import { NavBarContainer, NavButton } from "./index";
import { TbCards, TbChecklist, TbHome } from "react-icons/tb";

const NavBar = () => {
  return (
    <NavBarContainer>
      <NavButton to="/">
        <TbHome />
        Home
      </NavButton>
      <NavButton to="/habits">
        <TbChecklist />
        Habits
      </NavButton>
      <NavButton to="/flashcards">
        <TbCards />
        Flashcards
      </NavButton>
    </NavBarContainer>
  );
};

export default NavBar;
