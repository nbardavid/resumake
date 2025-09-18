"use client";

import { useState } from 'react'
import { Button} from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2Icon } from "lucide-react"
import { Toaster, toast} from "react-hot-toast"

export default function Home() {
    return (
        <div>
            <div className="flex flex-col h-screen w-screen bet items-center">
                <Header/>
                <ResumeInput/>
            </div>
        </div>
    );
}

function Header(){
    return (
    <div className="w-full h-15 border-4">
    </div>
    )
}

function ResumeInput() {
    const [job, setJob] = useState("");
    const [resume, setResume] = useState("");
    const [url, setUrl] = useState("");
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
            showToastSuccess('Resume successfully generated');

            if (url) { URL.revokeObjectURL(url) }
            setUrl(window.URL.createObjectURL(blob));
        } catch {
            showToastError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col bg-[var(--background)]">
            <div><Toaster/></div>
            <div className="mb-[1em]">
            <h1 className="text-3xl font-bold">Resumake</h1>
            <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <form 
                onSubmit={ (e) => {
                    if (!e.currentTarget.checkValidity()){
                        e.preventDefault();
                        showToastError('Please fill out all required fields correctly.')
                    } else {
                        e.preventDefault();
                        Generate();
                    }
                }}
                noValidate
                className="flex flex-col w-[500px] gap-6 p-8 border-5 rounded-md bg-[var(--card)]"
            >
                <div className="flex h-full flex-col gap-2">
                    <Label>Offer Link</Label>
                    <Input
                        className="bg-[var(--secondary)]"
                        type="url"
                        value={job}  
                        onChange={(e) => {setJob(e.target.value)}} 
                        id="link" 
                        placeholder="https://exemple.com/job" 
                        required
                    />
                </div>
                <div className="flex h-full flex-col gap-2">
                    <Label>Resume text</Label>
                    <Textarea 
                        className="h-[550px] mb-[0.5em] bg-[var(--secondary)] border-4"
                        value={resume}
                        onChange={(e) => {setResume(e.target.value)}} 
                        placeholder="My name is..., previous jobs: ... previous projects:..." 
                        required
                    />

                    { (isLoading &&
                        <Button disabled>
                            <Loader2Icon className="animate-spin" />
                            Please wait
                        </Button>) || 
                        <Button type="submit">Generate</Button>
                    }

                    {url && (
                        <Button asChild>
                            <a href={url} download="resume.pdf">Download resume.pdf</a>
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}

