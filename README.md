# resumake

**resumake** generates a customized PDF resume from a job posting.  
Paste a job offer link, add your resume text, and get a tailored LaTeX-compiled PDF in seconds.

🔗 Live demo: [resumake.nbardavid.dev](https://resumake.nbardavid.dev)

---

## How it works

- Extracts text from job postings using [Mozilla Readability](https://github.com/mozilla/readability).  
- Uses a private [Mistral](https://mistral.ai) agent to adapt your resume to the job description.  
- Converts the result into LaTeX and compiles it into a downloadable PDF.  
- Runs as a self-hosted Next.js app with Docker and Traefik.  

---

## Notes

- This project depends on **private Mistral agents**.  
- Even with a Mistral API key, it cannot be run locally.  
- Please use the hosted version: [resumake.nbardavid.dev](https://resumake.nbardavid.dev).  

---

## Stack

- [Next.js](https://nextjs.org)  
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)  
- [Mistral AI SDK](https://www.npmjs.com/package/@mistralai/mistralai)  
- [TeX Live](https://tug.org/texlive/)  

---
