import React from "react";
import styled from "styled-components";
import { RoomApi } from "../rooms";

// @ts-ignore
import bomb from "../../assets/bomb.wav";
// @ts-ignore
import boset from "../../assets/boset.png";
// @ts-ignore
import bosestand from "../../assets/bosestand.webp";

import { OxygenMeter } from "../../OxygenMeter";
import { ExitHatch } from "../ExitHatch";

const CenteredParagraph = styled.p`
  text-align: center;
  padding: 3px;
`;

const ThrottleSlider = styled.input`
  writing-mode: bt-lr; /* IE */
  background-color: transparent;
  -webkit-appearance: none;
  -webkit-transform: rotate(-90deg);
  touch-action: none;
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    background: #928483;
    border: 0.7px solid #562425;
    border-radius: 6.2px;
    width: 100%;
    height: 25px;
    cursor: pointer;
  }
  &::-webkit-slider-thumb {
    margin-top: -25px;
    width: 19px;
    height: 75px;
    background: black;
    border: 2.2px solid gray;
    border-radius: 4px;
    cursor: pointer;
    -webkit-appearance: none;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #9e9191;
  }
`;

const HeadphoneHolder = styled.div`
  cursor: pointer;
  background-image: url(${bosestand});
  background-size: contain;
  background-repeat: no-repeat;
`;

const Headphones = styled.div`
  cursor: pointer;
  width: 200px;
  height: 200px;
  background-image: url(${boset});
  background-size: contain;
  margin-left: 55px;
  margin-top: -8px;
`;

const ControlPanel = styled.div`
  display: grid;
  width: 500px;
  max-width: 95vw;
  height: 450px;
  grid-template-columns: 140px 1fr;
  grid-template-rows: 100px 1fr;
  grid-template-areas: "text text" "throttle headphones";
  background-color: #333333;
  border: 1px solid black;
  border-radius: 4px;
  margin: auto;
  padding: 10px;

  & ${ThrottleSlider} {
    grid-area: throttle;
  }
  & ${Headphones} {
    grid-area: headphones;
  }
  & span {
    grid-area: text;
  }
`;

export const Engine = (props: RoomApi) => {
  const [throttle, setThrottle] = React.useState(0);
  const [headphones, setHeadphones] = React.useState(false);
  const audioCtx = React.useRef<AudioContext>();
  const nodes = React.useRef<[GainNode, BiquadFilterNode]>();
  React.useEffect(() => {
    props.onReady();
    audioCtx.current = new AudioContext();
    audioCtx.current.suspend();

    fetch(bomb)
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioCtx.current.decodeAudioData(buffer))
      .then((sample) => {
        const buf = audioCtx.current.createBufferSource();
        buf.loop = true;
        buf.buffer = sample;
        buf.start(0);

        const bqf = audioCtx.current.createBiquadFilter();

        const gain = audioCtx.current.createGain();
        gain.gain.value = 0.4;

        buf.connect(bqf);
        bqf.connect(gain);
        gain.connect(audioCtx.current.destination);

        nodes.current = [gain, bqf];
      });
  }, []);
  React.useEffect(() => {
    if (nodes.current && headphones) {
      const [gain, bqf] = nodes.current;
      gain.gain.value = 0.05;

      bqf.type = "lowpass";
      bqf.frequency.value = 400;

      console.log("fugg :DD");
    }
  }, [headphones]);

  return (
    <div>
      <OxygenMeter roomId="engine" />
      <ExitHatch completed={props.roomCompleted} />
      <CenteredParagraph>
        You are wide awake, but something is missing. Where&apos;s the familiar
        sound of engine rumbling?
      </CenteredParagraph>
      <ControlPanel>
        <ThrottleSlider
          type="range"
          orient="vertical"
          value={throttle}
          min={0}
          max={100}
          onChange={(e) => {
            if (props.roomCompleted) {
              return;
            }
            if (e.target.valueAsNumber > 90) {
              setThrottle(100);
              props.onComplete();
              audioCtx.current.resume();
            } else {
              setThrottle(e.target.value);
            }
          }}
        />
        <span>
          {headphones
            ? "Move to the next task by switching to another tab!"
            : props.roomCompleted
            ? "Great! Here's your complimentary headphones to keep it quiet:"
            : "Turn the engine on by turning on throttle"}
        </span>
        {props.roomCompleted && (
          <HeadphoneHolder>
            {!headphones && <Headphones onClick={() => setHeadphones(true)} />}
          </HeadphoneHolder>
        )}
      </ControlPanel>
    </div>
  );
};
