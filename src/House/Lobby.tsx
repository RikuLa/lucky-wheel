import * as React from "react";
import { useSyncedState } from "./sync";

const attemptPopups = () => {
  const [a, b] = [window.open("about:blank"), window.open("about:blank")];
  a?.close();
  b?.close();
  return a && b;
};

const PopupPermissionsEnabler = ({ onPass }: { onPass: () => void }) => {
  const [failed, setFailed] = React.useState(false);
  return (
    <>
      {failed
        ? "We detected pop-up blocker :("
        : "We rely on popup permissions. Press test button and disable popup blocker for this page if needed."}
      <button
        onClick={() => {
          if (attemptPopups()) {
            onPass();
          } else {
            setFailed(true);
          }
        }}
      >
        Test
      </button>
    </>
  );
};

export default () => {
  const [popupsWork, setPopupsWork] = React.useState(false);
  const [state, setState] = useSyncedState();
  return (
    <>
      {popupsWork && (
        <>
          Ready to play!
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
      )}
      {!popupsWork && (
        <>
          <PopupPermissionsEnabler onPass={() => setPopupsWork(true)} />
        </>
      )}
    </>
  );
};
