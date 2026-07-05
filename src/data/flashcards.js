const flashcards = [
  // React hooks (8 cards)
  {
    id: 'react-001',
    question: 'What is the purpose of the useState hook?',
    answer: 'useState lets a function component hold local state. It returns [currentValue, setter]. React schedules a re-render whenever the setter is called with a value that differs from the current one (compared with Object.is).',
    topic: 'React & JS deck',
  },
  {
    id: 'react-002',
    question: 'Why pass a function to useState (lazy initialiser) instead of a plain value?',
    answer: 'The function form — useState(() => compute()) — is called only on the first render. The plain value form — useState(compute()) — evaluates on every render. Use the lazy form for expensive initialisations such as reading localStorage or parsing large data.',
    topic: 'React & JS deck',
  },
  {
    id: 'react-003',
    question: 'What does useEffect\'s cleanup function do, and when does it run?',
    answer: 'The function returned from useEffect is the cleanup. It runs before the next effect execution (when dependencies change) and when the component unmounts. Use it to cancel timers, abort fetches, or remove event listeners to prevent memory leaks.',
    topic: 'React & JS deck',
  },
  {
    id: 'react-004',
    question: 'What is useCallback and when should you use it?',
    answer: 'useCallback returns a memoised version of a function that only changes if one of its dependencies changes. Use it when passing callbacks to child components wrapped in React.memo, or when a function is listed as a dependency of another hook, to prevent unnecessary re-renders or effect re-runs.',
    topic: 'React & JS deck',
  },
  {
    id: 'react-005',
    question: 'What is the difference between useMemo and useCallback?',
    answer: 'useMemo memoises a computed value: useMemo(() => expensiveCalc(a, b), [a, b]). useCallback memoises a function reference: useCallback(() => doThing(a), [a]). useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).',
    topic: 'React & JS deck',
  },
  {
    id: 'react-006',
    question: 'What is useRef and how does it differ from useState?',
    answer: 'useRef returns a mutable object { current: value } that persists across renders. Unlike useState, mutating ref.current does not trigger a re-render. Common uses: storing a DOM node reference, holding a previous value, or keeping a mutable variable (e.g. a timer ID) without causing renders.',
    topic: 'React & JS deck',
  },
  {
    id: 'react-007',
    question: 'When would you choose useReducer over useState?',
    answer: 'Prefer useReducer when state logic involves multiple sub-values, when the next state depends on the previous in complex ways, or when you want to centralise and test state transitions as pure functions (action → new state). useState is simpler for independent, single-value state.',
    topic: 'React & JS deck',
  },
  {
    id: 'react-008',
    question: 'How does useContext work and what problem does it solve?',
    answer: 'useContext(MyContext) reads the nearest matching Context.Provider value above the component in the tree, without passing props through every intermediate component (prop drilling). Any component that calls useContext re-renders whenever the context value changes.',
    topic: 'React & JS deck',
  },

  // Component lifecycle (4 cards)
  {
    id: 'lifecycle-001',
    question: 'What are the three phases of a React component\'s lifecycle?',
    answer: 'Mounting (component inserted into the DOM — initial render, effects run after), Updating (re-render triggered by state or prop change — effects with changed deps re-run), and Unmounting (component removed from the DOM — cleanup functions run, effects do not re-run).',
    topic: 'React & JS deck',
  },
  {
    id: 'lifecycle-002',
    question: 'In what order do useEffect hooks run relative to rendering?',
    answer: 'React first renders (calculates the new VDOM and commits DOM mutations), then runs useEffect hooks after the browser has painted. This means effects do not block the browser from painting. If you need synchronous DOM measurement before paint, use useLayoutEffect instead.',
    topic: 'React & JS deck',
  },
  {
    id: 'lifecycle-003',
    question: 'Why does React StrictMode invoke components and effects twice in development?',
    answer: 'StrictMode intentionally double-invokes function component bodies and effect setup/cleanup to help detect side effects that rely on being called only once. If your component breaks under double-invocation, it has impure rendering or unguarded side effects that need fixing.',
    topic: 'React & JS deck',
  },
  {
    id: 'lifecycle-004',
    question: 'What is the role of the key prop, and what happens when you change it?',
    answer: 'key is React\'s identity signal for list items and components. React uses it during reconciliation to match old and new elements. Changing a component\'s key forces React to unmount the old instance and mount a fresh one, resetting all state — useful when you want to fully reset a component without lifting state.',
    topic: 'React & JS deck',
  },

  // JavaScript fundamentals (5 cards)
  {
    id: 'js-001',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has returned. Every function in JavaScript forms a closure over the scope where it was defined, which is why inner functions can read and write outer variables.',
    topic: 'React & JS deck',
  },
  {
    id: 'js-002',
    question: 'What are the differences between var, let, and const?',
    answer: 'var is function-scoped, hoisted to the top of its function, and can be re-declared. let and const are block-scoped ({} boundaries), not accessible before declaration (temporal dead zone), and cannot be re-declared in the same scope. const additionally prevents reassignment of the binding (though object contents can still mutate).',
    topic: 'React & JS deck',
  },
  {
    id: 'js-003',
    question: 'What is hoisting in JavaScript?',
    answer: 'Hoisting is the behaviour where variable and function declarations are processed before code executes. Function declarations are fully hoisted (callable before the line they appear). var declarations are hoisted but initialised to undefined. let/const declarations are hoisted but not initialised — accessing them before their declaration throws a ReferenceError (temporal dead zone).',
    topic: 'React & JS deck',
  },
  {
    id: 'js-004',
    question: 'What is the JavaScript event loop?',
    answer: 'The event loop continuously checks whether the call stack is empty. When it is, it dequeues tasks from the task queue (macrotasks: setTimeout, setInterval, I/O) and runs them. Microtasks (Promise callbacks, queueMicrotask) have their own queue that is fully drained after each macrotask and before the next one starts.',
    topic: 'React & JS deck',
  },
  {
    id: 'js-005',
    question: 'What is the prototype chain?',
    answer: 'Every JavaScript object has an internal [[Prototype]] link pointing to another object (or null). When a property lookup fails on an object, JS follows the chain upward until the property is found or the chain ends at null. This is the mechanism behind inheritance: methods on Array.prototype are available on all arrays via the chain.',
    topic: 'React & JS deck',
  },

  // Async patterns (4 cards)
  {
    id: 'async-001',
    question: 'What are the three states of a JavaScript Promise?',
    answer: 'Pending (initial state — neither fulfilled nor rejected), Fulfilled (the operation completed successfully and the promise has a resolved value), and Rejected (the operation failed and the promise has a reason/error). Once settled (fulfilled or rejected) a promise cannot transition to another state.',
    topic: 'React & JS deck',
  },
  {
    id: 'async-002',
    question: 'What does async/await syntax do under the hood?',
    answer: 'An async function always returns a Promise. The await keyword pauses execution of the async function until the awaited Promise settles, then resumes with the resolved value (or throws on rejection). It is syntactic sugar over Promise.then() chains, making asynchronous code read like synchronous code without blocking the thread.',
    topic: 'React & JS deck',
  },
  {
    id: 'async-003',
    question: 'What is the difference between Promise.all and Promise.allSettled?',
    answer: 'Promise.all(promises) resolves when ALL promises fulfil, but rejects immediately if any single promise rejects ("fail fast"). Promise.allSettled(promises) always waits for every promise to settle and returns an array of {status, value/reason} objects — use it when you need results from all operations regardless of individual failures.',
    topic: 'React & JS deck',
  },
  {
    id: 'async-004',
    question: 'What is the difference between microtasks and macrotasks in the event loop?',
    answer: 'Macrotasks (setTimeout, setInterval, I/O callbacks) are queued in the task queue and processed one per event loop iteration. Microtasks (Promise.then/catch/finally, queueMicrotask, MutationObserver) are queued in the microtask queue and all are drained completely after the current task finishes, before the next macrotask starts. This means Promise callbacks always run before the next setTimeout callback.',
    topic: 'React & JS deck',
  },
];

export default flashcards;
