'use client';

import { useEffect, useState } from 'react';
import Button from './Button';
import { ArrowUp } from 'lucide-react';

const TopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 100;

      setVisible((prev) => (prev === next ? prev : next));
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Button
      aria-label="맨 위로 이동"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      size="xs"
      variant="primary"
      className={`fixed right-5 bottom-5 rounded-full shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
    </Button>
  );
};

export default TopButton;
