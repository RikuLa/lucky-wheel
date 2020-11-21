import * as React from "react";
import styled from "styled-components";
import { rooms } from "./rooms";
import { useSyncedState } from "./sync";
import { useLocalStorage } from "../hooks/localStorage";
import Spaceship from "./Spaceship";

// @ts-ignore
import ambient from "../assets/OutThere.ogg";

export const Container = styled.div`
  margin: 0;
  padding: 40px 20px;
  background-color: rgba(0, 0, 0, 0.8);
`;

export const TextBox = styled.div`
  width: 100%;
  font-size: 1.1em;
`;

export const ActionButton = styled.div`
  margin-top: 20px;
  padding: 8px;
  background: #541388;
  padding: 5px;
  background: ${(props) => (props.disabled ? "lightgray" : "#541388")};
  color: ${(props) => (props.disabled ? "darkgray" : "#ffd400")};
  display: inline-block;
  text-align: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const PopupPrompt = styled.div`
  background-color: ${({ done }: { done: boolean }) =>
    done ? "green" : "orange"};
  color: black;
  margin: 10px;
  padding: 10px;

  & ${ActionButton} {
    color: white;
  }
`;

const StrikedThrough = styled.span`
  text-decoration: line-through;
  color: gray;
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

type GameState = "waiting" | "loading" | "active" | "game-over" | "completed";

const Lobby = () => {
  const [tempo, setTempo] = React.useState(1);
  const [popupsWork, setPopupsWork] = useLocalStorage("popupsWork", false);
  const [state, setState] = React.useState<GameState>("waiting");
  const roomWindows = React.useRef<Window[]>();
  const audioCtx = React.useRef<AudioContext>();
  const source = React.useRef<AudioBufferSourceNode>();

  React.useEffect(() => {
    audioCtx.current = new AudioContext();

    fetch(ambient)
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioCtx.current.decodeAudioData(buffer))
      .then((sample) => {
        source.current = audioCtx.current.createBufferSource();
        source.current.loop = true;
        source.current.buffer = sample;
        source.current.start(0);
        source.current.connect(audioCtx.current.destination);
      });
  }, []);

  React.useEffect(() => {
    if (source.current) {
      source.current.playbackRate.value = tempo;
    }
  }, [tempo]);

  const [syncedState] = useSyncedState();

  React.useEffect(() => {
    if (
      state === "loading" &&
      Object.values(syncedState.roomStates).every((s) => s.ready)
    ) {
      setState("active");
    }
    if (
      Object.values(syncedState.roomStates).some(
        (s) => s.closed && !s.completed
      )
    ) {
      // User closed a room tab without completing it..
      setState("game-over");
    }

    if (
      Object.values(syncedState.roomStates).some(
        (s) => s.oxygenDepleted && !s.completed
      )
    ) {
      console.log("some room oxygen is depleted");
      setState("game-over");
    }

    if (state === "game-over" && roomWindows.current) {
      for (const window of roomWindows.current) {
        window.close();
      }
    }
  }, [state, syncedState]);

  return (
    <Container>
      {state === "waiting" && (
        <PopupPrompt done={popupsWork}>
          {popupsWork ? (
            "Popups confirmed to work!"
          ) : (
            <PopupPermissionsEnabler onPass={() => setPopupsWork(true)} />
          )}
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
              // ensure that engine opens last
              const roomIds = new Set(Object.keys(rooms));
              roomIds.delete("engine");
              const windows = [...Array.from(roomIds), "engine"].map((id) =>
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
          <TextBox>Loading tasks.. Please stand by</TextBox>
          <br />
          <div>
            Loaded tasks:
            {
              Object.values(syncedState.roomStates).filter((s) => s.ready)
                .length
            }
            / {Object.values(syncedState.roomStates).length}
          </div>
        </>
      ) : state === "game-over" ? (
        <>
          <TextBox>
            Game over!{" "}
            <ActionButton onClick={() => location.reload()}>
              Try again?
            </ActionButton>
          </TextBox>
        </>
      ) : state === "active" ? (
        <>
          <TextBox>Game active</TextBox>
          <br />
          <div>
            Tasks (
            {
              Object.values(syncedState.roomStates).filter((s) => s.completed)
                .length
            }
            / {Object.values(syncedState.roomStates).length} completed):
          </div>
          <div>
            <ul>
              {Object.entries(syncedState.roomStates).map(([id, state]) => {
                if (state.completed) {
                  return (
                    <li key={id}>
                      <StrikedThrough>{id}</StrikedThrough>
                    </li>
                  );
                } else {
                  return <li key={id}>{id}</li>;
                }
              })}
            </ul>
          </div>
          <Spaceship roomStates={syncedState.roomStates} />
          {Object.values(syncedState.roomStates).every(
            (state) => state.completed
          ) ? (
            <ActionButton
              onClick={() => {
                setState("completed");
              }}
            >
              Go to Sleep
            </ActionButton>
          ) : (
            <ActionButton disabled>
              Complete all tasks before going to sleep
            </ActionButton>
          )}
        </>
      ) : (
        <>
          <TextBox>Completed!</TextBox>
          <br />
          <div>You have done it! Sweet, sweet cryosleep calls</div>
        </>
      )}
      <input
        type={"range"}
        min={"0.25"}
        max={"3"}
        step={"0.25"}
        value={tempo}
        onChange={(e) => setTempo(Number(e.target.value))}
      />
    </Container>
  );
};

export default Lobby;
