const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/capacity', require('./routes/capacity'));

// Serve a static welcome message for the API root
app.get('/', (req, res) => {
  res.json({ message: 'RetailOS Warehouse Module REST API is running.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
