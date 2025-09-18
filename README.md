# resumake

**resumake** is a web application that generates a tailored **resume in PDF format** directly from a job posting.  
It analyzes a job description, adapts your existing resume with AI, and outputs a polished LaTeX-generated PDF.

🌐 Live demo: [resumake.nbardavid.dev](https://resumake.nbardavid.dev)

---

## ✨ Features

- 🔗 Paste a job offer URL – the job description is automatically parsed.
- 🤖 Powered by [Mistral AI](https://mistral.ai) to adapt your resume to the role.
- 📄 Converts AI output into LaTeX and compiles it into a downloadable PDF.
- 🎨 Modern, responsive interface with [shadcn/ui](https://ui.shadcn.com) and Tailwind CSS.
- 🐳 Fully containerized with Docker and Traefik for deployment.

---

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org) (App Router)  
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)  
- [Mistral AI SDK](https://www.npmjs.com/package/@mistralai/mistralai)  
- [Mozilla Readability](https://github.com/mozilla/readability) & [JSDOM](https://github.com/jsdom/jsdom)  
- [TeX Live](https://tug.org/texlive/) for PDF generation  

---

## 📸 Screenshots

*(Add screenshots or GIFs of the app here — form input, loading state, generated PDF, etc.)*

---

## 📜 About this project

This project is self-hosted and requires private API keys for AI and PDF generation.  
It is available to try at the live demo link above, but is **not intended to be run locally without additional credentials**.

---

## 🙌 Credits

- [Next.js](https://nextjs.org)  
- [Mistral AI](https://mistral.ai)  
- [shadcn/ui](https://ui.shadcn.com)  
- [TeX Live](https://tug.org/texlive/)  

