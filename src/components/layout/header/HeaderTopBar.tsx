'use client';
import { useEffect, useRef, useState } from 'react';

export const HeaderTopBar = ({ children }: { children: React.ReactNode }) => {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0),
    ticking = useRef(false);
  useEffect(() => {
    lastY.current = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      if (y < 80) setHidden(false);
      else if (y - lastY.current > 8)
        setHidden(true); // 아래 8px+
      else if (lastY.current - y > 8) setHidden(false); // 위 8px+
      lastY.current = y;
      ticking.current = false;
    };
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-main transition-transform duration-300 will-change-transform ${hidden ? '-translate-y-12' : 'translate-y-0'}`}
    >
      {children}
    </header>
  );
};
