import { useEffect, useRef } from 'react';

export default function ShuffleText({
  text = '',
  maxRadius = 200,
  maxScale = 1.6,
  maxWeight = 900,
  maxSquash = 0.3, // directional stretch intensity
}) {
  const containerRef = useRef(null);
  const spansRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spans = spansRef.current;

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const update = () => {
      const { x: mx, y: my } = mouseRef.current;

      spans.forEach((span) => {
        if (!span) return;
        const rect = span.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxRadius && dist > 1) {
          const t = 1 - dist / maxRadius;     // 0 → 1
          const eased = t * t;                // quadratic
          const scale = 1 + (maxScale - 1) * eased;
          const squash = maxSquash * eased;   // directional deformation
          const angle = Math.atan2(dy, dx);   // direction to mouse

          // Stretch toward mouse, squash perpendicular
          const sx = 1 + squash;
          const sy = 1 - squash * 0.5;

          span.style.transform =
            `rotate(${angle}rad) scaleX(${sx}) scaleY(${sy}) rotate(${-angle}rad) scale(${scale})`;

          const weight = 400 + (maxWeight - 400) * eased;
          span.style.fontWeight = weight;
          span.style.color = `hsl(39, ${60 + 40 * eased}%, ${50 + 40 * eased}%)`;
        } else {
          span.style.transform = 'scale(1)';
          span.style.fontWeight = '400';
          span.style.color = '';
        }
      });

      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [maxRadius, maxScale, maxWeight, maxSquash]);

  if (!text) return null;

  return (
    <span ref={containerRef} style={{ display: 'inline', whiteSpace: 'pre-wrap' }}>
      {text.split('').map((char, i) =>
        char === ' ' || char === '　' ? (
          <span key={i} style={{ display: 'inline', width: '0.35em' }}>{char}</span>
        ) : (
          <span
            key={i}
            ref={el => { spansRef.current[i] = el; }}
            style={{
              display: 'inline-block',
              transition: 'transform 0.12s ease-out, font-weight 0.12s ease-out, color 0.12s ease-out',
              willChange: 'transform',
            }}
          >
            {char}
          </span>
        )
      )}
    </span>
  );
}
