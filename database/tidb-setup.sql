-- Fine-Arts-Pavilion TiDB Cloud 初始化脚本
-- 在 TiDB Cloud 的 SQL Editor 里执行一次即可（脚本幂等，可重复执行）
-- 执行后数据库名：art_exhibition

CREATE DATABASE IF NOT EXISTS art_exhibition DEFAULT CHARSET utf8mb4;
USE art_exhibition;

-- ===== 建表 =====

CREATE TABLE IF NOT EXISTS artists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exhibitions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  location VARCHAR(200),
  poster_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artworks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  year INT,
  artist_id INT,
  exhibition_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  FOREIGN KEY (exhibition_id) REFERENCES exhibitions(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- settings 表（原 schema.sql 缺失，但后端 settings 路由依赖它，含 ON DUPLICATE KEY UPDATE 的 upsert）
CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===== 种子数据 =====

-- 初始管理员：admin / admin123
INSERT IGNORE INTO admins (username, password_hash)
VALUES ('admin', '$2a$10$GiRO/XUU4vrjwEa1iG6AyeRdcLMmt61Bw3iVWNdkHcdsfFMDgDqkO');

INSERT IGNORE INTO artists (id, name, bio, avatar_url) VALUES
(1, '张晓刚', '中国当代艺术家，以"大家庭"系列闻名。', 'https://picsum.photos/seed/artist1/400/400'),
(2, '草间弥生', '日本前卫艺术家，以波点图案和无限镜屋著称。', 'https://picsum.photos/seed/artist2/400/400'),
(3, '徐冰', '中国观念艺术家，代表作《天书》《地书》。', 'https://picsum.photos/seed/artist3/400/400');

INSERT IGNORE INTO exhibitions (id, title, description, start_date, end_date, location, poster_url) VALUES
(1, '当代艺术春季展', '汇集国内外当代艺术家最新作品的大型展览。', '2026-06-01', '2026-08-31', '北京798艺术区', 'https://picsum.photos/seed/exhibition1/800/400'),
(2, '印象派回顾展', '回顾印象派大师的经典作品。', '2026-05-15', '2026-07-15', '上海当代艺术博物馆', 'https://picsum.photos/seed/exhibition2/800/400'),
(3, '新媒体艺术双年展', '探索科技与艺术的融合。', '2026-07-01', '2026-10-31', '深圳当代艺术馆', 'https://picsum.photos/seed/exhibition3/800/400');

INSERT IGNORE INTO artworks (id, title, description, image_url, year, artist_id, exhibition_id) VALUES
(1, '大家庭 No.1', '黑白老照片风格的油画肖像', 'https://picsum.photos/seed/artwork1/600/800', 1995, 1, 1),
(2, '红领巾', '带有时代印记的童年肖像', 'https://picsum.photos/seed/artwork2/600/800', 1998, 1, 1),
(3, '无尽波点', '标志性的波点装置艺术', 'https://picsum.photos/seed/artwork3/600/800', 2010, 2, 1),
(4, '南瓜', '著名的波点南瓜雕塑', 'https://picsum.photos/seed/artwork4/600/800', 2005, 2, 2),
(5, '天书', '无人能识的伪汉字印刷', 'https://picsum.photos/seed/artwork5/600/800', 1988, 3, 2),
(6, '背后的故事', '用光影重塑经典画作', 'https://picsum.photos/seed/artwork6/600/800', 2015, 3, 3);
