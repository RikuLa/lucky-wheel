import React from "react";
import styled from "styled-components";
import { useOxygen } from "../hooks/oxygen";
import { RoomId, useSyncedState } from "../House/sync";

const METER_WIDTH = 200;

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  display: inline-block;
  padding: 10px;
  background-color: #121212;
  text-align: center;
  color: #888;
  border: 2px solid #666;
  font-family: monospace;
  font-size: 14pt;
  border-radius: 6px;

  h4 {
    margin: 0;
    margin-bottom: 8px;
  }
`;

const Meter = styled.div`
  position: relative;
  width: ${METER_WIDTH}px;
  height: 50px;
  background-color: #002;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #444;
  border-bottom: 1px solid #333;
`;

const Value = styled.div`
  width: ${(props) => ((props.value * 1.0) / props.max) * 100}%;
  height: 100%;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    0deg,
    rgba(2, 36, 0, 1) 0%,
    rgba(9, 121, 9, 1) 15%,
    rgba(0, 255, 212, 1) 100%
  );
  border-right: 2px solid black;
`;

const Label = styled.span`
  position: absolute;
  top: 15px;
  right: 10%;
  color: white;
  font-family: sans-serif;
`;

const MAX_OXYGEN = 60;

export const OxygenMeter = ({ roomId }: { roomId: RoomId }) => {
  const [oxygen] = useOxygen(MAX_OXYGEN);
  const [state, setSyncedState] = useSyncedState();
  React.useEffect(() => {
    if (oxygen === 0 && !state.roomStates[roomId]?.completed) {
      console.log("YOU ARE DEAD");
      setSyncedState(roomId, { oxygenDepleted: true });
    }
  }, [oxygen]);
  const completed = state.roomStates[roomId]?.completed ?? false;
  return (
    <Container>
      <h4>{completed ? "Room Completed" : "Room Oxygen Level"}</h4>
      {!completed && (
        <Meter>
          <Value value={oxygen} max={MAX_OXYGEN} />
          <Label>
            O<sub>2</sub>
          </Label>
        </Meter>
      )}
    </Container>
  );
};
