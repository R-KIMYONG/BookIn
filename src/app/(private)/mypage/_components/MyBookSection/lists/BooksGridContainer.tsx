const BooksGridContainer = ({ children }: { children: React.ReactNode }) => {
  return <ul className="w-full grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{children}</ul>;
};

export default BooksGridContainer;
