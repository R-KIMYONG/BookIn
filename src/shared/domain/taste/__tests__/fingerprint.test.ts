import { describe, expect, it } from 'vitest';
import { buildBehavioralFingerprint, buildPersonaFingerprint } from '../fingerprint';

describe('fingerprint 함수 테스트', () => {
  it('buildBehavioralFingerprint 함수 좋아요,북마크,댓글의 호감도 비중', () => {
    const data = { likes: 10, bookmarks: 10, comments: 10, views: 10 };

    const result = buildBehavioralFingerprint(data);

    expect(result.numerical_balance.energy_distribution).toMatchObject({
      like_weight: 32.26,
      bookmark_weight: 32.26,
      comment_weight: 32.26,
    });
    expect(result.numerical_balance.interaction_density_ratio).toBe(281.82);
  });

  it('buildBehavioralFingerPrint 각 수치 0일경우', () => {
    const data = { likes: 0, bookmarks: 0, comments: 0, views: 0 };
    const result = buildBehavioralFingerprint(data);
    expect(result.numerical_balance.energy_distribution).toMatchObject({
      like_weight: 0,
      bookmark_weight: 0,
      comment_weight: 0,
    });
    expect(result.numerical_balance.interaction_density_ratio).toBe(100);
  });

  it('buildPersonaFingerprint함수 top_genres 출력 테스트', () => {
    const genre = [
      { genre: '소설/한국소설', cnt: 10 },
      { genre: '에세이', cnt: 5 },
      { genre: '과학/물리', cnt: 2 },
    ];

    const total = 17;

    const result = buildPersonaFingerprint(genre, total);

    expect(result.raw_top_genres).toMatchObject({
      first_place: '소설',
      second_place: '에세이',
    });
  });
  it('buildPersonaFingerprint함수 dna(편중도)지수 테스트', () => {
    const genre = [
      { genre: '소설/한국소설', cnt: 10 }, // 심슨 지수 계산하면 0.25
      { genre: '에세이', cnt: 5 }, //심슨 지수 0.0625
      { genre: '과학/물리', cnt: 5 }, //심슨 지수 0.0625
    ];

    const total = 20;

    const result = buildPersonaFingerprint(genre, total);

    expect(result.distribution_dna.dominant_genre_density).toBe('50%');
    expect(result.distribution_dna.top_two_clash_gap).toBe('25%');
    expect(result.distribution_dna.genre_diversity_density).toBe('62.5%'); //1-(심슨지수의합)*100
  });
  it('buildPersonaFingerprint함수 빈입력 시 반환테스트', () => {
    const result = buildPersonaFingerprint([], 0);

    expect(result.raw_top_genres.first_place).toBe('미분류');

    expect(result.distribution_dna.dominant_genre_density).toBe('0%');
    expect(result.distribution_dna.top_two_clash_gap).toBe('0%');
    expect(result.distribution_dna.genre_diversity_density).toBe('100%');
  });
});
