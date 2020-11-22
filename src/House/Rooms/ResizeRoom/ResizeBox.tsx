import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ActionButton } from "../../Lobby";
import { OxygenMeter } from "../../../OxygenMeter";
import { RoomApi } from "../../rooms";

import { useAudio } from "../../../hooks/useAudio";

// @ts-ignore
import success from "../../../assets/success.wav";
// @ts-ignore
import beep from "../../../assets/beep.flac";

import { TargetBox } from "./TargetBox";

const minimumSize = 20;
const treshold = 4;

const lastTouch = [0, 0];

type BoxPorps = {
  width: number;
  height: number;
  x: number;
  y: number;
  targets: number[][];
};

const ResizableBox = styled.div`
  width: ${(props) => (props.width ? props.width : 100)}px;
  height: ${(props) => (props.height ? props.height : 100)}px;
  position: absolute;
  top: ${(props) => (props.y ? props.y : 100)}px;
  left: ${(props) => (props.x ? props.x : 100)}px;
`;

const Corners = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid #009900;
  box-sizing: border-box;
`;

const Corner = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 5px solid #009900;
  border-top-color: transparent;
  position: absolute;
`;

const TextDisplay = styled.div`
  width: 100%;
  background-color: darkgreen;
  color: lightgreen;
  font-family: "Courier New", Courier, monospace;
  font-size: 24px;
  border-radius: 4px;
  line-height: 75px;
  height: 75px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function generateTarget() {
  const w = 40 + Math.round(Math.random() * 200);
  const h = 40 + Math.round(Math.random() * 200);
  const x = 100 + Math.round(Math.random() * 200);
  const y = 50 + Math.round(Math.random() * 200);

  return [w, h, x, y];
}
const generateTargets = () => [
  generateTarget(),
  generateTarget(),
  generateTarget(),
];

export const ResizeBox = ({
  width = 200,
  height = 100,
  x = 100,
  y = 100,
  onReady,
  onComplete,
  roomCompleted,
}: BoxPorps & RoomApi) => {
  const [scaneLevel, setScanLevel] = useState(0);
  const [targets] = useState(generateTargets);
  const [currentTarget, setTarget] = useState(0);
  const getTouchOffset = (e) => {
    const ret = [
      e.touches[0].pageX - lastTouch[0],
      e.touches[0].pageY - lastTouch[1],
    ];
    lastTouch[0] = e.touches[0].clientX;
    lastTouch[1] = e.touches[0].clientY;
    return ret;
  };

  const [, playScanSound] = useAudio(success);
  const [, playBeep] = useAudio(beep);

  useEffect(() => {
    onReady("Scanner");
  }, []);

  useEffect(() => {
    const box = document.querySelector(".resizableBox") as HTMLElement;
    const corners = document.querySelectorAll(".corner");
    for (let i = 0; i < corners.length; i += 1) {
      const corner = corners[i];

      const resize = (e) => {
        playBeep();
        const [dX, dY] =
          e.type === "touchmove"
            ? getTouchOffset(e)
            : [e.movementX, e.movementY];
        if (corner.classList.contains("bottom-right")) {
          const width = box.clientWidth + dX;
          const height = box.clientHeight + dY;
          if (width > minimumSize) {
            box.style.width = `${width}px`;
          }
          if (height > minimumSize) {
            box.style.height = `${height}px`;
          }
        } else if (corner.classList.contains("bottom-left")) {
          const height = box.clientHeight + dY;
          const width = box.clientWidth - dX;
          if (height > minimumSize) {
            box.style.height = `${height}px`;
          }
          if (width > minimumSize) {
            box.style.width = `${width}px`;
            box.style.left = `${box.offsetLeft + dX}px`;
          }
        } else if (corner.classList.contains("top-right")) {
          const width = box.clientWidth + dX;
          const height = box.clientHeight - dY;
          if (width > minimumSize) {
            box.style.width = `${width}px`;
          }
          if (height > minimumSize) {
            box.style.height = `${height}px`;
            box.style.top = `${box.offsetTop + dY}px`;
          }
        } else if (corner.classList.contains("top-left")) {
          const width = box.clientWidth - dX;
          const height = box.clientHeight - dY;
          if (width > minimumSize) {
            box.style.width = `${width}px`;
            box.style.left = `${box.offsetLeft + dX}px`;
          }
          if (height > minimumSize) {
            box.style.height = `${height}px`;
            box.style.top = `${box.offsetTop + dY}px`;
          }
        }
      };

      const mouseEvent = (e) => {
        e.preventDefault();
        window.addEventListener("mousemove", resize);
        window.addEventListener(
          "mouseup",
          () => {
            window.removeEventListener("mousemove", resize);
          },
          { once: true }
        );
      };

      const touchEvent = (e) => {
        // const [posX, posY] = [e.touches[0].clientX, e.touches[0].clientY];
        lastTouch[0] = e.touches[0].clientX;
        lastTouch[1] = e.touches[0].clientY;
        e.preventDefault();
        window.addEventListener("touchmove", resize);
        window.addEventListener(
          "touchend",
          () => {
            window.removeEventListener("touchmove", resize);
          },
          { once: true }
        );
        window.addEventListener(
          "touchcancel",
          () => {
            window.removeEventListener("touchmove", resize);
          },
          { once: true }
        );
      };

      corner.addEventListener("mousedown", mouseEvent);
      corner.addEventListener("touchstart", touchEvent);
    }

    // Will be fixed once https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/948 is availeable
    /* tslint:disable-next-line */
    // @ts-ignore
    const resizeObserver = new ResizeObserver((entries) => {
      if (targets.length > currentTarget) {
        entries.forEach((entry) => {
          const cr = entry.contentRect;
          const score =
            Math.abs(targets[currentTarget][0] - cr.width) +
            Math.abs(targets[currentTarget][1] - cr.height) +
            Math.abs(targets[currentTarget][2] - box.offsetLeft) +
            Math.abs(targets[currentTarget][3] - box.offsetTop);
          setScanLevel(Math.min(1.0, (treshold * 4) / score));
        });
      }
    });

    resizeObserver.observe(box);
  }, [currentTarget, targets]);
  React.useEffect(() => {
    if (targets.length <= currentTarget) {
      onComplete();
    }
  }, [targets, currentTarget]);
  return (
    <>
      <OxygenMeter roomId="resizer" />
      <TextDisplay>
        Accuracy: {Math.round(scaneLevel * 10000) / 100}%
        <ActionButton
          disabled={Math.round(scaneLevel * 10000) / 100 < 100}
          onClick={() => {
            if (Math.round(scaneLevel * 10000) / 100 >= 100) {
              setTarget(currentTarget + 1);
              playScanSound();
            }
          }}
          style={{ marginTop: 0, marginLeft: 25 }}
        >
          Scan
        </ActionButton>
      </TextDisplay>
      {targets.length > currentTarget
        ? "Scan the Highlighted sector!"
        : "Your Winner"}
      {targets.length > currentTarget ? (
        <TargetBox
          width={targets[currentTarget][0]}
          height={targets[currentTarget][1]}
          x={targets[currentTarget][2]}
          y={targets[currentTarget][3]}
        />
      ) : null}

      {!roomCompleted && (
        <ResizableBox
          width={width}
          height={height}
          x={x}
          y={y}
          className="resizableBox"
        >
          <Corners className="corners">
            <Corner className="corner top-left" />
            <Corner className="corner top-right" />
            <Corner className="corner bottom-left" />
            <Corner className="corner bottom-right" />
          </Corners>
        </ResizableBox>
      )}
    </>
  );
};
