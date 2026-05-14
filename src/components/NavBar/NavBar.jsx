import React from 'react'
import { NavBarContainer, NavButton } from '.'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <NavBarContainer>
        <NavButton to="/">Home</NavButton>
        <NavButton to="/habits">Habits</NavButton>
        <NavButton to="/flashcards">Flashcards</NavButton>
    </NavBarContainer>
  )
}

export default NavBar