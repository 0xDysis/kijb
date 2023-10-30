const express = require('express');
const mongoose = require('mongoose');
const stripe = require('stripe')('your_stripe_secret_key');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Initialize MongoDB connection
mongoose.connect('mongodb://localhost:27017/webshop', { useNewUrlParser: true, useUnifiedTopology: true });

// User Model
const User = mongoose.model('User', { username: String, password: String });

// Product Model
const Product = mongoose.model('Product', { name: String, description: String, price: Number });

// Order Model
const Order = mongoose.model('Order', { userId: mongoose.Types.ObjectId, products: Array, totalPrice: Number });

// Register
app.post('/users/register', async (req, res) => {
  // Implement registration logic here
  res.json({ success: true });
});

// Login
app.post('/users/login', async (req, res) => {
  // Implement login logic here
  res.json({ success: true });
});

// Fetch products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add products
app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Place an order and handle payment
app.post('/orders/payment', async (req, res) => {
  const { token, orderInfo } = req.body;
  
  try {
    const charge = await stripe.charges.create({
      amount: orderInfo.totalPrice * 100,
      currency: 'usd',
      source: token,
      description: 'Order payment for bathroom art panels',
    });

    const order = new Order(orderInfo);
    await order.save();
    
    res.json({ success: true, message: 'Payment and order successfully processed' });
  } catch (error) {
    res.json({ success: false, message: 'Payment failed', error });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
