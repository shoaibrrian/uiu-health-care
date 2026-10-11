import { io, Socket } from "socket.io-client";
import { API_URL } from "./config";

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (socket) return socket;

  socket = io(API_URL, {
    auth: { token: localStorage.getItem("token") },
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
