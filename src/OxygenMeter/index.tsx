import React from "react";
import styled from "styled-components";
import { useOxygen } from "../hooks/oxygen";

const METER_WIDTH = 200;

const Meter = styled.div`
  width: ${METER_WIDTH}px;
  height: 50px;
  background-color: red;
`;

const Value = styled.div`
  width: ${(props) => ((props.value * 1.0) / 10) * 100}%;
  height: 100%;
  background-color: green;
`;

export const OxygenMeter = () => {
  const [oxygen] = useOxygen(10);
  return (
    <Meter max={10}>
      <Value value={oxygen} />
    </Meter>
  );
};
