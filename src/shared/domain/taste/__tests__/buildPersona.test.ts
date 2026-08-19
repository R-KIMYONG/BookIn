import { describe, expect, it } from 'vitest';
import { buildPersona } from '../buildPersona';

describe('buildPersona 테스트입니다.', () => {
  it('빈 입력이면 sprout으로 폴백', () => {
    const result = buildPersona([], 0);
    expect(result.id).toBe('sprout');
  });

  it('빈입력일때 sprout으로 폴백한 obj일치여부 확인', () => {
    const result = buildPersona([], 0);
    expect(result).toMatchObject({
      dominant: '',
      concentration: 0,
      variety: 0,
      total: 0,
      surprise: null,
    });
  });

  it('장르가 있으면 concentration과 dominant를 계산한다.', () => {
    const genre = [{ genre: '소설/한국소설', cnt: 10 }];
    const total = 10;
    const result = buildPersona(genre, total);

    expect(result).toMatchObject({
      dominant: '소설',
      concentration: 1,
    });

    expect(result.surprise).toBeNull();
  });

  it('surprise는 null로 갈리는가?', () => {
    const genre = [
      { genre: '소설/한국소설', cnt: 10 },
      { genre: '에세이', cnt: 5 },
      { genre: '과학/물리', cnt: 2 },
    ];
    const total = 17;
    const result = buildPersona(genre, total);

    expect(result.surprise).toBe('과학');
  });

  it('dominant값이 존재여부 확인', () => {
    const data = [{ genre: '판타지', cnt: 2 }];
    const total = 5;

    const result = buildPersona(data, total);

    expect(result.dominant).toBe('판타지');
  });

  it.each([
    { cnt: 7, total: 10, id: 'fanatic' },
    { cnt: 5, total: 10, id: 'onewell' },
    { cnt: 3, total: 10, id: 'favorite' },
  ])('concentration으로 $cnt/$total -> $id', ({ cnt, total, id }) => {
    const data = [{ genre: '판타지', cnt }];
    const result = buildPersona(data, total);

    expect(result.id).toBe(id);
  });

  it('variety 나오는경우', () => {
    const genre = [
      { genre: '소설', cnt: 1 },
      { genre: '에세이', cnt: 1 },
      { genre: '과학', cnt: 1 },
      { genre: '역사', cnt: 1 },
      { genre: '여행', cnt: 1 },
      { genre: '요리', cnt: 1 },
      { genre: '예술', cnt: 1 },
      { genre: '종교', cnt: 1 },
      { genre: '만화', cnt: 1 },
      { genre: '건강', cnt: 1 },
      { genre: '음악', cnt: 1 },
      { genre: '경제', cnt: 1 },
    ];

    const total = genre.length
    const result = buildPersona(genre,total)

    expect(result.id).toBe('omnivore')
  });
});
