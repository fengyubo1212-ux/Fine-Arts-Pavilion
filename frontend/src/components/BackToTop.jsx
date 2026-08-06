import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollUp}
      aria-label="回到顶部"
      style={{
        position: 'fixed',
        bottom: 40,
        right: 40,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'rgba(14,14,20,0.85)',
        border: '1px solid rgba(200,168,112,0.3)',
        color: '#c8a870',
        fontSize: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 9995,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.3s, transform 0.3s, border-color 0.3s',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#c8a870'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,168,112,0.3)'; }}
    >
      ↑
    </button>
  );
}
