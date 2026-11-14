'use client';

import { ItemId } from '@/shared/domain/book/ids';
import { makeHref } from '@/shared/domain/book/makeHref';
import cn from '@/shared/utils/cn';
import Link from 'next/link';
import { toast } from 'react-toastify';

type BookLinkProps = { itemId: ItemId; adult: boolean; className?: string; children: React.ReactNode };

const BookLink = ({ itemId, adult, className, children }: BookLinkProps) => (
  <Link
    href={makeHref(itemId)}
    prefetch={adult ? false : undefined} // 못 들어갈 페이지는 미리 받지 않음
    onClick={
      adult
        ? (e) => {
            e.preventDefault();
            toast.warning('청소년 이용불가 도서예요.', { toastId: 'adult-book' });
          }
        : undefined
    }
    aria-disabled={adult || undefined}
    className={cn(
      className,
      'aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:grayscale-[30%]`'
    )}
  >
    {children}
  </Link>
);
export default BookLink;
