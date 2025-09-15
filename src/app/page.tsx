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
        <div className="flex h-screen w-screen items-center justify-center">
            <ResumeInput/>
        </div>
    );
}


function ResumeInput() {
    const [job, setJob] = useState("");
    const [resume, setResume] = useState("");
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
              toast.error(err?.error ?? `Erreur ${response.status}`);
              return;
            }

            const blob = await response.blob();
            toast.success('Resume successfully generated');

            if (url) { URL.revokeObjectURL(url) }
            setUrl(window.URL.createObjectURL(blob));
        } catch {
            toast.error('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div><Toaster/></div>
            <form 
                onSubmit={ (e) => {
                    if (!e.currentTarget.checkValidity()){
                        e.preventDefault();
                        toast.error("Please fill out all required fields correctly.");
                    } else {
                        e.preventDefault();
                        Generate();
                    }
                }}
                noValidate
                className="flex flex-col w-[500px] gap-6 p-8 border rounded-md"
            >
                <Label>Offer Link</Label>
                <Input
                    type="url"
                    value={job}  
                    onChange={(e) => {setJob(e.target.value)}} 
                    id="link" 
                    placeholder="https://exemple.com/job" 
                    required
                />
                <div className="flex h-full flex-col gap-2">
                    <Label>Resume text</Label>
                    <Textarea 
                        className="h-[550px]"
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
        </>
    );
}

