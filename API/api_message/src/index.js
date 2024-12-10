require('dotenv').config();
const dotenv = require('dotenv');
const routerMiddleware = require('./Middlewares/RouterMiddleware');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuration: Read environment variables from .env file
dotenv.config();


app.use(express.json());

// Point de terminaison de santé
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

let messages = [];


// WebSocket connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Send existing messages to newly connected clients
    socket.emit('allMessages', messages);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

routerMiddleware(app);

(async() => {
  /********************
   * Start API listener
   *******************/
  app.listen(process.env.SNL_PORT, () => {
      console.log("--- SERVICE MESSAGE UP! Listen on port: "+process.env.SNL_PORT+" ---");
  });
  
})();