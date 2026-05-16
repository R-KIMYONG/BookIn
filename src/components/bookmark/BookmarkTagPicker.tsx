'use client';

import { useMemo, useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { HiHashtag } from 'react-icons/hi';
import Button from '../common/ui/Button';
import TagColorPopover from './TagColorPopover';
import { DEFAULT_PRESETS } from '@/shared/domain/tag/constants';
import { BookmarkTagPickerProps } from '@/shared/domain/tag/types';
import { getTagColorClass } from '@/shared/domain/tag/getTagColorClass';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';

const toSlug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '-');

const normalizeTag = (raw: string) => {
  // 앞뒤 공백 제거 + 내부 연속 공백 1개로
  const t = raw.trim().replace(/\s+/g, ' ');
  // 너무 공격적이면 여기서 완화 가능: 한글/영문/숫자/공백/하이픈 정도만 허용
  return t.replace(/[^\p{L}\p{N}\s-]/gu, '');
};

const BookmarkTagPicker = ({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  maxTags = 5,
  maxLen = 8,
}: BookmarkTagPickerProps) => {
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [openTagName, setOpenTagName] = useState<string | null>(null);
  const selected = value ?? []; //기존 태그
  const left = Math.max(0, maxTags - selected.length);
  const canAddMore = selected.length < maxTags;

  const setTagColor = (tagName: string, colorKey: string | null) => {
    onChange((prev) => prev.map((t) => (t.name === tagName ? { ...t, color: colorKey } : t)));

    setOpenTagName(null);
  };

  const togglePalette = (tagName: string) => {
    setOpenTagName((prev) => (prev === tagName ? null : tagName));
  };

  const addTag = (raw: string) => {
    const normalized = normalizeTag(raw).slice(0, maxLen);

    if (raw.trim().length > 0 && normalized.length === 0) {
      showToast(RESULT_CODE.TAG_INVALID_CHARACTER, { toastId: 'tag-disallow-special-characters' });
      return;
    }
    if (!normalized) return;

    if (selected.length >= maxTags) {
      showToast(RESULT_CODE.TAG_MAX_COUNT_EXCEEDED, { variables: { maxTags }, toastId: 'overlap-tag' });

      return;
    }

    if (selected.some((t) => t.name.toLowerCase() === normalized.toLowerCase())) {
      showToast(RESULT_CODE.TAG_ALREADY_EXISTS, { toastId: 'overlap-tag' });
      return;
    }
    onChange((prev) => {
      return [...prev, { name: normalized, slug: toSlug(normalized), color: null }];
    });
    setInput('');
  };

  const removeTag = (tagName: string) => {
    onChange((prev) => prev.filter((t) => t.name !== tagName));

    setOpenTagName((prev) => (prev === tagName ? null : prev));
  };

  const togglePreset = (tag: string) => {
    const exists = value.some((t) => t.name === tag);
    if (!exists && value.length >= maxTags) {
      showToast(RESULT_CODE.TAG_MAX_COUNT_EXCEEDED, { variables: { maxTags }, toastId: 'overlap-tag' });

      return;
    }
    onChange((prev) => {
      const ex = prev.some((t) => t.name === tag);

      if (ex) return prev.filter((t) => t.name !== tag);

      if (prev.length >= maxTags) return prev;

      return [...prev, { name: tag, slug: toSlug(tag), color: null }];
    });
  };

  const helperText = useMemo(() => {
    return `태그 ${selected.length}/${maxTags} · 최대 ${maxLen}자`;
  }, [selected.length, maxTags, maxLen]);

  return (
    <div className="space-y-3 mb-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-800 items-center flex gap-2">
          태그
          <span className="text-[10px] font-light">(이미 추가된 태그를 클릭하여 컬러를 입혀보세요)</span>
        </p>
        <p className="text-[11px] text-gray-500">
          {helperText} {input.length}/{maxLen}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {selected.length === 0 ? (
          <span className="text-[11px] text-gray-400">선택된 태그가 없습니다.</span>
        ) : (
          selected.map((t) => {
            const isOpen = openTagName === t.name;
            return (
              <div key={t.id ?? t.name} className="relative inline-block">
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  onClick={() => togglePalette(t.name)}
                  className={` box-border ${isOpen && '!text-black'} ${getTagColorClass(t.color)}`}
                  aria-label={`태그 삭제: ${t}`}
                >
                  <div className="flex gap-1">
                    <div className="flex">
                      <HiHashtag className="h-3 w-3" />
                      <p className="text-[11px]">{t.name}</p>
                    </div>
                    <div>
                      <FiX
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(t.name);
                          if (openTagName === t.name) setOpenTagName(null);
                        }}
                      />
                    </div>
                  </div>
                </Button>
                <TagColorPopover
                  open={openTagName === t.name}
                  onClose={() => setOpenTagName(null)}
                  value={t.color}
                  tagName={t.name}
                  onSelect={(next) => setTagColor(t.name, next)}
                />
              </div>
            );
          })
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            value={input}
            onChange={(e) => {
              const next = e.target.value;
              if (isComposing) {
                setInput(next);
                return;
              }
              if (next.length === maxLen)
                showToast(RESULT_CODE.VALIDATION_TAG_MAX_LENGTH_EXCEEDED, {
                  variables: { maxLen },
                  toastId: 'tag-maxlen',
                });
              setInput(next.slice(0, maxLen));
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              const next = e.currentTarget.value.slice(0, maxLen);
              setInput(next);
            }}
            maxLength={maxLen}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              e.preventDefault();
              addTag(input);
            }}
            placeholder={canAddMore ? `태그 추가 (Enter) · 남은 ${left}개` : '태그 최대 개수 도달'}
            disabled={!canAddMore}
            className="h-9 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition
                       focus:border-[#af5858] focus:ring-2 focus:ring-[#af5858]/15 disabled:bg-gray-50 disabled:text-gray-400 placeholder:text-[11px]"
          />
        </div>
        <Button
          type="button"
          onClick={() => {
            addTag(input);
          }}
          disabled={!canAddMore}
          variant="primary"
          size="sm"
          leftIcon={<FiPlus className="h-3 w-3" />}
          label="추가"
          className="!gap-1"
        />
      </div>
      <div className="space-y-2">
        <p className="text-[11px] text-gray-500">추천 태그</p>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((tag) => {
            const active = selected.some((t) => t.name === tag);
            return (
              <Button
                key={tag}
                type="button"
                onClick={() => togglePreset(tag)}
                size="xs"
                variant={active ? 'primary' : 'secondary'}
                disabled={active || !canAddMore}
                leftIcon={<HiHashtag className="h-3 w-3" />}
                label={tag}
                className="!gap-0"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookmarkTagPicker;
