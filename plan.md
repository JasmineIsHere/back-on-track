# Implementation Plan: [BOT-007] Daily Mood Check-In

**Ticket:** BOT-007
**Status:** Approved
**Date:** 2026-07-10

## Summary
Add a daily mood check-in widget to the Home page that lets users select one of five moods, persists the selection to localStorage under a date-keyed key via `useLocalStorage`, and automatically resets on a new calendar day (no history is shown).

## Files to Create
- None — all styled components go into the existing `src/pages/HomePage/index.js` barrel

## Files to Modify
- `src/pages/HomePage/index.js` — add `MoodSection`, `MoodLabel`, `MoodGrid`, and `MoodButton` styled components
- `src/pages/HomePage/Home.jsx` — add mood state via `useLocalStorage`, derive today's date key, render the mood widget below the stats section

## Implementation Steps

1. **Add styled components to `src/pages/HomePage/index.js`**:

   - `MoodSection` — `styled.div`: `margin-top: 1.5rem;`
   - `MoodLabel` — `styled.p`: `font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${({ theme }) => theme.textTertiary}; margin-bottom: 0.75rem;`
   - `MoodGrid` — `styled.div`: `display: flex; gap: 0.5rem; flex-wrap: wrap;`
   - `MoodButton` — `styled.button`:
     ```
     padding: 0.5rem 1rem;
     border-radius: 8px;
     font-size: 0.9rem;
     cursor: pointer;
     border: 1px solid ${({ $selected, theme }) => $selected ? theme.purpleText : theme.border};
     background-color: ${({ $selected, theme }) => $selected ? theme.purpleBg : theme.bgSecondary};
     color: ${({ $selected, theme }) => $selected ? theme.purpleText : theme.textPrimary};
     ```

2. **Update `src/pages/HomePage/Home.jsx`**:

   a. **Add import** for `useLocalStorage` from `'../../hooks/useLocalStorage'`

   b. **Add imports** for `MoodSection`, `MoodLabel`, `MoodGrid`, `MoodButton` from `'.'`

   c. **Define `MOODS` constant** inside the component (or at module level — it's static data):
      ```js
      const MOODS = [
        { id: 'great', label: '😄 Great' },
        { id: 'good', label: '🙂 Good' },
        { id: 'okay', label: '😐 Okay' },
        { id: 'low', label: '😔 Low' },
        { id: 'stressed', label: '😤 Stressed' },
      ];
      ```

   d. **Derive today's date key** inside the component:
      ```js
      const todayKey = `mood-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      ```

   e. **Add mood state** using `useLocalStorage`:
      ```js
      const [selectedMood, setSelectedMood] = useLocalStorage(todayKey, null);
      ```

   f. **Add JSX** inside the existing `<Container>`, below `<StatsSection>`:
      ```jsx
      <MoodSection>
        <MoodLabel>How are you feeling today?</MoodLabel>
        <MoodGrid>
          {MOODS.map((mood) => (
            <MoodButton
              key={mood.id}
              $selected={selectedMood === mood.id}
              onClick={() => setSelectedMood(mood.id)}
            >
              {mood.label}
            </MoodButton>
          ))}
        </MoodGrid>
      </MoodSection>
      ```

## Code Shape

```js
// src/pages/HomePage/index.js — new exports
export const MoodSection = styled.div`margin-top: 1.5rem;`;
export const MoodLabel = styled.p`...text-transform: uppercase; theme.textTertiary;`;
export const MoodGrid = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`;
export const MoodButton = styled.button`
  background-color: ${({ $selected, theme }) => $selected ? theme.purpleBg : theme.bgSecondary};
  color: ${({ $selected, theme }) => $selected ? theme.purpleText : theme.textPrimary};
  border: 1px solid ${({ $selected, theme }) => $selected ? theme.purpleText : theme.border};
`;
```

```js
// src/pages/HomePage/Home.jsx — mood state
const todayKey = `mood-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const [selectedMood, setSelectedMood] = useLocalStorage(todayKey, null);
// key changes each calendar day → yesterday's selection is inaccessible (not deleted, just ignored)
```

## Patterns to Follow
- **`useLocalStorage` for persistence** — date-keyed (`mood-YYYY-MM-DD`) so selection expires naturally across days; initial value `null` means no selection
- **Styled components in barrel** — all four new components added to `src/pages/HomePage/index.js`; none inline in `Home.jsx`
- **Theme tokens only** — `purpleBg`/`purpleText` for selected state, `bgSecondary`/`border`/`textPrimary`/`textTertiary` for unselected and labels; no hardcoded hex
- **`$selected` transient prop** — boolean passed to `MoodButton` to toggle selected styling without leaking to DOM
- **No mood history** — only the current day's key is read; no list, no chart, no previous entries

## Out of Scope
- Mood history or trend visualization
- Clearing / deselecting a previously selected mood
- Syncing mood to AppContext (not needed — mood is page-local state)
- Any navigation or links from the mood widget
- Home Dashboard stats panel changes (BOT-006 is complete)

---
## Review

**Reviewer:** Claude Code Reviewer Agent
**Date:** 2026-07-10
**Ticket:** BOT-007

### Guardrail Results

| ID | Category | Check | Result | Notes |
|---|---|---|---|---|
| SEC-1 | Security | No dangerouslySetInnerHTML | PASS | — |
| SEC-2 | Security | No eval() | PASS | — |
| SEC-3 | Security | No sensitive data in localStorage | PASS | Only mood ID string (e.g. "great") stored under date key — no PII |
| SEC-4 | Security | No network requests | PASS | — |
| COR-1 | Correctness | All acceptance criteria addressed | PASS | All 6 criteria covered: visible selector, 5 mood options with correct emoji, visual highlight + persistence under mood-YYYY-MM-DD key, same-day read, new-day reset via null initialValue, no history |
| COR-2 | Correctness | No scope creep | PASS | — |
| COR-3 | Correctness | File paths valid | PASS | src/pages/HomePage/index.js and Home.jsx match CLAUDE.md structure |
| PAT-1 | Patterns | Styled components in barrel | PASS | All 4 new components (MoodSection, MoodLabel, MoodGrid, MoodButton) in index.js; none inline in Home.jsx |
| PAT-2 | Patterns | No hardcoded colors | PASS | All colors use theme tokens: purpleBg, purpleText, bgSecondary, border, textPrimary, textTertiary |
| PAT-3 | Patterns | No TypeScript | PASS | — |
| PAT-4 | Patterns | No external state libs | PASS | useLocalStorage (custom hook wrapping useState) only |
| PAT-5 | Patterns | localStorage via hook only | PASS | useLocalStorage(todayKey, null) used; no direct .getItem/.setItem calls |
| PAT-6 | Patterns | No misused useEffect | PASS | todayKey derived inline; no useEffect planned |
| SCO-1 | Scope | No extra features | PASS | — |
| SCO-2 | Scope | All files listed | PASS | index.js and Home.jsx both listed under Files to Modify |
| SCO-3 | Scope | No undisclosed packages | PASS | — |

### Verdict: APPROVED

All guardrails passed. Handing off to Developer for implementation.
