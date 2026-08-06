const jwt = require('jsonwebtoken');
const SECRET = 'art_exhibition_jwt_secret_2026';

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ code: 1, message: '未登录' });
  }
  try {
    req.user = jwt.verify(header.slice(7), SECRET);
    next();
  } catch {
    res.status(401).json({ code: 1, message: 'token 无效' });
  }
}

module.exports = { auth, SECRET };
