// src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const tasksRouter = require('./routes/tasks.routes');
const { initSocket } = require('./realtime/socket');

const app = express();

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

if (require.main === module) {
  const PORT = process.env.PORT || 4000;

  const server = http.createServer(app);

  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Task API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;