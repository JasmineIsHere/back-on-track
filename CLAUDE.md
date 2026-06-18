# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Back on Track** is a React SPA for job seekers combining a daily habit tracker and an interview flashcard study tool. It is fully client-side with no backend — all persistence is planned via `localStorage`.

## Commands

```bash
npm run dev       # Start dev server at http://127.0.0.1:3000
npm run build     # Production build (outputs to /dist)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
npm run deploy    # Build and deploy to GitHub Pages
```

There is no test suite. No Jest, Vitest, or test files exist yet.

## Architecture

### Routing & App Shell

`App.jsx` is the entry point. It holds the `isDark` theme state, wraps everything in styled-components `ThemeProvider`, and defines the three routes:

| Route | Component |
|---|---|
| `/` | `pages/HomePage/Home.jsx` |
| `/habits` | `pages/HabitsPage/HabitsPage.jsx` |
| `/flashcards` | `pages/FlashcardsPage/FlashcardsPage.jsx` |

`NavBar` is rendered **outside** `<Routes>` so it persists as a fixed bottom bar across all pages.

### Styling System

Styling is done exclusively with **styled-components**. The theme is defined in `src/theme.js` and exports `lightTheme` and `darkTheme`. All components receive theme values via styled-components' `ThemeProvider` — access them in styled components with `${({ theme }) => theme.someToken}`.

Theme tokens cover: `bgPrimary/Secondary/Tertiary`, `textPrimary/Secondary/Tertiary`, `border`, and semantic color palettes: `purple*`, `green*`, `amber*`, `blue*`.

The `isDark` toggle state exists in `App.jsx` but no UI toggle is wired up yet — the app currently always renders in dark mode.

Global base styles (font, resets) live in `src/GlobalStyles.js`.

### Page/Component File Convention

Each page directory has an `index.js` barrel file that **exports all styled components** for that page. The page component itself (e.g. `HabitsPage.jsx`) imports from `"."` to get those styled components. Shared reusable components live in `src/components/`.

### State Management — Current vs Planned

The README describes `useReducer`, `useContext`, a `context/` directory, a `hooks/useLocalStorage` hook, and a `data/` directory for flashcard content. **None of these exist yet.** The current implementation only uses `useState` within each page — state is not persisted and not shared across pages.

When building out these features, follow the README's planned structure:
- `src/context/` — AppContext for cross-page state (streaks, progress)
- `src/hooks/` — `useLocalStorage` custom hook
- `src/data/` — Static flashcard content (JS/React interview questions)
