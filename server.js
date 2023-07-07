const app = require('./app');

const mongoose = require('mongoose');
// const { DB_HOST, PORT = 3001 } = process.env;

mongoose.connect("mongodb+srv://Valerij:yYyX7ophSwjPTr40@cluster0.ibb8iqz.mongodb.net/so_yummy?retryWrites=true&w=majority").then(() => { app.listen(3001); console.log("Database connection successful") }).catch(e => { console.log(e.message); process.exit(1) });
