import * as React from "react";
import ReactDOM from "react-dom";
import { House } from "./House";
import { stream } from "./util/WordStream";

ReactDOM.render(<House />, document.getElementById("root"));

setInterval(async () => {
  console.log("Reading from stream");
  const result = await stream.read();
  console.log("Got value: ", result.value);
}, 1000);
