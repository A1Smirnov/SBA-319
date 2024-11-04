// ./app.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');  // Testing sessions

// Import of Building models
const Building = require('./models/Building');


const app = express();

// EJS as a Template
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For work with form's data
app.use(morgan('dev'));

// For sessions!
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  }));

// Connection to MongoDB
const mongoURI = process.env.ATLAS_URI;

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB:', err));

// Routes
const indexRoutes = require('./routes/index');
const gameRoutes = require('./routes/game');

app.use('/', indexRoutes);
app.use('/game', gameRoutes);

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
