import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getArtist, getArtworks } from '../../api';

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
          {artwork.year && <span className="card-tag">{artwork.year}</span>}
          <h3>{artwork.title}</h3>
        </div>
      </div>
    </Link>
  );
}

export default function ArtistDetail() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const profileRef = useRef(null);
  const worksTitleRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    getArtist(id).then((res) => setArtist(res.data));
    getArtworks({ artist_id: id }).then((res) => setArtworks(res.data));
  }, [id]);

  useEffect(() => {
    if (!artist) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(profileRef.current, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, [artist]);

  useEffect(() => {
    if (artworks.length === 0) return;
    requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        gsap.fromTo(worksTitleRef.current, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: worksTitleRef.current, start: 'top bottom-=80', end: 'top center', scrub: 1 },
        });
        const cards = cardsRef.current.querySelectorAll('.card');
        gsap.fromTo(cards, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, stagger: 0.08,
          scrollTrigger: { trigger: cardsRef.current, start: 'top bottom-=80', end: 'bottom top+=80', scrub: 1 },
        });
      });
      return () => ctx.revert();
    });
  }, [artworks]);

  if (!artist) return null;

  return (
    <div className="detail">
      <div ref={profileRef} className="artist-profile">
        <img
          src={artist.avatar_url || 'https://picsum.photos/seed/avatar/400/400'}
          alt={artist.name}
        />
        <div>
          <h1>{artist.name}</h1>
          <p className="body" style={{ textIndent: 0, border: 'none', padding: '16px 0 0', fontSize: 17, maxWidth: 'none' }}>
            {artist.bio}
          </p>
        </div>
      </div>

      {artworks.length > 0 && (
        <>
          <h2 ref={worksTitleRef} style={{ marginBottom: 24, color: '#e0dcd5', fontFamily: "'Georgia','Noto Serif SC','STSong',serif", fontSize: 28, textAlign: 'center' }}>
            作品
          </h2>
          <div className="card-grid" ref={cardsRef} style={{ padding: '0 0 40px' }}>
            {artworks.map((w) => <ArtworkCard key={w.id} artwork={w} />)}
          </div>
        </>
      )}
    </div>
  );
}
