import React, { useEffect } from "react";
import styled from "styled-components";

const ResizableBox = styled.div`
  background: white;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 100px;
  left: 100px;
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

const minimumSize = 20;
let originalWidth = 0;
let originalHeight = 0;
let originalX = 0;
let originalY = 0;
let originalMouseX = 0;
let originalMouseY = 0;

export default function ResizeBox() {
  useEffect(() => {
    const box = document.querySelector(".resizableBox") as HTMLElement;
    const corners = document.querySelectorAll(".corner");
    for (let i = 0; i < corners.length; i += 1) {
      const corner = corners[i];
      const resize = (e) => {
        const [posX, posY] =
          e.type === "touchmove"
            ? [e.touches[0].clientX, e.touches[0].clientY]
            : [e.pageX, e.pageY];
        if (corner.classList.contains("bottom-right")) {
          const width = originalWidth + (posX - originalMouseX);
          const height = originalHeight + (posY - originalMouseY);
          if (width > minimumSize) {
            box.style.width = `${width}px`;
          }
          if (height > minimumSize) {
            box.style.height = `${height}px`;
          }
        } else if (corner.classList.contains("bottom-left")) {
          const height = originalHeight + (posY - originalMouseY);
          const width = originalWidth - (posX - originalMouseX);
          if (height > minimumSize) {
            box.style.height = `${height}px`;
          }
          if (width > minimumSize) {
            box.style.width = `${width}px`;
            box.style.left = `${originalX + (posX - originalMouseX)}px`;
          }
        } else if (corner.classList.contains("top-right")) {
          const width = originalWidth + (posX - originalMouseX);
          const height = originalHeight - (posY - originalMouseY);
          if (width > minimumSize) {
            box.style.width = `${width}px`;
          }
          if (height > minimumSize) {
            box.style.height = `${height}px`;
            box.style.top = `${originalY + (posY - originalMouseY)}px`;
          }
        } else if (corner.classList.contains("top-left")) {
          const width = originalWidth - (posX - originalMouseX);
          const height = originalHeight - (posY - originalMouseY);
          if (width > minimumSize) {
            box.style.width = `${width}px`;
            box.style.left = `${originalX + (posX - originalMouseX)}px`;
          }
          if (height > minimumSize) {
            box.style.height = `${height}px`;
            box.style.top = `${originalY + (posY - originalMouseY)}px`;
          }
        }
      };
      const stopResize = () => {
        console.log("soppi");
        window.removeEventListener("mousemove", resize);
      };
      const mouseEvent = (e) => {
        const [posX, posY] =
          e.type === "touchstart"
            ? [e.touches[0].clientX, e.touches[0].clientY]
            : [e.pageX, e.pageY];

        e.preventDefault();
        originalWidth = parseFloat(
          getComputedStyle(box, null)
            .getPropertyValue("width")
            .replace("px", "")
        );
        originalHeight = parseFloat(
          getComputedStyle(box, null)
            .getPropertyValue("height")
            .replace("px", "")
        );
        originalX = box.getBoundingClientRect().left;
        originalY = box.getBoundingClientRect().top;
        originalMouseX = posX;
        originalMouseY = posY;
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
        window.addEventListener("touchmove", resize);
        window.addEventListener("touchend", stopResize);
      };
      corner.addEventListener("mousedown", mouseEvent);
      corner.addEventListener("touchstart", mouseEvent);
    }

    // Will be fixed once https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/948 is availeable
    /* tslint:disable-next-line */
    // @ts-ignore
    const resizeObserver = new ResizeObserver((entries) => {
      console.log("Size changed");
      entries.forEach((entry) => {
        const cr = entry.contentRect;
        /*
        console.log("box:", entry.target);
        console.log(`box size: ${cr.width}px x ${cr.height}px`);
        console.log(`box padding: ${cr.top}px ; ${cr.left}px`);
        */
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
}
