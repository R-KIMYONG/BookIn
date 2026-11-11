'use client';
import { ItemId } from '@/shared/domain/book/ids';
import { useEffect, useRef } from 'react';

const ViewTracker = ({ itemId }: { itemId: ItemId }) => {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch('/api/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    }).catch(() => {});
  }, [itemId]);
  return null;
};

export default ViewTracker;
