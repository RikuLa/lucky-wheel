import * as React from "react";
import { ResizeBox } from "../resizeBox";
import { WordTuner } from "./Rooms/WordTuner";
import { BombTest } from "../Bomb/Bomb";

export interface RoomApi {
  onReady: () => void;
}

export const rooms = {
  resizer: ResizeBox as React.ComponentType<RoomApi>,
  wordBox: WordTuner as React.ComponentType<RoomApi>,
  bombTest: BombTest as React.ComponentType<RoomApi>,
};
export type RoomKeys = keyof typeof rooms;