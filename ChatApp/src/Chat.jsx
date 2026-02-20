// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createSocket } from "./socket";
// import axios from "axios";
// import "./chat.css";

// const API_BASE_URL = "https://chat-app-wgrn.onrender.com";

// export default function Chat() {
//   const nav = useNavigate();

//   const [socket, setSocket] = useState(null);
//   const [userData, setUserData] = useState({});
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [chat, setChat] = useState([]);
//   const [message, setMessage] = useState("");

//   const token = localStorage.getItem("Token");

//   // 🔥 Get Logged In User Data
//   useEffect(() => {
//     if (!token) {
//       alert("Please Login First");
//       nav("/");
//       return;
//     }

//     const getMe = async () => {
//       try {
//         const res = await axios.get(
//           `${API_BASE_URL}/userdata/me`,
//           { headers: { Authorization: token } }
//         );
//         if (res.status === 200) {
//           setUserData(res.data);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const getUsers = async () => {
//       try {
//         const res = await axios.get(
//           `${API_BASE_URL}/userdata/getUsers`,
//           { headers: { Authorization: token } }
//         );
//         if (res.status === 200) {
//           setUsers(res.data);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     getMe();
//     getUsers();
//   }, []);

//   // 🔥 Socket Setup
//   useEffect(() => {
//     const s = createSocket();
//     setSocket(s);

//     s.on("receive_private_message", (data) => {
//       setChat((prev) => [...prev, data]);
//     });

//     return () => {
//       s.disconnect();
//     };
//   }, []);

//   // 🔥 Select User and Load Chats
//   const setChats = async (user) => {
//     setSelectedUser(user);
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/chatdata/chat/${user._id}`,
//         { headers: { Authorization: token } }
//       );
//       if (res.status === 200) {
//         setChat(res.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // 🔥 Send Message
//   const send = async () => {
//     if (!message || !selectedUser) return;

//     try {
//       socket.emit("private_message", {
//         to: selectedUser._id,
//         message,
//       });

//       await axios.post(
//         `${API_BASE_URL}/chatdata/savechat`,
//         {
//           from: userData._id,
//           to: selectedUser._id,
//           message,
//         },
//         { headers: { Authorization: token } }
//       );

//       setChat((prev) => [
//         ...prev,
//         { from: userData._id, message },
//       ]);

//       setMessage("");
//     } catch (error) {
//       console.log("Send Error:", error);
//     }
//   };

//   // 🔥 Logout
//   const logout = () => {
//     localStorage.removeItem("Token");
//     nav("/");
//   };

//   return (
//     <div className="chat-layout">

//       {/* SIDEBAR */}
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <h3>{userData.userName}</h3>
//           <button onClick={logout}>Logout</button>
//         </div>

//         <div className="user-list">
//           {users.map((u) => (
//             <div
//               key={u._id}
//               className={`user ${selectedUser?._id === u._id ? "active" : ""}`}
//               onClick={() => setChats(u)}
//             >
//               <div className="avatar">
//                 {u.userName.charAt(0).toUpperCase()}
//               </div>
//               <span>{u.userName}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* CHAT WINDOW */}
//       <div className="chat-window">
//         <div className="chat-header">
//           {selectedUser
//             ? `Chat with ${selectedUser.userName}`
//             : "Select a user"}
//         </div>

//         <div className="messages">
//           {chat.map((m, i) => (
//             <div
//               key={i}
//               className={`msg ${
//                 m.from === userData._id ? "me" : "other"
//               }`}
//             >
//               {m.message}
//             </div>
//           ))}
//         </div>

//         {selectedUser && (
//           <div className="input-area">
//             <input
//               value={message}
//               placeholder="Type message..."
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && send()}
//             />
//             <button onClick={send}>Send</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createSocket } from "./socket";
import axios from "axios";
import "./chat.css";

const API_BASE_URL = "https://chat-app-wgrn.onrender.com";

export default function Chat() {
  const nav = useNavigate();
  const socketRef = useRef(null);

  const [userData, setUserData] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("Token");

  // =============================
  // 🔥 GET LOGGED IN USER & USERS
  // =============================
  useEffect(() => {
    if (!token) {
      alert("Please Login First");
      nav("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [meRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/userdata/me`, {
            headers: { Authorization: token },
          }),
          axios.get(`${API_BASE_URL}/userdata/getUsers`, {
            headers: { Authorization: token },
          }),
        ]);

        setUserData(meRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // =============================
  // 🔥 SOCKET SETUP (ONLY ONCE)
  // =============================
  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("receive_private_message", (data) => {
      setChat((prev) => {
        // Only update if message belongs to current open chat
        if (
          selectedUser &&
          (data.from === selectedUser._id ||
            data.to === selectedUser._id)
        ) {
          return [...prev, data];
        }
        return prev;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedUser]);

  // =============================
  // 🔥 LOAD CHAT WHEN USER SELECTED
  // =============================
  const setChats = async (user) => {
    setSelectedUser(user);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/chatdata/chat/${user._id}`,
        { headers: { Authorization: token } }
      );

      setChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =============================
  // 🔥 SEND MESSAGE
  // =============================
  const send = async () => {
    if (!message.trim() || !selectedUser) return;

    const newMsg = {
      from: userData._id,
      to: selectedUser._id,
      message,
    };

    try {
      // Emit via socket
      socketRef.current.emit("private_message", newMsg);

      // Save in DB
      await axios.post(
        `${API_BASE_URL}/chatdata/savechat`,
        newMsg,
        { headers: { Authorization: token } }
      );

      // Update UI instantly
      setChat((prev) => [...prev, newMsg]);
      setMessage("");
    } catch (err) {
      console.log("Send Error:", err);
    }
  };

  // =============================
  // 🔥 LOGOUT
  // =============================
  const logout = () => {
    localStorage.removeItem("Token");
    nav("/");
  };

  return (
    <div className="chat-layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>{userData.userName}</h3>
          <button onClick={logout}>Logout</button>
        </div>

        <div className="user-list">
          {users.map((u) => (
            <div
              key={u._id}
              className={`user ${
                selectedUser?._id === u._id ? "active" : ""
              }`}
              onClick={() => setChats(u)}
            >
              <div className="avatar">
                {u.userName.charAt(0).toUpperCase()}
              </div>
              <span>{u.userName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="chat-window">
        <div className="chat-header">
          {selectedUser
            ? `Chat with ${selectedUser.userName}`
            : "Select a user"}
        </div>

        <div className="messages">
          {chat.map((m, i) => (
            <div
              key={i}
              className={`msg ${
                m.from === userData._id ? "me" : "other"
              }`}
            >
              {m.message}
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="input-area">
            <input
              value={message}
              placeholder="Type message..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && send()
              }
            />
            <button onClick={send}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}