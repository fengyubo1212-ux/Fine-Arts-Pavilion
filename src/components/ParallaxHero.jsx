import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxHero({ image, title, subtitle, meta }) {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const contentRef = useRef(null);
  const decoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      gsap.set(decoRef.current, { scaleX: 0 });
      gsap.set(contentRef.current.children, { opacity: 0, y: 70 });
      tl.to(decoRef.current, { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power4.inOut' })
        .to(contentRef.current.children, { opacity: 1, y: 0, duration: 1, stagger: 0.15 }, 0.3);

      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: 20, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="home-hero" ref={sectionRef}>
      <img ref={imgRef} src={image} alt={title} />
      <div className="overlay">
        <div ref={contentRef}>
          <div ref={decoRef} style={{
            width: 60, height: 3, background: '#c8a870', marginBottom: 24,
            transformOrigin: 'left', borderRadius: 2,
          }} />
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
          {meta && (
            <div className="hero-meta" style={{ marginTop: 16, fontSize: 15, letterSpacing: '0.08em', color: '#e0dcd5', opacity: 0.75 }}>
              {meta}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
