import * as React from "react";
import { rooms } from "./rooms";
import Lobby from "./Lobby";

const roomIdFromHash = () => {
  return location.hash.substring(1);
};

export const House = () => {
  const [roomId, setRoomId] = React.useState(roomIdFromHash);
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
  if (Room) {
    return <Room isSpying={false} />;
  } else {
    return <Lobby />;
  }
};
