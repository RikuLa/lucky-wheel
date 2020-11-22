import React from "react";
import { RoomId, useSyncedState } from "../House/sync";

export const ExitHatch = ({ roomId }: { roomId: RoomId }) => {
  const [syncedState] = useSyncedState();
  const canExit = syncedState.roomStates[roomId].completed;
  const exitRoom = React.useCallback(() => {
    console.log("exit room ", roomId);
  }, [roomId, syncedState]);
  return (
    <div
      style={{
        width: "100px",
        height: "50px",
        backgroundColor: canExit ? "green" : "yellow",
      }}
    >
      exit?
      <button onClick={exitRoom}>exit now</button>
    </div>
  );
};
