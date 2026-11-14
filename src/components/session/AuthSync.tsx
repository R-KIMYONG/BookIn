'use client';
import { AUTH_CHANNEL, AuthChangedMessage } from '@/shared/domain/auth/channel';
import { userKeys } from '@/shared/domain/user/queryKeys';
import { clearPersonalQueries } from '@/shared/lib/query/clearPersonalQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const AuthSync = ({ userId }: { userId: string | null }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUserId = useRef(userId);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return; // 미지원 브라우저는 기존처럼 새로고침으로
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<AuthChangedMessage>) => {
      const message = event.data;
      if (message?.type === 'INVALIDATE_USERINFO') {
        queryClient.invalidateQueries({ queryKey: userKeys.me() });
        return;
      }
      if (message?.type !== 'AUTH_CHANGED') return;
      if (message.userId === currentUserId.current) return;

      clearPersonalQueries(queryClient);

      router.refresh();
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [router, queryClient]);

  useEffect(() => {
    if (currentUserId.current === userId) return;
    currentUserId.current = userId;
    channelRef.current?.postMessage({ type: 'AUTH_CHANGED', userId } satisfies AuthChangedMessage);
  }, [userId]);

  return null;
};

export default AuthSync;
