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
        // 总是让 count 字段自增1，第一次自动从0开始
        const result = await col.findOneAndUpdate(
          { _id: 'visit_count' },
          { $inc: { count: 1 } },
          {
            upsert: true,
            returnDocument: 'after'
          }
        );
        // 如果是首次插入，Mongo会自动加上 count:1
        // 但保险起见补一层容错
        let count = 1;
        if (result.value && typeof result.value.count === 'number') {
          count = result.value.count;
        }
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

