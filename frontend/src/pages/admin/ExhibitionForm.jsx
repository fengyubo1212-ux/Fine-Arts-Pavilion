import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';
import { getExhibition, createExhibition, updateExhibition } from '../../api';

export default function ExhibitionForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', start_date: '', end_date: '', location: '', poster_url: '' });
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
      getExhibition(id).then((res) => {
        if (res.code === 0) {
          const d = res.data;
          setForm({
            title: d.title || '', description: d.description || '',
            start_date: d.start_date ? d.start_date.slice(0, 10) : '',
            end_date: d.end_date ? d.end_date.slice(0, 10) : '',
            location: d.location || '', poster_url: d.poster_url || '',
          });
          if (d.poster_url) setPreview(d.poster_url);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = isEdit ? await updateExhibition(id, form) : await createExhibition(form);
    if (res.code === 0) nav('/admin/exhibitions');
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
        setForm(f => ({ ...f, poster_url: url }));
      }
    } catch (err) {
      console.error('上传失败', err);
    }
    setUploading(false);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <h1>{isEdit ? '编辑展览' : '新增展览'}</h1>
      <form className="admin-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group"><label>标题 *</label><input value={form.title} onChange={set('title')} required /></div>
        <div className="form-group"><label>描述</label><textarea value={form.description} onChange={set('description')} rows={3} /></div>
        <div className="form-group" style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><label>开始日期</label><input type="date" value={form.start_date} onChange={set('start_date')} /></div>
          <div style={{ flex: 1 }}><label>结束日期</label><input type="date" value={form.end_date} onChange={set('end_date')} /></div>
        </div>
        <div className="form-group"><label>地点</label><input value={form.location} onChange={set('location')} /></div>
        <div className="form-group">
          <label>海报图片</label>
          <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: 8 }} />
          {uploading && <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>上传中...</span>}
          {preview && <img src={preview} alt="预览" style={{ width: 200, display: 'block', marginTop: 8, borderRadius: 4 }} />}
        </div>
        <input type="hidden" value={form.poster_url} />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">保存</button>
          <button type="button" className="btn btn-cancel" onClick={() => nav('/admin/exhibitions')}>取消</button>
        </div>
      </form>
    </div>
  );
}
