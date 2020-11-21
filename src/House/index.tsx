import * as React from "react";
import { RoomApi, rooms } from "./rooms";
import Lobby from "./Lobby";
import { useSyncedState } from "./sync";

const roomIdFromHash = () => {
  return location.hash.substring(1);
};

const RoomManager = ({
  roomId,
  Room,
}: {
  roomId: string;
  Room: React.ComponentType<RoomApi>;
}) => {
  const [, setRoomState] = useSyncedState();
  return (
    <Room
      onReady={() => {
        setRoomState(roomId as any, { ready: true });
      }}
    />
  );
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
    return <RoomManager roomId={roomId} Room={Room} />;
  } else {
    return <Lobby />;
  }
};
