import React from "react";
import ReactDOM from "react-dom";
import { House } from "./House";
import { ResizeBox } from "./House/Rooms/ResizeRoom/ResizeBox";

ReactDOM.render(
  <ResizeBox onReady={() => console.log("Ready")} onComplete={() => {}} />,
  document.getElementById("root")
);
