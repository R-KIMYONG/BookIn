'use client';
import { useEffect, useRef } from 'react';

const ViewTracker = ({ isbn13 }: { isbn13: string }) => {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch('/api/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isbn13 }),
    }).catch(() => {});
  }, [isbn13]);
  return null;
};

export default ViewTracker;
