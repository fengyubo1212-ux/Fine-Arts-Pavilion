import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getExhibitions } from '../../api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ExhibitionCard({ exhibition }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ref.current.style.transform = `perspective(600px) rotateY(${(x - 0.5) * 35}deg) rotateX(${(y - 0.5) * -25}deg) scale3d(1.04,1.04,1.04) translateZ(20px)`;
  }, []);
  const onLeave = useCallback((e) => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1) translateZ(0)';
  }, []);
  return (
    <Link to={`/exhibitions/${exhibition.id}`} className="card" data-cursor="magnetic"
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className="card-tilt-inner" style={{
        transition: 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
      }}>
        <div className="card-img-wrap">
          <img src={exhibition.poster_url || 'https://picsum.photos/seed/exhibition/800/500'} alt={exhibition.title} />
        </div>
        <div className="card-body">
          <span className="card-tag">{exhibition.location}</span>
          <h3>{exhibition.title}</h3>
          <p>{exhibition.start_date} ~ {exhibition.end_date}</p>
        </div>
      </div>
    </Link>
  );
}

export default function ExhibitionList() {
  const [list, setList] = useState([]);
  const [status, setStatus] = useState('');
  const gridRef = useRef(null);

  useEffect(() => {
    getExhibitions({ status: status || undefined }).then((res) => setList(res.data));
  }, [status]);

  useEffect(() => {
    if (list.length === 0) return;
    requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        const cards = gridRef.current.querySelectorAll('.card');
        gsap.fromTo(cards, { opacity: 0, y: 60 }, {
          opacity: 1, y: 0, stagger: 0.08,
          scrollTrigger: { trigger: gridRef.current, start: 'top bottom-=80', end: 'bottom top+=80', scrub: 1 },
        });
      });
      return () => ctx.revert();
    });
  }, [list]);

  return (
    <div>
      <div className="filter-bar">
        {['', 'ongoing', 'upcoming', 'past'].map((s) => (
          <button key={s} className={status === s ? 'active' : ''} onClick={() => setStatus(s)} style={{ cursor: 'none' }}>
            {s === '' ? '全部' : s === 'ongoing' ? '进行中' : s === 'upcoming' ? '即将开始' : '已结束'}
          </button>
        ))}
      </div>
      <div className="card-grid" ref={gridRef}>
        {list.map((e) => <ExhibitionCard key={e.id} exhibition={e} />)}
        {list.length === 0 && (
          <p style={{ color: '#6e6a64', textAlign: 'center', gridColumn: '1/-1', padding: 80, fontSize: 18 }}>暂无展览</p>
        )}
      </div>
    </div>
  );
}
