import RecommendBookCard from './RecommendBookCard';
import { RecommendBook } from '@/shared/domain/recommend/types';

const MarqueeRow = ({ books, direction }: { books: RecommendBook[]; direction: 'left' | 'right' }) => {
  return (
    <div className="overflow-hidden">
      <div
        className="marquee-track flex w-max items-start gap-4 hover:[animation-play-state:paused]"
        style={{ animation: `marquee-${direction} 40s linear infinite` }}
      >
        {[...books, ...books].map((book, i) => (
          <div key={`${book.isbn13}-${i}`} className="w-40 shrink-0">
            <RecommendBookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeRow;
