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
      size="md"
      variant="primary"
      className={`fixed right-5 bottom-5 rounded-full shadow-lg transition-all duration-300 !text-xs group ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center ">
        <ArrowUp
          className="w-5 h-5 transition-transform translate-y-0 group-hover:-translate-y-0.5"
          strokeWidth={2.5}
        />
        <span>Top</span>
      </div>
    </Button>
  );
};

export default TopButton;
