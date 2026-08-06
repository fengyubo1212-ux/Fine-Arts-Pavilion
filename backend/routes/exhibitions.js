const express = require('express');
const pool = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { keyword, status } = req.query;
  try {
    let sql = 'SELECT * FROM exhibitions WHERE 1=1';
    const params = [];
    if (keyword) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    const today = new Date().toISOString().slice(0, 10);
    if (status === 'ongoing') {
      sql += ' AND start_date <= ? AND end_date >= ?';
      params.push(today, today);
    } else if (status === 'upcoming') {
      sql += ' AND start_date > ?';
      params.push(today);
    } else if (status === 'past') {
      sql += ' AND end_date < ?';
      params.push(today);
    }
    sql += ' ORDER BY start_date DESC';
    const [rows] = await pool.query(sql, params);
    res.json({ code: 0, data: rows });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM exhibitions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.json({ code: 1, message: '未找到' });
    const [artworks] = await pool.query(
      `SELECT a.*, ar.name as artist_name FROM artworks a
       LEFT JOIN artists ar ON a.artist_id = ar.id
       WHERE a.exhibition_id = ?`,
      [req.params.id]
    );
    res.json({ code: 0, data: { ...rows[0], artworks } });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, start_date, end_date, location, poster_url } = req.body;
  if (!title) return res.json({ code: 1, message: '标题不能为空' });
  try {
    const [result] = await pool.query(
      'INSERT INTO exhibitions (title, description, start_date, end_date, location, poster_url) VALUES (?,?,?,?,?,?)',
      [title, description || '', start_date || null, end_date || null, location || '', poster_url || '']
    );
    res.json({ code: 0, data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, start_date, end_date, location, poster_url } = req.body;
  if (!title) return res.json({ code: 1, message: '标题不能为空' });
  try {
    const [result] = await pool.query(
      'UPDATE exhibitions SET title=?, description=?, start_date=?, end_date=?, location=?, poster_url=? WHERE id=?',
      [title, description || '', start_date || null, end_date || null, location || '', poster_url || '', req.params.id]
    );
    if (result.affectedRows === 0) return res.json({ code: 1, message: '未找到' });
    res.json({ code: 0, data: null });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM exhibitions WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.json({ code: 1, message: '未找到' });
    res.json({ code: 0, data: null });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

module.exports = router;
