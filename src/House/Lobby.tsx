import * as React from "react";
import styled from "styled-components";
import { rooms } from "./rooms";
import { useSyncedState } from "./sync";

const Container = styled.div`
  margin: 0;
  padding: 40px 20px;
  background-color: rgba(0, 0, 0, 0.8);
`;

const TextBox = styled.div`
  width: 100%;
  font-size: 1.1em;
`;

const ActionButton = styled.div`
  margin-top: 20px;
  padding: 5px;
  background: #541388;
  display: inline-block;
  text-align: center;
`;

const PopupPrompt = styled.div`
  background-color: orange;
  color: black;
  margin: 10px;
  padding: 10px;
`;

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
      <TextBox>
        {failed
          ? "We detected pop-up blocker :("
          : "We rely on popup permissions. Press test button and disable popup blocker for this page if needed."}
      </TextBox>
      <ActionButton
        onClick={() => {
          if (attemptPopups()) {
            onPass();
          } else {
            setFailed(true);
          }
        }}
      >
        Test
      </ActionButton>
    </>
  );
};

const Lobby = () => {
  const [popupsWork, setPopupsWork] = React.useState(false);
  const [state, setState] = React.useState<"waiting" | "loading" | "active">(
    "waiting"
  );
  const roomWindows = React.useRef<Window[]>();
  const [syncedState] = useSyncedState();

  React.useEffect(() => {
    if (
      state === "loading" &&
      Object.values(syncedState.roomStates).every((s) => s.ready)
    ) {
      setState("active");
    }
  }, [state, syncedState]);

  return (
    <Container>
      {!popupsWork && (
        <PopupPrompt>
          <PopupPermissionsEnabler onPass={() => setPopupsWork(true)} />
        </PopupPrompt>
      )}
      {state === "waiting" ? (
        <>
          <TextBox>
            Are you ready to begin your adventure? You wake up from cryo sleep
            to the blare of klaxons. Just another day at the office, you say to
            yourself. Not that there is anyone else aboard SCP RustBucket.
            <br />
            <br />
            You need to send a message home and isolate the virus. Also, the
            oxygen seems to be running particularly low today...
          </TextBox>
          <ActionButton
            onClick={() => {
              const windows = Object.keys(rooms).map((id) =>
                window.open(`#${id}`)
              );
              console.log("opened", windows);
              roomWindows.current = windows;

              setState("loading");
            }}
          >
            Begin your mission.
          </ActionButton>
        </>
      ) : state === "loading" ? (
        <>
          <TextBox>Loading rooms.. Please stand by</TextBox>
          <br />
          <div>
            Loaded rooms :{" "}
            {
              Object.values(syncedState.roomStates).filter((s) => s.ready)
                .length
            }{" "}
            / {Object.values(syncedState.roomStates).length}
          </div>
        </>
      ) : (
        <TextBox>Game active</TextBox>
      )}
    </Container>
  );
};

export default Lobby;
