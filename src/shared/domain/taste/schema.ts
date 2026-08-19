import * as z from 'zod/v4';
export const RecV2Schema = z.object({
  reading_style: z
    .string()
    .describe(
      '[정직] "어떻게" 반응하는 사람인지 한 문장. 행동 패턴을 근거로, 결론은 사람 성격(수집가·평론가·신중파·즉흥파). 데이터 묘사(“좋아요 많다”류) 금지.'
    ),
  taste_read: z
    .string()
    .describe(
      '[정직] "무엇에" 끌리는 사람인지 한 문장. 장르 구성+의외의 장르 근거, 결론은 사람 성격(편식/잡식·기분파 등). reading_style과 다른 특징. 데이터 묘사 금지.'
    ),
  fun_fortune: z
    .string()
    .describe('[재미·점] "재미로 점쳐보면…"으로 시작하는 과감한 한 방(연애/직장/미래 중 하나). 틀려도 웃기게.'),
  one_line_meme: z.string().describe('책제목·장르명·숫자(% 포함) 없이 성격을 한 방에 관통하는 밈. 30자 이내. 캡처각.'),
});
