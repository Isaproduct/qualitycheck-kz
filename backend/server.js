require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// --- SQLite база ---
const db = new Database('requests.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT,
    date TEXT DEFAULT (datetime('now'))
  )
`);

// --- POST /api/request ---
app.post('/api/request', (req, res) => {
  const { name, phone, service, message } = req.body;

  if (!name || !phone || !service) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
  }

  try {
    db.prepare(`
      INSERT INTO requests (name, phone, service, message)
      VALUES (?, ?, ?, ?)
    `).run(name, phone, service, message || '');

    res.json({ success: true, message: 'Заявка принята!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- GET /api/requests --- все заявки
app.get('/api/requests', (req, res) => {
  const requests = db.prepare('SELECT * FROM requests ORDER BY id DESC').all();
  res.json(requests);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Сервер запущен: http://localhost:${process.env.PORT || 5000}`);
});