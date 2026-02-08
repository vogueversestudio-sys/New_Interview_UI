# SDET Interview Prep — Interactive Learning App

A **gamified, interactive** SDET interview preparation app for **India 2026**.
Built with React + Vite + TailwindCSS.

## Features

### 🎯 Dashboard
- XP tracking, level system, streak counter
- Daily goals with XP rewards
- Progress overview with circular charts
- Motivational quotes

### 🗺️ 30-Day Learning Roadmap
- Structured 4-phase plan (Foundation → Core → Advanced → Interview Ready)
- Day-by-day tasks with topic links
- Visual timeline with progress tracking

### 📚 17 Topic Chapters (350+ Questions)
- Python, Java, SQL, Selenium, Playwright, API Testing, AI, DevOps
- Full markdown rendering with syntax highlighting
- Copy code buttons, reading progress bar
- Mark topics as complete (+50 XP)

### 🧠 Interactive Quizzes
- 6 topic-specific quizzes (50+ questions)
- Multiple choice with instant feedback
- Timer, score tracking, answer review
- +20 XP per correct answer, +50 XP bonus for perfect score

### 💻 Code Practice
- 12 coding problems (Easy/Medium)
- Built-in code editor
- Hints and solutions with reveal toggle
- +30 XP per problem solved

### 🎭 Interview Scenarios
- 6 real-world SDET scenarios
- Write your own answer, then reveal key points
- Practice speaking answers aloud

### 🏆 Gamification & Achievements
- **6-level system**: Intern → Junior → Mid → Senior → Lead → Architect
- **12 badges** to unlock (Python Pro, SQL Expert, Streak Warrior, etc.)
- **XP system** with rewards for every activity
- **Streak tracking** for daily consistency
- **Milestones** timeline

## Tech Stack
- **React 18** + **React Router 6**
- **Vite 5** (build tool)
- **TailwindCSS 3** (styling)
- **Marked.js** + **Highlight.js** (markdown + code)
- **Lucide React** (icons)
- **localStorage** (progress persistence)

## Run Locally

```bash
# Prerequisites: Node.js 18+ (install from https://nodejs.org)

cd interview-sdet-qa
npm install
npm run dev

# Opens at http://localhost:5173
```

## Deploy to Netlify
Already configured! Just push to your repo and Netlify auto-builds.

```bash
git add -A
git commit -m "Redesign: Interactive learning app v2.0"
git push origin main
```

## Project Structure
```
interview-sdet-qa/
├── src/
│   ├── main.jsx              → React entry point
│   ├── App.jsx               → Router + Layout
│   ├── index.css             → Tailwind + custom styles
│   ├── store.js              → State management (Context + localStorage)
│   ├── data.js               → Topics, quizzes, roadmap, problems, scenarios
│   └── components/
│       ├── Layout.jsx        → Sidebar + responsive shell
│       ├── Dashboard.jsx     → Home page (XP, goals, stats)
│       ├── Roadmap.jsx       → 30-day learning path
│       ├── Topics.jsx        → Topic browser (card grid)
│       ├── Reader.jsx        → Markdown content reader
│       ├── Quiz.jsx          → Interactive quiz engine
│       ├── Practice.jsx      → Code practice + editor
│       ├── Scenarios.jsx     → Mock interview scenarios
│       └── Achievements.jsx  → Badges, levels, milestones
├── content/                  → 17 markdown chapter files
├── public/                   → Static assets
├── index.html                → Vite HTML entry
├── package.json
├── vite.config.js
├── tailwind.config.js
└── netlify.toml              → Netlify deploy config
```

## Target Locations
Noida | Pune | Hyderabad | Bangalore | Gurugram | Dubai
