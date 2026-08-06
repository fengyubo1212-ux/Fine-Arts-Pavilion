const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ code: 1, message: '用户名和密码不能为空' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.json({ code: 1, message: '用户名或密码错误' });
    }
    const admin = rows[0];
    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) {
      return res.json({ code: 1, message: '用户名或密码错误' });
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET, { expiresIn: '7d' });
    res.json({ code: 0, data: { token, username: admin.username } });
  } catch (err) {
    res.status(500).json({ code: 1, message: '服务器错误' });
  }
});

module.exports = router;
