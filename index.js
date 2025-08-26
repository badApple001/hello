const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const MONGO_URL = 'mongodb://127.0.0.1:27017';
const PORT = 3000;

// 静态托管前端页面
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.json());

(async () => {
  let client;
  try {
    client = new MongoClient(MONGO_URL);
    await client.connect();
    const db = client.db('simplegame');
    const users = db.collection('users');

    // 用户注册
    app.post('/register', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) return res.json({ ok: false, msg: '参数缺失' });
      const exists = await users.findOne({ username });
      if (exists) return res.json({ ok: false, msg: '用户名已存在' });
      await users.insertOne({ username, password, count: 0 });
      res.json({ ok: true, msg: '注册成功' });
    });

    // 登录
    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) return res.json({ ok: false, msg: '参数缺失' });
      const user = await users.findOne({ username, password });
      if (!user) return res.json({ ok: false, msg: '账号或密码错误' });
      res.json({ ok: true, msg: '登录成功', count: user.count });
    });

    // 积分自增
    app.post('/play', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) return res.json({ ok: false, msg: '参数缺失' });
      const user = await users.findOneAndUpdate(
        { username, password },
        { $inc: { count: 1 } },
        { returnDocument: 'after' }
      );
      if (!user.value) return res.json({ ok: false, msg: '账号或密码错误' });
      res.json({ ok: true, msg: '游戏成功', count: user.value.count });
    });

    app.listen(PORT, () => {
      console.log('Express+Mongo+前端静态页面已启动: http://127.0.0.1:' + PORT);
    });
  } catch (err) {
    console.error('MongoDB连接失败:', err);
    process.exit(1);
  }
})();

