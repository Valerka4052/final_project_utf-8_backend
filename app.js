const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./route')

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// тут повинні бути роути

// тут повинні бути роути


app.use((req, res) => {
    res.status(404).json({ message: 'not found' });
});
app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message: message });
});

module.exports = app;