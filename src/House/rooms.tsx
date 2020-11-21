import * as React from "react";
import ResizeBox from "../resizeBox";
import { WordTuner } from "./Rooms/WordTuner";

export interface RoomApi {
  onReady: () => void;
}

export type RoomKeys = "resizer" | "wordBox";
export const rooms: {
  [K in RoomKeys]: React.ComponentType<RoomApi>;
} = {
  resizer: ResizeBox,
  wordBox: WordTuner,
};
