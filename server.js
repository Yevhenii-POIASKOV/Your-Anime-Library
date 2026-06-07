const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '123456789',
  database: 'your_anime_library'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Підключено до бази даних MySQL');
});

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Всі поля обов\'язкові' });

  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email вже існує' });
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Реєстрація успішна!', userId: result.insertId });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Введіть email та пароль' });

  const sql = 'SELECT id, username, email FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Невірний email або пароль' });
    res.json({ message: 'Успішний вхід!', user: results[0] });
  });
});

app.post('/api/library', (req, res) => {
  const { user_id, anime_id, title, image_url, genre, releaseYear, status, rating, comment } = req.body;

  if (!user_id || !anime_id || !status) {
    return res.status(400).json({ message: 'Не вистачає обов\'язкових даних' });
  }

  const insertAnimeSql = `
    INSERT IGNORE INTO anime (id, title, image_url, genre, releaseYear) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(insertAnimeSql, [anime_id, title, image_url, genre, releaseYear], (err) => {
    if (err) return res.status(500).json({ error: 'Помилка збереження аніме: ' + err.message });

    const insertLibrarySql = `
      INSERT INTO library_items (user_id, anime_id, status, rating, comment) 
      VALUES (?, ?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE status = ?, rating = ?, comment = ?
    `;
    
    db.query(insertLibrarySql, [user_id, anime_id, status, rating, comment, status, rating, comment], (err) => {
        if (err) return res.status(500).json({ error: 'Помилка бібліотеки: ' + err.message });
        res.json({ message: 'Бібліотеку успішно оновлено!' });
      }
    );
  });
});

app.get('/api/library/:userId', (req, res) => {
  const userId = req.params.userId;
  
  const sql = `
    SELECT 
      l.status, l.rating, l.comment, 
      a.id, a.title, a.image_url, a.genre, a.releaseYear
    FROM library_items l
    JOIN anime a ON l.anime_id = a.id
    WHERE l.user_id = ?
    ORDER BY l.status, a.title
  `;
  
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.delete('/api/library/:userId/:animeId', (req, res) => {
  const { userId, animeId } = req.params;
  const sql = 'DELETE FROM library_items WHERE user_id = ? AND anime_id = ?';
  
  db.query(sql, [userId, animeId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Аніме видалено з бібліотеки' });
  });
});

app.get('/api/library/:userId/:animeId', (req, res) => {
  const { userId, animeId } = req.params;
  const sql = 'SELECT status, rating, comment FROM library_items WHERE user_id = ? AND anime_id = ?';
  
  db.query(sql, [userId, animeId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json({ inLibrary: true, data: results[0] });
    } else {
      res.json({ inLibrary: false });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});