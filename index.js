const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const PORT = process.env.PORT || 4000;

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();
dotenv.config();

// middleware setup
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Connected to MONGODB');
  }
);

// routes

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
