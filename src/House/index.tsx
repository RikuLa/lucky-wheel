import * as React from "react";
import { RoomApi, RoomKeys, rooms } from "./rooms";
import Lobby from "./Lobby";
import { useSyncedState } from "./sync";

const roomIdFromHash = (): RoomKeys | null => {
  const id = location.hash.substring(1);
  return id in rooms ? (id as RoomKeys) : null;
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
  const [roomId] = React.useState<RoomKeys | null>(roomIdFromHash);
  const Room = rooms[roomId];
  if (Room) {
    return <RoomManager roomId={roomId as RoomKeys} Room={Room} />;
  } else {
    return <Lobby />;
  }
};
