import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';
import { getArtworks, deleteArtwork, getArtists, getExhibitions } from '../../api';

export default function ArtworkList() {
  const [list, setList] = useState([]);
  const [artistId, setArtistId] = useState('');
  const [exhibitionId, setExhibitionId] = useState('');
  const [artists, setArtists] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const nav = useNavigate();
  const tbodyRef = useRef(null);

  useEffect(() => {
    if (list.length === 0) return;
    const ctx = gsap.context(() => {
      const rows = tbodyRef.current.querySelectorAll('tr');
      gsap.set(rows, { opacity: 0, x: -20 });
      gsap.to(rows, { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, [list]);

  const fetch = () => {
    const params = {};
    if (artistId) params.artist_id = artistId;
    if (exhibitionId) params.exhibition_id = exhibitionId;
    getArtworks(params).then((res) => setList(res.data));
  };

  useEffect(() => {
    getArtists().then((res) => setArtists(res.data));
    getExhibitions().then((res) => setExhibitions(res.data));
  }, []);

  useEffect(() => { fetch(); }, [artistId, exhibitionId]);

  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return;
    await deleteArtwork(id);
    fetch();
  };

  const handleExhibitionChange = async (artworkId, newExhibitionId) => {
    const token = localStorage.getItem('token');
    await axios.patch(`/api/artworks/${artworkId}/exhibition`,
      { exhibition_id: newExhibitionId ? parseInt(newExhibitionId) : null },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetch();
  };

  return (
    <div>
      <h1>艺术品管理</h1>
      <div className="toolbar">
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={artistId} onChange={(e) => setArtistId(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }}>
            <option value="">全部艺术家</option>
            {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select value={exhibitionId} onChange={(e) => setExhibitionId(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }}>
            <option value="">全部展览</option>
            {exhibitions.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <Link to="/admin/artworks/new" className="btn btn-primary">新增艺术品</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>图片</th><th>标题</th><th>艺术家</th><th>所属展览</th><th>年份</th><th>操作</th></tr>
        </thead>
        <tbody ref={tbodyRef}>
          {list.map((w) => (
            <tr key={w.id}>
              <td>{w.image_url ? <img src={w.image_url} width="60" style={{ borderRadius: 4, objectFit: 'cover', height: 45 }} /> : '-'}</td>
              <td>{w.title}</td>
              <td>{w.artist_name || '-'}</td>
              <td>
                <select
                  value={w.exhibition_id || ''}
                  onChange={(e) => handleExhibitionChange(w.id, e.target.value)}
                  style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }}
                >
                  <option value="">-- 无 --</option>
                  {exhibitions.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </td>
              <td>{w.year || '-'}</td>
              <td>
                <button className="btn btn-primary" style={{ marginRight: 8, padding: '6px 14px', fontSize: 12 }}
                  onClick={() => nav(`/admin/artworks/${w.id}/edit`)}>编辑</button>
                <button className="btn btn-danger" style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={() => handleDelete(w.id)}>删除</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>暂无数据</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
