require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Connection to MongoDB
const mongoURI = process.env.ATLAS_URI;

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB:', err));

// Base route test
app.get('/', (req, res) => {
  res.send(`Welcome to the Smirnoff's Farm!`);
});

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
