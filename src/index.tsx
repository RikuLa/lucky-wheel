import React from "react";
import ReactDOM from "react-dom";
import { House } from "./House";

// we check if the browser supports ServiceWorkers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(
      // path to the service worker file
      "worker.ts"
    )
    // the registration is async and it returns a promise
    .then(function (reg) {
      console.log("Registration Successful:", reg);
    });
}

ReactDOM.render(<House />, document.getElementById("root"));
