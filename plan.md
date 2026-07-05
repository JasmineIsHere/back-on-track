# Implementation Plan: [BOT-001] Create useLocalStorage Custom Hook

**Ticket:** BOT-001
**Status:** Approved
**Date:** 2026-06-30

## Summary
Create a `useLocalStorage` custom hook in `src/hooks/useLocalStorage.js` that wraps `useState` with automatic JSON serialisation to and from `localStorage`. This is the foundational persistence primitive that all subsequent tickets (BOT-003 habit persistence, BOT-007 mood check-in) depend on.

## Files to Create
- `src/hooks/useLocalStorage.js` — the custom hook; also implicitly creates the `src/hooks/` directory

## Files to Modify
- None

## Implementation Steps

1. **Create directory and file**: Create `src/hooks/useLocalStorage.js`.

2. **Initialise state from localStorage**: Inside the hook, call `useState` with a lazy initialiser function. The initialiser reads `localStorage.getItem(key)`. If the item exists, parse it with `JSON.parse` and return it. If it does not exist (returns `null`), write `initialValue` to localStorage via `localStorage.setItem(key, JSON.stringify(initialValue))` and then return `initialValue`. Wrap both the read and write in a try/catch — if `JSON.parse` throws (invalid JSON) or `JSON.stringify` throws, fall back to returning `initialValue` without throwing.

3. **Write a `setValue` setter**: Define a `setValue` function (using `useCallback`) that accepts either a new value or an updater function (same API as the `useState` setter). Resolve the new value (call it if it's a function, passing the current stored value). Then call `JSON.stringify` on the new value and write it to `localStorage.setItem(key, ...)`. Then call the React state setter with the new value. Wrap in try/catch — if serialisation fails, still update React state without writing to localStorage.

4. **Return `[storedValue, setValue]`**: The return signature mirrors `useState` exactly.

5. **Export as named export**: `export function useLocalStorage(key, initialValue) { ... }`

## Code Shape

```js
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) return JSON.parse(item);
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      setStoredValue(value instanceof Function ? value(storedValue) : value);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
```

## Patterns to Follow
- **Pure logic hook** — no JSX, no styled-components; this file has no UI surface
- **JavaScript only** — no TypeScript annotations per CLAUDE.md constraints
- **No direct localStorage access in components** — this hook IS the single permitted access point; all future features must use it
- **`useState` lazy initialiser** — use the function form `useState(() => ...)` to avoid reading localStorage on every render

## Out of Scope
- Syncing across browser tabs (no `storage` event listener)
- TTL / expiry logic
- Any UI or styled component
- AppContext (BOT-003)
- Any feature that consumes this hook (BOT-003 through BOT-007)

---
## Review

**Reviewer:** Claude Code Reviewer Agent
**Date:** 2026-06-30
**Ticket:** BOT-001

### Guardrail Results

| ID | Category | Check | Result | Notes |
|---|---|---|---|---|
| SEC-1 | Security | No dangerouslySetInnerHTML | PASS | Pure JS hook, no JSX |
| SEC-2 | Security | No eval() | PASS | Uses JSON.parse only |
| SEC-3 | Security | No sensitive data in localStorage | PASS | Generic key/value utility, no PII mentioned |
| SEC-4 | Security | No network requests | PASS | localStorage only |
| COR-1 | Correctness | All acceptance criteria addressed | FAIL | Criterion 3 not met: "On first call with a new key, initialValue is written to localStorage and returned." Step 2 returns initialValue when the key is absent but does not call localStorage.setItem. The Code Shape confirms: `item !== null ? JSON.parse(item) : initialValue` — no write on first access. |
| COR-2 | Correctness | No scope creep | PASS | Only the hook file is created |
| COR-3 | Correctness | File paths valid | PASS | src/hooks/useLocalStorage.js matches CLAUDE.md planned structure |
| PAT-1 | Patterns | Styled components in barrel | PASS | No styled components — pure logic hook |
| PAT-2 | Patterns | No hardcoded colors | PASS | No colors or UI |
| PAT-3 | Patterns | No TypeScript | PASS | Code Shape is plain JavaScript |
| PAT-4 | Patterns | No external state libs | PASS | Only useState and useCallback from React |
| PAT-5 | Patterns | localStorage via hook only | PASS | This file IS the hook; direct access is correct here |
| PAT-6 | Patterns | No misused useEffect | PASS | No useEffect; uses useState lazy initialiser correctly |
| SCO-1 | Scope | No extra features | PASS | Exactly one file, nothing beyond the hook |
| SCO-2 | Scope | All files listed | PASS | src/hooks/useLocalStorage.js in Files to Create |
| SCO-3 | Scope | No undisclosed packages | PASS | React built-ins only |

### Verdict: FAIL

The following issue must be resolved before implementation:

1. **COR-1** — Step 2 describes reading `initialValue` from memory when a key is absent, but does not write it to localStorage. Acceptance criterion 3 explicitly requires: *"On first call with a new key, `initialValue` is written to localStorage and returned."* The fix: in the `useState` lazy initialiser, when `item === null`, call `window.localStorage.setItem(key, JSON.stringify(initialValue))` before returning `initialValue`. The corrected initialiser should be:
   ```js
   const item = window.localStorage.getItem(key);
   if (item !== null) return JSON.parse(item);
   window.localStorage.setItem(key, JSON.stringify(initialValue));
   return initialValue;
   ```

Please review the issue above and tell me how you'd like to proceed before I revise the plan.

---
## Review (Second Pass)

**Reviewer:** Claude Code Reviewer Agent
**Date:** 2026-07-05
**Ticket:** BOT-001

### Guardrail Results

| ID | Category | Check | Result | Notes |
|---|---|---|---|---|
| SEC-1 | Security | No dangerouslySetInnerHTML | PASS | Pure JS hook, no JSX |
| SEC-2 | Security | No eval() | PASS | Uses JSON.parse only |
| SEC-3 | Security | No sensitive data in localStorage | PASS | Generic key/value utility, no PII mentioned |
| SEC-4 | Security | No network requests | PASS | localStorage only |
| COR-1 | Correctness | All acceptance criteria addressed | PASS | Fix applied: initialiser now calls `window.localStorage.setItem(key, JSON.stringify(initialValue))` before returning `initialValue` when key is absent |
| COR-2 | Correctness | No scope creep | PASS | Only the hook file is created |
| COR-3 | Correctness | File paths valid | PASS | src/hooks/useLocalStorage.js matches CLAUDE.md planned structure |
| PAT-1 | Patterns | Styled components in barrel | PASS | No styled components — pure logic hook |
| PAT-2 | Patterns | No hardcoded colors | PASS | No colors or UI |
| PAT-3 | Patterns | No TypeScript | PASS | Code Shape is plain JavaScript |
| PAT-4 | Patterns | No external state libs | PASS | Only useState and useCallback from React |
| PAT-5 | Patterns | localStorage via hook only | PASS | This file IS the hook; direct access is correct here |
| PAT-6 | Patterns | No misused useEffect | PASS | No useEffect; uses useState lazy initialiser correctly |
| SCO-1 | Scope | No extra features | PASS | Exactly one file, nothing beyond the hook |
| SCO-2 | Scope | All files listed | PASS | src/hooks/useLocalStorage.js in Files to Create |
| SCO-3 | Scope | No undisclosed packages | PASS | React built-ins only |

### Verdict: APPROVED

All guardrails passed. Handing off to Developer for Phase 2 implementation.
