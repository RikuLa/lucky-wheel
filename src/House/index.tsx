import * as React from "react";
import { RoomApi, RoomKeys, rooms } from "./rooms";
import Lobby from "./Lobby";
import { useSyncedState } from "./sync";

const roomIdFromHash = () => {
  return location.hash.substring(1);
};

const RoomManager = ({
  roomId,
  Room,
}: {
  roomId: RoomKeys;
  Room: React.ComponentType<RoomApi>;
}) => {
  const [, setRoomState] = useSyncedState();
  React.useEffect(() => {
    const listener = () => {
      setRoomState(roomId, { closed: true });
    };
    window.addEventListener("beforeunload", listener);
    return () => window.removeEventListener("beforeunload", listener);
  }, []);
  return (
    <Room
      onReady={() => {
        setRoomState(roomId, { ready: true });
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
    return <RoomManager roomId={roomId as RoomKeys} Room={Room} />;
  } else {
    return <Lobby />;
  }
};
