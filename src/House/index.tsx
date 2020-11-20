import * as React from "react";
import Lobby from "./Lobby";

export class House extends React.PureComponent {
  render() {
    const room: React.Component | null = null;
    if (room !== null) {
      return room;
    } else {
      return <Lobby />;
    }
  }
}
