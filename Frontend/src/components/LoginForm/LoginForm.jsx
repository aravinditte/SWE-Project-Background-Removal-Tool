import React, { useState } from "react";
import "./LoginForm.css";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Loginform() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Define navigate

  function handleSubmit(e) {
    e.preventDefault();

    async function login() {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login/", {
          email: email,
          password: password,
        });
        if (response.data.status === "success") {
          console.log("Login successful");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
          navigateToHome();
        } else {
          setError(response.data.message);
          console.log(response.data);
        }
      } catch (error) {
        setError("Enter Correct Details!");
        console.error("Error logging in:", error);
      }
    }
    login();
  }

  const navigateToHome = () => {
    let path = `/home`;
    navigate(path, { replace: true });
  };
  const navigateToRegister = () => {
    navigate(`/register`);
  };
  

  function handleForgotPassword(){
    async function ForgotPassword() {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/send_forgot_password_mail", {
          email: email
        });
        if (response.data.success) { 
          setError(response.data.message);
        } else {
          setError(response.data.message);
          console.log(response.data);
        }
      } catch (error) {
        setError("Enter Correct Details!");
        console.error("Error logging in:", error);
      }
    }
    ForgotPassword();
  }

  return (
    <div className="content">
      <div className="wrapper">
        <form action="">
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <MdEmail className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="remeber-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <span style={{cursor:"pointer"}} onClick={handleForgotPassword}>Forgot Password?</span>
          </div>

          <button
            type="submit"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Login
          </button>

          <div className="error">
            <p>{error}</p>
          </div>

          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <a onClick={navigateToRegister}>Register</a>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Loginform;
