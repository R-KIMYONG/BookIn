import { describe, expect, it } from 'vitest';
import { formatDateTime } from '../formatDateTime';
import { formatDate } from '../formatDate';

describe('날짜 표시는 항상 KST', () => {
  it.each([
    { input: '2026-11-20T09:54:26Z', dateTime: '2026.11.20 18:54', date: '2026.11.20' },
    { input: '2026-11-20T15:30:00Z', dateTime: '2026.11.21 00:30', date: '2026.11.21' }, // UTC로는 20일, 한국은 21일
  ])('$input → $dateTime', ({ input, dateTime, date }) => {
    expect(formatDateTime(input)).toBe(dateTime);
    expect(formatDate(input)).toBe(date);
  });
});
