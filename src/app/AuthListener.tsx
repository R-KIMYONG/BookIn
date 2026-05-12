'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { UserContext } from './provider';

export const AuthListener = () => {
  const user = useContext(UserContext);
  const queryClient = useQueryClient();

  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    const currentId = user?.id ?? null;

    if (prevUserId.current !== currentId) {
      if (!currentId) {
        // 로그아웃
        queryClient.clear();
      } else {
        // 로그인
        queryClient.invalidateQueries();
      }
    }

    prevUserId.current = currentId;
  }, [user, queryClient]);

  return null;
};
