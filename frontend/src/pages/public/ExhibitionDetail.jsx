import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getExhibition } from '../../api';
import Lightbox from '../../components/Lightbox';
import ParallaxHero from '../../components/ParallaxHero';

gsap.registerPlugin(ScrollTrigger);

function ArtworkCard({ artwork }) {
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
    <Link to={`/artworks/${artwork.id}`} className="card" data-cursor="magnetic"
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className="card-tilt-inner" style={{
        transition: 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
      }}>
        <div className="card-img-wrap">
          <img src={artwork.image_url || 'https://picsum.photos/seed/artwork/800/500'} alt={artwork.title} />
        </div>
        <div className="card-body">
          <h3>{artwork.title}</h3>
          <p>{artwork.artist_name}</p>
        </div>
      </div>
    </Link>
  );
}

export default function ExhibitionDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [lightbox, setLightbox] = useState(false);
  const titleRef = useRef(null);
  const metaRef = useRef(null);
  const bodyRef = useRef(null);
  const sectionTitleRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    getExhibition(id).then((res) => setData(res.data));
  }, [id]);

  useEffect(() => {
    if (!data) return;
    const ctx = gsap.context(() => {
      const els = [titleRef.current, metaRef.current, bodyRef.current].filter(Boolean);
      gsap.set(els, { opacity: 0, y: 60 });
      gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, [data]);

  useEffect(() => {
    if (!data?.artworks?.length) return;
    requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        gsap.fromTo(sectionTitleRef.current, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: sectionTitleRef.current, start: 'top bottom-=80', end: 'top center', scrub: 1 },
        });
        const cards = cardsRef.current.querySelectorAll('.card');
        gsap.fromTo(cards, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, stagger: 0.08,
          scrollTrigger: { trigger: cardsRef.current, start: 'top bottom-=80', end: 'bottom top+=80', scrub: 1 },
        });
      });
      return () => ctx.revert();
    });
  }, [data]);

  if (!data) return null;

  return (
    <>
    <div className="detail" style={{ paddingTop: 0 }}>
      {data.poster_url && (
        <div onClick={() => setLightbox(true)} style={{ cursor: 'pointer' }}>
          <ParallaxHero
            image={data.poster_url}
            title={data.title}
            subtitle={data.description?.slice(0, 120)}
            meta={<>{data.start_date} ~ {data.end_date} · {data.location}</>}
          />
        </div>
      )}
      <h1 ref={titleRef} style={{ marginTop: 40 }}>{data.title}</h1>
      <div className="meta" ref={metaRef}>
        <span>{data.start_date} ~ {data.end_date}</span>
        <span>{data.location}</span>
      </div>
      <p className="body" ref={bodyRef}>{data.description}</p>

      {data.artworks?.length > 0 && (
        <>
          <h2 ref={sectionTitleRef} style={{ marginTop: 60, marginBottom: 24, color: '#e0dcd5', fontFamily: "'Georgia','Noto Serif SC','STSong',serif", fontSize: 30, textAlign: 'center' }}>
            参展作品
          </h2>
          <div className="card-grid" ref={cardsRef} style={{ padding: '0 0 40px' }}>
            {data.artworks.map((w) => <ArtworkCard key={w.id} artwork={w} />)}
          </div>
        </>
      )}
    </div>
      {lightbox && (
        <Lightbox src={data.poster_url} alt={data.title} onClose={() => setLightbox(false)} />
      )}
    </>
  );
}
