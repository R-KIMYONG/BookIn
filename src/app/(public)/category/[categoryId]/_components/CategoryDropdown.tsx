'use client';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type CategoryOption = {
  id: string;
  name: string;
};

type CategoryDropdownProps = {
  current: CategoryOption;
  options: CategoryOption[];
};

const CategoryDropdown = ({ current, options }: CategoryDropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex max-w-full items-center gap-0.5 rounded px-1 py-0.5 text-sm text-gray-500 hover:bg-gray-100"
      >
        <span className="truncate">{current.name}</span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul className="absolute left-0 top-full z-30 mt-1 max-h-72 w-52 overflow-y-auto overscroll-contain rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5">
          {options.map((option) => (
            <li key={option.id}>
              <Link
                href={`/category/${option.id}`}
                aria-current={option.id === current.id ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={`block truncate px-3 py-2 text-sm hover:bg-gray-50 ${
                  option.id === current.id ? 'font-semibold text-main' : 'text-gray-700'
                }`}
              >
                {option.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryDropdown;
