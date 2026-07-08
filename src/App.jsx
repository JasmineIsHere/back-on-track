import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import { GlobalStyles } from './GlobalStyles'
import { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from './theme'
import { useState } from 'react'
import HomePage from './pages/HomePage/Home'
import HabitsPage from './pages/HabitsPage/HabitsPage'
import FlashcardsPage from './pages/FlashcardsPage/FlashcardsPage'
import { AppProvider } from './context/AppContext'

function App() {

  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles/>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
          </Routes>
          <NavBar />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
