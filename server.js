require('dotenv').config();
require('./config/dbConnect');
const express = require('express');
const userRouter = require('./routes/userRoute');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, console.log(`Server up and running on port ${PORT}`));
