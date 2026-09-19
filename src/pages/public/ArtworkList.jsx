import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getArtworks, getArtists, getExhibitions } from '../../api';
import useTilt3D from '../../hooks/useTilt3D';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ArtworkCard({ artwork }) {
  const { tiltRef, handlers, onClick } = useTilt3D();
  return (
    <Link to={`/artworks/${artwork.id}`} className="card" data-cursor="magnetic"
      {...handlers} onClick={onClick}>
      <div ref={tiltRef} className="card-tilt-inner" style={{
        transition: 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
      }}>
        <div className="card-img-wrap">
          <img src={artwork.image_url || './images/seed-artwork1.jpg'} alt={artwork.title} />
        </div>
        <div className="card-body">
          {artwork.year && <span className="card-tag">{artwork.year}</span>}
          <h3>{artwork.title}</h3>
          <p>{artwork.artist_name}</p>
        </div>
      </div>
    </Link>
  );
}

export default function ArtworkList() {
  const [list, setList] = useState([]);
  const [artists, setArtists] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [artistId, setArtistId] = useState('');
  const [exhibitionId, setExhibitionId] = useState('');
  const gridRef = useRef(null);

  useEffect(() => {
    getArtists().then((res) => setArtists(res.data));
    getExhibitions().then((res) => setExhibitions(res.data));
  }, []);

  useEffect(() => {
    const params = {};
    if (artistId) params.artist_id = artistId;
    if (exhibitionId) params.exhibition_id = exhibitionId;
    getArtworks(params).then((res) => setList(res.data));
  }, [artistId, exhibitionId]);

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
        <select value={artistId} onChange={(e) => setArtistId(e.target.value)}
          style={{ padding: '10px 20px', border: '1px solid #1a1a24', borderRadius: 100, background: '#111116', color: '#8a8580', fontSize: 14, outline: 'none', cursor: 'none' }}>
          <option value="">全部艺术家</option>
          {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select value={exhibitionId} onChange={(e) => setExhibitionId(e.target.value)}
          style={{ padding: '10px 20px', border: '1px solid #1a1a24', borderRadius: 100, background: '#111116', color: '#8a8580', fontSize: 14, outline: 'none', cursor: 'none' }}>
          <option value="">全部展览</option>
          {exhibitions.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>
      <div className="card-grid" ref={gridRef}>
        {list.map((w) => <ArtworkCard key={w.id} artwork={w} />)}
        {list.length === 0 && (
          <p style={{ color: '#6e6a64', textAlign: 'center', gridColumn: '1/-1', padding: 80, fontSize: 18 }}>暂无作品</p>
        )}
      </div>
    </div>
  );
}
