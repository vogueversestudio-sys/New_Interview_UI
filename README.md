# Interview SDET Q&A — Vikrant Mishra

A beautiful, book-like interview preparation website for **SDET roles in India 2026**.

## Features
- **17 Chapters** covering Python, Java, SQL, Selenium, Playwright, API Testing, AI, and more
- **350+ Questions** with clean, interview-ready answers
- **100+ Code Examples** with syntax highlighting and copy buttons
- **Book-like reading experience** with Merriweather serif font
- **Reading progress bar** at the top
- **Dark / Light theme** toggle (warm reading-friendly light theme)
- **Chapter navigation** — Previous / Next buttons
- **Table of Contents** floating panel (large screens)
- **Search** across all chapters
- **Estimated reading time** and word count per chapter
- **Responsive** — works on mobile, tablet, and desktop
- **Zero dependencies** — pure HTML/CSS/JS, no build step needed

## Target Locations
Noida | Pune | Hyderabad | Bangalore | Gurugram | Dubai

## Run Locally
```bash
# Python 3
python3 -m http.server 8080

# Then open http://localhost:8080
```

## Deploy to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name it `interview-sdet-qa` (or any name you like)
3. Set to **Public** (required for free GitHub Pages)
4. Do NOT initialize with README (we already have one)
5. Click **Create repository**

### Step 2: Push Code
```bash
cd "/Users/vikrant.mishra/SDET Prompt/interview-sdet-qa"
git init
git add -A
git commit -m "Initial commit: Interview SDET Q&A website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/interview-sdet-qa.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **root**
4. Click **Save**
5. Wait 1-2 minutes, your site will be live at:
   `https://YOUR_USERNAME.github.io/interview-sdet-qa/`

## Tech Stack
- HTML5 + CSS3 + Vanilla JavaScript
- [Marked.js](https://marked.js.org/) — Markdown rendering
- [Highlight.js](https://highlightjs.org/) — Code syntax highlighting
- [Google Fonts](https://fonts.google.com/) — Merriweather + Inter + JetBrains Mono
