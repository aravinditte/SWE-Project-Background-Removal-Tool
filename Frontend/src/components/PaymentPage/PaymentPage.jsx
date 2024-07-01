import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress'; 
import './PaymentPage.css';

function PaymentPage() {
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [redirectCountdown, setRedirectCountdown] = useState(5); // Initial countdown value

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPaymentStatus('successful');
    }, 5000); 

    return () => clearTimeout(timeoutId); 
  }, []);

  // Countdown effect
  useEffect(() => {
    if (paymentStatus === 'successful' && redirectCountdown > 0) {
      const intervalId = setInterval(() => {
        setRedirectCountdown((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (paymentStatus === 'successful' && redirectCountdown === 0) {
      setTimeout(() => {
        window.history.back(); 
      }, 500);
    }
  }, [paymentStatus, redirectCountdown]);

  const renderRedirectMessage = () => {
    if (paymentStatus === 'successful' && redirectCountdown > 0) {
      return <p>You will be redirected back in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}.</p>;
    }
    return null;
  };

  return (
    <div className="payment-page">
      {paymentStatus === 'processing' ? (
        <CircularProgress color="primary" size={30} thickness={3} />
      ) : (
        <div>
          <h3 className="payment-success">Payment Successful!</h3>
          {renderRedirectMessage()}
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
