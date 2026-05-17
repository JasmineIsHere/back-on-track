# 🚀 Back on Track

> A personal job search recovery app built during my second retrenchment — because sometimes you need to build your way through the hard stuff.

---

## 🌱 The Story

Getting retrenched once is hard. Getting retrenched twice is the kind of thing that makes you question everything — your career, your industry, your direction. This app was born out of that exact moment.

Instead of doom-scrolling job boards, I decided to build something that would help me stay consistent, accountable, and sane during the job search grind. **Back on Track** is a daily companion that combines a habit tracker for job search routines with a flashcard tool for interview prep — two things I needed desperately, in one place.

If you're going through a retrenchment or career transition yourself, I hope this is useful to you too.

---

## ✨ Features

### 🏠 Home Dashboard
- Daily greeting and motivational status message
- At-a-glance view of habit completion and flashcard progress
- Daily mood check-in to track emotional wellbeing over time

### ✅ Habit Tracker
- Create and manage daily job search habits
- Check off habits each day
- Streak tracking to build consistency
- Progress bar showing daily completion percentage

### 🧠 Flashcard Deck
- Flip-card interface for React and JavaScript interview concepts
- Self-rating system — mark cards as "Got it" or "Review again"
- Cards you struggle with return to the queue automatically
- Progress bar tracking deck completion

---

## 🛠️ Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + JavaScript | Industry standard, interview relevant |
| Bundler | Vite | Fast dev experience, modern standard |
| Styling | styled-components | Colocated styles, clean component API |
| Routing | React Router v6 | Multi-page navigation |
| State | useState, useReducer, useContext | Built-in, no unnecessary dependencies |
| Persistence | localStorage via custom hook | Lightweight, no backend needed |
| Deployment | Github Pages | Free, fast, GitHub-connected |

---

## 🧩 React Concepts Covered

This project was intentionally scoped to cover key intermediate React concepts:

- `useState` — local UI state management
- `useReducer` — complex state logic (habit list, card queue)
- `useContext` — shared state across pages (progress, streaks)
- `useEffect` — side effects and lifecycle
- `useMemo` — computed values (cards due, habit scores)
- Custom hook (`useLocalStorage`) — reusable persistence logic
- React Router v6 — client-side routing
- CSS-in-JS with styled-components

---

## 📁 Project Structure

```
src/
├── components/       # Shared/reusable UI components (NavBar, Button, Card)
├── pages/            # One file per route (Home, Habits, Flashcards)
├── context/          # AppContext for shared state across pages
├── hooks/            # Custom hooks (useLocalStorage)
├── data/             # Static flashcard content
└── App.jsx           # Router and app shell
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/back-on-track.git
cd back-on-track

# Install dependencies
npm install

# Start the dev server
npm run dev
```

App runs at `http://localhost:3000`

---

## 🚀 Deployment

Deployed via GitHub Pages at:
`https://your-username.github.io/back-on-track`

---

## 🤝 Contributing

This is a personal project but PRs and suggestions are welcome — especially if you're going through a job search yourself and have ideas for features that would help.

---

## 📄 License

MIT — free to use, fork, and adapt.

---

*Built with React, Claude, and too much coffee. ☕*
