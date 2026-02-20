
import React, { useState } from 'react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "https://chat-app-wgrn.onrender.com";

const Signup = () => {
  const nav = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    passWord: "",
    confirmPassword: ""
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (form.passWord !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/signup`,
        {
          userName: form.userName,
          email: form.email,
          passWord: form.passWord
        }
      );

      if (res.status === 200) {
        setMsg("Signup successful 🎉 Redirecting...");

        setTimeout(() => {
          nav("/login");
        }, 1500);
      }

    } catch (err) {
      setError("Signup failed or server error");
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Create Account</h2>

        <form onSubmit={submit}>
          <label>Full Name</label>
          <br />
          <input
            type="text"
            name="userName"
            placeholder="Your full name"
            value={form.userName}
            onChange={handleChange}
            required
          />

          <br />
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <br />
          <label>Password</label>
          <br />
          <input
            type="password"
            name="passWord"
            placeholder="Create password"
            value={form.passWord}
            onChange={handleChange}
            required
          />

          <br />
          <label>Confirm Password</label>
          <br />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <br />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}

        <p className="signup">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>

      <div className="image-box">
        <img src="/images/chatappimage.png" alt="Signup Visual" />
      </div>
    </div>
  );
};

export default Signup;

