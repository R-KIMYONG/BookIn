const ROLE_SUFFIX = /\s+(편저|원저|엮음|지음|그림|기획|감수|저|글|역|편|외)$/;

export const toAuthorName = (author: string | null | undefined): string | null => {
  if (!author) return null;

  // '/' 뒤는 번역가·그림 작가, ',' 뒤는 공저자 -> 첫 사람만
  let name = author.split('/')[0].split(',')[0].trim();

  // '홍길동 외 저'처럼 역할 단어가 여러 개 붙은 경우까지 끝에서부터 반복해서 지움
  while (ROLE_SUFFIX.test(name)) {
    name = name.replace(ROLE_SUFFIX, '').trim();
  }

  return name || null;
};
