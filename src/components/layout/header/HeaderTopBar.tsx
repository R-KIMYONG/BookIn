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
      const dy = y - lastY.current;
      if (Math.abs(dy) > 200) {
        //급격히 큰 이동일때 유저가 아니므로 점프하지않음
        lastY.current = y;
        ticking.current = false;
        return;
      }

      if (y < 80) setHidden(false);
      else if (dy > 8)
        setHidden(true); // 아래 8px+
      else if (-dy > 8) setHidden(false); // 위 8px+
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
