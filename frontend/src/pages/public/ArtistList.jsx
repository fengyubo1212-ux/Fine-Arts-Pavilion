import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getArtists } from '../../api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ArtistCard({ artist }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ref.current.style.transform = `perspective(600px) rotateY(${(x - 0.5) * 35}deg) rotateX(${(y - 0.5) * -25}deg) scale3d(1.04,1.04,1.04) translateZ(20px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1) translateZ(0)';
  }, []);
  return (
    <Link to={`/artists/${artist.id}`} className="card" data-cursor="magnetic"
      onMouseMove={onMove} onMouseLeave={onLeave} style={{ textAlign: 'center' }}>
      <div ref={ref} className="card-tilt-inner" style={{
        transition: 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
      }}>
        <div style={{ padding: '32px 24px 0' }}>
          <img src={artist.avatar_url || 'https://picsum.photos/seed/artist/400/400'}
            style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto', objectFit: 'cover', border: '3px solid #1e1e28' }}
            alt={artist.name} />
        </div>
        <div className="card-body">
          <h3>{artist.name}</h3>
          <p>{artist.bio?.slice(0, 80)}</p>
        </div>
      </div>
    </Link>
  );
}

export default function ArtistList() {
  const [list, setList] = useState([]);
  const gridRef = useRef(null);

  useEffect(() => {
    getArtists().then((res) => setList(res.data));
  }, []);

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
    <div className="card-grid" ref={gridRef} style={{ padding: 60 }}>
      {list.map((a) => <ArtistCard key={a.id} artist={a} />)}
      {list.length === 0 && (
        <p style={{ color: '#6e6a64', textAlign: 'center', gridColumn: '1/-1', padding: 80, fontSize: 18 }}>暂无艺术家</p>
      )}
    </div>
  );
}
