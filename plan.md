# Implementation Plan: [BOT-004] Habit Streak Tracking and Daily Progress Bar

**Ticket:** BOT-004
**Status:** Approved
**Date:** 2026-07-08

## Summary
Add streak tracking to each habit (increments on toggle-to-complete, decrements on toggle-to-incomplete) and a progress bar to HabitsPage showing today's completion percentage — both using theme tokens and a `useMemo`-derived percentage. New styled components (`ProgressTrack`, `ProgressFill`, `StreakBadge`) go in the barrel file.

## Files to Create
- None

## Files to Modify
- `src/pages/HabitsPage/index.js` — add `ProgressTrack`, `ProgressFill`, `StreakBadge` styled components
- `src/pages/HabitsPage/HabitsPage.jsx` — add `useMemo` for progress, update `handleAddHabit` to initialise `streak: 0`, update `toggleHabitCompletion` to adjust streak, import and render new styled components

## Implementation Steps

1. **Add styled components to `src/pages/HabitsPage/index.js`**:
   - Add `ProgressTrack`: a `div` with `width: 100%`, `height: 8px`, `background-color: ${({ theme }) => theme.bgSecondary}`, `border-radius: 4px`, `overflow: hidden`, and `margin-bottom: 1rem`
   - Add `ProgressFill`: a `div` inside the track; sets `height: 100%`, `width: ${({ $percent }) => $percent}%` (transient prop so it does not reach the DOM), `background-color: ${({ theme }) => theme.greenStrong}`, `border-radius: 4px`, `transition: width 0.3s ease`
   - Add `StreakBadge`: a `span` with `font-size: 0.875rem`, `color: ${({ theme }) => theme.textSecondary}`, `margin-left: auto` (pushes it to the right edge of the flex row)

2. **Update imports in `src/pages/HabitsPage/HabitsPage.jsx`**:
   - Change `import { useState } from "react"` to `import { useState, useMemo } from "react"`
   - Add `ProgressTrack`, `ProgressFill`, `StreakBadge` to the named imports from `"."`

3. **Compute progress with `useMemo` in `HabitsPage`**:
   - Inside the component body, after the context and state declarations, add:
     ```js
     const { completedCount, percent } = useMemo(() => {
       const completed = habits.filter((h) => h.completed).length;
       return {
         completedCount: completed,
         percent: habits.length ? Math.round((completed / habits.length) * 100) : 0,
       };
     }, [habits]);
     ```

4. **Update `handleAddHabit` to initialise `streak: 0`**:
   - Change the new habit object from `{ name: newHabit, completed: false }` to `{ name: newHabit, completed: false, streak: 0 }`

5. **Update `toggleHabitCompletion` to adjust streak**:
   - Replace the current implementation with one that also updates `streak`:
     ```js
     const toggleHabitCompletion = (index) => {
       const updatedHabits = habits.map((habit, i) => {
         if (i !== index) return habit;
         const nowCompleted = !habit.completed;
         const streak = nowCompleted
           ? (habit.streak ?? 0) + 1
           : Math.max(0, (habit.streak ?? 0) - 1);
         return { ...habit, completed: nowCompleted, streak };
       });
       setHabits(updatedHabits);
     };
     ```
   - The `?? 0` guard handles existing habits in localStorage that pre-date the `streak` field

6. **Render the progress bar in `HabitsPage` JSX**:
   - Inside the `habits.length > 0` block, before the `habits.map(...)` list, add:
     ```jsx
     <ProgressTrack>
       <ProgressFill $percent={percent} />
     </ProgressTrack>
     ```

7. **Render the streak badge in each `HabitContainer`**:
   - After `<HabitText>`, add:
     ```jsx
     <StreakBadge>🔥 {habit.streak ?? 0}</StreakBadge>
     ```

## Code Shape

```js
// src/pages/HabitsPage/index.js — new exports appended
export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.bgSecondary};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background-color: ${({ theme }) => theme.greenStrong};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const StreakBadge = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-left: auto;
`;
```

```jsx
// src/pages/HabitsPage/HabitsPage.jsx — relevant additions
import { useState, useMemo } from "react";
import { ..., ProgressTrack, ProgressFill, StreakBadge } from ".";

// Derived value — useMemo, not useEffect
const { completedCount, percent } = useMemo(() => {
  const completed = habits.filter((h) => h.completed).length;
  return {
    completedCount: completed,
    percent: habits.length ? Math.round((completed / habits.length) * 100) : 0,
  };
}, [habits]);

// handleAddHabit — streak: 0 on creation
setHabits([...habits, { name: newHabit, completed: false, streak: 0 }]);

// toggleHabitCompletion — adjusts streak
const nowCompleted = !habit.completed;
const streak = nowCompleted
  ? (habit.streak ?? 0) + 1
  : Math.max(0, (habit.streak ?? 0) - 1);
return { ...habit, completed: nowCompleted, streak };

// JSX — progress bar above list
<ProgressTrack>
  <ProgressFill $percent={percent} />
</ProgressTrack>

// JSX — streak badge in each row
<StreakBadge>🔥 {habit.streak ?? 0}</StreakBadge>
```

## Patterns to Follow
- **Styled components in barrel** — `ProgressTrack`, `ProgressFill`, `StreakBadge` go in `index.js`, not in `HabitsPage.jsx`
- **Theme tokens only** — `theme.bgSecondary` for track, `theme.greenStrong` for fill, `theme.textSecondary` for badge; no hardcoded hex
- **`useMemo` for derived values** — `completedCount` and `percent` are derived from `habits`; never `useEffect`
- **Transient prop `$percent`** — styled-components v6 transient prop syntax to prevent `percent` from being forwarded to the DOM element
- **`?? 0` guard** — safely handles existing habits in localStorage without a `streak` field (added by BOT-003)
- **Cross-page state via AppContext** — `habits`/`setHabits` come from `useAppContext()` (already in place from BOT-003); streak values persist automatically because they're part of the habits objects in localStorage

## Out of Scope
- Daily reset of streaks (no midnight cron logic)
- Streak history or charts
- Home Dashboard stats panel (BOT-006)
- Any flashcard work (BOT-005)
- Mood check-in (BOT-007)

---
## Review

**Reviewer:** Claude Code Reviewer Agent
**Date:** 2026-07-08
**Ticket:** BOT-004

### Guardrail Results

| ID | Category | Check | Result | Notes |
|---|---|---|---|---|
| SEC-1 | Security | No dangerouslySetInnerHTML | PASS | Styled components only; no innerHTML |
| SEC-2 | Security | No eval() | PASS | No dynamic code execution |
| SEC-3 | Security | No sensitive data in localStorage | PASS | Only name, completed boolean, streak integer stored |
| SEC-4 | Security | No network requests | PASS | Pure React/styled-components |
| COR-1 | Correctness | All acceptance criteria addressed | PASS | All 6 criteria met: persistence via BOT-003 (with ?? 0 guard), streak field in Steps 4&5, +1/-1 logic with Math.max(0,...) in Step 5, progress bar in Steps 3&6, theme tokens in Step 1, 🔥 badge in Step 7 |
| COR-2 | Correctness | No scope creep | PASS | Daily reset, streak history, BOT-005/006/007 all explicitly excluded |
| COR-3 | Correctness | File paths valid | PASS | Both src/pages/HabitsPage/index.js and HabitsPage.jsx exist in the project |
| PAT-1 | Patterns | Styled components in barrel | PASS | ProgressTrack, ProgressFill, StreakBadge all go in index.js, not inline |
| PAT-2 | Patterns | No hardcoded colors | PASS | theme.bgSecondary, theme.greenStrong, theme.textSecondary only; no hex values |
| PAT-3 | Patterns | No TypeScript | PASS | Plain JS/JSX throughout |
| PAT-4 | Patterns | No external state libs | PASS | Only useState and useMemo from React |
| PAT-5 | Patterns | localStorage via hook only | PASS | setHabits from useAppContext() wraps useLocalStorage; no direct calls |
| PAT-6 | Patterns | No misused useEffect | PASS | completedCount and percent derived with useMemo; explicitly noted in Patterns section |
| SCO-1 | Scope | No extra features | PASS | Two files only; exactly what the ticket specifies |
| SCO-2 | Scope | All files listed | PASS | Both files listed in Files to Modify; no others touched |
| SCO-3 | Scope | No undisclosed packages | PASS | React built-ins only |

### Verdict: APPROVED

All guardrails passed. Handing off to Developer for Phase 2 implementation.
