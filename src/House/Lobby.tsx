import * as React from "react";
import { rooms } from "./rooms";
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

// eslint-disable-next-line react/display-name
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
              const windows = Object.keys(rooms).map((id) =>
                window.open(`#${id}`)
              );
              console.log("opened", windows);
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
