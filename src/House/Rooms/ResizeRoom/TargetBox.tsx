import React from "react";
import styled, { keyframes } from "styled-components";

type BoxPorps = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const blink = keyframes`
  from {
    border: 2px solid #550000AA;
    outline: 2px solid #550000AA;
  }

  to {
    border: 2px solid #993333AA;
    outline: 2px solid #993333AA;
  }
`;

const Box = styled.div`
  width: ${(props) => (props.width ? props.width : 100)}px;
  height: ${(props) => (props.height ? props.height : 100)}px;
  position: absolute;
  top: ${(props) => (props.y ? props.y : 100)}px;
  left: ${(props) => (props.x ? props.x : 100)}px;
  border: 1px double #000;
  outline-offset: -6px;
  box-sizing: border-box;
  animation: ${blink} 2s alternate infinite;
  -webkit-background-clip: padding-box; /* for Safari */
  background-clip: padding-box; /* for IE9+, Firefox 4+, Opera, Chrome */
`;

export const TargetBox = ({
  width = 200,
  height = 100,
  x = 100,
  y = 100,
}: BoxPorps) => {
  console.log("doing box", width, height, "at", x, y);
  return <Box width={width} height={height} x={x} y={y} />;
};
