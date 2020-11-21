import * as React from "react";
import styled from "styled-components";

export const Maze = () => {

  const [accelerationX, setAccelerationX] = React.useState("The princess is in another castle 0.0");
  const [motionX, setMotionX] = React.useState(0.0);

  const orientationChange = (event) => {
    var absolute = event.absolute;
    var alpha = event.alpha;
    var beta = event.beta;
    var gamma = event.gamma;

    setAccelerationX("The princess is in another castle " + beta);
  }

  window.addEventListener("deviceorientation", orientationChange);
  window.addEventListener('devicemotion', function (event) {
    setMotionX(event.accelerationIncludingGravity.x);
  });

  return (
    <>
      <p>{accelerationX}</p>
      <p>{motionX}</p>
    </>
  )
}
