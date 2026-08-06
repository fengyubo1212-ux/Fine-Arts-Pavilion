import axios from 'axios';

// 生产环境由 .env.production 提供 Render 后端地址，开发环境回退 /api（走 vite proxy）
const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// 覆盖 admin 表单/列表里的裸 axios 调用（如 /api/upload、PATCH /api/artworks/...）
axios.defaults.baseURL = BASE;

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);

export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const getArtists = (params) => api.get('/artists', { params });
export const getArtist = (id) => api.get(`/artists/${id}`);
export const createArtist = (data) => api.post('/artists', data);
export const updateArtist = (id, data) => api.put(`/artists/${id}`, data);
export const deleteArtist = (id) => api.delete(`/artists/${id}`);

export const getExhibitions = (params) => api.get('/exhibitions', { params });
export const getExhibition = (id) => api.get(`/exhibitions/${id}`);
export const createExhibition = (data) => api.post('/exhibitions', data);
export const updateExhibition = (id, data) => api.put(`/exhibitions/${id}`, data);
export const deleteExhibition = (id) => api.delete(`/exhibitions/${id}`);

export const getArtworks = (params) => api.get('/artworks', { params });
export const getArtwork = (id) => api.get(`/artworks/${id}`);
export const createArtwork = (data) => api.post('/artworks', data);
export const updateArtwork = (id, data) => api.put(`/artworks/${id}`, data);
export const deleteArtwork = (id) => api.delete(`/artworks/${id}`);

export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);
