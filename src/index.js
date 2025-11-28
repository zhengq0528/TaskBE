// src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const tasksRouter = require('./routes/tasks.routes');
const { initSocket } = require('./realtime/socket');

const app = express();

// CORS: during dev allow localhost:5173; in prod set CLIENT_ORIGIN on Railway
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task API is running' });
});

app.use('/api/tasks', tasksRouter);

// Only start HTTP + WebSocket server when run directly (not in tests)
if (require.main === module) {
  const PORT = process.env.PORT || 4000;

  const server = http.createServer(app);

  // Initialise Socket.IO on this HTTP server
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Task API listening on http://localhost:${PORT}`);
  });
}

// Export the Express app for Jest / supertest
module.exports = app;