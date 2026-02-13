import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
//import Home from "./Home";
import Chat from "./Chat";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
        <Route
          path="/chat"
          element={
            isLoggedIn ? <Chat /> : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
