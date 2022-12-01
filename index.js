const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 4000;

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();


// middleware setup

dotenv.config();
app.use(express.json());
app.use(
  'public/assets/images',
  express.static(path.join(__dirname, 'public/assets/images'))
);
app.use(cors());

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

app.use(helmet());
app.use(morgan('common'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.status(200).json('File has been uploaded');
});

// routes

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
