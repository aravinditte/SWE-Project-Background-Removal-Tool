import React, { useState } from "react";
import "./../LoginForm/LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Regular expression for validating email address
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // Regular expression for validating password
    const re = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
    return re.test(password);
  };

  const subscribe = (email, name) => {
    const subscriptionData = {
      user_id: email,
      plan: "No Plan",
      available_tokens: 3,
      user_name: name,
    };

    axios
      .post("http://127.0.0.1:8000/api/subscribe/", subscriptionData)
      .then((response) => {
        console.log("Subscription created:", response.data);
      })
      .catch((error) => {
        console.error("There was a problem with your axios operation:", error);
      });

    navigateToLogin();
  };

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

    register();
  };

  const register = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        email: email,
        name: name,
        password: password,
      });

      if (response.data.status === "success") {
        subscribe(email, name);
      } else {
        setError("Please enter valid details!");
      }
    } catch (error) {
      setError("Please enter valid details!");
    }
  };

  const navigateToLogin = () => {
    let path = `/login`;
    navigate(path);
  };

  return (
    <div className="content">
      <div className="wrapper">
        <form>
          <h1>Register</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
            <FaUser className="icon" />
          </div>

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

          <button type="submit" onClick={handleSubmit}>
            Register
          </button>

          <div className="error">
            <p>{error}</p>
          </div>

          <div className="register-link">
            <p>
              Already have an account?{" "}
              <a onClick={navigateToLogin}>Login</a>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
