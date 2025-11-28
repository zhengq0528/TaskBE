// src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const tasksRouter = require('./routes/tasks.routes');
const { initSocket } = require('./realtime/socket'); // if you used a helper

const app = express();

// --------- CORS ORIGINS ----------
const allowedOrigins = [
  'http://localhost:5173',           // local frontend
  process.env.CLIENT_ORIGIN || null, // production frontend (Railway)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools like curl / Postman with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task API is running' });
});

app.use('/api/tasks', tasksRouter);

// Only start server if run directly (not in tests)
if (require.main === module) {
  const PORT = process.env.PORT || 4000;

  const server = http.createServer(app);

  // initialize socket.io with the same CORS
  initSocket(server, allowedOrigins);

  server.listen(PORT, () => {
    console.log(`Task API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;