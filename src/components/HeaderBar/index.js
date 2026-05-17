import styled from "styled-components";

export const HeaderBarDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  background-color: ${(props) => props.theme.bgSecondary};
`;

export const HeaderTitle = styled.h1`
  font-size: 2rem;
  color: ${(props) => props.theme.textPrimary};
`;

export const HeaderSubtitle = styled.h2`
  font-size: 1rem;
  color: ${(props) => props.theme.textSecondary};
`;

