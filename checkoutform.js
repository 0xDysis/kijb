import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import React from 'react';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      console.log('[error]', error);
    } else {
      // Replace with your order info
      const orderInfo = { totalPrice: 100 }; 
      
      const response = await fetch('http://localhost:3000/orders/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.id, orderInfo }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Handle successful payment
        console.log('Payment successful');
      } else {
        // Handle failed payment
        console.log('Payment failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
}

export default CheckoutForm;
