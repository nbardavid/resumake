"use client";

import Image from "next/image";
import { useState } from 'react'
import { Button} from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2Icon } from "lucide-react"

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
        const response = await fetch("http://localhost:3000/api/parse-job", {
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
        const blob = await response.blob();
        setUrl(window.URL.createObjectURL(blob));
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col w-[500px] p-10 border-1 rounded-md gap-6 p-4">
            <Label>Offer Link</Label>
            <Input type="link" value={job}  onChange={(e) => {setJob(e.target.value)}} id="link" placeholder="Link" />
            <div className="flex h-full flex-col gap-2">
                <Label>Resume text</Label>
                <Textarea className="h-[550px]"  onChange={(e) => {setResume(e.target.value)}} placeholder="Resume..." />

                { (isLoading &&
                    <Button disabled>
                        <Loader2Icon className="animate-spin" />
                        Please wait
                    </Button>) || 
                    <Button onClick={Generate}>Generate</Button>
                }

                {url && (
                    <Button asChild>
                      <a href={url} download="resume.pdf">Download CV.pdf</a>
                    </Button>
                )}
            </div>
        </div>
    );
}

