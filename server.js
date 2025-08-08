const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

function normalizeName(raw) {
  if (raw == null) return '';
  const name = String(raw).trim();
  return name.slice(0, 30);
}

io.on('connection', (socket) => {
  const shortId = socket.id.slice(0, 4);
  socket.data.username = `Guest-${shortId}`;

  // 最初の接続時に人数を通知
  io.emit('online count', io.engine.clientsCount);

  socket.on('join', (providedName) => {
    const name = normalizeName(providedName) || `Guest-${shortId}`;
    socket.data.username = name;
    io.emit('system message', `${name} が参加しました`);
    io.emit('online count', io.engine.clientsCount);
  });

  socket.on('chat message', (msg) => {
    const text = String(msg || '').slice(0, 1000);
    const name = socket.data.username || `Guest-${shortId}`;
    if (!text) return;
    io.emit('chat message', { name, text, ts: Date.now() });
  });

  socket.on('disconnect', () => {
    const name = socket.data.username || `Guest-${shortId}`;
    io.emit('system message', `${name} が退出しました`);
    io.emit('online count', io.engine.clientsCount);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Chat server listening on http://localhost:${PORT}`);
});


