import { io } from "socket.io-client";

export const createSocket = () => {
  return io("http://localhost:4000", {   // ✅ CORRECT PORT
    auth: {
      token: localStorage.getItem("token"),
    },
  });
};
