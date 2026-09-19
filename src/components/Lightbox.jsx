import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

export default function Lightbox({ src, alt = '', onClose }) {
  const overlayRef = useRef(null);
  const imgRef = useRef(null);
  const scaleRef = useRef(1);

  // Entrance animation
  useEffect(() => {
    const overlay = overlayRef.current;
    const img = imgRef.current;
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(img, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Wheel zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    scaleRef.current = Math.min(Math.max(scaleRef.current - e.deltaY * 0.002, 0.5), 5);
    imgRef.current.style.transform = `scale(${scaleRef.current})`;
  }, []);

  // Drag to pan when zoomed
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const imgPos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    if (scaleRef.current <= 1) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    imgPos.current.x += dx;
    imgPos.current.y += dy;
    imgRef.current.style.translate = `${imgPos.current.x}px ${imgPos.current.y}px`;
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  // Double click to reset
  const onDoubleClick = useCallback(() => {
    scaleRef.current = 1;
    imgPos.current = { x: 0, y: 0 };
    imgRef.current.style.transform = 'scale(1)';
    imgRef.current.style.translate = '0 0';
  }, []);

  return (
    <div
      ref={overlayRef}
      onClick={onClose}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        position: 'fixed', inset: 0, zIndex: 10001,
        background: 'rgba(4,4,6,0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: scaleRef.current > 1 ? 'grab' : 'zoom-out',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 24, right: 24,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}
      >✕</button>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onClick={e => e.stopPropagation()}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        draggable={false}
        style={{
          maxWidth: '90vw', maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: 4,
          userSelect: 'none',
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div style={{ position: 'absolute', bottom: 24, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
        滚轮缩放 · 拖拽平移 · 双击重置 · ESC关闭
      </div>
    </div>
  );
}
