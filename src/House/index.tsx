import * as React from "react";
import Lobby from "./Lobby";

const RoomStub = () => "";

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
  const Room: React.Component | null = roomId !== null ? RoomStub : null;
  if (Room !== null) {
    return <Room />;
  } else {
    return <Lobby />;
  }
};
