import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const RINGS = [
  { size: 22, delay: 0.2, opacity: 0.6, width: 1.5 },
  { size: 40, delay: 0.12, opacity: 0.4, width: 1.2 },
  { size: 62, delay: 0.06, opacity: 0.22, width: 1 },
];

export default function CustomCursor() {
  const triWrapperRef = useRef(null);
  const tri1Ref = useRef(null);
  const tri2Ref = useRef(null);
  const ringRefs = useRef([]);
  const dotRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const triPos = useRef({ x: -100, y: -100 });
  const ringPositions = useRef(RINGS.map(() => ({ x: -100, y: -100 })));
  const hoverTarget = useRef(null);

  // Triangle geometry
  const S = 40;
  const H = S * Math.sqrt(3) / 2;
  const upCentroidY = H * 2 / 3;
  const downCentroidY = H / 3;
  const upPoints = `${S / 2},0 ${S},${H} 0,${H}`;
  const downPoints = `${S / 2},${H} ${S},0 0,0`;

  useEffect(() => {
    const triWrapper = triWrapperRef.current;
    const dot = dotRef.current;
    const rings = ringRefs.current;

    gsap.set(triWrapper, { xPercent: -50, yPercent: -50 });
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    rings.forEach(r => gsap.set(r, { xPercent: -50, yPercent: -50 }));

    /* ---- Mouse tracking ---- */
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    /* ---- Hover: only rings morph ---- */
    const onOver = (e) => {
      const t = e.target.closest('button,.btn');
      if (!t) {
        if (hoverTarget.current) {
          hoverTarget.current = null;
          // Restore rings to circles
          rings.forEach((r, i) => {
            const def = RINGS[i];
            gsap.to(r, {
              xPercent: -50, yPercent: -50,
              width: def.size, height: def.size,
              borderRadius: '50%',
              borderColor: `rgba(212,168,96,${def.opacity})`,
              borderWidth: def.width,
              duration: 0.4, ease: 'power3.out',
            });
          });
          gsap.to(dot, { scale: 1, duration: 0.15 });
        }
        return;
      }
      if (t === hoverTarget.current) return;
      hoverTarget.current = t;
      const rect = t.getBoundingClientRect();

      // Morph rings to wrap button — inherit its border-radius
      const computed = getComputedStyle(t);
      const btnRadius = computed.borderRadius.split(' ')[0]; // e.g. "50%" or "999px"

      rings.forEach((r, i) => {
        const p = 5 + i * 5;
        const def = RINGS[i];
        gsap.to(r, {
          x: rect.left - p, y: rect.top - p,
          xPercent: 0, yPercent: 0,
          width: rect.width + p * 2,
          height: rect.height + p * 2,
          borderRadius: btnRadius,
          borderColor: `rgba(212,168,96,${def.opacity + 0.15})`,
          borderWidth: def.width + 0.5,
          duration: 0.35, ease: 'power3.out',
        });
      });
      gsap.to(dot, { scale: 0, duration: 0.1 });
    };

    /* ---- Click: heartbeat pulse ---- */
    const onClick = () => {
      // Pulse triangles
      gsap.to(triWrapper, {
        scale: 1.35, duration: 0.12, ease: 'power2.out',
        onComplete: () => {
          gsap.to(triWrapper, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        }
      });
      // Pulse rings (only if not hovering a button)
      if (!hoverTarget.current) {
        rings.forEach((r, i) => {
          const def = RINGS[i];
          gsap.to(r, {
            scale: 1.3, duration: 0.12, ease: 'power2.out',
            onComplete: () => {
              gsap.to(r, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            }
          });
        });
      }
    };

    /* ---- Animation loop ---- */
    let angle = 0;
    const animate = () => {
      const { x: mx, y: my } = mouse.current;

      // Dot follows mouse (leader)
      dotPos.current.x += (mx - dotPos.current.x) * 0.25;
      dotPos.current.y += (my - dotPos.current.y) * 0.25;
      gsap.set(dot, { x: dotPos.current.x, y: dotPos.current.y });

      if (!hoverTarget.current) {
        // Triangle wrapper follows dot (dragging behind)
        triPos.current.x += (dotPos.current.x - triPos.current.x) * 0.08;
        triPos.current.y += (dotPos.current.y - triPos.current.y) * 0.08;
        gsap.set(triWrapper, { x: triPos.current.x, y: triPos.current.y });

        // Each ring follows the previous (or dot for innermost)
        RINGS.forEach((def, i) => {
          const target = i === 0 ? dotPos.current : ringPositions.current[i - 1];
          ringPositions.current[i].x += (target.x - ringPositions.current[i].x) * def.delay;
          ringPositions.current[i].y += (target.y - ringPositions.current[i].y) * def.delay;
          gsap.set(rings[i], { x: ringPositions.current[i].x, y: ringPositions.current[i].y });
        });
      }

      // Triangles rotate independently (always)
      angle += 0.02;
      tri1Ref.current.style.transform = `rotate(${angle}rad)`;
      tri2Ref.current.style.transform = `rotate(${-angle * 0.7}rad)`;

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mousedown', onClick, { passive: true });
    animate();

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  return (
    <>
      {/* Outer rings — innermost first (rendered behind), outermost last (rendered in front) */}
      {RINGS.map((def, i) => (
        <div
          key={`ring-${i}`}
          ref={el => { ringRefs.current[i] = el; }}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: def.size, height: def.size,
            borderRadius: '50%',
            border: `${def.width}px solid rgba(212,168,96,${def.opacity})`,
            pointerEvents: 'none', zIndex: 9996 + i,
          }}
        />
      ))}

      {/* Triangle wrapper — both triangles share center */}
      <div ref={triWrapperRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: S, height: S,
        pointerEvents: 'none', zIndex: 9999,
      }}>
        {/* Up triangle — clockwise */}
        <svg ref={tri1Ref} width={S} height={H}
          style={{
            position: 'absolute', left: 0, top: S / 2 - upCentroidY,
            transformOrigin: `${S / 2}px ${upCentroidY}px`,
          }}>
          <polygon points={upPoints} fill="none" stroke="rgba(212,168,96,0.55)" strokeWidth="1.2" />
        </svg>
        {/* Down triangle — counter-clockwise */}
        <svg ref={tri2Ref} width={S} height={H}
          style={{
            position: 'absolute', left: 0, top: S / 2 - downCentroidY,
            transformOrigin: `${S / 2}px ${downCentroidY}px`,
          }}>
          <polygon points={downPoints} fill="none" stroke="rgba(212,168,96,0.45)" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Center dot */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: 4, height: 4, borderRadius: '50%',
        backgroundColor: '#d4a860',
        pointerEvents: 'none', zIndex: 9999,
      }} />

      <style>{`
        * { cursor: none !important; }
        a, button, input, textarea, select, [data-cursor="magnetic"] { cursor: none !important; }
      `}</style>
    </>
  );
}
