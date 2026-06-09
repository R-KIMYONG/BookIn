'use client';
import { APP_QUERY_KEYS } from '@/shared/domain/aladin/constants';
import useUrlParams from './useUrlParams';

const MODAL_OPEN_VALUE = 'open';

export const useRankingModal = () => {
  const { getParams, setParams } = useUrlParams();

  const isOpen = getParams(APP_QUERY_KEYS.rankingModal) === MODAL_OPEN_VALUE;

  const open = () => setParams({ [APP_QUERY_KEYS.rankingModal]: MODAL_OPEN_VALUE });
  const close = () => setParams({ [APP_QUERY_KEYS.rankingModal]: null }); // null이면 URL에서 제거

  return { isOpen, open, close };
};
