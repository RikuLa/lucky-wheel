import React from "react";
import styled, { keyframes } from "styled-components";

import Planet1 from "../../../assets/planet_18.png";
import Planet2 from "../../../assets/planet_19.png";
import Planet3 from "../../../assets/planet_23.png";
import Planet4 from "../../../assets/planet_31.png";
const planetImgs = [Planet1, Planet2, Planet3, Planet4];

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

const PlanetImg = styled.img`
  position: absolute;
  width: 200px;
  height: 200px;
  left: ${({ left }: { left: number }) => left}px;
  top: ${({ top }: { top: number }) => top}px;
  z-index: -1;
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
  const img = React.useMemo(
    () => planetImgs[Math.floor(Math.random() * planetImgs.length)],
    [x, y, width, height]
  );
  return (
    <Box width={width} height={height} x={x} y={y}>
      <div style={{ position: "relative" }}>
        <PlanetImg
          src={img}
          left={-(200 - width) / 2}
          top={-(200 - width) / 2}
        />
      </div>
    </Box>
  );
};
