import React, { useState } from 'react';

export default function resizeBox() {
  return (
    <div>
      Spurdo spärde
    </div>
  );
}

/*
export default function (box, corners) {
  const minimumSize = 20;
  let originalWidth = 0;
  let originalHeight = 0;
  let originalX = 0;
  let originalY = 0;
  let originalMouseX = 0;
  let originalMouseY = 0;

    function resize(e) {
        console.log(e.target.classList)
        const corner = e.target;
    if (corner.classList.contains('bottom-right')) {
      const width = originalWidth + (e.pageX - originalMouseX);
      const height = originalHeight + (e.pageY - originalMouseY);
      if (width > minimumSize) {
        box.style.width = `${width}px`;
      }
      if (height > minimumSize) {
        box.style.height = `${height}px`;
      }
    } else if (corner.classList.contains('bottom-left')) {
      const height = originalHeight + (e.pageY - originalMouseY);
      const width = originalWidth - (e.pageX - originalMouseX);
      if (height > minimumSize) {
        box.style.height = `${height}px`;
      }
      if (width > minimumSize) {
        box.style.width = `${width}px`;
        box.style.left = `${originalX + (e.pageX - originalMouseX)}px`;
      }
    } else if (corner.classList.contains('top-right')) {
      const width = originalWidth + (e.pageX - originalMouseX);
      const height = originalHeight - (e.pageY - originalMouseY);
      if (width > minimumSize) {
        box.style.width = `${width}px`;
      }
      if (height > minimumSize) {
        box.style.height = `${height}px`;
        box.style.top = `${originalY + (e.pageY - originalMouseY)}px`;
      }
    } else if (corner.classList.contains('top-left'){
      const width = originalWidth - (e.pageX - originalMouseX);
      const height = originalHeight - (e.pageY - originalMouseY);
      if (width > minimumSize) {
        box.style.width = `${width}px`;
        box.style.left = `${originalX + (e.pageX - originalMouseX)}px`;
      }
      if (height > minimumSize) {
        box.style.height = `${height}px`;
        box.style.top = `${originalY + (e.pageY - originalMouseY)}px`;
      }
    }
  }

  function stopResize() {
    window.removeEventListener('mousemove', resize);
  }

  const mouseEvent = (e) => {
    e.preventDefault();
    originalWidth = parseFloat(getComputedStyle(box, null).getPropertyValue('width').replace('px', ''));
    originalHeight = parseFloat(getComputedStyle(box, null).getPropertyValue('height').replace('px', ''));
    originalX = box.getBoundingClientRect().left;
    originalY = box.getBoundingClientRect().top;
    originalMouseX = e.pageX;
    originalMouseY = e.pageY;
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
  };

  for (let i = 0; i < corners.length; i += 1) {
    const corner = corners[i];
    corner.addEventListener('mousedown', mouseEvent);
  }
}

// Wait for dom to load
window.addEventListener('DOMContentLoaded', () => {
    const resizableBox = document.createElement('div');
    resizableBox.className = 'resizableBox';
    const corners = document.createElement('div');
    corners.className = 'corners';
    const tl = document.createElement('div');
    const tr = document.createElement('div');
    const bl = document.createElement('div');
    const br = document.createElement('div');
    tl.className = 'corner top-left';
    tr.className = 'corner top-right';
    bl.className = 'corner bottom-left';
    br.className = 'corner bottom-right';
    document.body.appendChild(resizableBox);
    resizableBox.appendChild(corners);
    corners.appendChild(tl);
    corners.appendChild(tr);
    corners.appendChild(bl);
    corners.appendChild(br);
    resizeBox(resizableBox, [tl, tr, bl, br]);
  });

const resizeObserver = new ResizeObserver((entries) => {
  console.log('Size changed');
  entries.forEach((entry) => {
    const cr = entry.contentRect;
    console.log('box:', entry.target);
    console.log(`box size: ${cr.width}px x ${cr.height}px`);
    console.log(`box padding: ${cr.top}px ; ${cr.left}px`);
    if (cr.width > cr.height) {
      console.log('Ländskeip');
    } else if (cr.width < cr.height) {
      console.log('porttrait');
    } else {
      console.log('boxxx');
    }
  });
});

resizeObserver.observe(box);
*/

/*
<style>
    body,
    html {
      background: black;
    }
    html {
            width: 100%;
            height: 100%;
        }

    .resizableBox {
      background: white;
      width: 100px;
      height: 100px;
      position: absolute;
      top: 100px;
      left: 100px;
    }

    .resizableBox .corners{
      width: 100%;
      height: 100%;
      border: 3px solid #4286f4;
      box-sizing: border-box;
    }

    .resizableBox .corners .corner{
      width: 10px;
      height: 10px;
      border-radius: 50%; // magic to turn square into circle
      background: white;
      border: 3px solid #4286f4;
      position: absolute;
    }

    .resizableBox .corners .corner.top-left {
      left: -5px;
      top: -5px;
      cursor: nwse-resize; // corner cursor
    }
    .resizableBox .corners .corner.top-right {
      right: -5px;
      top: -5px;
      cursor: nesw-resize;
    }
    .resizableBox .corners .corner.bottom-left {
      left: -5px;
      bottom: -5px;
      cursor: nesw-resize;
    }
    .resizableBox .corners .corner.bottom-right {
      right: -5px;
      bottom: -5px;
      cursor: nwse-resize;
    }

    </style>
*/
