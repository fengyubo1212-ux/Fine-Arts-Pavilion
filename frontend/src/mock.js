// Mock data for static frontend (no backend API)

const exhibitions = [
  {
    id: 1,
    title: '印象派回顾展',
    description: '回顾印象派大师的经典作品。',
    start_date: '2024-03-15',
    end_date: '2024-06-30',
    location: '北京美术馆',
    poster_url: 'https://picsum.photos/seed/exhibition1/1200/600',
    status: 'ongoing'
  },
  {
    id: 2,
    title: '当代艺术邀请展',
    description: '汇聚当代最具影响力的艺术家作品。',
    start_date: '2024-04-01',
    end_date: '2024-07-15',
    location: '上海艺术中心',
    poster_url: 'https://picsum.photos/seed/exhibition2/1200/600',
    status: 'ongoing'
  },
  {
    id: 3,
    title: '水墨新语',
    description: '传统水墨与当代表达的碰撞。',
    start_date: '2024-05-10',
    end_date: '2024-08-20',
    location: '杭州画廊',
    poster_url: 'https://picsum.photos/seed/exhibition3/1200/600',
    status: 'ongoing'
  }
];

const artists = [
  { id: 1, name: '张晓明', bio: '著名油画家，擅长风景与人物创作。', avatar_url: 'https://picsum.photos/seed/artist1/200/200' },
  { id: 2, name: '李婷婷', bio: '当代装置艺术家，作品关注人与自然的关系。', avatar_url: 'https://picsum.photos/seed/artist2/200/200' },
  { id: 3, name: '王建国', bio: '水墨画家，致力于传统技法的现代转化。', avatar_url: 'https://picsum.photos/seed/artist3/200/200' },
  { id: 4, name: '陈思雨', bio: '数字艺术家，探索虚拟与现实的边界。', avatar_url: 'https://picsum.photos/seed/artist4/200/200' },
  { id: 5, name: '赵文轩', bio: '雕塑家，作品以青铜和大理石为主。', avatar_url: 'https://picsum.photos/seed/artist5/200/200' },
  { id: 6, name: '林小雪', bio: '水彩画家，专注于花卉与静物主题。', avatar_url: 'https://picsum.photos/seed/artist6/200/200' }
];

const artworks = [
  { id: 1, title: '城市余晖', image_url: 'https://picsum.photos/seed/art1/800/500', year: 2023, artist_id: 1, artist_name: '张晓明', exhibition_id: 1, description: '描绘了夕阳下城市的壮丽景象。' },
  { id: 2, title: '微光之外', image_url: 'https://picsum.photos/seed/art2/800/500', year: 2024, artist_id: 2, artist_name: '李婷婷', exhibition_id: 1, description: '探索光影与空间的关系。' },
  { id: 3, title: '山水间', image_url: 'https://picsum.photos/seed/art3/800/500', year: 2023, artist_id: 3, artist_name: '王建国', exhibition_id: 1, description: '传统山水画的现代诠释。' },
  { id: 4, title: '数字梦境', image_url: 'https://picsum.photos/seed/art4/800/500', year: 2024, artist_id: 4, artist_name: '陈思雨', exhibition_id: 1, description: '虚拟世界中的奇幻景象。' },
  { id: 5, title: '静物·花', image_url: 'https://picsum.photos/seed/art5/800/500', year: 2023, artist_id: 6, artist_name: '林小雪', exhibition_id: 2, description: '水彩花卉系列之一。' },
  { id: 6, title: '人物肖像', image_url: 'https://picsum.photos/seed/art6/800/500', year: 2024, artist_id: 1, artist_name: '张晓明', exhibition_id: 2, description: '当代人物肖像创作。' },
  { id: 7, title: '自然之声', image_url: 'https://picsum.photos/seed/art7/800/500', year: 2023, artist_id: 2, artist_name: '李婷婷', exhibition_id: 3, description: '装置艺术作品。' },
  { id: 8, title: '墨韵', image_url: 'https://picsum.photos/seed/art8/800/500', year: 2024, artist_id: 3, artist_name: '王建国', exhibition_id: 3, description: '水墨新作。' },
  { id: 9, title: '光与影', image_url: 'https://picsum.photos/seed/art9/800/500', year: 2023, artist_id: 4, artist_name: '陈思雨', exhibition_id: 2, description: '数字艺术探索。' }
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
