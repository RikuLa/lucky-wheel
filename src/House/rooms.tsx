import * as React from "react";
import ResizeBox from "../resizeBox";
import { WordTuner } from "./Rooms/WordTuner";

export interface RoomApi {
  onReady: () => void;
}

export const rooms: {
  [id: string]: React.ComponentType<RoomApi>;
} = {
  resizer: ResizeBox,
  wordBox: WordTuner,
};
