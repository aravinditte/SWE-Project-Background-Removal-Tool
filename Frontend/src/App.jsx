import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import Main from "./components/Main/Main.jsx";
import LoginForm from "./components/LoginForm/LoginForm.jsx";
import RegisterForm from './components/RegisterForm/RegisterForm.jsx';
import PaymentPage from './components/PaymentPage/PaymentPage.jsx';
import VideoRemoval from './components/VideoRemoval/VideoRemoval.jsx';
import PricingCard from './components/PricingCard/PricingCard.jsx';
import Subscription from './components/Subscription/Subscription.jsx';
import Forgot_Password from './components/ForgotPassword/ForgotPassword.jsx';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/home" element={<Main />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path='/paymentPage' element={<PaymentPage />} />
          <Route path='/videoRemove' element={<VideoRemoval />} />
          <Route path='/pricing' element={<Subscription />} />
          <Route path='/forgot_password' element={<Forgot_Password />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
