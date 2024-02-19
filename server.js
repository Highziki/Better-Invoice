require('dotenv').config();
require('./config/dbConnect');
const express = require('express');
const userRouter = require('./routes/userRoute');
const cookieParser = require('cookie-parser');
const isLoggedIn = require('./middlewares/isLoggedIn');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.render('index', { user: '' });
});

app.get('*', (req, res) => {
  res.render('errorPage', { error: '404. Not Found' });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log(`Server up and running on port ${PORT}`));
