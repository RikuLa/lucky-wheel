import React from "react";
import styled from "styled-components";
import { useOxygen } from "../hooks/oxygen";
import { RoomId, useSyncedState } from "../House/sync";

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

export const OxygenMeter = ({ roomId }: { roomId: RoomId }) => {
  const [oxygen] = useOxygen(HARD_CODED_OXYGEN_VALUE);
  const [, setSyncedState] = useSyncedState();
  React.useEffect(() => {
    if (oxygen === 0) {
      console.log("YOU ARE DEAD");
      setSyncedState(roomId, { oxygenDepleted: true });
    }
  }, [oxygen]);
  return (
    <Meter>
      <Value value={oxygen} max={HARD_CODED_OXYGEN_VALUE} />
    </Meter>
  );
};
