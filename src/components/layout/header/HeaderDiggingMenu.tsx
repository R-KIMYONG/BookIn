import { Sparkles } from 'lucide-react';
import Link from 'next/link';

const HeaderDiggingMenu = () => {
  return (
    <Link href={'/digging'}>
      <span className="flex shrink-0 gap-1 items-center text-white">
        <Sparkles size={15} />
        <p className="text-[12px] whitespace-nowrap ">디깅</p>
      </span>
    </Link>
  );
};

export default HeaderDiggingMenu;
