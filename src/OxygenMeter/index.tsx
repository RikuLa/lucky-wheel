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
  width: ${(props) => ((props.value * 1.0) / props.max) * 100}%;
  height: 100%;
  background-color: green;
`;

const HARD_CODED_OXYGEN_VALUE = 10;

export const OxygenMeter = () => {
  const [oxygen] = useOxygen(HARD_CODED_OXYGEN_VALUE);
  return (
    <Meter>
      <Value value={oxygen} max={HARD_CODED_OXYGEN_VALUE} />
    </Meter>
  );
};
