require('dotenv').config();
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'Success', message: 'Home route' });
});

const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server up and running on port ${PORT}`));
