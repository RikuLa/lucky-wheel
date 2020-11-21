import React, { useEffect } from "react";
import styled from "styled-components";
import { RoomApi } from "./House/rooms";

const minimumSize = 20;
const lastTouch = [0, 0];

type BoxPorps = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export const ResizeBox = ({
  width,
  height,
  x,
  y,
  onReady,
}: BoxPorps & RoomApi) => {
  onReady();

  const originalWidth = width;
  const originalHeight = height;
  const originalX = x;
  const originalY = y;

  const ResizableBox = styled.div`
    background: white;
    width: ${originalWidth}px;
    height: ${originalHeight}px;
    position: absolute;
    top: ${originalY}px;
    left: ${originalX}px;
  `;

  const Corners = styled.div`
    width: 100%;
    height: 100%;
    border: 3px solid #4286f4;
    box-sizing: border-box;
  `;

  const Corner = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: white;
    border: 3px solid #4286f4;
    position: absolute;
  `;

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
      console.log("Size changed");
      entries.forEach((entry) => {
        const cr = entry.contentRect;
        console.log("box:", entry.target);
        console.log(`box size: ${cr.width}px x ${cr.height}px`);
        console.log(`box padding: ${cr.top}px ; ${cr.left}px`);
        if (cr.width > cr.height) {
          console.log("Ländskeip");
        } else if (cr.width < cr.height) {
          console.log("porttrait");
        } else {
          console.log("boxxx");
        }
      });
    });

    resizeObserver.observe(box);
  }, []);

  return (
    <ResizableBox className="resizableBox">
      <Corners className="corners">
        <Corner className="corner top-left" />
        <Corner className="corner top-right" />
        <Corner className="corner bottom-left" />
        <Corner className="corner bottom-right" />
      </Corners>
    </ResizableBox>
  );
};
