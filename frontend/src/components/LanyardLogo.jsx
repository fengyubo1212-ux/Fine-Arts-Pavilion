import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export default function LanyardLogo() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const ropeRef = useRef(null);
  const knotRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const rope = ropeRef.current;
    const knot = knotRef.current;

    // 初始入场：卡牌从上方掉落摆动
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.set([rope, knot, card], { opacity: 0 });
    tl.set(card, { rotation: 25, y: -80, transformOrigin: 'top center' });
    tl.set(rope, { scaleY: 0, transformOrigin: 'top center' });
    tl.set(knot, { scale: 0 });

    tl.to(rope, { scaleY: 1, opacity: 1, duration: 0.3 }, 0);
    tl.to(knot, { scale: 1, opacity: 1, duration: 0.25 }, 0.1);
    tl.to(card, { opacity: 1, duration: 0.1 }, 0.2);
    tl.to(card, {
      rotation: -15,
      y: 0,
      duration: 0.5,
      ease: 'back.out(2)'
    }, 0.2);

    // 持续摆动（幅度更大、速度更快）
    gsap.to(card, {
      rotation: -8,
      duration: 1.0,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.8
    });

    // hover 时甩得更猛
    const onEnter = () => {
      gsap.to(card, {
        rotation: -22,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto'
      });
    };
    const onLeave = () => {
      gsap.to(card, {
        rotation: -6,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
        overwrite: 'auto'
      });
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="lanyard-wrap" onClick={() => navigate('/')}>
      {/* 绳结 */}
      <div className="lanyard-knot" ref={knotRef} />
      {/* 绳子 */}
      <div className="lanyard-rope" ref={ropeRef} />
      {/* 卡片 */}
      <div className="lanyard-card" ref={cardRef}>
        <div className="lanyard-card-hole" />
        <span className="lanyard-card-text">艺</span>
      </div>
    </div>
  );
}
