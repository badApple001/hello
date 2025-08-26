const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Ice-Glacier! Express is Ok!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', ts: new Date() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Express 已启动：http://127.0.0.1:${PORT}`);
});

