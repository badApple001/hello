const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const MONGO_URL = 'mongodb://127.0.0.1:27017';
const PORT = 3000;

(async () => {
  let client;
  try {
    client = new MongoClient(MONGO_URL);
    await client.connect();
    const db = client.db('testdemo');
    const col = db.collection('counter');

    app.get('/', async (req, res) => {
      try {
        // 每次访问自增1，查出新值
        const result = await col.findOneAndUpdate(
          { _id: 'visit_count' },
          { $inc: { count: 1 } },
          { upsert: true, returnDocument: 'after' }
        );
        res.json({ ok: true, count: result.value.count });
      } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
      }
    });

    app.listen(PORT, () => {
      console.log('Express+Mongo服务已启动: http://127.0.0.1:' + PORT);
    });
  } catch (err) {
    console.error('MongoDB连接失败:', err);
    process.exit(1);
  }
})();

