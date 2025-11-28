// src/realtime/socket.js
const { Server } = require('socket.io');
const { tasks } = require('../models/task.store');

let ioInstance = null;

function initSocket(server) {
  const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

  ioInstance = new Server(server, {
    cors: {
      origin: allowedOrigin,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // send initial snapshot to this client
    socket.emit('tasks:init', Array.from(tasks.values()));

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return ioInstance;
}

function getIo() {
  return ioInstance;
}

module.exports = { initSocket, getIo };