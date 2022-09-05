const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGO_URL, () => {
  console.log('Connected to MONGODB');
});

// middleware setup
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.listen(8800, () => {
  console.log('Server is running on port 8800');
});
