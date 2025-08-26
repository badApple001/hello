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
        // 1. 查询当前计数
        let doc = await col.findOne({ _id: 'visit_count' });
        let count = doc && typeof doc.count === 'number' ? doc.count : 0;

        // 2. 自增
        count++;

        // 3. 存回去（覆盖写）
        await col.updateOne(
          { _id: 'visit_count' },
          { $set: { count } },
          { upsert: true }
        );

        // 4. 返回最新值
        res.json({ ok: true, count });
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

