const express = require('express');
const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('CrownKing Backend Server is running!');
});

// Placeholder API routes (to be implemented later)
app.get('/api/products', (req, res) => {
  // Placeholder for fetching products
  res.json([{ id: 1, name: 'Sample Ring', price: 199.99 }]);
});

app.post('/api/auth/login', (req, res) => {
  // Placeholder for login logic
  res.json({ message: 'Login endpoint placeholder' });
});

app.post('/api/auth/register', (req, res) => {
  // Placeholder for registration logic
  res.json({ message: 'Register endpoint placeholder' });
});

app.get('/api/cart', (req, res) => {
  // Placeholder for fetching cart items
  res.json({ items: [], total: 0 });
});

app.post('/api/cart', (req, res) => {
  // Placeholder for adding items to cart
  res.json({ message: 'Add to cart endpoint placeholder' });
});

app.post('/api/checkout', (req, res) => {
  // Placeholder for checkout logic
  res.json({ message: 'Checkout endpoint placeholder' });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
