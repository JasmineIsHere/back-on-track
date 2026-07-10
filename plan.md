# Implementation Plan: [BOT-006] Home Dashboard Stats Panel

**Ticket:** BOT-006
**Status:** Awaiting Review
**Date:** 2026-07-10

## Summary
Add a stats section to the Home page that reads `habits` and `flashcardProgress` from `useAppContext()` and displays today's habit completion percentage and flashcard deck progress, with contextual empty-state prompts when no data exists yet.

## Files to Create
- `src/pages/HomePage/index.js` — barrel file with all styled components for the stats section (file exists but is empty; will be populated)

## Files to Modify
- `src/pages/HomePage/Home.jsx` — add `useMemo` import, `useAppContext` import, `Container` import, styled component imports from `'.'`, compute derived progress, render stats section below the `HeaderBar`

## Implementation Steps

1. **Populate `src/pages/HomePage/index.js`** with the following named exports (all using `styled-components`; no hardcoded colors):

   - `StatsSection` — `styled.div`: `display: flex; flex-direction: column; gap: 1rem;`
   - `StatCard` — `styled.div`: `background-color: ${({ theme }) => theme.bgSecondary}; border: 1px solid ${({ theme }) => theme.border}; border-radius: 12px; padding: 1.25rem 1.5rem;`
   - `StatLabel` — `styled.p`: `font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${({ theme }) => theme.textTertiary}; margin-bottom: 0.5rem;`
   - `StatValue` — `styled.p`: `font-size: 1rem; color: ${({ $tone, theme }) => $tone === 'good' ? theme.greenText : $tone === 'partial' ? theme.amberText : theme.textSecondary};`
   - `EmptyPrompt` — `styled.p`: `font-size: 0.875rem; color: ${({ theme }) => theme.textSecondary};`

2. **Rewrite `src/pages/HomePage/Home.jsx`**:

   a. **Imports**: add `useMemo` from `'react'`; `Container` from `'../../components/Container'`; `useAppContext` from `'../../context/AppContext'`; named exports `StatsSection`, `StatCard`, `StatLabel`, `StatValue`, `EmptyPrompt` from `'.'`

   b. **Inside `HomePage` component**, after the existing date/greeting logic:
      ```js
      const { habits, flashcardProgress } = useAppContext();

      const habitStats = useMemo(() => {
        const total = habits.length;
        const completed = habits.filter((h) => h.completed).length;
        const percent = total ? Math.round((completed / total) * 100) : 0;
        return { total, completed, percent };
      }, [habits]);

      const flashTone = flashcardProgress.total === 0 ? 'none'
        : flashcardProgress.completed === flashcardProgress.total ? 'good'
        : flashcardProgress.completed > 0 ? 'partial'
        : 'none';

      const habitTone = habitStats.total === 0 ? 'none'
        : habitStats.percent === 100 ? 'good'
        : habitStats.percent > 0 ? 'partial'
        : 'none';
      ```

   c. **JSX return**: wrap in a fragment, keep `HeaderBar` first, add `Container` with stats below:
      ```jsx
      <>
        <HeaderBar title={greeting() + ", " + user + "!"} subtitle={formattedDate} />
        <Container>
          <StatsSection>
            <StatCard>
              <StatLabel>Today's habits</StatLabel>
              {habitStats.total === 0 ? (
                <EmptyPrompt>Add your first habit on the Habits page</EmptyPrompt>
              ) : (
                <StatValue $tone={habitTone}>
                  {habitStats.completed} / {habitStats.total} habits done — {habitStats.percent}%
                </StatValue>
              )}
            </StatCard>
            <StatCard>
              <StatLabel>Flashcard session</StatLabel>
              {flashcardProgress.total === 0 ? (
                <EmptyPrompt>Start a session on the Flashcards page</EmptyPrompt>
              ) : (
                <StatValue $tone={flashTone}>
                  {flashcardProgress.completed} / {flashcardProgress.total} cards cleared
                </StatValue>
              )}
            </StatCard>
          </StatsSection>
        </Container>
      </>
      ```

## Code Shape

```js
// src/pages/HomePage/index.js — key exports
export const StatsSection = styled.div`display: flex; flex-direction: column; gap: 1rem;`;
export const StatCard = styled.div`...theme.bgSecondary / theme.border;`;
export const StatLabel = styled.p`...text-transform: uppercase; theme.textTertiary;`;
export const StatValue = styled.p`color: ${({ $tone, theme }) => $tone === 'good' ? theme.greenText : $tone === 'partial' ? theme.amberText : theme.textSecondary};`;
export const EmptyPrompt = styled.p`...theme.textSecondary;`;
```

```js
// src/pages/HomePage/Home.jsx — derived state shape
const { habits, flashcardProgress } = useAppContext();
const habitStats = useMemo(() => ({ total, completed, percent }), [habits]);
// $tone prop: 'good' | 'partial' | 'none' — drives StatValue color via theme token
```

## Patterns to Follow
- **Styled components in barrel** — all components in `index.js`; none declared inline in `Home.jsx`
- **Theme tokens only** — `greenText`/`amberText`/`textSecondary`/`bgSecondary`/`border`/`textTertiary`; no hardcoded hex
- **`$tone` transient prop** — passes semantic tone signal to `StatValue` without leaking to DOM
- **`useMemo` for derived values** — `habitStats` is computed with `useMemo`, never `useEffect`
- **`useAppContext()` for cross-page state** — no prop drilling from App.jsx
- **`Container` shared component** — wraps stats section just as other pages do

## Out of Scope
- Mood check-in widget (BOT-007)
- Streak display on the home page
- Navigation links within the stats cards
- Animated counters or progress bars on the home page
- Persisting flashcard session progress across page refreshes (AppContext holds it in session state)
