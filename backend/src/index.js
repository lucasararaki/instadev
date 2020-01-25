const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes');

const app = express();

const server = require('http').Server(app); // allows server work with HTTP
const io = require('socket.io')(server); // al lows server work with websocket

mongoose.connect('mongodb+srv://tindev:tindev@cluster0-rtelk.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true
});

/* all requests after this middleware, can access IO */
app.use((req, res, next) => {
  req.io = io;

  next();
})

app.use(cors());

/* set files route default to get files */
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized' )));

app.use(routes);

server.listen(3333); // creates HTTP server


