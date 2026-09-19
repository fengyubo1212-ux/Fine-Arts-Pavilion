import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';

export default function useTilt(options = {}) {
  const { maxRotate = 12, speed = 0.5, scale = 1.02 } = options;
  const ref = useRef(null);
  const bounds = useRef(null);
  const active = useRef(false);

  const onMove = useCallback((e) => {
    if (!ref.current || !bounds.current || !active.current) return;
    const { left, top, width, height } = bounds.current;
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    gsap.to(ref.current, {
      rotateY: (x - 0.5) * maxRotate * 2,
      rotateX: (y - 0.5) * -maxRotate,
      scale,
      duration: speed,
      ease: 'power2.out',
    });
  }, [maxRotate, speed, scale]);

  const onEnter = useCallback(() => {
    if (!ref.current) return;
    active.current = true;
    bounds.current = ref.current.getBoundingClientRect();
  }, []);

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    active.current = false;
    gsap.to(ref.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseenter', onEnter, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [onMove, onEnter, onLeave]);

  return ref;
}
