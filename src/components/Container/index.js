import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem 2rem;
  padding: 1rem 1.5rem;
  min-height: 1rem;
  background-color: ${(props) => props.theme.bgSecondary};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
`;

export default Container;