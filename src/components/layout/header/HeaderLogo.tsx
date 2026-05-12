import Logo from '@/components/icons/Logo';
import Link from 'next/link';

const HeaderLogo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Link href="/">
        <Logo />
      </Link>
    </div>
  );
};

export default HeaderLogo;
