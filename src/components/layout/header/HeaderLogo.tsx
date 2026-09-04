import { BookInLogo } from '@/components/icons/BookInLogo';
import Link from 'next/link';

const HeaderLogo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Link href="/" scroll={false}>
        <span className="flex items-center gap-2 text-white">
          <BookInLogo size={32} />
        </span>
      </Link>
    </div>
  );
};

export default HeaderLogo;
