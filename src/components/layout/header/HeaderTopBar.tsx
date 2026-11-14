'use client';
import { useEffect, useRef, useState } from 'react';

const HOVER_DELAY_MS = 150;

export const HeaderTopBar = ({ children }: { children: React.ReactNode }) => {
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapsed = hidden && !hovered;

  const lastY = useRef(0),
    ticking = useRef(false);

  const clearHoverTimer = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return; // 터치는 제외
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => setHovered(true), HOVER_DELAY_MS);
  };

  const handlePointerLeave = () => {
    clearHoverTimer(); // 150ms 안에 나가면 아예 안 펼침
    setHovered(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    // 포커스가 헤더 안의 다른 요소로 옮겨간 거면 무시 (링크 → 링크 이동)
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setHovered(false);
  };

  useEffect(() => clearHoverTimer, []);
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
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setHovered(true)}
      onBlur={handleBlur}
      className={`sticky top-0 z-50 w-full bg-main transition-transform duration-300 will-change-transform ${collapsed ? '-translate-y-12' : 'translate-y-0'}`}
    >
      {children}
    </header>
  );
};
