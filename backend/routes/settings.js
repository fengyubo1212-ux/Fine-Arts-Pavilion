const express = require('express');
const pool = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM settings');
    const data = {};
    rows.forEach(r => { data[r.setting_key] = r.setting_value; });
    res.json({ code: 0, data });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await pool.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?', [key, value, value]);
    }
    res.json({ code: 0, data: null });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

module.exports = router;
