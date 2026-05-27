'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import { DropdownProps } from './types';

const Dropdown = <T,>({ trigger, items, onSelect, align, variant = 'primary' }: DropdownProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const positionClass = (align ?? 'left') === 'right' ? 'right-0' : 'left-0';

  const isDesktop = !isTouchDevice;
  const handleClick = () => {
    if (isTouchDevice) {
      setOpen((prev) => !prev);
    }
  };

  const handleEnter = () => {
    if (!isTouchDevice) setOpen(true);
  };

  const handleLeave = () => {
    if (!isTouchDevice) setOpen(false);
  };

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative inline-block text-left group"
      onMouseEnter={isDesktop ? handleEnter : undefined}
      onMouseLeave={isDesktop ? handleLeave : undefined}
    >
      {/* 트리거메뉴 */}
      <Button type="button" size="xs" variant={variant} className="text-white" onClick={handleClick}>
        {trigger}
      </Button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          className={`
            absolute 
            top-full 
            ${positionClass} 
            py-2 
            w-40 
            max-h-60 
            overflow-y-auto 
            rounded-md 
            bg-white 
            shadow-lg 
            ring-1 
            ring-black/5
            z-30 
            pointer-events-auto 
            overscroll-contain 
            flex flex-col gap-1`}
        >
          {items.map((item, idx) => {
            if (item.type === 'custom') {
              return (
                <div key={idx} className="px-3 py-2 border-b last:border-none" onClick={(e) => e.stopPropagation()}>
                  {item.content}
                </div>
              );
            }

            return (
              <div
                key={String(item.value)}
                className={`flex justify-center ${item.renderType === 'button' ? `px-3 py-2` : ''}`}
              >
                <Button
                  type="button"
                  variant={item.renderType === 'button' ? 'navbarDark' : 'ghost'}
                  size="xs"
                  label={item.label}
                  onClick={() => {
                    onSelect(item.value);
                    setOpen(false);
                  }}
                  className={
                    item.renderType === 'button'
                      ? ' text-center py-2 w-full'
                      : 'w-full justify-start text-left text-sm text-gray-800 hover:bg-gray-100'
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
