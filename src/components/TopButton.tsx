'use client';

import { useEffect, useState } from 'react';
import { TbArrowBigUpLinesFilled } from 'react-icons/tb';

const TopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) setIsVisible(true);
      else setIsVisible(false);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div
        className={`fixed right-5 bottom-5 bg-[#af5858] text-white rounded p-1 transition-all duration-500 ease-in-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        <TbArrowBigUpLinesFilled className="text-xl" onClick={scrollToTop} />
      </div>
    </>
  );
};

export default TopButton;
