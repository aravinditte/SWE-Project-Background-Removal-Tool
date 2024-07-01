import React, { useState } from "react";
import "./../LoginForm/LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Forgot_Password() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
    return re.test(password);
  };

  const validateConfirmPassword = (password,confirmPassword) => {
    return password === confirmPassword;
  }


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long and contain at least one letter and one number.");
      return;
    }
    if (!validateConfirmPassword(password,confirmPassword)) {
      setError("Password and Confirm Password must be same!");
      return;
    }
    

    register();
  };

  const register = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/change_password", {
        email: email,
        new_password: password,
      });

      if (response.data.status === "success") {
        setTimeout(() => {
          window.history.back(); 
        }, 500);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(response.data.message);
    }
  };


  return (
    <div className="content">
      <div className="wrapper">
        <form>
          <h1>Forgot Password</h1>

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
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <FaLock className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />
            <FaLock className="icon" />
          </div>

          <button type="submit" onClick={handleSubmit}>
            Change Password
          </button>

          <div className="error">
            <p>{error}</p>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Forgot_Password;
