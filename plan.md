# Implementation Plan: [BOT-005] Flashcard Flip-Card Interface, Self-Rating, and Queue

**Ticket:** BOT-005
**Status:** Approved
**Date:** 2026-07-08

## Summary
Replace the FlashcardsPage stub with a full flip-card study experience: a `useReducer`-driven queue that lets users flip cards, rate them ("Got it" / "Review again"), and tracks cleared count in a progress bar and in AppContext. All styled components go in a new barrel file.

## Files to Create
- `src/pages/FlashcardsPage/index.js` — barrel file with all styled components for the flashcard UI

## Files to Modify
- `src/pages/FlashcardsPage/FlashcardsPage.jsx` — full rewrite of the stub; adds `useReducer`, loads cards from `src/data/flashcards.js`, renders flip card, rating buttons, progress bar, and completion screen

## Implementation Steps

1. **Create `src/pages/FlashcardsPage/index.js`** with the following named exports (all using `styled-components`; no hardcoded colors):

   - `CardScene` — `styled.div`: `perspective: 1000px; width: 100%; cursor: pointer; margin: 1rem 0;`
   - `CardInner` — `styled.div`: `position: relative; min-height: 220px; transform-style: preserve-3d; transition: transform 0.5s ease; transform: ${({ $flipped }) => $flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};`
   - Internal (non-exported) `CardFace` base: `position: absolute; top: 0; left: 0; right: 0; bottom: 0; min-height: 220px; border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; backface-visibility: hidden; background-color: ${({ theme }) => theme.bgSecondary}; border: 1px solid ${({ theme }) => theme.border};`
   - `CardFront` — `styled(CardFace)`: no additional styles (shows by default)
   - `CardBack` — `styled(CardFace)`: `transform: rotateY(180deg);` (pre-rotated so it shows when CardInner flips)
   - `CardText` — `styled.p`: `font-size: 1.1rem; color: ${({ theme }) => theme.textPrimary}; line-height: 1.6;`
   - `FlipHint` — `styled.span`: `font-size: 0.75rem; color: ${({ theme }) => theme.textTertiary}; margin-top: 1rem;`
   - `RatingRow` — `styled.div`: `display: flex; gap: 1rem; margin-top: 1rem;`
   - `GotItButton` — `styled.button`: `flex: 1; padding: 0.75rem; border-radius: 8px; font-size: 1rem; cursor: pointer; background-color: ${({ theme }) => theme.greenBg}; color: ${({ theme }) => theme.greenText}; border: 1px solid ${({ theme }) => theme.greenText};`
   - `ReviewAgainButton` — `styled.button`: same shape as `GotItButton` but `background-color: ${({ theme }) => theme.amberBg}; color: ${({ theme }) => theme.amberText}; border: 1px solid ${({ theme }) => theme.amberText};`
   - `ProgressTrack` — `styled.div`: `width: 100%; height: 8px; background-color: ${({ theme }) => theme.bgSecondary}; border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem;`
   - `ProgressFill` — `styled.div`: `height: 100%; width: ${({ $percent }) => $percent}%; background-color: ${({ theme }) => theme.greenStrong}; border-radius: 4px; transition: width 0.3s ease;`
   - `ProgressLabel` — `styled.p`: `font-size: 0.875rem; color: ${({ theme }) => theme.textSecondary}; margin-bottom: 1rem;`
   - `CompletionBox` — `styled.div`: `text-align: center; padding: 2rem; background-color: ${({ theme }) => theme.greenBg}; border-radius: 12px; color: ${({ theme }) => theme.greenText};`
   - `ResetButton` — `styled.button`: `margin-top: 1rem; padding: 0.75rem 1.5rem; background-color: ${({ theme }) => theme.bgSecondary}; color: ${({ theme }) => theme.textPrimary}; border: 1px solid ${({ theme }) => theme.border}; border-radius: 8px; font-size: 1rem; cursor: pointer;`

2. **Rewrite `src/pages/FlashcardsPage/FlashcardsPage.jsx`**:

   a. **Imports**: `useReducer`, `useState` from `'react'`; `HeaderBar`; `Container` from `'../../components/Container'`; `useAppContext` from `'../../context/AppContext'`; default `flashcards` from `'../../data/flashcards'`; all named exports from `'.'`.

   b. **Define `TOPICS` constant** at module level (outside the component):
      ```js
      const TOPICS = ["React & JS deck", "Java 21 deck", "Data Structures deck", "Kubernetes deck"];
      ```

   c. **Define `buildInitialState(cards)` helper** at module level:
      ```js
      function buildInitialState(cards) {
        return { queue: [...cards], cleared: 0, total: cards.length, flipped: false, done: cards.length === 0 };
      }
      ```

   d. **Define `reducer(state, action)` at module level** with four cases:
      - `FLIP` — returns `{ ...state, flipped: !state.flipped }`
      - `RATE_GOT_IT` — destructures `[, ...rest]` from `state.queue`, returns `{ ...state, queue: rest, cleared: state.cleared + 1, flipped: false, done: rest.length === 0 }`
      - `RATE_REVIEW_AGAIN` — destructures `[current, ...rest]` from `state.queue`, returns `{ ...state, queue: [...rest, current], flipped: false }`
      - `RESET` — returns `buildInitialState(action.cards)`
      - `default` — returns `state`

   e. **Inside `FlashcardsPage` component**:
      - `const { setFlashcardProgress } = useAppContext()`
      - `const [selectedTopic] = useState(() => TOPICS[Math.floor(Math.random() * TOPICS.length)])` — keeps random topic from initial render, consistent with existing behaviour
      - `const [state, dispatch] = useReducer(reducer, selectedTopic, (topic) => buildInitialState(flashcards.filter(c => c.topic === topic)))` — lazy initialiser filters cards once at mount
      - `const percent = state.total ? Math.round((state.cleared / state.total) * 100) : 0`
      - `const currentCard = state.queue[0]`

   f. **Event handlers inside the component**:
      ```js
      const handleFlip = () => dispatch({ type: 'FLIP' });

      const handleGotIt = () => {
        const newCleared = state.cleared + 1;
        dispatch({ type: 'RATE_GOT_IT' });
        setFlashcardProgress({ completed: newCleared, total: state.total });
      };

      const handleReviewAgain = () => dispatch({ type: 'RATE_REVIEW_AGAIN' });

      const handleReset = () => {
        const cards = flashcards.filter(c => c.topic === selectedTopic);
        dispatch({ type: 'RESET', cards });
        setFlashcardProgress({ completed: 0, total: cards.length });
      };
      ```

   g. **JSX return**:
      ```jsx
      <>
        <HeaderBar title="Flashcards" subtitle={selectedTopic} />
        <Container>
          <ProgressTrack><ProgressFill $percent={percent} /></ProgressTrack>
          <ProgressLabel>{state.cleared} / {state.total} cards cleared</ProgressLabel>

          {state.done ? (
            <CompletionBox>
              <p>All cards cleared! 🎉</p>
              <ResetButton onClick={handleReset}>Restart deck</ResetButton>
            </CompletionBox>
          ) : (
            <>
              <CardScene onClick={handleFlip}>
                <CardInner $flipped={state.flipped}>
                  <CardFront>
                    <CardText>{currentCard.question}</CardText>
                    <FlipHint>Tap to reveal answer</FlipHint>
                  </CardFront>
                  <CardBack>
                    <CardText>{currentCard.answer}</CardText>
                  </CardBack>
                </CardInner>
              </CardScene>
              {state.flipped && (
                <RatingRow>
                  <GotItButton onClick={handleGotIt}>Got it ✓</GotItButton>
                  <ReviewAgainButton onClick={handleReviewAgain}>Review again</ReviewAgainButton>
                </RatingRow>
              )}
            </>
          )}
        </Container>
      </>
      ```

## Code Shape

```js
// src/pages/FlashcardsPage/index.js — key exports
export const CardScene = styled.div`...cursor: pointer; perspective: 1000px;`;
export const CardInner = styled.div`
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  transform: ${({ $flipped }) => $flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;
// Internal base (not exported)
const CardFace = styled.div`...backface-visibility: hidden;`;
export const CardFront = styled(CardFace)``;
export const CardBack = styled(CardFace)`transform: rotateY(180deg);`;
export const GotItButton = styled.button`...theme.greenBg / theme.greenText`;
export const ReviewAgainButton = styled.button`...theme.amberBg / theme.amberText`;
export const ProgressFill = styled.div`width: ${({ $percent }) => $percent}%;`;
export const CompletionBox = styled.div`...theme.greenBg / theme.greenText`;
```

```js
// src/pages/FlashcardsPage/FlashcardsPage.jsx — reducer shape
// State: { queue: Card[], cleared: number, total: number, flipped: boolean, done: boolean }
// Actions: FLIP | RATE_GOT_IT | RATE_REVIEW_AGAIN | RESET(cards)
useReducer(reducer, selectedTopic, (topic) => buildInitialState(flashcards.filter(...)))
```

## Patterns to Follow
- **Styled components in barrel** — all components in `index.js`; none declared inline in `FlashcardsPage.jsx`
- **Theme tokens only** — `greenBg/greenText/greenStrong`, `amberBg/amberText`, `bgSecondary`, `border`, `textPrimary/Secondary/Tertiary`; no hardcoded hex
- **`$flipped` transient prop** — prevents the boolean from reaching the DOM element
- **`$percent` transient prop** — same pattern as HabitsPage ProgressFill
- **`useReducer` for queue logic** — per ticket's explicit technical note; all state transitions are pure functions in `reducer`
- **Cross-page state update** — `setFlashcardProgress` from `useAppContext()` is called in `handleGotIt` and `handleReset`, never via direct localStorage; AppContext owns the data
- **Lazy initialiser on `useReducer`** — `(topic) => buildInitialState(...)` form avoids recomputing on every render

## Out of Scope
- Persisting flashcard progress in localStorage (AppContext holds it in session state — BOT-003 defined `flashcardProgress` as session-only)
- Topic switcher UI (no UI to change topic during session in this ticket)
- Keyboard navigation or accessibility enhancements
- Shuffle or random ordering of cards
- Home Dashboard stats panel (BOT-006)
- Mood check-in (BOT-007)

---
## Review

**Reviewer:** Claude Code Reviewer Agent
**Date:** 2026-07-10
**Ticket:** BOT-005

### Guardrail Results

| ID | Category | Check | Result | Notes |
|---|---|---|---|---|
| SEC-1 | Security | No dangerouslySetInnerHTML | PASS | — |
| SEC-2 | Security | No eval() | PASS | — |
| SEC-3 | Security | No sensitive data in localStorage | PASS | flashcardProgress is session-only, not stored in localStorage |
| SEC-4 | Security | No network requests | PASS | — |
| COR-1 | Correctness | All acceptance criteria addressed | PASS | All 9 criteria covered: card display, flip, Got it, Review again, progress bar, completion screen, AppContext update |
| COR-2 | Correctness | No scope creep | PASS | — |
| COR-3 | Correctness | File paths valid | PASS | src/pages/FlashcardsPage/index.js and FlashcardsPage.jsx match CLAUDE.md structure |
| PAT-1 | Patterns | Styled components in barrel | PASS | All styled components in index.js; none inline in FlashcardsPage.jsx |
| PAT-2 | Patterns | No hardcoded colors | PASS | All colors use theme tokens (greenBg, greenText, amberBg, amberText, etc.) |
| PAT-3 | Patterns | No TypeScript | PASS | — |
| PAT-4 | Patterns | No external state libs | PASS | useReducer + useState only |
| PAT-5 | Patterns | localStorage via hook only | PASS | flashcardProgress uses session useState; no direct localStorage calls |
| PAT-6 | Patterns | No misused useEffect | PASS | percent computed inline; no useEffect used |
| SCO-1 | Scope | No extra features | PASS | — |
| SCO-2 | Scope | All files listed | PASS | index.js (create) and FlashcardsPage.jsx (modify) both listed |
| SCO-3 | Scope | No undisclosed packages | PASS | — |

### Verdict: APPROVED

All guardrails passed. Handing off to Developer for implementation.
