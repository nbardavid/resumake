"use client";
import { useState, useRef, useEffect } from 'react'
import { Button} from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2Icon } from "lucide-react"
import { Toaster, toast} from "react-hot-toast"
import { EXAMPLE_JOB, EXAMPLE_RESUME_WEB, EXAMPLE_RESUME_LOW} from "@/lib/profiles"

export default function Home() {
    return (
        <div>
            <div className="flex flex-col h-screen w-screen items-center">
                <Header/>
                <div className="flex flex-col h-full justify-center items-center w-full">
                    <ResumeInput/>
                </div>
            </div>
        </div>
    );
}

function Header(){
    return (
        <div className="flex px-10 w-full h-15 place-content-between items-center border-b-4">
            <h1 className="text-3xl font-bold">Resumake</h1>
            <div className="flex gap-1">
                <img src="/github-mark.svg" className="w-5 h-5" />
                <a href="https://github.com/nbardavid/resume-maker" className="hover-lift text-l"> GitHub </a>
            </div>
        </div>
    )
}

function ResumeInput() {
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

    const fillInputsWeb= async () => {
        setSelected("web")
        setJob(EXAMPLE_JOB);
        setResume(EXAMPLE_RESUME_WEB)
    }

    const fillInputsLowLevel = async () => {
        setSelected("low-level");
        setJob(EXAMPLE_JOB);
        setResume(EXAMPLE_RESUME_LOW)
    }
    
    function TestsButtons(){
        return (
            <div className="flex h-full w-full flex-col gap-2">
                <Label className="Try these examples"> Try these examples</Label>
                <div className="flex w-full gap-3">

                    { (selected === "low-level" &&
                        <Button 
                            type="button"
                            className="glow clicky-on">
                            low-level
                        </Button>) ||
                        <Button
                            type="button"
                            onClick={fillInputsLowLevel}
                            className="bg-[var(--card-background)] shadow-sm clicky-active hover:bg-[rgba(255,240,100,1)]"
                        > low-level </Button>
                    }

                    { (selected === "web" &&
                        <Button 
                            type="button"
                            className="glow clicky-on">
                            web eng
                        </Button>) ||
                        <Button
                            type="button"
                            onClick={fillInputsWeb}
                            className="bg-[var(--card-background)] shadow-sm clicky-active  hover:bg-[rgba(255,240,100,1)]"
                        > web eng </Button>
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-[700px] bg-[var(--background)]">
            <div><Toaster/></div>
            <div className="mb-[1em]">
            <h1 className="text-6xl font-bold">Resumes made easy</h1>
            <p className="text-lg text-muted-foreground italic">Your resume, always aligned with the role.</p>
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

                    <TestsButtons/>

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
