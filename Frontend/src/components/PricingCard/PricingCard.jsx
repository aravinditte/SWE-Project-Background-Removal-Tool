import React from "react";
import "./PricingCard.css";
function PricingCard({
  title,
  price,
  images,
  quality,
  refund,
  plan,
  subscribe,
  setSelectedPlan,
}) {
  function handleSubscribe() {
    setSelectedPlan(plan);
    subscribe();
  }
  return (
    <div className="PricingCard">
      <header>
        <p className="card-title">{title}</p>
        <h1 className="card-price">{price}</h1>
      </header>
      <div className="card-features">
        <div className="card-storage">Remove up to {images} images</div>
        <div className="card-users-allowed">{quality} Quality</div>
        <div className="card-send-up">{refund} Available</div>
      </div>
      <button className="card-btn" onClick={handleSubscribe}>
        Subscribe
      </button>
    </div>
  );
}

export default PricingCard;
