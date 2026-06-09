const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
let client;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db('qualitycheck');
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await connectDB();
    const collection = db.collection('requests');

    if (req.method === 'GET') {
      const requests = await collection.find({}).sort({ date: -1 }).toArray();
      return res.status(200).json(requests);
    }

    if (req.method === 'POST') {
      const { name, phone, service, message } = req.body;

      if (!name || !phone || !service) {
        return res.status(400).json({ error: 'Заполните обязательные поля' });
      }

      await collection.insertOne({
        name,
        phone,
        service,
        message: message || '',
        date: new Date()
      });

      return res.status(200).json({ success: true, message: 'Заявка принята!' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера: ' + err.message });
  }
};

    const newRequest = {
      name,
      phone,
      service,
      message: message || '',
      date: new Date()
    };

    await collection.insertOne(newRequest);
    return res.status(200).json({ success: true, message: 'Заявка принята!' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}