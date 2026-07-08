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
