import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: 2,
        background: 'linear-gradient(90deg, #c8a870, #d4a860)',
        zIndex: 10000,
        transition: 'width 0.1s linear',
        borderRadius: '0 1px 1px 0',
        boxShadow: '0 0 6px rgba(200,168,112,0.4)',
      }}
    />
  );
}
