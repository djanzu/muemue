(() => {
  const socket = io();

  const el = {
    messages: document.getElementById('messages'),
    form: document.getElementById('form'),
    input: document.getElementById('m'),
    nameInput: document.getElementById('name'),
    saveName: document.getElementById('saveName'),
    online: document.getElementById('online'),
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function ensureName() {
    const saved = localStorage.getItem('chat:username');
    const name = saved && saved.trim().length > 0
      ? saved.trim().slice(0, 30)
      : `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('chat:username', name);
    el.nameInput.value = name;
    return name;
  }

  function scrollToBottom() {
    el.messages.scrollTop = el.messages.scrollHeight;
  }

  function addSystemMessage(text) {
    const li = document.createElement('li');
    li.className = 'sys';
    li.innerText = text;
    el.messages.appendChild(li);
    scrollToBottom();
  }

  function addChatMessage({ name, text, ts }) {
    const li = document.createElement('li');
    li.className = 'msg';
    const time = new Date(ts || Date.now());
    li.innerHTML = `
      <div class="meta">${escapeHtml(name)} ・ ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div class="body">${escapeHtml(text)}</div>
    `;
    el.messages.appendChild(li);
    scrollToBottom();
  }

  // 初回 join
  function join() {
    const name = ensureName();
    socket.emit('join', name);
  }

  el.saveName.addEventListener('click', () => {
    const name = el.nameInput.value.trim().slice(0, 30);
    if (!name) return;
    localStorage.setItem('chat:username', name);
    socket.emit('join', name);
  });

  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = el.input.value;
    if (!text || !text.trim()) return;
    socket.emit('chat message', text);
    el.input.value = '';
  });

  // Shift+Enter で改行、Enter で送信
  el.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      el.form.requestSubmit();
    }
  });

  // 受信ハンドラ
  socket.on('system message', addSystemMessage);
  socket.on('chat message', addChatMessage);
  socket.on('online count', (n) => {
    el.online.textContent = String(n);
  });

  socket.on('connect', join);
})();


