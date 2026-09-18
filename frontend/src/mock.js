// Mock data - 从完整版项目导出的原始数据

export const settings = {
  carousel_exhibition_id: "2",
};

export const artists = [
  { id: 1, name: "张晓刚", bio: "中国当代艺术家，以\"大家庭\"系列闻名。", avatar_url: "https://picsum.photos/seed/artist1/400/400" },
  { id: 2, name: "草间弥生", bio: "日本前卫艺术家，以波点图案和无限镜屋著称。", avatar_url: "https://picsum.photos/seed/artist2/400/400" },
  { id: 3, name: "徐冰", bio: "中国观念艺术家，代表作《天书》《地书》。", avatar_url: "https://picsum.photos/seed/artist3/400/400" },
  { id: 4, name: "fyb", bio: "摄影师，擅长捕捉自然光线的瞬间变化。", avatar_url: "https://picsum.photos/seed/artist4/400/400" },
  { id: 5, name: "刘诗喆", bio: "平安当大赚", avatar_url: "https://picsum.photos/seed/artist5/400/400" },
  { id: 6, name: "hamoii", bio: "世界安静的观察者", avatar_url: "https://picsum.photos/seed/artist6/400/400" },
];

export const exhibitions = [
  { id: 1, title: "当代艺术春季展", description: "汇集国内外当代艺术家最新作品的大型展览。", start_date: "2026-06-01", end_date: "2026-08-31", location: "北京798艺术区", poster_url: "https://picsum.photos/seed/exhibition1/800/400" },
  { id: 2, title: "印象派回顾展", description: "回顾印象派大师的经典作品。", start_date: "2026-05-15", end_date: "2026-07-15", location: "上海当代艺术博物馆", poster_url: "https://picsum.photos/seed/exhibition2/800/400" },
  { id: 3, title: "新媒体艺术双年展", description: "探索科技与艺术的融合。", start_date: "2026-07-01", end_date: "2026-10-31", location: "深圳当代艺术馆", poster_url: "https://picsum.photos/seed/exhibition3/800/400" },
  { id: 5, title: "美食", description: "囊括所有美食~", start_date: "2026-06-23", end_date: "2027-06-24", location: "#8#220", poster_url: "https://picsum.photos/seed/exhibition5/800/400" },
  { id: 6, title: "城市建筑", description: "一些奇特的城市建筑", start_date: "2026-06-24", end_date: "2027-06-24", location: "#8#220", poster_url: "https://picsum.photos/seed/exhibition6/800/400" },
];

export const artworks = [
  { id: 1, title: "大家庭 No.1", description: "黑白老照片风格的油画肖像", image_url: "https://picsum.photos/seed/artwork1/600/800", year: 1995, artist_id: 1, artist_name: "张晓刚", exhibition_id: 1 },
  { id: 2, title: "红领巾", description: "带有时代印记的童年肖像", image_url: "https://picsum.photos/seed/artwork2/600/800", year: 1998, artist_id: 1, artist_name: "张晓刚", exhibition_id: 1 },
  { id: 3, title: "无尽波点", description: "标志性的波点装置艺术", image_url: "https://picsum.photos/seed/artwork3/600/800", year: 2010, artist_id: 2, artist_name: "草间弥生", exhibition_id: 1 },
  { id: 4, title: "南瓜", description: "著名的波点南瓜雕塑", image_url: "https://picsum.photos/seed/artwork4/600/800", year: 2005, artist_id: 2, artist_name: "草间弥生", exhibition_id: 2 },
  { id: 6, title: "背后的故事", description: "用光影重塑经典画作", image_url: "https://picsum.photos/seed/artwork6/600/800", year: 2015, artist_id: 3, artist_name: "徐冰", exhibition_id: 3 },
  { id: 7, title: "暮色未央", description: "当太阳缓缓沉向地平线时，白昼并未立刻结束。它仿佛知道自己的离去无法挽留，于是将最后的光芒倾洒于天空。", image_url: "https://picsum.photos/seed/artwork7/600/800", year: 2026, artist_id: 4, artist_name: "fyb", exhibition_id: 1 },
  { id: 8, title: "花开有声", description: "在许多人的记忆里，花总是与盛大和浪漫联系在一起。然而，当镜头真正靠近一朵花时，所看到的往往并非宏大的叙事，而是生命最细腻的纹理。", image_url: "https://picsum.photos/seed/artwork8/600/800", year: 2026, artist_id: 4, artist_name: "fyb", exhibition_id: 1 },
  { id: 9, title: "虚焦之花", description: "有时，真正打动人的并不是被看清的事物，而是那些停留在视线边缘、始终无法完全触及的存在。", image_url: "https://picsum.photos/seed/artwork9/600/800", year: 2026, artist_id: 4, artist_name: "fyb", exhibition_id: 1 },
  { id: 10, title: "夏日穹顶", description: "抬头的那一刻，世界忽然变得辽阔起来。", image_url: "https://picsum.photos/seed/artwork10/600/800", year: 2026, artist_id: 4, artist_name: "fyb", exhibition_id: 1 },
  { id: 11, title: "流光之花", description: "这朵花并非盛开于花园，而是诞生于光线与凝视交汇的瞬间。", image_url: "https://picsum.photos/seed/artwork11/600/800", year: 2026, artist_id: 4, artist_name: "fyb", exhibition_id: 1 },
  { id: 12, title: "镜中黄昏", description: "有些风景之所以动人，并不因为它们本身足够壮丽，而是因为在某个恰当的时刻，与观看它的人产生了联系。", image_url: "https://picsum.photos/seed/artwork12/600/800", year: 2026, artist_id: 4, artist_name: "fyb", exhibition_id: 1 },
  { id: 13, title: "倒影之外", description: "黄昏总是一天中最富有诗意的时刻。白昼尚未完全离去，夜色也还未真正降临，天地停留在一种模糊而温柔的边界上。", image_url: "https://picsum.photos/seed/artwork13/600/800", year: 2026, artist_id: 4, artist_name: "fyb", exhibition_id: 1 },
  { id: 14, title: "静默之光", description: "黄昏并不总是壮阔的。更多时候，它只是一天缓缓收拢的姿态，是光线褪去锋芒后留给世界最后的温柔。", image_url: "https://picsum.photos/seed/artwork14/600/800", year: 2026, artist_id: 4, artist_name: "fyb", exhibition_id: 1 },
  { id: 15, title: "独行于暮色之间", description: "当白昼缓缓退场，天地被橙金色的余晖浸染，一切喧嚣似乎都被拉远了。", image_url: "https://picsum.photos/seed/artwork15/600/800", year: 2026, artist_id: 4, artist_name: "fyb", exhibition_id: 2 },
  { id: 16, title: "平凡生活的赞歌", description: "生活的大多数时刻，并不发生在宏伟的殿堂之中，也不诞生于被历史铭记的重要瞬间。", image_url: "https://picsum.photos/seed/artwork16/600/800", year: 2026, artist_id: 4, artist_name: "fyb", exhibition_id: 1 },
  { id: 17, title: "月色低语", description: "夜晚并不总是寂静的。云层在高空缓慢流动，月光穿过缝隙，将银白色的光辉洒向大地。", image_url: "https://picsum.photos/seed/artwork17/600/800", year: 2025, artist_id: 5, artist_name: "刘诗喆", exhibition_id: 2 },
  { id: 18, title: "向光而行", description: "峡谷深处，岩壁高耸，四周被阴影包围。光从高处倾泻而下，像一道无声的召唤。", image_url: "https://picsum.photos/seed/artwork18/600/800", year: 2025, artist_id: 5, artist_name: "刘诗喆", exhibition_id: 1 },
  { id: 19, title: "城市余晖", description: "每一座城市都有属于自己的黄昏。当白昼渐渐退场，忙碌的街道尚未完全沉入夜色。", image_url: "https://picsum.photos/seed/artwork19/600/800", year: 2025, artist_id: 5, artist_name: "刘诗喆", exhibition_id: 2 },
  { id: 20, title: "人间烟火", description: "一口沸腾的红汤，承载的不仅是味觉的刺激，更是一种关于相聚的记忆。", image_url: "https://picsum.photos/seed/artwork20/600/800", year: 2025, artist_id: 5, artist_name: "刘诗喆", exhibition_id: 5 },
  { id: 21, title: "城市黄昏的缝隙", description: "摄影并不总是在追逐壮阔的风景。更多时候，它是在平凡生活的缝隙里，等待一束恰好经过的光。", image_url: "https://picsum.photos/seed/artwork21/600/800", year: 2025, artist_id: 5, artist_name: "刘诗喆", exhibition_id: 2 },
  { id: 22, title: "山城不夜", description: "有些城市的夜晚属于灯光，有些城市的夜晚属于故事。", image_url: "https://picsum.photos/seed/artwork22/600/800", year: 2025, artist_id: 5, artist_name: "刘诗喆", exhibition_id: 6 },
  { id: 23, title: "晚霞经过城市的时候", description: "并非每一次日落都会被记住。", image_url: "https://picsum.photos/seed/artwork23/600/800", year: 2026, artist_id: 5, artist_name: "刘诗喆", exhibition_id: 2 },
  { id: 24, title: "破晓之前", description: "人们总习惯歌颂日出的壮丽，却很少记得等待日出的过程。", image_url: "https://picsum.photos/seed/artwork24/600/800", year: 2025, artist_id: 5, artist_name: "刘诗喆", exhibition_id: 2 },
  { id: 25, title: "云层之下，灯火之上", description: "当黄昏缓慢沉入地平线，天空并未立刻归于黑暗。", image_url: "https://picsum.photos/seed/artwork25/600/800", year: 2025, artist_id: 6, artist_name: "hamoii", exhibition_id: 2 },
  { id: 26, title: "微光之外", description: "夜色降临之后，人们总习惯将目光投向灯火辉煌的地方。", image_url: "https://picsum.photos/seed/artwork26/600/800", year: 2024, artist_id: 6, artist_name: "hamoii", exhibition_id: 2 },
  { id: 27, title: "玫瑰在午后", description: "花朵常被赋予爱情的寓意，而玫瑰尤甚。", image_url: "https://picsum.photos/seed/artwork27/600/800", year: 2023, artist_id: 6, artist_name: "hamoii", exhibition_id: 1 },
  { id: 28, title: "春夜未央", description: "有些花适合在白昼观看。", image_url: "https://picsum.photos/seed/artwork28/600/800", year: 2024, artist_id: 6, artist_name: "hamoii", exhibition_id: 1 },
];

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
