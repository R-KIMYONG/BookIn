export type AppPaginationProps = {
  page: number;
  totalPages: number;
  onChange: (next: number) => void;
  disabled?: boolean;
};
