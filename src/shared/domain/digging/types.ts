// 디깅 타입 정의 (직접 구현)
// 참고: 질문뱅크용 타입(Dimension, DiggingOption, DiggingQuestion)은 현재 questionBank.ts에 함께 정의·export 되어 있음.
// 답(DiggingAnswer)·결과(DiggingResult) 등 나머지 타입을 여기서 정의하면 됨.
export {};
export type MatchBookType = {
  item_id: string;
  isbn13: string;
  title: string;
  author: string;
  thumbnail_url: string;
  category_id: number;
  category_name: string;
  similarity: number;
};

export type ReaderType = {
  readerType: string;
  moodTags: string[];
  searchQuery: string;
  reason: string;
  alpha: string;
  categories: string[];
};

export type DiggingResultType = { reader: ReaderType; DiggingBookList: MatchBookType[] };

export type DiggingReader = {
  readerType: string;
  moodTags: string[];
  searchQuery: string;
  reason: string;
  alpha: string;
  categories: string[];
};

export type DiggingDaily = {
  date: string;
  reader: DiggingReader;
  books: MatchBookType[];
};
