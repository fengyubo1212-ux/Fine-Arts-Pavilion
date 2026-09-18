// Mock data from seed.sql - 原始数据

const artists = [
  { id: 1, name: '张晓刚', bio: '中国当代艺术家，以"大家庭"系列闻名。', avatar_url: 'https://picsum.photos/seed/artist1/400/400' },
  { id: 2, name: '草间弥生', bio: '日本前卫艺术家，以波点图案和无限镜屋著称。', avatar_url: 'https://picsum.photos/seed/artist2/400/400' },
  { id: 3, name: '徐冰', bio: '中国观念艺术家，代表作《天书》《地书》。', avatar_url: 'https://picsum.photos/seed/artist3/400/400' }
];

const exhibitions = [
  { id: 1, title: '当代艺术春季展', description: '汇集国内外当代艺术家最新作品的大型展览。', start_date: '2026-06-01', end_date: '2026-08-31', location: '北京798艺术区', poster_url: 'https://picsum.photos/seed/exhibition1/800/400', status: 'ongoing' },
  { id: 2, title: '印象派回顾展', description: '回顾印象派大师的经典作品。', start_date: '2026-05-15', end_date: '2026-07-15', location: '上海当代艺术博物馆', poster_url: 'https://picsum.photos/seed/exhibition2/800/400', status: 'ongoing' },
  { id: 3, title: '新媒体艺术双年展', description: '探索科技与艺术的融合。', start_date: '2026-07-01', end_date: '2026-10-31', location: '深圳当代艺术馆', poster_url: 'https://picsum.photos/seed/exhibition3/800/400', status: 'ongoing' }
];

const artworks = [
  { id: 1, title: '大家庭 No.1', description: '黑白老照片风格的油画肖像', image_url: 'https://picsum.photos/seed/artwork1/600/800', year: 1995, artist_id: 1, artist_name: '张晓刚', exhibition_id: 1 },
  { id: 2, title: '红领巾', description: '带有时代印记的童年肖像', image_url: 'https://picsum.photos/seed/artwork2/600/800', year: 1998, artist_id: 1, artist_name: '张晓刚', exhibition_id: 1 },
  { id: 3, title: '无尽波点', description: '标志性的波点装置艺术', image_url: 'https://picsum.photos/seed/artwork3/600/800', year: 2010, artist_id: 2, artist_name: '草间弥生', exhibition_id: 1 },
  { id: 4, title: '南瓜', description: '著名的波点南瓜雕塑', image_url: 'https://picsum.photos/seed/artwork4/600/800', year: 2005, artist_id: 2, artist_name: '草间弥生', exhibition_id: 2 },
  { id: 5, title: '天书', description: '无人能识的伪汉字印刷', image_url: 'https://picsum.photos/seed/artwork5/600/800', year: 1988, artist_id: 3, artist_name: '徐冰', exhibition_id: 2 },
  { id: 6, title: '背后的故事', description: '用光影重塑经典画作', image_url: 'https://picsum.photos/seed/artwork6/600/800', year: 2015, artist_id: 3, artist_name: '徐冰', exhibition_id: 3 }
];

const settings = { carousel_exhibition_id: 1 };

// Simulate API responses
function delay(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getExhibitions(params) {
  await delay();
  let result = [...exhibitions];
  if (params?.status) {
    result = result.filter(e => e.status === params.status);
  }
  return { data: result };
}

export async function getExhibition(id) {
  await delay();
  const exh = exhibitions.find(e => e.id === parseInt(id));
  return { data: exh ? { ...exh, artworks: artworks.filter(a => a.exhibition_id === exh.id) } : null };
}

export async function getArtworks(params) {
  await delay();
  let result = [...artworks];
  if (params?.exhibition_id) {
    result = result.filter(a => a.exhibition_id === parseInt(params.exhibition_id));
  }
  if (params?.artist_id) {
    result = result.filter(a => a.artist_id === parseInt(params.artist_id));
  }
  return { data: result };
}

export async function getArtwork(id) {
  await delay();
  const art = artworks.find(a => a.id === parseInt(id));
  return { data: art || null };
}

export async function getArtists() {
  await delay();
  return { data: artists };
}

export async function getArtist(id) {
  await delay();
  const artist = artists.find(a => a.id === parseInt(id));
  return { data: artist || null };
}

export async function getSettings() {
  await delay();
  return { data: settings };
}

export async function login(username, password) {
  await delay();
  if (username === 'admin' && password === 'admin123') {
    return { data: { token: 'mock-token' } };
  }
  throw new Error('用户名或密码错误');
}
