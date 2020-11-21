import React from "react";
import { useIsVisible } from "../../hooks/visibility";
import { RoomApi } from "../rooms";

// @ts-ignore
import bomb from "../../assets/bomb.wav";

export const Engine = (props: RoomApi) => {
  const [level, setLevel] = React.useState(10);
  const audioCtx = React.useRef<AudioContext>();
  const source = React.useRef<AudioBufferSourceNode>();
  React.useEffect(() => {
    props.onReady("Engine");
    audioCtx.current = new AudioContext();

    fetch(bomb)
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
      source.current.playbackRate.value = level / 10;
    }
  }, [level]);

  const [isVisible] = useIsVisible();

  return (
    <div>
      is this visible? {isVisible ? "yess" : "no"}
      <br />
      <br />
      <button
        onClick={() => {
          audioCtx.current.resume();
          props.onComplete();
        }}
      >
        joo joo
      </button>
      <br />
      <br />
      <input
        type="range"
        value={level}
        onChange={(e) => {
          setLevel(e.target.valueAsNumber);
        }}
        min="1"
        max="30"
      />
    </div>
  );
};
