import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
function Header({tokens, setTokens}) {
  let navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableTokens = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.post("http://127.0.0.1:8000/api/get_tokens", {
          user_id: user.email,
        });
        console.log("Available tokens:", response.data.available_tokens);
        setTokens(response.data.available_tokens);
      } catch (error) {
        console.error("Error fetching available tokens:", error);
      }
    };
    fetchAvailableTokens();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.getItem(
      "after removal: " + localStorage.getItem("isLoggedIn")
    );
    let path = `/login`;
    navigate(path);
  };

  function handleVideoRemovalNavigation() {
    navigate("/videoRemove");
  }
  function handlePricingNavigation() {
    navigate("/pricing");
  }

  return (
    <div className="header">
      <nav className="navbar">
        <div className="navbar-left">
          <span>Background Remover</span>
          <span onClick={handleVideoRemovalNavigation}>Video Removal</span>
          <span onClick={handlePricingNavigation}>Buy tokens</span>
        </div>
        <div className="navbar-right">
          <span>Available tokens: {tokens}</span>
          <span onClick={handleLogout}>Logout</span>
        </div>
      </nav>
    </div>
  );
}

export default Header;
