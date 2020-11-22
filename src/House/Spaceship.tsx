import * as React from "react";
import { SharedState } from "./sync";
import styled from "styled-components";

const Canvas = styled.canvas`
  width: 100%;
`;

// @ts-ignore
import spaceship_on from "../assets/rocket_On.png";
// @ts-ignore
import spaceship_off from "../assets/rocket_Off.png";

type Props = {
  roomStates: SharedState["roomStates"];
};

const imgOn = new Image();
imgOn.src = spaceship_on;

const imgOff = new Image();
imgOff.src = spaceship_off;

const updateCanvas = (canvas: HTMLCanvasElement, props: Props) => {
  const ctx = canvas.getContext("2d");
  ctx.textAlign = "center";
  ctx.drawImage(
    props.roomStates.engine.completed ? imgOn : imgOff,
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle = props.roomStates.resizer.completed ? "green" : "gray";
  ctx.fillRect(0.5 * canvas.width - 5, 0.7 * canvas.height, 10, 10);
  ctx.fillText("Fax", 0.5 * canvas.width, 0.7 * canvas.height);

  ctx.fillStyle = props.roomStates.resizer.completed ? "green" : "gray";
  ctx.fillRect(0.25 * canvas.width - 5, 0.35 * canvas.height, 10, 10);
  ctx.fillText("Scanner", 0.25 * canvas.width, 0.35 * canvas.height);

  ctx.fillStyle = props.roomStates.wordBox.completed ? "green" : "gray";
  ctx.fillRect(0.3 * canvas.width - 5, 0.8 * canvas.height, 10, 10);
  ctx.fillText("Word Box", 0.3 * canvas.width, 0.8 * canvas.height);

  ctx.fillStyle = props.roomStates.engine.completed ? "green" : "gray";
  ctx.fillRect(0.5 * canvas.width - 5, 0.2 * canvas.height, 10, 10);
  ctx.fillText("Engine", 0.5 * canvas.width, 0.2 * canvas.height);
};

export default function Spaceship(props: Props) {
  const canvas = React.useRef<HTMLCanvasElement>();
  React.useEffect(() => {
    const current = canvas.current;
    if (current) {
      updateCanvas(current, props);
    }
  }, [canvas.current, props]);
  return <Canvas ref={canvas} />;
}
