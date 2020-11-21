import React from "react";
import { useIsVisible } from "../hooks/visibility";
// @ts-ignore
import bomb from "./bomb.wav";

export const BombTest = () => {
  const [isVisible] = useIsVisible();
  const audio = React.useRef(null);

  React.useEffect(() => {
    if (audio != null && !isVisible) {
      audio.current.play();
    }
  }, [isVisible]);

  return (
    <div>
      is this visible? {isVisible ? "yess" : "no"}
      <audio ref={audio} controls>
        <source src={bomb} type="audio/wav"></source>
      </audio>
    </div>
  );
};
