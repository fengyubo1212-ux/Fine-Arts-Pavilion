import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';
import { getArtwork, createArtwork, updateArtwork, getArtists, getExhibitions } from '../../api';

export default function ArtworkForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', image_url: '', year: '', artist_id: '', exhibition_id: '' });
  const [artists, setArtists] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(formRef.current, { opacity: 0, y: 20 });
      gsap.to(formRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    getArtists().then((res) => setArtists(res.data));
    getExhibitions().then((res) => setExhibitions(res.data));
    if (isEdit) {
      getArtwork(id).then((res) => {
        if (res.code === 0) {
          const d = res.data;
          setForm({
            title: d.title || '', description: d.description || '',
            image_url: d.image_url || '', year: d.year || '',
            artist_id: d.artist_id || '', exhibition_id: d.exhibition_id || '',
          });
          if (d.image_url) setPreview(d.image_url);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, year: form.year ? parseInt(form.year) : null, artist_id: form.artist_id ? parseInt(form.artist_id) : null, exhibition_id: form.exhibition_id ? parseInt(form.exhibition_id) : null };
    const res = isEdit ? await updateArtwork(id, data) : await createArtwork(data);
    if (res.code === 0) nav('/admin/artworks');
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await axios.post('/api/upload', fd);
      if (res.data.code === 0) {
        const url = res.data.data.url;
        setPreview(url);
        setForm(f => ({ ...f, image_url: url }));
      }
    } catch (err) { console.error('上传失败', err); }
    setUploading(false);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <h1>{isEdit ? '编辑艺术品' : '新增艺术品'}</h1>
      <form className="admin-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group"><label>标题 *</label><input value={form.title} onChange={set('title')} required /></div>
        <div className="form-group"><label>描述</label><textarea value={form.description} onChange={set('description')} rows={3} /></div>
        <div className="form-group">
          <label>图片</label>
          <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: 8 }} />
          {uploading && <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>上传中...</span>}
          {preview && <img src={preview} alt="预览" style={{ width: 200, display: 'block', marginTop: 8, borderRadius: 4 }} />}
        </div>
        <input type="hidden" value={form.image_url} />
        <div className="form-group"><label>创作年份</label><input type="number" value={form.year} onChange={set('year')} /></div>
        <div className="form-group"><label>艺术家</label><select value={form.artist_id} onChange={set('artist_id')}><option value="">-- 选择 --</option>{artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
        <div className="form-group"><label>所属展览</label><select value={form.exhibition_id} onChange={set('exhibition_id')}><option value="">-- 选择 --</option>{exhibitions.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</select></div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">保存</button>
          <button type="button" className="btn btn-cancel" onClick={() => nav('/admin/artworks')}>取消</button>
        </div>
      </form>
    </div>
  );
}
