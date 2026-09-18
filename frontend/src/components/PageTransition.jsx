import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const wrapperRef = useRef(null);
  const overlayRef = useRef(null);
  const prevPath = useRef(location.pathname);
  const animating = useRef(false);

  useEffect(() => {
    if (location.pathname === prevPath.current || animating.current) {
      prevPath.current = location.pathname;
      setDisplayChildren(children);
      return;
    }

    animating.current = true;
    prevPath.current = location.pathname;

    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;

    // Phase 1: old page slides out in 3D
    const tl = gsap.timeline({
      onComplete: () => {
        setDisplayChildren(children);
        // Phase 2: new page slides in from opposite side
        gsap.set(wrapper, { rotateY: 30, rotateX: 5, opacity: 0, z: -100 });
        gsap.to(wrapper, {
          rotateY: 0, rotateX: 0, opacity: 1, z: 0,
          duration: 0.8, ease: 'power3.out',
          onComplete: () => { animating.current = false; }
        });
      }
    });

    // Overlay flash
    tl.set(overlay, { opacity: 0, backgroundColor: '#08080a' });
    tl.to(wrapper, { rotateY: -25, rotateX: 3, opacity: 0, z: -80, duration: 0.35, ease: 'power3.in' });
    tl.to(overlay, { opacity: 1, duration: 0.1, ease: 'power2.inOut' }, 0.2);

    return () => { tl.kill(); };
  }, [location.pathname]);

  return (
    <>
      {/* Brief blackout overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none',
          opacity: 0,
        }}
      />
      <div
        ref={wrapperRef}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1200px',
          minHeight: '100vh',
        }}
      >
        {displayChildren}
      </div>
    </>
  );
}
