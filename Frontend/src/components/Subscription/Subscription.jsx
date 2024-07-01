import React, { useState, useEffect } from "react";
import axios from 'axios';
import PricingCard from "../PricingCard/PricingCard";
import "./Subscription.css";
import { useNavigate } from "react-router-dom";


function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState("0");
  let navigate = useNavigate();
  const navigateToPaymentPage = () => {
    let path = `/paymentPage`;
    navigate(path);
  };

  var user = localStorage.getItem('user');
  var data = JSON.parse(user);


  function handleSubscribe() {
    var user_id = data.email;
    var plan = "";
    var available_tokens = 0;
    var user_name = data.user_name;
    if(selectedPlan === "0"){
      plan = "Pay as you go";
      available_tokens = 10;
    }else if(selectedPlan === "1"){
      plan = "Subscription Plan";
      available_tokens = 60;
    }else{
      plan = "High-Volume Solutions";
      available_tokens = 120;
    }

    const subscriptionData = {
      user_id: user_id,
      plan: plan,
      available_tokens: available_tokens,
      user_name: user_name
    };
  
    axios.post('http://127.0.0.1:8000/api/subscribe/', subscriptionData)
      .then(response => {
        console.log('Subscription created:', response.data);
      })
      .catch(error => {
        console.error('There was a problem with your axios operation:', error);
      });

      navigateToPaymentPage();
  } 

  return (
    <div className="PricingApp">
      <div className="app-container">
        <div className="pricing-cards">
          <PricingCard
            title="Pay as you go"
            price="₹100"
            images="10"
            quality="HD"
            refund="No refund"
            plan="0"
            subscribe={handleSubscribe}
            setSelectedPlan={setSelectedPlan}
          />
          <PricingCard
            title="Subscription Plan"
            price="₹500"
            images="60"
            quality="Ultra HD"
            refund="Refund"
            plan="1"
            subscribe={handleSubscribe}
            setSelectedPlan={setSelectedPlan}
          />
          <PricingCard
            title="High-Volume Solutions"
            price="₹1000"
            images="120"
            quality="4k HD"
            refund="Refund"
            plan="2"
            subscribe={handleSubscribe}
            setSelectedPlan={setSelectedPlan}
          />
        </div>
      </div>
    </div>
  );
}

export default Subscription;
