import * as React from "react";
import { useSyncedState } from "./sync";

export default () => {
  const [state, setState] = useSyncedState();
  return (
    <>
      <span>count is {state.count}</span>
      <button
        onClick={() => {
          for (let i = 0; i < 3; ++i) {
            setTimeout(() => window.open("/"), 100 * i);
          }
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          setState({ count: state.count + 1 });
        }}
      >
        more count
      </button>
    </>
  );
};
