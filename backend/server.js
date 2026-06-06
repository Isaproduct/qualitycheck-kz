require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
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

// --- Nodemailer ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- POST /api/request ---
app.post('/api/request', async (req, res) => {
  const { name, phone, service, message } = req.body;

  if (!name || !phone || !service) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
  }

  try {
    db.prepare(`
      INSERT INTO requests (name, phone, service, message)
      VALUES (?, ?, ?, ?)
    `).run(name, phone, service, message || '');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `Новая заявка от ${name}`,
      html: `
        <h2>Новая заявка — QualityCheck KZ</h2>
        <p><b>Имя:</b> ${name}</p>
        <p><b>Телефон:</b> ${phone}</p>
        <p><b>Услуга:</b> ${service}</p>
        <p><b>Сообщение:</b> ${message || '—'}</p>
      `
    });

    res.json({ success: true, message: 'Заявка принята!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- GET /api/requests ---
app.get('/api/requests', (req, res) => {
  const requests = db.prepare('SELECT * FROM requests ORDER BY id DESC').all();
  res.json(requests);
});

// --- Запуск ---
app.listen(process.env.PORT || 5000, () => {
  console.log(`Сервер запущен: http://localhost:${process.env.PORT || 5000}`);
});