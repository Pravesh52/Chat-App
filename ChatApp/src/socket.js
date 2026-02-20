// import { io } from "socket.io-client";

// export const createSocket = () => {
//   return io("http://localhost:4000", {   // ✅ CORRECT PORT
//     auth: {
//       token: localStorage.getItem("token"),
//     },
//   });
// };


import { io } from "socket.io-client";

export const createSocket = () => {
  return io("https://chat-app-wgrn.onrender.com", {
    auth: {
      token: localStorage.getItem("Token"), // ⚠️ Capital T
    },
    transports: ["websocket"],   // VERY IMPORTANT for Render
    withCredentials: true
  });
};