import { useState, useEffect } from "react";

const bc = new BroadcastChannel("house-sync");

type BaseRoomState = {
  ready: boolean;
  closed: boolean;
  completed: boolean;
  oxygenDepleted: boolean;
};

export interface SharedState {
  roomStates: {
    wordBox: BaseRoomState;
    resizer: BaseRoomState;
    fax: BaseRoomState;
    printer: BaseRoomState;
    engine: BaseRoomState;
  };
}
type RoomStates = SharedState["roomStates"];

const defaultState: SharedState = {
  roomStates: {
    fax: {
      ready: false,
      closed: false,
      completed: false,
      oxygenDepleted: false,
    },
    printer: {
      ready: false,
      closed: false,
      completed: false,
      oxygenDepleted: false,
    },
    wordBox: {
      ready: false,
      closed: false,
      completed: false,
      oxygenDepleted: false,
    },
    resizer: {
      ready: false,
      closed: false,
      completed: false,
      oxygenDepleted: false,
    },
    engine: {
      ready: false,
      closed: false,
      completed: false,
      oxygenDepleted: false,
    },
  },
};

type Message = {
  kind: "room-update";
  roomId: string;
  payload: RoomStates[keyof RoomStates];
};

export type RoomId = keyof RoomStates;

export const useSyncedState = (): [
  SharedState,
  <T extends RoomId>(roomId: T, state: Partial<RoomStates[T]>) => void
] => {
  const [internalState, setInternalState] = useState<SharedState>(defaultState);
  useEffect(() => {
    const listener = ({ data }: { data: Message }) => {
      if (data.kind === "room-update") {
        setInternalState((prev) => ({
          ...prev,
          roomStates: {
            ...prev.roomStates,
            [data.roomId]: { ...prev.roomStates[data.roomId], ...data.payload },
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
    state: Partial<RoomStates[T]>
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
        [roomId]: { ...prev.roomStates[roomId], ...state },
      },
    }));
  };

  return [internalState, setRoomState];
};
