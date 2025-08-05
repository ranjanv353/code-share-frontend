import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

let socket = null;

export function createSocket(userEmail) {
  socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
    extraHeaders: {
      "x-user-email": userEmail || "guest@anon.com",
    },
  });

  return socket;
}


export function joinRoom(roomId) {
  if (socket) {
    socket.emit("room:join", roomId);
  }
}

export function emitCodeChange(code) {
  if (socket) {
    socket.emit("code:change", code);
  }
}

export function onCodeChange(callback) {
  if (socket) {
    socket.on("code:change", callback);
  }
}


export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
