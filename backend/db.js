const mysql = require('mysql2/promise');

if (!process.env.DB_HOST) {
  throw new Error('缺少 DB_HOST 环境变量（请在 Render 环境变量中配置数据库连接）');
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // TiDB Cloud 强制 TLS 连接
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
  dateStrings: true,
});

module.exports = pool;
