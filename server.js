require('dotenv').config(); // Dotenv Configuration
require('./config/dbConnect');
const express = require('express');
const userRouter = require('./routes/userRoute');
const cookieParser = require('cookie-parser');
const path = require('path');
const verifyToken = require('./utils/verifyToken');

const app = express();

app.set('view engine', 'ejs');

// ------------------

// Middlewares
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use('/users', userRouter);

app.use((req, res, next) => {
  if (req.cookies.token) {
    const verifiedToken = verifyToken(req.cookies.token);
    if (verifiedToken) res.locals.user = verifiedToken;
  }
  if (!req.cookies.token) res.locals.user = '';

  next();
});
// ------------------

app.get('/', (req, res) => {
  res.render('index', { user: res.locals.user });
});

app.all('*', (req, res) => {
  res.render('errorPage', { error: '404. Not Found' });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log(`Server up and running on port ${PORT}`));
