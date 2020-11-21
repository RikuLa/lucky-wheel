import { useState, useEffect } from "react";

const bc = new BroadcastChannel("house-sync");

type BaseRoomState = { ready: boolean };

export interface SharedState {
  roomStates: {
    wordBox: BaseRoomState;
    resizer: BaseRoomState;
  };
}
type RoomStates = SharedState["roomStates"];

const defaultState: SharedState = {
  roomStates: {
    wordBox: { ready: false },
    resizer: { ready: false },
  },
};

type Message = {
  kind: "room-update";
  roomId: string;
  payload: RoomStates[keyof RoomStates];
};

export const useSyncedState = (): [
  SharedState,
  <T extends keyof RoomStates>(roomId: T, state: RoomStates[T]) => void
] => {
  const [internalState, setInternalState] = useState<SharedState>(defaultState);
  useEffect(() => {
    const listener = ({ data }: { data: Message }) => {
      if (data.kind === "room-update") {
        setInternalState((prev) => ({
          ...prev,
          roomStates: {
            ...prev.roomStates,
            [data.roomId]: data.payload,
          },
        }));
      }
      console.log("received", data);
    };
    bc.addEventListener("message", listener);
    return () => bc.removeEventListener("message", listener);
  }, [setInternalState]);

  const setRoomState = <T extends keyof RoomStates>(
    roomId: T,
    state: RoomStates[T]
  ) => {
    bc.postMessage({
      kind: "room-update",
      roomId,
      payload: state,
    } as Message);
    setInternalState((prev) => ({
      ...prev,
      roomStates: {
        ...prev.roomStates,
        [roomId]: state,
      },
    }));
  };

  return [internalState, setRoomState];
};
