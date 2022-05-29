require('dotenv-flow').config()
require('./db');

const http = require('http');
const express = require('express');
const app = express()
app.use(express.json())

const productRoutes = require('../index');

app.use('/products', productRoutes)

const server = http.createServer(app);
// server.listen(process.env.PORT || 3000);

module.exports = server