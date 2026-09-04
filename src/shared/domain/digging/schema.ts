import { z } from 'zod/v4';
import { DIGGING_GENRES } from './constants';

export const DiggingSchema = z.object({
  readerType: z
    .string()
    .describe(
      '이 독자를 한마디로 규정하는 짧고 재치있는 타이틀. "~형 독자"처럼. 예: "잔잔한 위로를 찾는 밤의 산책자". 20자 내외.'
    ),
  moodTags: z
    .array(z.string())
    .describe('취향을 요약하는 3~5개 키워드(장르·무드). 예: ["에세이","위로","잔잔함"]. 화면에 칩으로 노출됨.'),
  searchQuery: z
    .string()
    .describe(
      '★가장 중요★ 이 독자에게 어울릴 책을 벡터 검색으로 찾기 위한 "실제 책 소개문 한 문장". 키워드 나열 절대 금지. 장르·주제·분위기를 담아 서점 소개글처럼 자연스러운 한국어 한 문장으로. 특정 실제 책 제목·작가를 지어내지 말 것. 예: "바쁜 일상에 지친 마음을 잔잔하게 어루만지는 따뜻한 한국 에세이".'
    ),
  reason: z
    .string()
    .describe('왜 이런 책을 골랐는지 독자에게 건네는 다정한 한두 문장. 고른 선택들을 자연스럽게 엮어서.'),
  alpha: z
    .string()
    .describe(
      '[재미] 취향을 유쾌하게 놀리거나 점쳐주는 한 방. 30자 내외, 캡처하고 싶게. 예: "당신, 새벽 감성에 약하죠?".'
    ),
  categories: z.array(z.string()).describe('제공된 장르 목록에서 유저 취향에 맞는 것 2~3개를 그대로 골라 담기'),
});
