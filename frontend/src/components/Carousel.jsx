import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const FALLBACK = 'https://picsum.photos/seed/carousel/1200/500';

export default function Carousel({ items = [], interval = 5000 }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const slideRef = useRef(null);

  useEffect(() => {
    if (items.length <= 1) return;
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % items.length), interval);
    return () => clearInterval(timerRef.current);
  }, [items.length, interval]);

  useEffect(() => {
    if (!slideRef.current) return;
    gsap.fromTo(slideRef.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' });
  }, [current]);

  if (!items.length) return null;

  const item = items[current];

  return (
    <div className="carousel">
      <Link to={`/artworks/${item.id}`} style={{ display: 'block' }}>
        <div className="carousel-slide" ref={slideRef}>
          <img src={item.image_url || FALLBACK} alt={item.title} />
          <div className="carousel-overlay">
            <h2>{item.title}</h2>
            {item.artist_name && <p>艺术家：{item.artist_name}</p>}
          </div>
        </div>
      </Link>
      {items.length > 1 && (
        <>
          <button className="carousel-nav prev" onClick={(e) => {
            e.preventDefault();
            setCurrent(c => (c - 1 + items.length) % items.length);
          }}>‹</button>
          <button className="carousel-nav next" onClick={(e) => {
            e.preventDefault();
            setCurrent(c => (c + 1) % items.length);
          }}>›</button>
          <div className="carousel-dots">
            {items.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
