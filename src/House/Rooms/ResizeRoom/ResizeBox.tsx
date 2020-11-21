import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RoomApi } from "../../rooms";

import { TargetBox } from "./TargetBox";

const minimumSize = 20;
const treshold = 3;

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

export const ResizeBox = ({
  width = 200,
  height = 100,
  x = 100,
  y = 100,
  targets = [
    [30, 70, 200, 200],
    [70, 200, 40, 200],
  ],
  onReady,
}: BoxPorps & RoomApi) => {
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

  useEffect(() => {
    onReady("Scanner");

    const box = document.querySelector(".resizableBox") as HTMLElement;
    const corners = document.querySelectorAll(".corner");
    for (let i = 0; i < corners.length; i += 1) {
      const corner = corners[i];

      const resize = (e) => {
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
          console.log(cr, box);
          console.log(
            currentTarget,
            Math.abs(targets[currentTarget][0] - cr.width),
            Math.abs(targets[currentTarget][1] - cr.height),
            Math.abs(targets[currentTarget][2] - box.offsetTop),
            Math.abs(targets[currentTarget][3] - box.offsetLeft)
          );
          if (
            Math.abs(targets[currentTarget][0] - cr.width) < treshold &&
            Math.abs(targets[currentTarget][1] - cr.height) < treshold &&
            Math.abs(targets[currentTarget][2] - box.offsetTop) < treshold &&
            Math.abs(targets[currentTarget][3] - box.offsetLeft) < treshold
          ) {
            setTarget(currentTarget + 1);
          }
        });
      }
    });

    resizeObserver.observe(box);
  }, [currentTarget]);

  return (
    <>
      {targets.length > currentTarget
        ? "Scan the Highlighted sector!"
        : "Your Winner"}

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
      {targets.length > currentTarget ? (
        <TargetBox
          width={targets[currentTarget][0]}
          height={targets[currentTarget][1]}
          y={targets[currentTarget][2]}
          x={targets[currentTarget][3]}
        />
      ) : null}
    </>
  );
};
