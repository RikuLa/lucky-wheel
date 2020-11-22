import * as React from "react";
import styled from "styled-components";
import { rooms } from "./rooms";
import { useSyncedState } from "./sync";
import { useLocalStorage } from "../hooks/localStorage";
import Spaceship from "./Spaceship";

// @ts-ignore
import ambient from "../assets/OutThere.ogg";
// @ts-ignore
import startImage from "../assets/start_cryo.png";
// @ts-ignore
import deathImage from "../assets/lose_suffocate.png";
// @ts-ignore
import winImage from "../assets/win_cryo.png";

export const Container = styled.div`
  margin: 0;
  padding: 20px 20px;
  background-color: rgba(0, 0, 0, 0.8);
  height: 100vh;
  overflow-y: scroll;
`;

export const TextBox = styled.div`
  width: 100%;
  padding: 5px;
  margin: 10px 0;
`;

export const Header = styled.h1`
  width: 100%;
  text-align: center;
  margin: 0 0 10px 0;
  font-size: 2em;
  font-weight: bold;
`;

export const ActionButton = styled.div`
  margin-top: 20px;
  padding: 8px;
  background: #541388;
  padding: 10px 5px;
  width: 100%;
  background: ${(props) => (props.disabled ? "lightgray" : "#541388")};
  color: ${(props) => (props.disabled ? "darkgray" : "#ffd400")};
  display: inline-block;
  text-align: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border-radius: 4px;
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

const LimitedImage = styled.img`
  width: 100%;
`;

const GameEndText = styled.div`
  height: 250px;
`;

const ActiveContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr;

  @media screen and (min-width: 500px) {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
  }
`;

const TaskContainer = styled.div``;

const ShipContainer = styled.div``;

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
      {state === "waiting" ? (
        <>
          {!popupsWork && (
            <PopupPrompt done={popupsWork}>
              <PopupPermissionsEnabler onPass={() => setPopupsWork(true)} />
            </PopupPrompt>
          )}
          <div>
            <Header>Good Morning, Commander!</Header>
            <LimitedImage
              src={startImage}
              alt="A frustrated engineer climbs out of a cryo-pod"
            />
            <TextBox>
              You wake up from cryo sleep to the blare of klaxons. SCP
              RustBucket is passing by yet another sun. It&apos;s time to see if
              this location would host your next home.
              <br />
              <br />
              The planets need to be scanned, comms need to be checked for
              messages and the course needs to be adjusted. The different parts
              of the spaceship will be located in different tabs in your
              browser. However, the oxygen supplies are not designed for you to
              stay awake. You better hurry...
            </TextBox>
          </div>
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
            Death comes to those who do not have oxygen. Game over!
            <ActionButton onClick={() => location.reload()}>
              Try again?
            </ActionButton>
          </TextBox>

          <GameEndText>
            <LimitedImage src={deathImage} alt="The player has suffocated" />
          </GameEndText>
        </>
      ) : state === "active" ? (
        <>
          <Header>Mission In Progress</Header>
          <ActiveContainer>
            <TaskContainer>
              Tasks (
              {
                Object.values(syncedState.roomStates).filter((s) => s.completed)
                  .length
              }
              / {Object.values(syncedState.roomStates).length} completed):
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
            </TaskContainer>
            <ShipContainer>
              <Spaceship roomStates={syncedState.roomStates} />
            </ShipContainer>
          </ActiveContainer>
          {Object.values(syncedState.roomStates).every(
            (state) => state.completed
          ) ? (
            <ActionButton
              onClick={() => {
                setState("completed");
              }}
            >
              Settle down on the galaxy?
            </ActionButton>
          ) : (
            <ActionButton disabled>
              Complete all tasks the tasks before the oxygen runs out
            </ActionButton>
          )}
        </>
      ) : (
        <>
          <TextBox>Completed!</TextBox>
          <br />
          <GameEndText>
            <LimitedImage src={winImage} />
            <span>
              Unfortunately this does not seem like the place for you. Thus the
              cryo sleep calls for you again.
            </span>
          </GameEndText>
        </>
      )}
    </Container>
  );
};

export default Lobby;
