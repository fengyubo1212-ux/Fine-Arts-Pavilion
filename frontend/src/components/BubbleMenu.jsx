import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import LanyardLogo from './LanyardLogo';
import './BubbleMenu.css';

const MENU_ITEMS = [
  { label: '首页', href: '/' },
  { label: '展览', href: '/exhibitions' },
  { label: '艺术品', href: '/artworks' },
  { label: '艺术家', href: '/artists' }
];

function calcCircleGeometry(w, h) {
  const R = (w * w / 4 + h * h) / (2 * h);
  const D = Math.ceil(2 * R) + 2;
  const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - w * w / 4))) + 1;
  return { size: D, delta, originY: D - delta };
}

function buildHoverTimeline(circle, label, hoverLabel, h) {
  const tl = gsap.timeline({ paused: true });
  tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.easeOut' }, 0);
  if (label) tl.to(label, { y: -(h + 8), duration: 2, ease: 'power3.easeOut' }, 0);
  if (hoverLabel) {
    gsap.set(hoverLabel, { y: h + 100, opacity: 0 });
    tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease: 'power3.easeOut' }, 0);
  }
  return tl;
}

export default function BubbleMenu({
  menuBg = '#0e0e12',
  menuContentColor = '#e0dcd5',
  items
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const overlayRef = useRef(null);
  const pillRefs = useRef([]);
  const circleRefs = useRef([]);
  const timelines = useRef([]);
  const activeTween = useRef([]);

  const menuItems = items?.length ? items : MENU_ITEMS;

  const handleToggle = () => {
    const next = !isMenuOpen;
    if (next) setShowOverlay(true);
    setIsMenuOpen(next);
  };

  const handleNav = (href) => {
    setIsMenuOpen(false);
    navigate(href);
  };

  // 初始化圆圈的 hover 动效
  useEffect(() => {
    if (!showOverlay) return;
    requestAnimationFrame(() => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement;
        const { width: w, height: h } = pill.getBoundingClientRect();
        const geo = calcCircleGeometry(w, h);

        circle.style.width = `${geo.size}px`;
        circle.style.height = `${geo.size}px`;
        circle.style.bottom = `-${geo.delta}px`;
        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${geo.originY}px` });

        const label = pill.querySelector('.pill-label');
        const hover = pill.querySelector('.pill-label-hover');
        if (label) gsap.set(label, { y: 0 });
        if (hover) gsap.set(hover, { y: h + 12, opacity: 0 });

        timelines.current[i]?.kill();
        timelines.current[i] = buildHoverTimeline(circle, label, hover, h);
      });
    });
  }, [showOverlay]);

  // 菜单开/关动画
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    if (isMenuOpen) {
      gsap.killTweensOf(el);
      gsap.set(el, { display: 'block', scale: 0.8, opacity: 0, transformOrigin: 'top right' });
      gsap.to(el, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.4)' });
    } else if (showOverlay) {
      gsap.to(el, {
        scale: 0.8, opacity: 0, duration: 0.15, ease: 'power3.in',
        onComplete: () => setShowOverlay(false)
      });
    }
  }, [isMenuOpen, showOverlay]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const animateHover = (i, forward) => {
    const tl = timelines.current[i];
    if (!tl) return;
    activeTween.current[i]?.kill();
    const target = forward ? tl.duration() : 0;
    activeTween.current[i] = tl.tweenTo(target, {
      duration: 0.3,
      ease: 'power3.easeOut'
    });
  };

  return (
    <>
      <nav className="bubble-menu absolute" aria-label="Main navigation">
        <LanyardLogo />
        <button
          type="button"
          className={`bubble toggle-bubble menu-btn${isMenuOpen ? ' open' : ''}`}
          onClick={handleToggle}
          aria-label="Toggle menu"
          style={{ background: menuBg }}
        >
          <span className="menu-line" style={{ background: menuContentColor }} />
          <span className="menu-line short" style={{ background: menuContentColor }} />
        </button>
      </nav>
      {showOverlay && (
        <div className="bubble-menu-items absolute" ref={overlayRef} aria-hidden={!isMenuOpen}>
          <ul className="pill-list" role="menu">
            {menuItems.map((item, i) => (
              <li key={i} role="none">
                <button
                  role="menuitem"
                  onClick={() => handleNav(item.href)}
                  onMouseEnter={() => animateHover(i, true)}
                  onMouseLeave={() => animateHover(i, false)}
                  className="pill-btn"
                  ref={el => { pillRefs.current[i] = el; }}
                  style={{
                    '--pill-bg': menuBg,
                    '--pill-color': menuContentColor,
                    '--hover-color': '#ffffff'
                  }}
                >
                  <span className="hover-circle" ref={el => { circleRefs.current[i] = el; }} />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover">{item.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
