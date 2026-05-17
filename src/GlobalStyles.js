import {  createGlobalStyle } from 'styled-components';
export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0; 
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  body {
    background-color: ${(props) => props.theme.bgPrimary};
    color: ${(props) => props.theme.textPrimary};
    transition: background-color 0.2s ease, color 0.2s ease;
  }
`