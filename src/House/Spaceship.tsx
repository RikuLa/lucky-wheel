import * as React from "react";
import { SharedState } from "./sync";

// @ts-ignore
import spaceship from "../assets/spaceship.png";

type Props = {
  roomStates: SharedState["roomStates"];
};

const img = new Image();
img.src = spaceship;

const updateCanvas = (canvas: HTMLCanvasElement, props: Props) => {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = props.roomStates.engine.completed ? "green" : "gray";
  ctx.fillRect(0.8 * canvas.width, 0.2 * canvas.height, 10, 10);
};

export default function Spaceship(props: Props) {
  const canvas = React.useRef<HTMLCanvasElement>();
  React.useEffect(() => {
    const current = canvas.current;
    if (current) {
      updateCanvas(current, props);
    }
  }, [canvas.current, props]);
  return <canvas ref={canvas} />;
}
