import * as React from "react";
import ResizeBox from "../resizeBox";
import { WordTuner } from "./Rooms/WordTuner";
import { BombTest } from "../Bomb/Bomb";

export interface RoomApi {
  isSpying: boolean;
}

export const rooms: {
  [id: string]: React.ComponentType<RoomApi>;
} = {
  resizer: ResizeBox,
  wordBox: WordTuner,
  bombTest: BombTest,
};
