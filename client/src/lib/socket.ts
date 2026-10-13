import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "./env";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_BASE_URL, { autoConnect: true, transports: ["websocket", "polling"] });
  }
  return socket;
}
