import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 30;

export default function FloatingParticles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dot = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = Math.random() * 6 + 8;
      const opacity = Math.random() * 0.3 + 0.05;

      dot.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: #d4a860;
        left: ${left}%;
        bottom: -10px;
        opacity: 0;
        animation: floatUp ${duration}s ${delay}s ease-in-out infinite;
        box-shadow: 0 0 ${size * 3}px ${size}px rgba(212,168,96,${opacity});
      `;
      container.appendChild(dot);
      particles.push(dot);
    }

    return () => particles.forEach(d => d.remove());
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      />
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.1; }
          100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
        }
      `}</style>
    </>
  );
}
