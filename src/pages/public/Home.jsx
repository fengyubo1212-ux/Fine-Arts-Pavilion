import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getExhibitions, getArtworks, getSettings } from '../../api';
import Carousel from '../../components/Carousel';
import ShuffleText from '../../components/ShuffleText';
import useTilt3D from '../../hooks/useTilt3D';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGE = './images/seed-artwork1.jpg';
const MAX_ITEMS = 6;

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

function TiltCard({ to, image, title, subtitle, tag }) {
  const { tiltRef, handlers, onClick } = useTilt3D();
  return (
    <Link to={to} className="card" data-cursor="magnetic"
      {...handlers} onClick={onClick}>
      <div ref={tiltRef} className="card-tilt-inner" style={{
        transition: 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
      }}>
        <div className="card-img-wrap">
          <img src={image || FALLBACK_IMAGE} alt={title} />
        </div>
        <div className="card-body">
          {tag && <span className="card-tag">{tag}</span>}
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [allExhibitions, setAllExhibitions] = useState([]);

  const heroRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroDecoRef = useRef(null);
  const overlayContentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const cardsRef = useRef(null);
  const carouselSectionRef = useRef(null);
  const moreSectionRef = useRef(null);
  const moreCardsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getSettings().catch(() => null);
      const carouselId = s?.data?.carousel_exhibition_id;
      const allExh = await getExhibitions();
      if (cancelled) return;
      setAllExhibitions(allExh.data || []);

      if (carouselId) {
        const [artworksRes] = await Promise.all([getArtworks({ exhibition_id: carouselId })]);
        if (!cancelled && artworksRes.data?.length > 0) setCarouselItems(pickRandom(artworksRes.data, MAX_ITEMS));
        const exh = allExh.data.find(e => e.id === parseInt(carouselId));
        if (exh) setFeatured(exh);
      }
      if (!cancelled && !carouselId) {
        const exhRes = await getExhibitions({ status: 'ongoing' });
        if (exhRes.data?.length > 0) setFeatured(exhRes.data[0]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!featured?.id) return;
    getArtworks({ exhibition_id: featured.id }).then(res => {
      setArtworks(pickRandom(res.data, MAX_ITEMS));
    });
  }, [featured?.id]);

  // Hero entrance + parallax
  useEffect(() => {
    if (!featured) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      gsap.set(overlayContentRef.current.children, { opacity: 0, y: 80 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });
      gsap.set(heroDecoRef.current, { scaleX: 0, opacity: 0 });

      // Decorative line extends
      tl.to(heroDecoRef.current, { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power4.inOut' }, 0.1);
      // Title and text stagger in with bigger movement
      tl.to(overlayContentRef.current.children, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power4.out' }, 0.3);
      tl.to(scrollIndicatorRef.current, { opacity: 0.6, duration: 0.6 }, 1.0);

      // Parallax
      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          y: 120, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    });
    return () => ctx.revert();
  }, [featured]);

  useEffect(() => {
    if (carouselItems.length === 0) return;
    gsap.fromTo(carouselSectionRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
  }, [carouselItems]);

  useEffect(() => {
    if (artworks.length === 0) return;
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.querySelectorAll('.card');
      gsap.fromTo(cards, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, stagger: 0.08,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top bottom-=80',
          end: 'bottom top+=80',
          scrub: 1,
        },
      });
    });
    return () => ctx.revert();
  }, [artworks]);

  /* More exhibitions animation */
  const otherExhibitions = allExhibitions.filter(e => e.id !== featured?.id).slice(0, 3);

  useEffect(() => {
    if (otherExhibitions.length === 0) return;
    const ctx = gsap.context(() => {
      const title = moreSectionRef.current?.querySelector('.reveal-text');
      const cards = moreCardsRef.current?.querySelectorAll('.card');
      if (title) {
        gsap.fromTo(title, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: title, start: 'top bottom-=100', end: 'top center', scrub: 1 },
        });
      }
      if (cards && cards.length > 0) {
        gsap.fromTo(cards, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, stagger: 0.1,
          scrollTrigger: { trigger: moreCardsRef.current, start: 'top bottom-=80', end: 'bottom top+=80', scrub: 1 },
        });
      }
    });
    return () => ctx.revert();
  }, [otherExhibitions]);

  if (!featured) return null;

  return (
    <div>
      <section className="home-hero" ref={heroRef}>
        <img ref={heroImgRef} src={featured.poster_url || FALLBACK_IMAGE} alt={featured.title} />
        <div className="scroll-indicator" ref={scrollIndicatorRef}>
          <span><ShuffleText text="SCROLL" maxScale={1.3} maxRadius={100} /></span>
          <div className="line" />
        </div>
        <div className="overlay">
          <div ref={overlayContentRef}>
            <div ref={heroDecoRef} style={{
              width: 60, height: 3, background: '#c8a870', marginBottom: 24,
              transformOrigin: 'left', borderRadius: 2,
            }} />
            <Link to={`/exhibitions/${featured.id}`}>
              <h1><ShuffleText text={featured.title} /></h1>
              <p>{featured.description?.slice(0, 150)}</p>
            </Link>
          </div>
        </div>
      </section>

      {carouselItems.length > 0 && (
        <div ref={carouselSectionRef} style={{ marginTop: -80, position: 'relative', zIndex: 5 }}>
          <Carousel items={carouselItems} interval={6000} />
        </div>
      )}

      <div className="section-divider" />
      <h2 className="section-title"><ShuffleText text="精选作品" maxScale={1.4} /></h2>

      <div className="card-grid" ref={cardsRef}>
        {artworks.map((w) => (
          <TiltCard key={w.id} to={`/artworks/${w.id}`} image={w.image_url} title={w.title} subtitle={w.artist_name && `艺术家：${w.artist_name}`} tag={w.year} />
        ))}
      </div>

      {/* More exhibitions */}
      {otherExhibitions.length > 0 && (
        <>
          <div className="section-divider" />
          <div ref={moreSectionRef}>
            <h2 className="section-title reveal-text"><ShuffleText text="更多展览" maxScale={1.4} /></h2>
          </div>
          <div className="card-grid" ref={moreCardsRef}>
            {otherExhibitions.map((e) => (
              <TiltCard key={e.id} to={`/exhibitions/${e.id}`} image={e.poster_url} title={e.title} subtitle={`${e.start_date} ~ ${e.end_date}`} tag={e.location} />
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: '40px 0 60px' }}>
            <Link to="/exhibitions" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: 16, borderRadius: 100 }}>查看全部展览 →</Link>
          </div>
        </>
      )}

      <div style={{ height: 80 }} />
    </div>
  );
}
