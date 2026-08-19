import { RailBookView } from '@/shared/domain/rails/types';
import BookRailsCard from './BookRailsCard';

type BookRailProps = {
  icon: React.ReactNode;
  label: React.ReactNode;
  books: RailBookView[];
};

const BookRail = ({ icon, label, books }: BookRailProps) => {
  if (!books?.length) return null;

  return (
    <section id="rails" className="space-y-3 scroll-mt-20">
      <h3 className="flex items-center gap-2 px-1 text-lg font-bold tracking-tight">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">{icon}</span>
        {label}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {books.map((b) => (
          <BookRailsCard key={b.itemId} book={b} />
        ))}
      </div>
    </section>
  );
};

export default BookRail;
