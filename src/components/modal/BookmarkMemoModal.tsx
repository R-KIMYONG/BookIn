'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from '@/components/common/ui/Button';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import type { Editor } from '@tiptap/react';
import BookmarkTagPicker, { Tag } from '../bookmark/BookmarkTagPicker';
import BookmarkMemoModalSkeleton from '../bookmark/BookmarkMemoModalSkeleton';

const TiptapEditor = dynamic(() => import('@/app/(public)/(detailMainPage)/[id]/_components/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80px] px-3 py-2 text-sm text-gray-400 flex items-center gap-2">
      <div className="h-3 w-3 border-2 border-gray-300 border-t-[#AF5858] rounded-full animate-spin" />
      <span>memo 입력을 준비하고 있어요…</span>
    </div>
  ),
});

type BookmarkMemoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMemoHtml?: string | null;
  initialTags?: Tag[];
  onSave: (payload: { memo: string | null; tags: Tag[] }) => Promise<void>;
  isSaving: boolean;
  isLoadingMemo: boolean;
  loadError: string | null;
  onRefetch: () => void;
};

const MAX_LENGTH = 100;
const MAX_LINE = 3;

const BookmarkMemoModal = ({
  isOpen,
  onClose,
  initialMemoHtml,
  initialTags,
  onSave,
  isSaving,
  isLoadingMemo,
  loadError,
  onRefetch,
}: BookmarkMemoModalProps) => {
  const [memoValue, setMemoValue] = useState<string>('');
  const [tagsValue, setTagsValue] = useState<Tag[]>([]);
  const [len, setLen] = useState<number>(0);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

  const didInitRef = useRef(false);

  const handleEditorReady = useCallback((editor: Editor) => {
    setEditorInstance(editor);
  }, []);

  const setTags = (updater: React.SetStateAction<Tag[]>) => {
    didInitRef.current = true;

    setTagsValue(updater);
  };

  const setMemo = (next: string) => {
    didInitRef.current = true;

    setMemoValue(next);
  };
  useEffect(() => {
    if (!isOpen) {
      didInitRef.current = false;
      return;
    }
    if (isLoadingMemo) return;

    if (didInitRef.current) return;

    didInitRef.current = true;

    setMemoValue(initialMemoHtml ?? '');
    setTagsValue(initialTags ?? []);
    setLen(0);
  }, [isOpen, isLoadingMemo, initialMemoHtml, initialTags]);

  useEffect(() => {
    if (!isOpen) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isOpen]);

  const hasMemo = useMemo(() => {
    const text = (memoValue ?? '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, '')
      .trim();
    return text.length > 0;
  }, [memoValue]);

  if (!isOpen) return null;

  const handleSave = async () => {
    // "빈 메모 저장" 방지: 빈 문자열이면 null 저장으로 통일 (삭제와 동일)
    const trimmedText = memoValue
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, '')
      .trim();
    const nextMemo = trimmedText.length === 0 ? null : memoValue;

    try {
      await onSave({ memo: nextMemo, tags: tagsValue });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('메모 저장에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await onSave({ memo: null, tags: [] });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('메모 삭제에 실패했습니다.');
    }
  };

  const lineCount = editorInstance ? editorInstance.state.doc.content.childCount : 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[92vw] max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="px-5 py-2 border-b border-gray-100">
          <h3 className="text-sm font-extrabold text-gray-900">북마크 메모</h3>
        </div>

        <div className="px-5 py-4">
          {isLoadingMemo ? (
            <BookmarkMemoModalSkeleton />
          ) : loadError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-semibold text-red-700">메모를 불러오지 못했습니다.</p>

              <p className="mt-1 text-xs text-red-600 break-words">{loadError}</p>

              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  label="다시 시도"
                  onClick={onRefetch}
                  disabled={isSaving}
                  className="!bg-white/70 hover:!bg-white"
                />
              </div>
            </div>
          ) : (
            <>
              <BookmarkTagPicker value={tagsValue} onChange={setTags} />
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <TiptapEditor
                  value={memoValue}
                  onChange={(html, textLen) => {
                    setMemo(html);
                    setLen(textLen);
                  }}
                  maxLines={MAX_LINE}
                  maxLength={MAX_LENGTH}
                  onReady={handleEditorReady}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 px-2">
                <span>Ctrl/⌘ + Enter로 저장(선택)</span>
                <div className="flex gap-4">
                  <span className="">
                    {len}/{MAX_LENGTH}
                  </span>
                  <span>
                    {lineCount}/{MAX_LINE}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            {!isLoadingMemo && !loadError && hasMemo && (
              <Button
                label="메모 삭제"
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={isSaving || isLoadingMemo || !!loadError}
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button label="취소" variant="secondary" size="sm" onClick={onClose} disabled={isSaving} />
            <Button
              label={isSaving ? '저장중...' : '저장'}
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={isSaving || isLoadingMemo || !!loadError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookmarkMemoModal;
