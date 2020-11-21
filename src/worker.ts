export type RoomEventType = "ENTERED_ROOM";

export interface RoomEvent {
  type: RoomEventType;
  payload: Record<string, any>;
}

export interface RoomMessage {
  data: RoomEvent;
}

self.addEventListener("install", (event) => {
  // Perform install steps
  console.log("web worker installed:", event);
});

self.addEventListener("message", (event: RoomMessage) => {
  console.log("message received:", event.data.type);
  console.log("message received:", event.data.payload);
});
