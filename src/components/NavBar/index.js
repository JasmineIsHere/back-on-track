import styled from "styled-components";
import { Link } from "react-router-dom";

export const NavBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #7ea7cf;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
`;

export const NavButton = styled(Link)`
    margin: 0 1rem;
    text-decoration: none;
    color: #fff;
    font-weight: bold;
    &:hover {
        color: #f0f0f0;
    }
`;
