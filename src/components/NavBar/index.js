import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const NavBarContainer = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    background-color: ${(props) => props.theme.bgSecondary};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const NavButton = styled(NavLink)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 1rem;
    text-decoration: none;
    font-size: 1.2rem;
    color: ${(props) => props.theme.textPrimary};
    &:hover {
        color: ${(props) => props.theme.purpleText};
    }
    &.active {
        color: ${(props) => props.theme.purpleStrong};
    }
`;
