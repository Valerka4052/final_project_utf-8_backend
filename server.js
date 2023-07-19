const app = require('./app');
require("dotenv").config();
const mongoose = require('mongoose');
const { DB_HOST, PORT = 3001 } = process.env;

mongoose.connect(DB_HOST).then(() => { app.listen(PORT); console.log("database connection successful") }).catch(e => { console.log(e.message); process.exit(1) });
