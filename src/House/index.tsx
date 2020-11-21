import * as React from "react";
import { rooms } from "./rooms";
import Lobby from "./Lobby";

export const House = () => {
  const [roomId, setRoomId] = React.useState(null);
  window.addEventListener(
    "message",
    (event) => {
      if (typeof event.data === "string") {
        setRoomId(event.data);
      }
    },
    false
  );
  const Room = rooms[roomId];
  if (Room !== null) {
    return <Room isSpying={false} />;
  } else {
    return <Lobby />;
  }
};
