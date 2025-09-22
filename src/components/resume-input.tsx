import { useState, useRef, useEffect } from 'react'
import { Button} from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2Icon } from "lucide-react"
import { Toaster, toast} from "react-hot-toast"

import { TestsButtons } from "@/components/examples-buttons"


export function ResumeInput() {
    const [job, setJob] = useState("");
    const [resume, setResume] = useState("");
    const [url, setUrl] = useState("");
    const [selected, setSelected] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const showToastError = async (message: string) => {
        toast.error(message, {
            style: {
                background: "var(--card)",
                color: "var(--secondary-foreground)",
                border: "4px solid var(--border)",
                borderRadius: "var(--radius)",
                fontFamily: "var(--font-sans)",
            },
        });
    }

    const showToastSuccess = async (message: string) => {
        toast.success(message, {
            style: {
                background: "var(--card)",
                color: "var(--secondary-foreground)",
                border: "4px solid var(--border)",
                borderRadius: "var(--radius)",
                fontFamily: "var(--font-sans)",
            },
        });
    }

    const Generate = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/parse-job", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: job,
                    resume: resume,
                    language: "en",
                }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                showToastError(err?.error ?? `Erreur ${response.status}`)
                return;
            }

            const blob = await response.blob();
            showToastSuccess("Resume successfully generated");

            if (url) { URL.revokeObjectURL(url) }
            setUrl(window.URL.createObjectURL(blob));
        } catch {
            showToastError("Network error");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col w-[700px] bg-[var(--background)]">
            <div><Toaster/></div>
            <div className="mb-[1em]">
                <div className="flex flex-col gap-2">
                    <h1 className="text-6xl font-bold">
                        <span className="highlight-hover">Resumes </span>
                        <span className="highlight-hover">made </span>
                        <span className="highlight-hover">easy</span>
                    </h1>
                    <p className="text-lg text-muted-foreground italic">
                        Your resume, always aligned with the role.
                    </p>
                </div>
            </div>
            <form 
                onSubmit={ (e) => {
                    if (!e.currentTarget.checkValidity()){
                        e.preventDefault();
                        showToastError("Please fill out all required fields correctly.")
                    } else {
                        e.preventDefault();
                        Generate();
                    }
                }}
                noValidate
                className="flex flex-col w-[100%] gap-6 p-8 border-5 rounded-md bg-[var(--card)]"
            >
                <div className="flex h-full w-full flex-col gap-2">
                    <Label className="font-bold"> Offer Link</Label>
                    <Input
                        className="clicky-focus bg-[var(--secondary)]"
                        type="url"
                        value={job}  
                        onChange={(e) => {setJob(e.target.value)}} 
                        id="link" 
                        placeholder="https://exemple.com/job" 
                        required
                    />
                </div>
                <div className="flex h-full w-full flex-col gap-2">
                    <Label className="font-bold"> Resume text</Label>
                    <Textarea 
                        className="resize-none clicky-focus w-full h-[200px] box-border min-h-[200px] mb-[0.5em] bg-[var(--secondary)] border-4"
                        value={resume}
                        onChange={(e) => {setResume(e.target.value)}} 
                        placeholder="My name is..., previous jobs: ... previous projects:..." 
                        required
                    />
                </div>

                    <TestsButtons
                    selected={selected}
                    setSelected={setSelected}
                    setResume={setResume}
                    setJob={setJob}
                />

                    { (isLoading &&
                        <Button disabled className="h-15 clicky-on">
                            <Loader2Icon className="animate-spin" />
                            Please wait
                        </Button>) || 
                        <Button type="submit" className="h-15 shadow-sm clicky-active">Generate</Button>
                    }

                    {url && (
                        <Button 
                        className="shadow-sm clicky-active bg-[var(--accent)] hover:bg-[var(--accent-hover)]"
                        asChild>
                            <a href={url} download="resume.pdf">Download resume.pdf</a>
                        </Button>
                    )}
            </form>
        </div>
    );
}
