import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HabitsPage from './pages/HabitsPage'
import FlashCardsPage from './pages/FlashCardsPage'
import NavBar from './components/NavBar/NavBar'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="App">Hello, World!</div>} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/flashcards" element={<FlashCardsPage />} />
      </Routes>
            <NavBar />

    </BrowserRouter>

    </> 
  )
}

export default App
