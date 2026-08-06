import { useEffect, useState, useRef } from 'react';
import { getExhibitions, getArtworks, getArtists, getSettings, updateSettings } from '../../api';
import gsap from 'gsap';

const STAT_LABELS = ['展览总数', '艺术品总数', '艺术家总数'];

export default function Dashboard() {
  const [stats, setStats] = useState([0, 0, 0]);
  const [exhibitions, setExhibitions] = useState([]);
  const [carouselId, setCarouselId] = useState('');
  const [saving, setSaving] = useState(false);
  const cardsRef = useRef(null);
  const numRefs = useRef([]);

  useEffect(() => {
    Promise.all([getExhibitions(), getArtworks(), getArtists(), getSettings()]).then(
      ([e, w, a, s]) => {
        setStats([e.data.length, w.data.length, a.data.length]);
        setExhibitions(e.data);
        setCarouselId(s.data?.carousel_exhibition_id || '');
      }
    );
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current.querySelectorAll('.stat-card'), {
        y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!numRefs.current[0]) return;
    const ctx = gsap.context(() => {
      numRefs.current.forEach((el, i) => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stats[i], duration: 1.2, delay: 0.4, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val); },
        });
      });
    });
    return () => ctx.revert();
  }, [stats]);

  const handleSaveCarousel = async () => {
    setSaving(true);
    await updateSettings({ carousel_exhibition_id: carouselId });
    setSaving(false);
  };

  return (
    <div>
      <h1>仪表盘</h1>
      <div className="stats" ref={cardsRef}>
        {STAT_LABELS.map((label, i) => (
          <div className="stat-card" key={label}>
            <div className="num" ref={el => { numRefs.current[i] = el; }}>{stats[i]}</div>
            <div className="label">{label}</div>
          </div>
        ))}
      </div>

      <div className="admin-form" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>首页轮播设置</h2>
        <div className="form-group">
          <label>选择轮播展览</label>
          <select value={carouselId} onChange={e => setCarouselId(e.target.value)}>
            <option value="">-- 不显示轮播 --</option>
            {exhibitions.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSaveCarousel} disabled={saving}>
          {saving ? '保存中...' : '保存轮播设置'}
        </button>
      </div>
    </div>
  );
}
