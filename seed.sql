USE art_exhibition;

INSERT INTO artists (name, bio, avatar_url) VALUES
('张晓刚', '中国当代艺术家，以"大家庭"系列闻名。', 'https://picsum.photos/seed/artist1/400/400'),
('草间弥生', '日本前卫艺术家，以波点图案和无限镜屋著称。', 'https://picsum.photos/seed/artist2/400/400'),
('徐冰', '中国观念艺术家，代表作《天书》《地书》。', 'https://picsum.photos/seed/artist3/400/400');

INSERT INTO exhibitions (title, description, start_date, end_date, location, poster_url) VALUES
('当代艺术春季展', '汇集国内外当代艺术家最新作品的大型展览。', '2026-06-01', '2026-08-31', '北京798艺术区', 'https://picsum.photos/seed/exhibition1/800/400'),
('印象派回顾展', '回顾印象派大师的经典作品。', '2026-05-15', '2026-07-15', '上海当代艺术博物馆', 'https://picsum.photos/seed/exhibition2/800/400'),
('新媒体艺术双年展', '探索科技与艺术的融合。', '2026-07-01', '2026-10-31', '深圳当代艺术馆', 'https://picsum.photos/seed/exhibition3/800/400');

INSERT INTO artworks (title, description, image_url, year, artist_id, exhibition_id) VALUES
('大家庭 No.1', '黑白老照片风格的油画肖像', 'https://picsum.photos/seed/artwork1/600/800', 1995, 1, 1),
('红领巾', '带有时代印记的童年肖像', 'https://picsum.photos/seed/artwork2/600/800', 1998, 1, 1),
('无尽波点', '标志性的波点装置艺术', 'https://picsum.photos/seed/artwork3/600/800', 2010, 2, 1),
('南瓜', '著名的波点南瓜雕塑', 'https://picsum.photos/seed/artwork4/600/800', 2005, 2, 2),
('天书', '无人能识的伪汉字印刷', 'https://picsum.photos/seed/artwork5/600/800', 1988, 3, 2),
('背后的故事', '用光影重塑经典画作', 'https://picsum.photos/seed/artwork6/600/800', 2015, 3, 3);
