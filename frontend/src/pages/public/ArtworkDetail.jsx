import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { getArtwork } from '../../api';
import Lightbox from '../../components/Lightbox';

export default function ArtworkDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [lightbox, setLightbox] = useState(false);
  const bannerRef = useRef(null);
  const titleRef = useRef(null);
  const metaRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    getArtwork(id).then((res) => setData(res.data));
  }, [id]);

  useEffect(() => {
    if (!data) return;
    const ctx = gsap.context(() => {
      const els = [bannerRef.current, titleRef.current, metaRef.current, bodyRef.current].filter(Boolean);
      gsap.set(els, { opacity: 0, y: 50 });
      gsap.to(els, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, [data]);

  if (!data) return null;

  return (
    <>
      <div className="detail">
        {data.image_url && (
          <img className="banner" ref={bannerRef} src={data.image_url} alt={data.title}
            onClick={() => setLightbox(true)}
            style={{ cursor: 'pointer' }}
          />
        )}
        <h1 ref={titleRef}>{data.title}</h1>
        <div className="meta" ref={metaRef}>
          {data.artist_name && (
            <span>
              艺术家：
              <Link to={`/artists/${data.artist_id}`}>{data.artist_name}</Link>
            </span>
          )}
          {data.year && <span>创作年份：{data.year}</span>}
          {data.exhibition_title && (
            <span>
              所属展览：
              <Link to={`/exhibitions/${data.exhibition_id}`}>{data.exhibition_title}</Link>
            </span>
          )}
        </div>
        <p className="body" ref={bodyRef}>{data.description}</p>
      </div>
      {lightbox && (
        <Lightbox src={data.image_url} alt={data.title} onClose={() => setLightbox(false)} />
      )}
    </>
  );
}
