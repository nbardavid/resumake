import { NextResponse } from "next/server";
import { Readability } from "@mozilla/readability";
import type { MessageOutputEntry, MessageOutputContentChunks } from "@mistralai/mistralai/models/components";
import { Mistral } from "@mistralai/mistralai";
import { JSDOM } from 'jsdom';
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export async function POST(req: Request) {
    const { url, resume, language} = await req.json();

    //Mistral Setup
    const apiKey = process.env.MISTRAL_API_KEY;
    const client = new Mistral({ apiKey: apiKey });

    if (!url || typeof url !== "string"){
        return NextResponse.json({error: "Missing or invalid URL"}, { status: 400 });
    }
    if (!resume || typeof resume !== "string"){
        return NextResponse.json({error: "Missing or invalid resume"}, { status: 400 });
    }

    //need verify url like https://...com

    const res = await fetch(url, {
        cache: "no-store",

        headers: {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    });

    if (!res.ok) {
        return NextResponse.json(
            { error: `Upstream responded ${res.status}`},
            { status: 502 }
        );
    }

    const html = await res.text();
    const doc = new JSDOM(html);

    const reader = new Readability(doc.window.document);
    const job = reader.parse()?.textContent;

    const conversation = await client.beta.conversations.start({
        agentId:"ag:1afbfb74:20250912:resume-improver:d9f9533b",
        inputs:`Language:[${language}]Resume:[${resume}]Job:[${job}]`,
    });

    const firstOutput = conversation.outputs?.[0];
    let response = "";

    if (firstOutput && "content" in firstOutput) {
        const content = (firstOutput as MessageOutputEntry).content;
        if (Array.isArray(content)) {
            response = content
                .map((chunk: MessageOutputContentChunks) =>
                    "text" in chunk ? chunk.text : ""
                )
                .join("\n");
        } else {
            response = content as string;
        }
    }

    response = stripCodeFence(response);

    function stripCodeFence(input: string): string {
        const t = input.trim();
        const m = t.match(/^```(?:[a-zA-Z0-9_+-]+)?\r?\n?([\s\S]*?)\r?\n?```\s*$/);
        return m ? m[1] : t;
    }

    const texPath = path.join("/tmp", "resume.tex");
    const pdfPath = path.join("/tmp", "resume.pdf");
    fs.writeFileSync(texPath, response, "utf-8");


    try {
        execSync(`pdflatex -interaction=nonstopmode -output-directory=/tmp ${texPath}`, { stdio: "inherit" });
    } catch (err: unknown) {
        if (err && typeof err === "object" && "stdout" in err && "stderr" in err) {
            const e = err as { stdout?: Buffer; stderr?: Buffer };
            console.error("pdflatex failed:", e.stdout?.toString());
            console.error("stderr:", e.stderr?.toString());
        } else if (err instanceof Error) {
            console.error("pdflatex failed:", err.message);
        } else {
            console.error("pdflatex failed with unknown error:", err);
        }
        throw err;
    }

    const pdf = fs.readFileSync(pdfPath);

    return new Response(pdf, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=resume.pdf",
        },
    });
}
