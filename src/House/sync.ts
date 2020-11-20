import { useState, useEffect } from "react";

const bc = new BroadcastChannel("house-sync");

export interface SharedState {
  count: number;
}

const defaultState: SharedState = {
  count: 0,
};

export const useSyncedState = (): [
  SharedState,
  (newState: SharedState) => void
] => {
  const [internalState, setInternalState] = useState<SharedState>(defaultState);
  useEffect(() => {
    const listener = ({ data }) => {
      setInternalState(data);
      console.log("received", data);
    };
    bc.addEventListener("message", listener);
    return () => bc.removeEventListener("message", listener);
  }, [setInternalState]);

  const broadcast = (data: SharedState) => {
    bc.postMessage(data);
    setInternalState(data);
  };

  return [internalState, broadcast];
};
