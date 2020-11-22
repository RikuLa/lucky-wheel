import * as React from "react";
import { SharedState } from "./sync";
import styled from "styled-components";

const Canvas = styled.canvas`
  width: 100%;
`;

// @ts-ignore
import spaceship from "../assets/spaceship.png";

type Props = {
  roomStates: SharedState["roomStates"];
};

const img = new Image();
img.src = spaceship;

const updateCanvas = (canvas: HTMLCanvasElement, props: Props) => {
  const ctx = canvas.getContext("2d");
  ctx.textAlign = "center";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = props.roomStates.resizer.completed ? "green" : "gray";
  ctx.fillRect(0.35 * canvas.width - 5, 0.15 * canvas.height, 10, 10);
  ctx.fillText("Scanner", 0.35 * canvas.width, 0.15 * canvas.height);

  ctx.fillStyle = props.roomStates.wordBox.completed ? "green" : "gray";
  ctx.fillRect(0.4 * canvas.width - 5, 0.8 * canvas.height, 10, 10);
  ctx.fillText("Word Box", 0.4 * canvas.width, 0.8 * canvas.height);

  ctx.fillStyle = props.roomStates.engine.completed ? "green" : "gray";
  ctx.fillRect(0.65 * canvas.width - 5, 0.2 * canvas.height, 10, 10);
  ctx.fillText("Engine", 0.65 * canvas.width, 0.2 * canvas.height);
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
