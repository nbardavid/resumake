import { Label } from "@/components/ui/label"
import { useState, useRef, useEffect } from 'react'
import { Button} from "@/components/ui/button"
import { EXAMPLE_JOB, EXAMPLE_RESUME_WEB, EXAMPLE_RESUME_LOW} from "@/lib/profiles"

interface TestsButtonsProps {
    selected: string;
    setSelected: (arg:string) => void;
    setJob: (arg:string) => void;
    setResume: (arg:string) => void;
}

export function TestsButtons({selected, setSelected, setJob, setResume}: TestsButtonsProps){
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
