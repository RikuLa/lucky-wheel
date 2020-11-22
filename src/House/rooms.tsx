import * as React from "react";
import { ResizeBox } from "./Rooms/ResizeRoom/ResizeBox";
import { WordTuner } from "./Rooms/WordTuner";
import { Fax } from "./Rooms/FaxRoom/Fax";
import { Printer } from "./Rooms/PrinterRoom/Printer";
import { Engine } from "./Rooms/Engine";

export interface RoomApi {
  onReady: () => void;
  onComplete: () => void;
  roomCompleted: boolean;
}

export const roomNames = {
  resizer: "Scanner",
  wordBox: "Radio",
  fax: "Fax",
  printer: "Archives",
  engine: "Engine",
};
export const rooms = {
  resizer: ResizeBox as React.ComponentType<RoomApi>,
  wordBox: WordTuner as React.ComponentType<RoomApi>,
  fax: Fax as React.ComponentType<RoomApi>,
  printer: Printer as React.ComponentType<RoomApi>,

  engine: Engine as React.ComponentType<RoomApi>,
};
export type RoomKeys = keyof typeof rooms;
