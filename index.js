const express = require('express');
const { MongoClient } = require('mongodb');

// 本机MongoDB服务，非鉴权模式
const MONGO_URL = 'mongodb://127.0.0.1:27017';
const PORT = 3000;

const app = express();

(async () => {
  try {
    const client = new MongoClient(MONGO_URL, { serverSelectionTimeoutMS: 2000 });
    await client.connect();
    const db = client.db('testdemo');

    app.get('/', async (req, res) => {
      try {
        const col = db.collection('messages');
        // 写入一条测试数据
        await col.insertOne({ msg: 'hello from iceglacier', ts: new Date() });
        const count = await col.countDocuments();
        res.json({ ok: true, count });
      } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
      }
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ 测试服务已启动：http://127.0.0.1:${PORT}`);
    });

  } catch (err) {
    console.error('❌ MongoDB连接失败:', err);
    process.exit(1);
  }
})();

