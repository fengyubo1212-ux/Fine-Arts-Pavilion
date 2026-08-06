import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';
import { getArtist, createArtist, updateArtist } from '../../api';

export default function ArtistForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', bio: '', avatar_url: '' });
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
    if (isEdit) {
      getArtist(id).then((res) => {
        if (res.code === 0) {
          const d = res.data;
          setForm({ name: d.name || '', bio: d.bio || '', avatar_url: d.avatar_url || '' });
          if (d.avatar_url) setPreview(d.avatar_url);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = isEdit ? await updateArtist(id, form) : await createArtist(form);
    if (res.code === 0) nav('/admin/artists');
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
        setForm(f => ({ ...f, avatar_url: url }));
      }
    } catch (err) { console.error('上传失败', err); }
    setUploading(false);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <h1>{isEdit ? '编辑艺术家' : '新增艺术家'}</h1>
      <form className="admin-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group"><label>姓名 *</label><input value={form.name} onChange={set('name')} required /></div>
        <div className="form-group"><label>简介</label><textarea value={form.bio} onChange={set('bio')} rows={3} /></div>
        <div className="form-group">
          <label>头像</label>
          <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: 8 }} />
          {uploading && <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>上传中...</span>}
          {preview && <img src={preview} alt="预览" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', display: 'block', marginTop: 8 }} />}
        </div>
        <input type="hidden" value={form.avatar_url} />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">保存</button>
          <button type="button" className="btn btn-cancel" onClick={() => nav('/admin/artists')}>取消</button>
        </div>
      </form>
    </div>
  );
}
