"use client";

import { useState, useRef, useEffect } from 'react'
import { Button} from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2Icon } from "lucide-react"
import { Toaster, toast} from "react-hot-toast"

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
        <div className="flex flex-col bg-[var(--background)]">
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
                className="flex flex-col w-full gap-6 p-8 border-5 rounded-md bg-[var(--card)]"
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
                        className="clicky-focus w-[500px] h-[200px] box-border min-h-[200px] mb-[0.5em] bg-[var(--secondary)] border-4"
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

const EXAMPLE_JOB="https://jobs.lever.co/mistral/a6980b07-e55a-427c-a985-38ecd1e2eea6"
const EXAMPLE_RESUME_LOW= `Nathan Bardavid
Low-Level & UNIX Systems Engineer - C - C++ - Zig
example@gmail.com — +33 6 01 23 45 67 — Paris

Profile:
Student at 42 Paris focused on low-level and UNIX systems. Builds robust system tools in C and Zig,
with strong command of POSIX primitives, parsing, and process supervision.

Skills:
Proficiency: C, C++, Zig, JavaScript, TypeScript, Go, Docker
Backend: Python (FastAPI), Go (Gin)
Tooling: Bash, Git, Docker

Projects:
42sh - POSIX-compliant Shell (C)
Sep 2024–Feb 2025 — Team of 2
Constraints: C only, POSIX system calls (man 2) and malloc.
- Delivered a POSIX-compliant command interpreter compatible with Bash scripts.
- Built a regex engine in C for pattern matching across shell features.
- Reimplemented readline-like line editing and history from scratch.
- Implemented a resilient parser handling shell grammar and edge cases.

Taskmaster - Process Supervisor (Zig)
Mar–May 2025 — Solo project
Constraint: standard Zig library only.
- Implemented hot reload of configuration without restarting the supervisor.
- Built a CLI with history and line editing for operator efficiency.
-  Designed process lifecycle controls: launch, stop, restart, restart policies, expected exit codes,
timeouts, custom signals.
- Added fine-grained monitoring and local event logging (start, stop, crash, reload).

Education:
Master’s Degree in Computer Architecture - 42 Paris Sep 2023 - Jun 2027
Coursework and projects in systems/software engineering.
General Baccalaureate 2022
Specialties: NSI & Mathematics

Languages:
French (native)
English (technical/conversational)

Interests:
Self-hosting on Debian mini-server (personal services, websites...); advanced customization of environments
(OS, Neovim)
`
const EXAMPLE_RESUME_WEB=`Robin Retayeur
Web Engineer - TypeScript - React - Node.js
obin.retayeur@example.com — +33 6 98 76 54 32 — Paris

Profile:
Web engineer passionate about building scalable frontends and reliable backends.
Currently at Alan, delivering secure, user-friendly web experiences in healthcare.  
Strong focus on TypeScript, React, and system design for high-traffic applications.

Skills:
Frontend: TypeScript, React, Next.js, Tailwind, Redux
Backend: Node.js (Express, NestJS), Go (Gin)
Tooling: Docker, GitHub Actions, Vite, PostgreSQL
Other: GraphQL, REST API design, testing (Jest, Cypress)

Experience:
Alan — Web Engineer
Sep 2024–Present — Paris
- Developed and maintained core user-facing web applications for members and HR teams.  
- Designed reusable React component libraries with accessibility and performance in mind.  
- Optimized API interactions, reducing load times by 30% across the dashboard.  
- Collaborated with designers, PMs, and security engineers to ship healthcare-compliant features.

Projects:
HabitFlow — Habit Tracker (React, Node.js)
Feb–Jun 2024 — Solo project  
- Built a full-stack app with React + Tailwind frontend and a Node.js + PostgreSQL backend.  
- Implemented calendar-based habit visualization with charts and reminders.  
- Added JWT authentication and real-time sync via WebSockets.

Sharely — Collaborative Docs (Next.js, Go)
Oct–Dec 2023 — Team of 3  
- Built a collaborative Markdown editor with real-time updates using WebSockets.  
- Designed a Go backend with optimistic concurrency control for versioning.  
- Integrated with cloud storage for persistent backups.

Education:
Master’s Degree in Computer Science — 42 Paris  
Sep 2022 – Jun 2026 — Focus on software engineering & web systems.  
General Baccalaureate 2022  
Specialties: Mathematics & Physics

Languages:
French (native)  
English (fluent)

Interests:
Frontend performance optimization, self-hosting, open-source contribution, Neovim customization.`
