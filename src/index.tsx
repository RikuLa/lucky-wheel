import React from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";
import { House } from "./House";

// @ts-ignore
import StarBg from "./assets/starbg.jpg";

const BackgroundParallax = keyframes`
0% {
  background-position: 0% 0%;
}
100% {
  background-position: 100% 100%;
}
`;

const StyledHouse = styled(House)`
  height: 100vh;
  background-image: url(${StarBg});
  animation: ${BackgroundParallax} 150s linear infinite;
`;

ReactDOM.render(<StyledHouse />, document.getElementById("root"));
