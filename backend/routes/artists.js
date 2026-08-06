const express = require('express');
const pool = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { keyword } = req.query;
  try {
    let sql = 'SELECT * FROM artists';
    const params = [];
    if (keyword) {
      sql += ' WHERE name LIKE ? OR bio LIKE ?';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    sql += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json({ code: 0, data: rows });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM artists WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.json({ code: 1, message: '未找到' });
    res.json({ code: 0, data: rows[0] });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.post('/', auth, async (req, res) => {
  const { name, bio, avatar_url } = req.body;
  if (!name) return res.json({ code: 1, message: '姓名不能为空' });
  try {
    const [result] = await pool.query(
      'INSERT INTO artists (name, bio, avatar_url) VALUES (?, ?, ?)',
      [name, bio || '', avatar_url || '']
    );
    res.json({ code: 0, data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name, bio, avatar_url } = req.body;
  if (!name) return res.json({ code: 1, message: '姓名不能为空' });
  try {
    const [result] = await pool.query(
      'UPDATE artists SET name=?, bio=?, avatar_url=? WHERE id=?',
      [name, bio || '', avatar_url || '', req.params.id]
    );
    if (result.affectedRows === 0) return res.json({ code: 1, message: '未找到' });
    res.json({ code: 0, data: null });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM artists WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.json({ code: 1, message: '未找到' });
    res.json({ code: 0, data: null });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

module.exports = router;
