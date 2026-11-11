import { describe, it, vi } from 'vitest';
import { yes24Fetch } from '../client';

vi.mock('server-only', () => ({}));
vi.mock('../client');

describe('getYes24Search함수 테스트', () => {
  it('정상적인결과 반환여부 확인', () => {
    vi.mocked(yes24Fetch).mockResolvedValue('가짜응답');
  });
});
