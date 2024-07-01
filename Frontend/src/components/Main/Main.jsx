import React from "react";
import "./Main.css";
import Upload from "../Upload/Upload";
import Header from "./../Header/Header.jsx";
import Remove from "../Remove/Remove.jsx";
import Plans from "../Plans/Plans.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Subscription from "../Subscription/Subscription.jsx";
function Main() {
  let navigate = useNavigate();
  const navigateToLogin = () => {
    let path = `/login`;
    navigate(path);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === null) {
      navigateToLogin();
    } else {
      console.log("Already logged in: " + localStorage.getItem("user"));
    }
  }, []);


  const [tokens, setTokens] = useState(0);

  return (
    <>
      <Header tokens={tokens} setTokens={setTokens} />

      <Remove tokens={tokens} setTokens={setTokens} />
    </>
  );
}

export default Main;
