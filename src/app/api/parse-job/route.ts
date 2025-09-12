import { NextResponse } from "next/server";
import { Readability } from "@mozilla/readability";
import { Mistral } from "@mistralai/mistralai";
import * as dotenv from 'dotenv';
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

    let reader = new Readability(doc.window.document);
    const job = reader.parse()?.textContent;

    let conversation = await client.beta.conversations.start({
        agentId:"ag:1afbfb74:20250912:resume-improver:d9f9533b",
        inputs:`Language:[${language}]Resume:[${resume}]Job:[${job}]`,
    });
    
    const response = conversation.outputs?.[0]?.content ?? "";

    const texPath = path.join("/tmp", "resume.tex");
    const pdfPath = path.join("/tmp", "resume.pdf");
    fs.writeFileSync(texPath, response, "utf-8");
    
    execSync(`pdflatex -interaction=nonstopmode -output-directory=/tmp ${texPath}`)
    
    const pdf = fs.readFileSync(pdfPath);

    return new Response(pdf, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=resume.pdf",
        },
    });
}
