const express = require('express');
const pool = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { artist_id, exhibition_id, keyword } = req.query;
  try {
    let sql = `SELECT a.*, ar.name as artist_name, e.title as exhibition_title
               FROM artworks a
               LEFT JOIN artists ar ON a.artist_id = ar.id
               LEFT JOIN exhibitions e ON a.exhibition_id = e.id
               WHERE 1=1`;
    const params = [];
    if (artist_id) { sql += ' AND a.artist_id = ?'; params.push(artist_id); }
    if (exhibition_id) { sql += ' AND a.exhibition_id = ?'; params.push(exhibition_id); }
    if (keyword) {
      sql += ' AND (a.title LIKE ? OR a.description LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    sql += ' ORDER BY a.created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json({ code: 0, data: rows });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, ar.name as artist_name, e.title as exhibition_title
       FROM artworks a
       LEFT JOIN artists ar ON a.artist_id = ar.id
       LEFT JOIN exhibitions e ON a.exhibition_id = e.id
       WHERE a.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.json({ code: 1, message: '未找到' });
    res.json({ code: 0, data: rows[0] });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, description, image_url, year, artist_id, exhibition_id } = req.body;
  if (!title) return res.json({ code: 1, message: '标题不能为空' });
  try {
    const [result] = await pool.query(
      'INSERT INTO artworks (title, description, image_url, year, artist_id, exhibition_id) VALUES (?,?,?,?,?,?)',
      [title, description || '', image_url || '', year || null, artist_id || null, exhibition_id || null]
    );
    res.json({ code: 0, data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, image_url, year, artist_id, exhibition_id } = req.body;
  if (!title) return res.json({ code: 1, message: '标题不能为空' });
  try {
    const [result] = await pool.query(
      'UPDATE artworks SET title=?, description=?, image_url=?, year=?, artist_id=?, exhibition_id=? WHERE id=?',
      [title, description || '', image_url || '', year || null, artist_id || null, exhibition_id || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.json({ code: 1, message: '未找到' });
    res.json({ code: 0, data: null });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.patch('/:id/exhibition', auth, async (req, res) => {
  try {
    await pool.query('UPDATE artworks SET exhibition_id = ? WHERE id = ?', [req.body.exhibition_id || null, req.params.id]);
    res.json({ code: 0, data: null });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM artworks WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.json({ code: 1, message: '未找到' });
    res.json({ code: 0, data: null });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

module.exports = router;
