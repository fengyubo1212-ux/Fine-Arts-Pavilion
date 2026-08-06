import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onDone }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const viewSize = Math.max(window.innerWidth, window.innerHeight);
    const maxRadius = viewSize * 1.5;

    // Tweenable object for the hole radius
    const maskObj = { radius: 30 };

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        if (onDone) onDone();
      }
    });

    // Logo entrance
    tl.set(logo, { scale: 0, rotate: -30, opacity: 0 });
    tl.to(logo, { scale: 1, rotate: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' });

    // Rotate in place
    tl.to(logo, { rotate: 90, duration: 0.5, ease: 'none' });

    // Initial mask: center hole (transparent) allows website to show
    const setMask = (r) => {
      const val = `radial-gradient(circle ${r}px at 50% 50%, transparent ${r}px, black ${r}px)`;
      overlay.style.webkitMaskImage = val;
      overlay.style.maskImage = val;
    };
    setMask(30);

    // Expand hole + logo together
    tl.to(maskObj, {
      radius: maxRadius,
      duration: 1.2,
      ease: 'power3.in',
      onUpdate: () => setMask(maskObj.radius),
    }, '-=0');

    tl.to(logo, {
      scale: maxRadius / 30,
      rotate: 360 + 90,
      duration: 1.2,
      ease: 'power3.in',
    }, '-=1.2');

    return () => tl.kill();
  }, [onDone]);

  if (done) return null;

  return (
    <>
      {/* Mask overlay — black fills the OPPOSITE of the hole */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 10002,
          backgroundColor: '#08080a',
        }}
      />
      {/* Logo on top of hole */}
      <div ref={logoRef} style={{
        position: 'fixed',
        top: '50%', left: '50%',
        width: 60, height: 60,
        marginLeft: -30, marginTop: -30,
        zIndex: 10003,
      }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          <polygon points="30,4 52.5,43 7.5,43"
            fill="none" stroke="#c8a870" strokeWidth="1.5" opacity="0.8" />
          <polygon points="30,56 52.5,17 7.5,17"
            fill="none" stroke="#c8a870" strokeWidth="1.5" opacity="0.5" />
        </svg>
      </div>
    </>
  );
}
