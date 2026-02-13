
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './App.css'
import axios from 'axios';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    passWord: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!form.email || !form.passWord) {
      setError("Please enter email and password")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await axios.post(
        "http://localhost:4000/api/login",
        {
          email: form.email,
          passWord: form.passWord
        }
      )

      if (res.status === 200) {
        // ✅ Save token
        localStorage.setItem("Token", res.data.Token || res.data)
        localStorage.setItem("me", res.data.userName || "")

        if (setIsLoggedIn) {
          setIsLoggedIn(true)
        }

        navigate("/chat")   // tumhara original route
      }

    } catch (error) {
      setError("Wrong password or server error")
      console.log(error)
    }

    setLoading(false)
  }

  return (
    <div className="container">

      {/* LEFT SIDE */}
      <div className="login-box">
        <h2>Welcome!</h2>

        <button className="social google">Log in with Google</button>
        <button className="social apple">Log in with Apple</button>

        <div className="divider">---------OR--------</div>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <br/>
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            value={form.email}
            onChange={handleChange}
          />
          <br></br>

          <label>Password</label>
          <br></br>
          <input
            type="password"
            name="passWord"
            placeholder="Your password"
            value={form.passWord}
            onChange={handleChange}
          />
          <br></br>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p className="signup">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="image-box">
        <img src="/images/chatappimage.png" alt="Chat App" />
      </div>

    </div>
  )
}

export default Login
