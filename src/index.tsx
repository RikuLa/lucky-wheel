import React from "react";
import ReactDOM from "react-dom";
import { WordTuner } from "./House/Rooms/WordTuner";
// import { House } from "./House";
import { ResizeBox } from "./resizeBox";

ReactDOM.render(
  <ResizeBox width={100} height={200} x={300} y={20} />,
  document.getElementById("root")
);
