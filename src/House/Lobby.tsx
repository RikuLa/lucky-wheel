import * as React from "react";
import styled from "styled-components";
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

const Panel = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  padding: 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 600px;
  height: 300px;
  margin-left: -300px;
  margin-top: -150px;
`;

const Lobby = () => {
  const [popupsWork, setPopupsWork] = React.useState(false);
  const [state] = useSyncedState();
  return (
    <Panel>
      {popupsWork && (
        <>
          Ready to play!
          <span>
            ready:{" "}
            {Object.values(state.roomStates).filter((s) => s.ready).length} /
            {Object.values(state.roomStates).length}
          </span>
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
        </>
      )}
      {!popupsWork && (
        <>
          <PopupPermissionsEnabler onPass={() => setPopupsWork(true)} />
        </>
      )}
    </Panel>
  );
};

export default Lobby;
