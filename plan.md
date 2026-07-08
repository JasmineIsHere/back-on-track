# Implementation Plan: [BOT-003] Create AppContext for Cross-Page Shared State

**Ticket:** BOT-003
**Status:** Approved
**Date:** 2026-07-08

## Summary
Create `src/context/AppContext.jsx` exporting `AppProvider` and `useAppContext`, lift `habits` (persisted via `useLocalStorage`) and `flashcardProgress` into shared context, wrap the app in `App.jsx`, and switch `HabitsPage` from local `useState` to `useAppContext` for habits.

## Files to Create
- `src/context/AppContext.jsx` — AppProvider component and useAppContext hook; also implicitly creates the `src/context/` directory

## Files to Modify
- `src/App.jsx` — import `AppProvider` and wrap `BrowserRouter` with it (inside `ThemeProvider`, outside `BrowserRouter`)
- `src/pages/HabitsPage/HabitsPage.jsx` — replace local `useState` for `habits`/`setHabits` with `useAppContext()`

## Implementation Steps

1. **Create `src/context/AppContext.jsx`**:
   - Import `createContext`, `useContext`, `useState` from `'react'`
   - Import `useLocalStorage` from `'../hooks/useLocalStorage'`
   - Create `const AppContext = createContext(null)` (not exported — internal only)
   - Define and export `AppProvider({ children })`:
     - Call `useLocalStorage('habits', [])` to get `[habits, setHabits]` — this persists the habits array across page refreshes with an empty-array default
     - Call `useState({ completed: 0, total: 0 })` to get `[flashcardProgress, setFlashcardProgress]` — flashcard progress is session-only (not persisted), default to zero counts
     - Return `<AppContext.Provider value={{ habits, setHabits, flashcardProgress, setFlashcardProgress }}>{children}</AppContext.Provider>`
   - Define and export `useAppContext()`:
     - Call `useContext(AppContext)` and store the result
     - If the result is `null`, throw `new Error('useAppContext must be used within an AppProvider')`
     - Otherwise return the context value

2. **Modify `src/App.jsx`**:
   - Add `import { AppProvider } from './context/AppContext'`
   - Wrap the `<BrowserRouter>…</BrowserRouter>` block with `<AppProvider>…</AppProvider>`, keeping it inside `<ThemeProvider>` and outside `<BrowserRouter>`
   - No other changes to `App.jsx`

3. **Modify `src/pages/HabitsPage/HabitsPage.jsx`**:
   - Add `import { useAppContext } from '../../context/AppContext'`
   - Remove the line `const [habits, setHabits] = useState([{ name: "Drink water", completed: true }]);`
   - Add `const { habits, setHabits } = useAppContext();` at the top of the component body (after existing imports and before `newHabit` state)
   - Keep `import { useState } from "react"` — it is still needed for `newHabit` local state
   - No other changes to `HabitsPage.jsx`

## Code Shape

```jsx
// src/context/AppContext.jsx
import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [flashcardProgress, setFlashcardProgress] = useState({ completed: 0, total: 0 });

  return (
    <AppContext.Provider value={{ habits, setHabits, flashcardProgress, setFlashcardProgress }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
```

```jsx
// src/App.jsx — relevant change only
import { AppProvider } from './context/AppContext'
// ...
<ThemeProvider theme={theme}>
  <GlobalStyles/>
  <AppProvider>
    <BrowserRouter>
      {/* routes and NavBar unchanged */}
    </BrowserRouter>
  </AppProvider>
</ThemeProvider>
```

```jsx
// src/pages/HabitsPage/HabitsPage.jsx — relevant change only
import { useAppContext } from '../../context/AppContext';
// ...
const HabitsPage = () => {
  const { habits, setHabits } = useAppContext();   // replaces local useState
  const [newHabit, setNewHabit] = useState('');    // local UI state — unchanged
  // rest of component body unchanged
```

## Patterns to Follow
- **Cross-page state in context** — habits and flashcardProgress are shared across pages; CLAUDE.md explicitly requires this pattern
- **Local UI state stays local** — `newHabit` in HabitsPage is input-only UI state; it stays in local `useState`, not context
- **useLocalStorage for persistence** — habits are stored via the `useLocalStorage` hook (BOT-001), never via direct localStorage calls
- **No styled components in context file** — AppContext.jsx is pure logic; no JSX styling
- **Named exports** — both `AppProvider` and `useAppContext` are named exports, not default

## Out of Scope
- Streak tracking or `streak` field on habits (BOT-004)
- Progress bar on HabitsPage (BOT-004)
- Flashcard progress being set from anywhere — `setFlashcardProgress` is wired up but callers come in BOT-005
- Home Dashboard stats panel (BOT-006)
- Mood check-in (BOT-007)
- Any styled components or UI changes

---
## Review

**Reviewer:** Claude Code Reviewer Agent
**Date:** 2026-07-08
**Ticket:** BOT-003

### Guardrail Results

| ID | Category | Check | Result | Notes |
|---|---|---|---|---|
| SEC-1 | Security | No dangerouslySetInnerHTML | PASS | AppContext.Provider wrapper only; no innerHTML |
| SEC-2 | Security | No eval() | PASS | No dynamic code execution |
| SEC-3 | Security | No sensitive data in localStorage | PASS | Only habits array (name + completed boolean) stored; no PII |
| SEC-4 | Security | No network requests | PASS | Pure React context; no fetch/XHR |
| COR-1 | Correctness | All acceptance criteria addressed | PASS | All 6 criteria met: file/exports (Step 1), AppProvider placement (Step 2 + Code Shape), full context value shape (Step 1), useLocalStorage for habits (Step 1), HabitsPage migration (Step 3), descriptive throw in useAppContext (Step 1) |
| COR-2 | Correctness | No scope creep | PASS | Streak, progress bar, BOT-005/006/007 features all explicitly excluded in Out of Scope |
| COR-3 | Correctness | File paths valid | PASS | src/context/ matches CLAUDE.md planned directory; App.jsx and HabitsPage.jsx both exist |
| PAT-1 | Patterns | Styled components in barrel | PASS | No styled components introduced; AppContext.jsx is pure logic |
| PAT-2 | Patterns | No hardcoded colors | PASS | No color values anywhere in the plan |
| PAT-3 | Patterns | No TypeScript | PASS | All code shapes are plain JSX/JS; no type annotations |
| PAT-4 | Patterns | No external state libs | PASS | createContext, useContext, useState from React only |
| PAT-5 | Patterns | localStorage via hook only | PASS | useLocalStorage hook used; no direct getItem/setItem calls |
| PAT-6 | Patterns | No misused useEffect | PASS | No useEffect anywhere in the plan |
| SCO-1 | Scope | No extra features | PASS | Three files only; exactly the context file plus two wiring changes |
| SCO-2 | Scope | All files listed | PASS | AppContext.jsx in Files to Create; App.jsx and HabitsPage.jsx in Files to Modify |
| SCO-3 | Scope | No undisclosed packages | PASS | React built-ins and project's own useLocalStorage hook only |

### Verdict: APPROVED

All guardrails passed. Handing off to Developer for Phase 2 implementation.
