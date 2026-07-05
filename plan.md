# Implementation Plan: [BOT-002] Create Static Flashcard Data File

**Ticket:** BOT-002
**Status:** Awaiting Review
**Date:** 2026-07-05

## Summary
Create `src/data/flashcards.js` with a default-exported array of at least 20 flashcard objects covering React hooks, component lifecycle, JavaScript fundamentals, and async patterns. This is the pure data layer the flashcard UI (BOT-005) will consume — no logic, no imports.

## Files to Create
- `src/data/flashcards.js` — static flashcard data array; also implicitly creates the `src/data/` directory

## Files to Modify
- None

## Implementation Steps

1. **Create the file**: Create `src/data/flashcards.js`.

2. **Define the flashcard object shape**: Each object must have exactly four fields:
   - `id`: unique string using a `topic-prefix-NNN` pattern (e.g. `'react-001'`, `'js-001'`)
   - `question`: string — the question text shown on the card face
   - `answer`: string — the answer text revealed on flip
   - `topic`: string — must exactly match one of the topic strings from `FlashcardsPage.jsx`: `"React & JS deck"`, `"Java 21 deck"`, `"Data Structures deck"`, or `"Kubernetes deck"`

3. **Author at least 20 cards** all with `topic: "React & JS deck"`, distributed across these four categories:
   - **React hooks** (≥ 7 cards): useState lazy initialiser, useEffect cleanup, useCallback memoisation, useMemo vs useCallback, useRef for DOM access, useReducer vs useState, useContext usage
   - **Component lifecycle** (≥ 4 cards): mounting/updating/unmounting phases, when useEffect runs, StrictMode double-invoke, key prop and reconciliation
   - **JavaScript fundamentals** (≥ 5 cards): closure definition, var/let/const scoping, hoisting, event loop and call stack, prototype chain
   - **Async patterns** (≥ 4 cards): Promise states, async/await syntax, Promise.all vs Promise.allSettled, microtask vs macrotask queue

4. **Export as default**: The last line of the file is `export default flashcards;` — no named exports, no imports.

## Code Shape

```js
const flashcards = [
  {
    id: 'react-001',
    question: 'What is the purpose of the useState hook?',
    answer: 'useState lets a function component hold local state. It returns [currentValue, setter]. React schedules a re-render whenever the setter is called with a value that differs from the current one.',
    topic: 'React & JS deck',
  },
  {
    id: 'react-002',
    question: 'Why pass a function to useState instead of a value — e.g. useState(() => compute()) instead of useState(compute())?',
    answer: 'The function form is a lazy initialiser: React calls it only on the first render. The value form evaluates on every render, which wastes work if the initialisation is expensive (e.g. reading localStorage).',
    topic: 'React & JS deck',
  },
  // ... 18+ more cards following the same shape
];

export default flashcards;
```

## Patterns to Follow
- **Pure data file** — no imports, no hooks, no JSX; this is a plain JS module with a single `const` and a default export
- **JavaScript only** — no TypeScript per CLAUDE.md constraints
- **No styled components** — data only, no UI surface
- **Topic strings must exactly match** the hardcoded strings in `FlashcardsPage.jsx` (`"React & JS deck"` etc.) to enable filtering in BOT-005

## Out of Scope
- Java 21, Data Structures, or Kubernetes decks — only "React & JS deck" is required by this ticket
- Any changes to `FlashcardsPage.jsx` (BOT-005)
- Wiring the data to any component (BOT-005)
- AppContext or useLocalStorage (BOT-001 / BOT-003)
- Pagination or difficulty levels
