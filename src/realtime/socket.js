// src/realtime/socket.js
const { Server } = require('socket.io');
const { getAllTasksSync } = require('../models/task.store');

let ioInstance = null;

function initSocket(server, allowedOrigins = ['http://localhost:5173']) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
    },
  });

  io.on('connection', (socket) => {
    console.log('WS client connected:', socket.id);

    // send all tasks when a client connects
    socket.emit('tasks:init', getAllTasksSync());

    socket.on('disconnect', () => {
      console.log('WS client disconnected:', socket.id);
    });
  });

  ioInstance = io;
  return io;
}

function getIo() {
  return ioInstance;
}

module.exports = {
  initSocket,
  getIo,
};