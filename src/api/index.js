// 静态数据 API 层：不再请求后端，直接读 src/data/content.js 里的数据。
// 返回结构与原来后端一致：{ code: 0, data: ... }。

import {
  artists as artistData,
  exhibitions as exhibitionData,
  artworks as artworkData,
  settings as settingsData,
} from '../data/content';

const BASE = import.meta.env.BASE_URL;

// 把 /images/xxx.jpg 改写为带部署根路径的相对路径（兼容 GitHub Pages 子路径）
function img(url) {
  return url && url.startsWith('/images/') ? BASE + url.slice(1) : url;
}

function withImg(rec, fields) {
  const out = { ...rec };
  fields.forEach((f) => {
    out[f] = img(rec[f]);
  });
  return out;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

const artistById = new Map(artistData.map((a) => [a.id, a]));
const exhibitionById = new Map(exhibitionData.map((e) => [e.id, e]));

// 作品补上 artist_name / exhibition_title（原来由后端 JOIN 提供）
function decorateArtwork(a) {
  const out = withImg({ ...a }, ['image_url']);
  const ar = artistById.get(a.artist_id);
  const ex = exhibitionById.get(a.exhibition_id);
  out.artist_name = ar ? ar.name : null;
  out.exhibition_title = ex ? ex.title : null;
  return out;
}

export function getSettings() {
  return Promise.resolve({ code: 0, data: { ...settingsData } });
}

export function getExhibitions(params) {
  const { status, keyword } = params || {};
  let rows = [...exhibitionData];
  if (keyword) {
    rows = rows.filter((e) => (e.title || '').includes(keyword) || (e.description || '').includes(keyword));
  }
  const t = today();
  if (status === 'ongoing') {
    rows = rows.filter((e) => e.start_date <= t && e.end_date >= t);
  } else if (status === 'upcoming') {
    rows = rows.filter((e) => e.start_date > t);
  } else if (status === 'past') {
    rows = rows.filter((e) => e.end_date < t);
  }
  rows.sort((a, b) => (b.start_date || '').localeCompare(a.start_date || ''));
  return Promise.resolve({ code: 0, data: rows.map((e) => withImg({ ...e }, ['poster_url'])) });
}

export function getExhibition(id) {
  const rec = exhibitionData.find((e) => e.id === Number(id));
  if (!rec) return Promise.resolve({ code: 1, message: '未找到' });
  const arts = artworkData
    .filter((a) => a.exhibition_id === Number(id))
    .sort((a, b) => a.id - b.id)
    .map(decorateArtwork);
  return Promise.resolve({ code: 0, data: { ...withImg({ ...rec }, ['poster_url']), artworks: arts } });
}

export function getArtworks(params) {
  const { artist_id, exhibition_id, keyword } = params || {};
  let rows = [...artworkData];
  if (artist_id) rows = rows.filter((a) => a.artist_id === Number(artist_id));
  if (exhibition_id) rows = rows.filter((a) => a.exhibition_id === Number(exhibition_id));
  if (keyword) {
    rows = rows.filter((a) => (a.title || '').includes(keyword) || (a.description || '').includes(keyword));
  }
  rows.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return Promise.resolve({ code: 0, data: rows.map(decorateArtwork) });
}

export function getArtwork(id) {
  const rec = artworkData.find((a) => a.id === Number(id));
  if (!rec) return Promise.resolve({ code: 1, message: '未找到' });
  return Promise.resolve({ code: 0, data: decorateArtwork(rec) });
}

export function getArtists() {
  const rows = [...artistData].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return Promise.resolve({ code: 0, data: rows.map((a) => withImg({ ...a }, ['avatar_url'])) });
}

export function getArtist(id) {
  const rec = artistData.find((a) => a.id === Number(id));
  if (!rec) return Promise.resolve({ code: 1, message: '未找到' });
  return Promise.resolve({ code: 0, data: withImg({ ...rec }, ['avatar_url']) });
}
