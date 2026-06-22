import Logo from '@/components/icons/Logo';
import Link from 'next/link';

const HeaderLogo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Link href="/" scroll={false}>
        <Logo />
      </Link>
    </div>
  );
};

export default HeaderLogo;
