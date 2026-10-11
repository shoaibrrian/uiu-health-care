import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (socket) return socket;

  socket = io("http://localhost:5000", {
    auth: { token: localStorage.getItem("token") },
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
