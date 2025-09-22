"use client";

import { ResumeInput } from "@/components/resume-input"
import { Header } from "@/components/header"

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

