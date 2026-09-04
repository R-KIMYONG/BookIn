// 디깅 질문뱅크 (자립형 — 타입도 여기서 정의·export)
// label은 감성적 은유로, signal은 검색에 쓸 의미로 분리하는 게 핵심.
// 각 dimension 10문항 × 9차원 = 90문항. 뱅크가 클수록 매 세션 조합이 달라져 재플레이 변주가 커진다.

export type Dimension =
  | 'mood' // 지금 마음 상태
  | 'purpose' // 책에게 바라는 것
  | 'reality' // 현실 ↔ 환상
  | 'tempo' // 호흡(가벼움 ↔ 묵직함)
  | 'situation' // 읽는 상황/분량
  | 'curiosity' // 끌리는 세계/주제
  | 'tone' // 원하는 온도
  | 'challenge' // 난이도/도전
  | 'discovery'; // 화제작 ↔ 숨은책 ↔ 고전

export interface DiggingOption {
  id: string;
  label: string; // 유저에게 보이는 은유적 선택지
  signal: string; // 내부 의미 — 최종에 AI가 읽는 재료 (유저에겐 안 보임)
}

export interface DiggingQuestion {
  id: string;
  dimension: Dimension;
  prompt: string;
  options: DiggingOption[];
}

export const QUESTION_BANK: DiggingQuestion[] = [
  // ══ mood: 지금 마음 상태 ═══════════════════════════════
  {
    id: 'mood-1',
    dimension: 'mood',
    prompt: '오늘 당신의 마음에 가장 가까운 풍경은?',
    options: [
      { id: 'a', label: '잔잔한 호수', signal: '평온·안정, 여운을 음미할 여유' },
      { id: 'b', label: '안개 낀 새벽', signal: '복잡·불확실, 생각을 정리해줄 책' },
      { id: 'c', label: '타오르는 모닥불', signal: '열정·의욕, 몰입하고 자극받고 싶음' },
      { id: 'd', label: '비 오는 창가', signal: '가라앉음·센치, 감성적 위로' },
      { id: 'e', label: '북적이는 광장', signal: '들뜸·호기심, 새 세계로 뛰어들고 싶음' },
    ],
  },
  {
    id: 'mood-2',
    dimension: 'mood',
    prompt: '요즘 당신의 밤은 어떤가요?',
    options: [
      { id: 'a', label: '생각이 많아 잠이 안 와요', signal: '불면·사색, 마음을 가라앉히는 책' },
      { id: 'b', label: '지쳐서 아무 생각 없어요', signal: '번아웃, 부담 없는 가벼운 위로' },
      { id: 'c', label: '뭔가 새로 시작하고 싶어요', signal: '의욕·전환, 동기와 영감을 주는 책' },
      { id: 'd', label: '그냥 재밌는 게 필요해요', signal: '오락·기분전환, 페이지터너' },
    ],
  },
  {
    id: 'mood-3',
    dimension: 'mood',
    prompt: '지금 딱 듣고 싶은 음악은?',
    options: [
      { id: 'a', label: '잔잔한 어쿠스틱', signal: '차분·서정, 조용한 위로' },
      { id: 'b', label: '신나는 댄스 팝', signal: '활력·유쾌, 기분 띄우는' },
      { id: 'c', label: '웅장한 영화 OST', signal: '몰입·감정 고조, 서사적 대작' },
      { id: 'd', label: '감성 발라드', signal: '센치·여운, 감정을 파고드는' },
      { id: 'e', label: '로파이 비트', signal: '무던·집중, 잔잔히 곁에 두는' },
    ],
  },
  {
    id: 'mood-4',
    dimension: 'mood',
    prompt: '지금 마음을 날씨로 표현하면?',
    options: [
      { id: 'a', label: '구름 한 점 없는 맑음', signal: '안정·긍정, 산뜻한 이야기' },
      { id: 'b', label: '잔뜩 흐린 하늘', signal: '가라앉음·무기력, 부드러운 위로' },
      { id: 'c', label: '소나기 쏟아지는 중', signal: '감정 격동, 몰입해 쏟아낼 서사' },
      { id: 'd', label: '고요히 내리는 눈', signal: '차분·사색, 여백 있는 책' },
      { id: 'e', label: '천둥 치는 폭풍전야', signal: '긴장·불안, 강렬한 몰입' },
    ],
  },
  {
    id: 'mood-5',
    dimension: 'mood',
    prompt: '지금 가장 끌리는 색은?',
    options: [
      { id: 'a', label: '깊고 차분한 남색', signal: '고요·안정, 사색적인 책' },
      { id: 'b', label: '생기 도는 노란색', signal: '활력·밝음, 유쾌한 기분전환' },
      { id: 'c', label: '따뜻한 코럴 핑크', signal: '다정·온기, 마음 포근한 위로' },
      { id: 'd', label: '강렬한 레드', signal: '열정·긴장, 자극적인 몰입' },
      { id: 'e', label: '몽환적인 보라', signal: '신비·상상, 환상적인 세계' },
    ],
  },
  {
    id: 'mood-6',
    dimension: 'mood',
    prompt: '지금 있고 싶은 공간은?',
    options: [
      { id: 'a', label: '조용한 서재', signal: '집중·사색, 밀도 있는 독서' },
      { id: 'b', label: '북적이는 카페', signal: '적당한 활기, 가벼운 몰입' },
      { id: 'c', label: '한적한 바닷가', signal: '해방·여유, 마음 트이는 책' },
      { id: 'd', label: '포근한 이불 속', signal: '휴식·위안, 편안한 이야기' },
      { id: 'e', label: '낯선 여행지', signal: '설렘·모험, 새 세계로의 이동' },
    ],
  },
  {
    id: 'mood-7',
    dimension: 'mood',
    prompt: '지금 마음의 온도는?',
    options: [
      { id: 'a', label: '포근하게 따뜻', signal: '안정·온기, 다정한 이야기' },
      { id: 'b', label: '미지근하게 나른', signal: '무던·휴식, 부담 없는 책' },
      { id: 'c', label: '서늘하게 가라앉은', signal: '침잠·사색, 조용한 위로' },
      { id: 'd', label: '펄펄 끓는 뜨거움', signal: '열정·의욕, 몰입과 자극' },
    ],
  },
  {
    id: 'mood-8',
    dimension: 'mood',
    prompt: '지금 나에게 해주고 싶은 말은?',
    options: [
      { id: 'a', label: '좀 쉬어가자', signal: '휴식·위로가 필요한 상태' },
      { id: 'b', label: '다시 힘내보자', signal: '동기·의욕 충전이 필요' },
      { id: 'c', label: '멀리 떠나보자', signal: '도피·전환, 새 세계로' },
      { id: 'd', label: '오늘은 그냥 즐기자', signal: '오락·재미·가벼움' },
      { id: 'e', label: '차분히 생각해보자', signal: '사색·성찰, 깊이 있는 책' },
    ],
  },
  {
    id: 'mood-9',
    dimension: 'mood',
    prompt: '오늘 감정 날씨 예보를 낸다면?',
    options: [
      { id: 'a', label: '온종일 잔잔한 맑음', signal: '평온·안정' },
      { id: 'b', label: '오락가락 변덕 흐림', signal: '불안정·복잡, 마음 다독일 책' },
      { id: 'c', label: '오후 늦게 폭풍', signal: '격동·긴장, 강렬한 몰입' },
      { id: 'd', label: '짙은 안개 후 갬', signal: '혼란 뒤 정리, 통찰 주는 책' },
    ],
  },
  {
    id: 'mood-10',
    dimension: 'mood',
    prompt: '지금 당신에게 가장 필요한 건?',
    options: [
      { id: 'a', label: '푹 쉬는 시간', signal: '휴식·회복' },
      { id: 'b', label: '짜릿한 자극', signal: '자극·몰입·긴장' },
      { id: 'c', label: '따뜻한 위로', signal: '위안·공감' },
      { id: 'd', label: '순수한 재미', signal: '오락·유쾌' },
      { id: 'e', label: '깊은 몰입', signal: '몰입·집중·서사' },
    ],
  },

  // ══ purpose: 책에게 바라는 것 ══════════════════════════
  {
    id: 'purpose-1',
    dimension: 'purpose',
    prompt: '지금 책에게 바라는 한 가지는?',
    options: [
      { id: 'a', label: '위로받고 싶어요', signal: '정서적 위안·공감' },
      { id: 'b', label: '도망치고 싶어요', signal: '현실도피·몰입형 서사' },
      { id: 'c', label: '성장하고 싶어요', signal: '자기계발·통찰·배움' },
      { id: 'd', label: '그냥 재밌고 싶어요', signal: '오락·재미·페이지터너' },
      { id: 'e', label: '세상을 알고 싶어요', signal: '지식·교양·현실 이해' },
    ],
  },
  {
    id: 'purpose-2',
    dimension: 'purpose',
    prompt: '다 읽고 나서 남았으면 하는 건?',
    options: [
      { id: 'a', label: '따뜻해진 마음', signal: '온기·위로·힐링의 여운' },
      { id: 'b', label: '새로운 관점', signal: '인식의 전환·통찰' },
      { id: 'c', label: '짜릿한 몰입의 기억', signal: '강렬한 재미·몰입 경험' },
      { id: 'd', label: '써먹을 지식', signal: '실용·정보·바로 적용' },
    ],
  },
  {
    id: 'purpose-3',
    dimension: 'purpose',
    prompt: '요즘 당신에게 책이란?',
    options: [
      { id: 'a', label: '지친 하루의 도피처', signal: '위안·휴식·도피' },
      { id: 'b', label: '더 나은 내가 되는 사다리', signal: '성장·자기계발·목표' },
      { id: 'c', label: '심심함을 달래는 놀이', signal: '오락·재미·가벼움' },
      { id: 'd', label: '세상을 읽는 창문', signal: '지식·통찰·시야 확장' },
    ],
  },
  {
    id: 'purpose-4',
    dimension: 'purpose',
    prompt: '지금 채우고 싶은 결핍은?',
    options: [
      { id: 'a', label: '마음의 위안', signal: '정서적 결핍·위로' },
      { id: 'b', label: '지적인 자극', signal: '앎·사고의 갈증' },
      { id: 'c', label: '짜릿한 재미', signal: '자극·오락 결핍' },
      { id: 'd', label: '삶의 방향', signal: '의미·동기·나침반' },
    ],
  },
  {
    id: 'purpose-5',
    dimension: 'purpose',
    prompt: '이 책이 나에게 해줬으면 하는 건?',
    options: [
      { id: 'a', label: '가만히 위로해줘', signal: '위안·공감·힐링' },
      { id: 'b', label: '눈을 번쩍 뜨게 해줘', signal: '각성·통찰·깨달음' },
      { id: 'c', label: '실컷 즐겁게 해줘', signal: '오락·재미' },
      { id: 'd', label: '뭔가 가르쳐줘', signal: '지식·배움·실용' },
      { id: 'e', label: '가슴 설레게 해줘', signal: '설렘·감동·몰입' },
    ],
  },
  {
    id: 'purpose-6',
    dimension: 'purpose',
    prompt: '독서로 얻고 싶은 변화는?',
    options: [
      { id: 'a', label: '지친 마음 회복', signal: '치유·회복·안정' },
      { id: 'b', label: '넓어진 시야', signal: '시야 확장·교양' },
      { id: 'c', label: '늘어난 실력', signal: '실용·성장·역량' },
      { id: 'd', label: '기분 전환', signal: '리프레시·오락' },
    ],
  },
  {
    id: 'purpose-7',
    dimension: 'purpose',
    prompt: '책 고를 때 가장 중요한 건?',
    options: [
      { id: 'a', label: '무조건 재미', signal: '오락·흡입력 우선' },
      { id: 'b', label: '깊은 감동', signal: '감동·정서·여운 우선' },
      { id: 'c', label: '유익함', signal: '지식·실용 우선' },
      { id: 'd', label: '화제성', signal: '트렌드·베스트셀러 우선' },
      { id: 'e', label: '문학성', signal: '문체·작품성 우선' },
    ],
  },
  {
    id: 'purpose-8',
    dimension: 'purpose',
    prompt: '요즘 삶에서 찾고 있는 건?',
    options: [
      { id: 'a', label: '안정과 평온', signal: '안정 지향·위안' },
      { id: 'b', label: '새로운 도전', signal: '도전·성장 지향' },
      { id: 'c', label: '소소한 즐거움', signal: '재미·일상의 기쁨' },
      { id: 'd', label: '삶의 의미', signal: '의미·성찰 지향' },
    ],
  },
  {
    id: 'purpose-9',
    dimension: 'purpose',
    prompt: '완독 후 SNS에 한 줄 쓴다면?',
    options: [
      { id: 'a', label: '"인생책 갱신"', signal: '깊은 감동·작품성' },
      { id: 'b', label: '"큰 위로받았다"', signal: '위안·공감' },
      { id: 'c', label: '"시간 순삭"', signal: '흡입력·오락' },
      { id: 'd', label: '"많이 배웠다"', signal: '지식·유익' },
      { id: 'e', label: '"신선했다"', signal: '새로움·발견' },
    ],
  },
  {
    id: 'purpose-10',
    dimension: 'purpose',
    prompt: '지금 나에게 책의 역할은?',
    options: [
      { id: 'a', label: '곁을 지켜주는 친구', signal: '위로·동행·정서' },
      { id: 'b', label: '길을 알려주는 스승', signal: '배움·통찰·성장' },
      { id: 'c', label: '숨어드는 도피처', signal: '도피·휴식' },
      { id: 'd', label: '신나는 놀이터', signal: '오락·재미' },
      { id: 'e', label: '나를 비추는 거울', signal: '성찰·자기이해' },
    ],
  },

  // ══ reality: 현실 ↔ 환상 ══════════════════════════════
  {
    id: 'reality-1',
    dimension: 'reality',
    prompt: '눈앞에 문이 다섯 개. 하나만 연다면?',
    options: [
      { id: 'a', label: '낯선 행성으로 가는 문', signal: 'SF·미래·상상력' },
      { id: 'b', label: '100년 전 골목으로 가는 문', signal: '역사·시대물·고전 정취' },
      { id: 'c', label: '옆집 사람의 일기장', signal: '현실·일상·관계 드라마' },
      { id: 'd', label: '풀리지 않은 사건 파일', signal: '미스터리·추리·스릴' },
      { id: 'e', label: '마법이 흐르는 숲', signal: '판타지·신화·모험' },
    ],
  },
  {
    id: 'reality-2',
    dimension: 'reality',
    prompt: '끌리는 이야기의 배경은?',
    options: [
      { id: 'a', label: '지금 여기, 우리 동네', signal: '현실·동시대·일상성' },
      { id: 'b', label: '한 번도 없던 세계', signal: '판타지·SF·세계관 구축' },
      { id: 'c', label: '실제 있었던 어느 시대', signal: '역사·논픽션·시대 배경' },
      { id: 'd', label: '경계가 흐릿한 꿈결', signal: '몽환·마술적 리얼리즘·문학성' },
    ],
  },
  {
    id: 'reality-3',
    dimension: 'reality',
    prompt: '더 끌리는 주인공은?',
    options: [
      { id: 'a', label: '예언을 짊어진 마법사', signal: '판타지·영웅서사' },
      { id: 'b', label: '우주선을 모는 개척자', signal: 'SF·미래·모험' },
      { id: 'c', label: '지금 우리 옆의 누군가', signal: '현실·일상·공감' },
      { id: 'd', label: '역사의 소용돌이 속 인물', signal: '역사·시대·대하' },
    ],
  },
  {
    id: 'reality-4',
    dimension: 'reality',
    prompt: '하룻밤 살아본다면 어디서?',
    options: [
      { id: 'a', label: '네온 빛 미래 도시', signal: 'SF·사이버펑크·미래' },
      { id: 'b', label: '고성이 선 중세 왕국', signal: '판타지·중세·모험' },
      { id: 'c', label: '평범한 골목의 어느 집', signal: '현실·일상·생활' },
      { id: 'd', label: '외딴섬의 오두막', signal: '고립·서스펜스·자연' },
      { id: 'e', label: '마법 학교 기숙사', signal: '판타지·성장·모험' },
    ],
  },
  {
    id: 'reality-5',
    dimension: 'reality',
    prompt: '더 흥미로운 이야기는?',
    options: [
      { id: 'a', label: '실화를 바탕으로 한', signal: '논픽션·실화·현실' },
      { id: 'b', label: '완전히 지어낸 세계', signal: '판타지·SF·허구' },
      { id: 'c', label: '역사를 다시 상상한', signal: '역사·대체역사·시대' },
      { id: 'd', label: '현실 같지만 이상한', signal: '마술적 리얼리즘·문학' },
    ],
  },
  {
    id: 'reality-6',
    dimension: 'reality',
    prompt: '끌리는 표지 분위기는?',
    options: [
      { id: 'a', label: '몽환적인 일러스트', signal: '환상·감성·문학' },
      { id: 'b', label: '사실적인 사진', signal: '현실·논픽션·에세이' },
      { id: 'c', label: '고풍스러운 회화', signal: '고전·역사·시대' },
      { id: 'd', label: '우주·기하학 그래픽', signal: 'SF·과학·미래' },
      { id: 'e', label: '미니멀한 타이포', signal: '담백·현대·문학' },
    ],
  },
  {
    id: 'reality-7',
    dimension: 'reality',
    prompt: '읽고 싶은 세계관은?',
    options: [
      { id: 'a', label: '현실 그대로', signal: '현실·일상·리얼리즘' },
      { id: 'b', label: '살짝 비튼 평행세계', signal: 'SF·대체현실·상상' },
      { id: 'c', label: '아득한 먼 미래', signal: 'SF·미래·문명' },
      { id: 'd', label: '완전한 이세계', signal: '판타지·세계관·모험' },
    ],
  },
  {
    id: 'reality-8',
    dimension: 'reality',
    prompt: '지금 더 궁금한 건?',
    options: [
      { id: 'a', label: '사람 사는 진짜 이야기', signal: '현실·일상·인간' },
      { id: 'b', label: '있을 법한 미래', signal: 'SF·기술·전망' },
      { id: 'c', label: '신화와 전설', signal: '판타지·신화·상상' },
      { id: 'd', label: '실제 있었던 역사', signal: '역사·논픽션·사실' },
    ],
  },
  {
    id: 'reality-9',
    dimension: 'reality',
    prompt: '지금 떠나고 싶은 곳은?',
    options: [
      { id: 'a', label: '익숙한 일상 속으로', signal: '현실·공감·잔잔' },
      { id: 'b', label: '한 번도 못 간 세계로', signal: '환상·SF·모험' },
      { id: 'c', label: '추억의 그 시절로', signal: '역사·시대·향수' },
      { id: 'd', label: '꿈속 같은 곳으로', signal: '몽환·환상·문학' },
    ],
  },
  {
    id: 'reality-10',
    dimension: 'reality',
    prompt: '소설이라면 어느 쪽?',
    options: [
      { id: 'a', label: '현실 드라마', signal: '현실·관계·일상 소설' },
      { id: 'b', label: 'SF·판타지', signal: '환상·SF·장르소설' },
      { id: 'c', label: '역사·시대물', signal: '역사·시대 소설' },
      { id: 'd', label: '미스터리·스릴러', signal: '추리·스릴·서스펜스' },
      { id: 'e', label: '순수·문학', signal: '문학성·서정·작품성' },
    ],
  },

  // ══ tempo: 호흡 ═══════════════════════════════════════
  {
    id: 'tempo-1',
    dimension: 'tempo',
    prompt: '완독의 리듬은 어느 쪽?',
    options: [
      { id: 'a', label: '단숨에 빨려들어 밤새우기', signal: '속도감·흡입력·플롯 중심' },
      { id: 'b', label: '한 문장씩 곱씹으며 천천히', signal: '문장·사유·밀도' },
      { id: 'c', label: '틈틈이 가볍게 넘기기', signal: '짧은 호흡·에세이·단편' },
      { id: 'd', label: '지식을 차곡차곡 쌓기', signal: '구조적·정보 축적형' },
    ],
  },
  {
    id: 'tempo-2',
    dimension: 'tempo',
    prompt: '어떤 문장이 더 좋아요?',
    options: [
      { id: 'a', label: '군더더기 없이 시원시원한', signal: '간결·속도·가독성' },
      { id: 'b', label: '오래 머무는 아름다운', signal: '문체·서정·밀도' },
      { id: 'c', label: '위트 있고 톡톡 튀는', signal: '유머·경쾌·재치' },
    ],
  },
  {
    id: 'tempo-3',
    dimension: 'tempo',
    prompt: '완독까지 바라는 건?',
    options: [
      { id: 'a', label: '오늘 안에 끝내기', signal: '짧고 빠른·즉각적 완결' },
      { id: 'b', label: '일주일쯤 함께하기', signal: '표준 호흡·적당한 몰입' },
      { id: 'c', label: '천천히 오래오래', signal: '느린 밀도·장기 동행' },
    ],
  },
  {
    id: 'tempo-4',
    dimension: 'tempo',
    prompt: '이상적인 독서 페이스는?',
    options: [
      { id: 'a', label: '질주하듯 빠르게', signal: '속도·몰아치는 전개' },
      { id: 'b', label: '산책하듯 여유롭게', signal: '여유·잔잔·음미' },
      { id: 'c', label: '등산하듯 꾸준히', signal: '꾸준·구조적·성실' },
    ],
  },
  {
    id: 'tempo-5',
    dimension: 'tempo',
    prompt: '첫 장을 폈을 때 바라는 건?',
    options: [
      { id: 'a', label: '바로 빨려들기', signal: '강한 훅·속도감' },
      { id: 'b', label: '서서히 스며들기', signal: '잔잔한 빌드업·서정' },
      { id: 'c', label: '차근차근 안내받기', signal: '친절한 구성·정보형' },
    ],
  },
  {
    id: 'tempo-6',
    dimension: 'tempo',
    prompt: '선호하는 챕터 길이는?',
    options: [
      { id: 'a', label: '짧게 뚝뚝 끊기는', signal: '짧은 호흡·틈새 독서' },
      { id: 'b', label: '적당한 호흡', signal: '표준·균형' },
      { id: 'c', label: '길고 깊게 이어지는', signal: '몰입·밀도·장편' },
    ],
  },
  {
    id: 'tempo-7',
    dimension: 'tempo',
    prompt: '어떤 전개가 좋아요?',
    options: [
      { id: 'a', label: '반전과 사건이 몰아치는', signal: '플롯·긴장·속도' },
      { id: 'b', label: '잔잔히 흐르는', signal: '서정·여백·정적' },
      { id: 'c', label: '치밀하게 쌓아가는', signal: '빌드업·구성·깊이' },
    ],
  },
  {
    id: 'tempo-8',
    dimension: 'tempo',
    prompt: '평소 책 읽는 속도는?',
    options: [
      { id: 'a', label: '한 번에 몰아서', signal: '몰입·정주행형' },
      { id: 'b', label: '매일 조금씩', signal: '루틴·꾸준·짧은 호흡' },
      { id: 'c', label: '기분 날 때 왕창', signal: '불규칙·흡입력 의존' },
    ],
  },
  {
    id: 'tempo-9',
    dimension: 'tempo',
    prompt: '선호하는 스토리 밀도는?',
    options: [
      { id: 'a', label: '숨 가쁜 꽉 찬 전개', signal: '고밀도·속도·사건' },
      { id: 'b', label: '여백 있는 서사', signal: '여백·서정·사유' },
      { id: 'c', label: '정보가 알찬 구성', signal: '정보·구조·논픽션' },
    ],
  },
  {
    id: 'tempo-10',
    dimension: 'tempo',
    prompt: '한 문장에 머무는 시간은?',
    options: [
      { id: 'a', label: '휙휙 넘어가는 편', signal: '속독·가독성·속도' },
      { id: 'b', label: '가끔 멈춰 곱씹는 편', signal: '균형·음미' },
      { id: 'c', label: '자주 밑줄 긋는 편', signal: '문장·밀도·사유' },
    ],
  },

  // ══ situation: 읽는 상황/분량 ══════════════════════════
  {
    id: 'situation-1',
    dimension: 'situation',
    prompt: '이 책을 읽는 장면을 고른다면?',
    options: [
      { id: 'a', label: '잠들기 전 침대에서', signal: '잔잔·짧은 분량·마음 편한' },
      { id: 'b', label: '카페에서 혼자', signal: '몰입·적당한 무게·나만의 시간' },
      { id: 'c', label: '출퇴근 지하철에서', signal: '끊어 읽기 좋은·흡입력' },
      { id: 'd', label: '주말 통째로 방구석에서', signal: '장편·정주행·묵직해도 OK' },
    ],
  },
  {
    id: 'situation-2',
    dimension: 'situation',
    prompt: '지금 감당할 수 있는 두께는?',
    options: [
      { id: 'a', label: '앉은자리에서 끝나는 얇은 책', signal: '단편·에세이·짧은 분량' },
      { id: 'b', label: '적당히 며칠 걸리는 책', signal: '표준 분량·부담 없는 장편' },
      { id: 'c', label: '두껍고 깊게 파고드는 책', signal: '대작·심층·장기 몰입' },
    ],
  },
  {
    id: 'situation-3',
    dimension: 'situation',
    prompt: '책 읽을 시간은 주로 언제?',
    options: [
      { id: 'a', label: '자기 전 짧은 틈', signal: '짧은 호흡·잔잔·부담 없는' },
      { id: 'b', label: '주말의 긴 여유', signal: '몰입·장편 OK·정주행' },
      { id: 'c', label: '이동 중 자투리', signal: '끊어 읽기·흡입력·가벼움' },
    ],
  },
  {
    id: 'situation-4',
    dimension: 'situation',
    prompt: '주로 책 읽는 곳은?',
    options: [
      { id: 'a', label: '집 소파나 침대', signal: '편안·잔잔·휴식형 독서' },
      { id: 'b', label: '카페나 작업실', signal: '집중·몰입형' },
      { id: 'c', label: '대중교통 안', signal: '자투리·끊어읽기·가벼움' },
      { id: 'd', label: '도서관·서점', signal: '몰입·다독·집중' },
    ],
  },
  {
    id: 'situation-5',
    dimension: 'situation',
    prompt: '하루에 책 읽는 시간은?',
    options: [
      { id: 'a', label: '10분 남짓', signal: '짧은 분량·틈새 독서' },
      { id: 'b', label: '30분에서 한 시간', signal: '표준·꾸준' },
      { id: 'c', label: '두세 시간 푹', signal: '몰입·장편 소화' },
      { id: 'd', label: '그때그때 다름', signal: '불규칙·유연' },
    ],
  },
  {
    id: 'situation-6',
    dimension: 'situation',
    prompt: '주로 어떻게 읽어요?',
    options: [
      { id: 'a', label: '종이책 촉감으로', signal: '종이·소장·몰입' },
      { id: 'b', label: '이북으로 가볍게', signal: '전자책·이동성·분량 무관' },
      { id: 'c', label: '오디오북으로 들으며', signal: '오디오·멀티태스킹·서사' },
      { id: 'd', label: '가리지 않아요', signal: '유연·상관없음' },
    ],
  },
  {
    id: 'situation-7',
    dimension: 'situation',
    prompt: '한 권에 쓰는 기간은?',
    options: [
      { id: 'a', label: '하루 만에', signal: '짧은 분량·흡입력' },
      { id: 'b', label: '며칠에 걸쳐', signal: '표준 분량' },
      { id: 'c', label: '몇 주 느긋하게', signal: '장편·대작·장기' },
    ],
  },
  {
    id: 'situation-8',
    dimension: 'situation',
    prompt: '요즘 당신의 라이프스타일은?',
    options: [
      { id: 'a', label: '바빠서 짬독서', signal: '짧은 호흡·틈새·가벼움' },
      { id: 'b', label: '여유로워 몰입독서', signal: '몰입·장편 OK' },
      { id: 'c', label: '불규칙하게 그때그때', signal: '유연·흡입력 의존' },
      { id: 'd', label: '꾸준한 독서 루틴', signal: '루틴·표준·성실' },
    ],
  },
  {
    id: 'situation-9',
    dimension: 'situation',
    prompt: '가방에 넣고 싶은 책은?',
    options: [
      { id: 'a', label: '가벼운 문고본', signal: '얇음·휴대·짧은 호흡' },
      { id: 'b', label: '적당한 단행본', signal: '표준 분량' },
      { id: 'c', label: '무거워도 대작', signal: '장편·대작 감수' },
      { id: 'd', label: '전자책이라 무게 없음', signal: '전자책·분량 무관' },
    ],
  },
  {
    id: 'situation-10',
    dimension: 'situation',
    prompt: '완독에 대한 부담은?',
    options: [
      { id: 'a', label: '부담 없이 얇게', signal: '짧은 분량·가벼움' },
      { id: 'b', label: '적당히 도전', signal: '표준·균형' },
      { id: 'c', label: '두꺼워도 끝까지', signal: '장편·대작·완주 의지' },
    ],
  },

  // ══ curiosity: 끌리는 세계/주제 ════════════════════════
  {
    id: 'curiosity-1',
    dimension: 'curiosity',
    prompt: '요즘 가장 궁금한 세계는?',
    options: [
      { id: 'a', label: '사람의 마음속', signal: '심리·관계·인간 이해' },
      { id: 'b', label: '우주와 과학의 최전선', signal: '과학·기술·미래' },
      { id: 'c', label: '지나간 시대의 이야기', signal: '역사·인물·문명' },
      { id: 'd', label: '낯선 나라의 골목', signal: '여행·문화·이국' },
      { id: 'e', label: '돈과 세상이 굴러가는 법', signal: '경제·사회·시사' },
    ],
  },
  {
    id: 'curiosity-2',
    dimension: 'curiosity',
    prompt: '책 속에서 만나고 싶은 사람은?',
    options: [
      { id: 'a', label: '무너졌다 다시 일어서는 사람', signal: '성장서사·회복·인간승리' },
      { id: 'b', label: '세상과 불화하는 아웃사이더', signal: '문제적 개인·문학적 깊이' },
      { id: 'c', label: '미스터리를 쫓는 탐정', signal: '추리·수사·퍼즐' },
      { id: 'd', label: '평범한 하루를 사는 보통 사람', signal: '일상·잔잔·공감' },
      { id: 'e', label: '불가능에 도전하는 모험가', signal: '모험·도전·스케일' },
    ],
  },
  {
    id: 'curiosity-3',
    dimension: 'curiosity',
    prompt: 'SNS에서 자꾸 눈이 가는 콘텐츠는?',
    options: [
      { id: 'a', label: '사람 심리 파헤치는 글', signal: '심리·관계·자기이해' },
      { id: 'b', label: '과학·우주 떡밥', signal: '과학·기술·호기심' },
      { id: 'c', label: '역사 비하인드', signal: '역사·인문·교양' },
      { id: 'd', label: '재테크·트렌드 정보', signal: '경제·투자·시사' },
      { id: 'e', label: '여행·맛집·문화', signal: '여행·라이프스타일·문화' },
    ],
  },
  {
    id: 'curiosity-4',
    dimension: 'curiosity',
    prompt: '지금 보고 싶은 다큐멘터리는?',
    options: [
      { id: 'a', label: '사람들의 삶과 관계', signal: '인간·심리·휴먼' },
      { id: 'b', label: '우주와 자연의 신비', signal: '과학·자연·우주' },
      { id: 'c', label: '역사와 문명의 흥망', signal: '역사·문명·인문' },
      { id: 'd', label: '경제와 사회의 이면', signal: '경제·사회·시사' },
      { id: 'e', label: '예술가와 그들의 세계', signal: '예술·문화·창작' },
    ],
  },
  {
    id: 'curiosity-5',
    dimension: 'curiosity',
    prompt: '듣고 싶은 강연 주제는?',
    options: [
      { id: 'a', label: '마음과 관계의 심리학', signal: '심리·관계' },
      { id: 'b', label: '과학과 기술의 미래', signal: '과학·기술' },
      { id: 'c', label: '역사에서 배우는 통찰', signal: '역사·인문' },
      { id: 'd', label: '돈과 투자의 원리', signal: '경제·투자' },
      { id: 'e', label: '더 나은 삶의 태도', signal: '자기계발·에세이·삶' },
    ],
  },
  {
    id: 'curiosity-6',
    dimension: 'curiosity',
    prompt: '서점에서 가장 먼저 가는 코너는?',
    options: [
      { id: 'a', label: '소설·문학', signal: '문학·소설·서사' },
      { id: 'b', label: '과학·교양', signal: '과학·교양·지식' },
      { id: 'c', label: '역사·인문', signal: '역사·인문·사상' },
      { id: 'd', label: '경제·자기계발', signal: '경제·자기계발·실용' },
      { id: 'e', label: '예술·취미', signal: '예술·취미·라이프' },
    ],
  },
  {
    id: 'curiosity-7',
    dimension: 'curiosity',
    prompt: '지금 가장 끌리는 키워드는?',
    options: [
      { id: 'a', label: '관계와 감정', signal: '심리·관계·정서' },
      { id: 'b', label: '미래와 기술', signal: '과학·기술·미래' },
      { id: 'c', label: '과거와 뿌리', signal: '역사·인문·전통' },
      { id: 'd', label: '부와 성공', signal: '경제·자기계발·성공' },
      { id: 'e', label: '아름다움', signal: '예술·미학·감성' },
    ],
  },
  {
    id: 'curiosity-8',
    dimension: 'curiosity',
    prompt: '요즘 가장 알고 싶은 건?',
    options: [
      { id: 'a', label: '나를 더 이해하기', signal: '심리·자기이해·성찰' },
      { id: 'b', label: '세상이 돌아가는 원리', signal: '과학·경제·사회' },
      { id: 'c', label: '우리가 지나온 역사', signal: '역사·인문' },
      { id: 'd', label: '잘 살아가는 법', signal: '자기계발·에세이·삶' },
      { id: 'e', label: '취향을 넓히는 법', signal: '예술·문화·교양' },
    ],
  },
  {
    id: 'curiosity-9',
    dimension: 'curiosity',
    prompt: '검색창에 자주 치는 주제는?',
    options: [
      { id: 'a', label: '심리·성격', signal: '심리·관계' },
      { id: 'b', label: '과학·상식', signal: '과학·교양' },
      { id: 'c', label: '역사·인물', signal: '역사·인문' },
      { id: 'd', label: '경제·트렌드', signal: '경제·시사' },
      { id: 'e', label: '문화·예술', signal: '예술·문화' },
    ],
  },
  {
    id: 'curiosity-10',
    dimension: 'curiosity',
    prompt: '대화에서 가장 빠져드는 주제는?',
    options: [
      { id: 'a', label: '사람 이야기', signal: '심리·관계·인간' },
      { id: 'b', label: '신기한 지식', signal: '과학·교양·호기심' },
      { id: 'c', label: '옛날 이야기', signal: '역사·인문' },
      { id: 'd', label: '돈·세상 돌아가는 법', signal: '경제·사회·시사' },
      { id: 'e', label: '취향·감성 이야기', signal: '예술·문화·감성' },
    ],
  },

  // ══ tone: 원하는 온도 ═════════════════════════════════
  {
    id: 'tone-1',
    dimension: 'tone',
    prompt: '지금 당신에게 필요한 목소리는?',
    options: [
      { id: 'a', label: '따뜻하게 안아주는', signal: '위로·다정·힐링' },
      { id: 'b', label: '뒤통수를 치는 통찰', signal: '자극·반전·깨달음' },
      { id: 'c', label: '킥킥 웃게 하는 유머', signal: '유머·경쾌·위트' },
      { id: 'd', label: '조용히 곁에 있어주는', signal: '잔잔·사색·동행' },
      { id: 'e', label: '심장을 뛰게 하는 긴장', signal: '긴장·서스펜스·몰입' },
    ],
  },
  {
    id: 'tone-2',
    dimension: 'tone',
    prompt: '마지막 장을 덮을 때의 여운은?',
    options: [
      { id: 'a', label: '잔잔하게 스며드는', signal: '은은한 여운·서정' },
      { id: 'b', label: '머리를 얻어맞은 듯한', signal: '충격·반전·강렬함' },
      { id: 'c', label: '입가에 남는 미소', signal: '따뜻·유쾌·기분 좋음' },
      { id: 'd', label: '오래 곱씹게 되는 질문', signal: '사유·여지·묵직함' },
    ],
  },
  {
    id: 'tone-3',
    dimension: 'tone',
    prompt: '지금 위로가 필요한 방식은?',
    options: [
      { id: 'a', label: '다 괜찮다고 토닥여주기', signal: '따뜻·공감·위로' },
      { id: 'b', label: '정신 번쩍 드는 팩폭', signal: '자극·직언·동기부여' },
      { id: 'c', label: '같이 웃어넘기기', signal: '유머·경쾌·기분전환' },
      { id: 'd', label: '말없이 곁에 있어주기', signal: '잔잔·동행·고요' },
    ],
  },
  {
    id: 'tone-4',
    dimension: 'tone',
    prompt: '지금 끌리는 분위기는?',
    options: [
      { id: 'a', label: '포근하고 따뜻한', signal: '온기·힐링' },
      { id: 'b', label: '서늘하고 긴장된', signal: '긴장·스릴·서스펜스' },
      { id: 'c', label: '유쾌하고 경쾌한', signal: '유머·밝음' },
      { id: 'd', label: '고요하고 사색적인', signal: '정적·사유' },
      { id: 'e', label: '뜨겁고 강렬한', signal: '열정·몰입·강렬' },
    ],
  },
  {
    id: 'tone-5',
    dimension: 'tone',
    prompt: '책이 건네는 첫인사라면?',
    options: [
      { id: 'a', label: '"괜찮아, 다 지나가"', signal: '위로·공감' },
      { id: 'b', label: '"이건 생각해본 적 있어?"', signal: '통찰·자극' },
      { id: 'c', label: '"자, 웃을 준비 됐어?"', signal: '유머·경쾌' },
      { id: 'd', label: '"천천히 들어줄게"', signal: '잔잔·동행' },
      { id: 'e', label: '"각오는 됐지?"', signal: '긴장·몰입' },
    ],
  },
  {
    id: 'tone-6',
    dimension: 'tone',
    prompt: '지금 감정의 결은?',
    options: [
      { id: 'a', label: '잔잔한 물결', signal: '평온·서정' },
      { id: 'b', label: '휘몰아치는 파도', signal: '격동·강렬·몰입' },
      { id: 'c', label: '보글보글 즐거움', signal: '유쾌·경쾌' },
      { id: 'd', label: '깊고 고요한 심연', signal: '사색·묵직·깊이' },
    ],
  },
  {
    id: 'tone-7',
    dimension: 'tone',
    prompt: '원하는 감정 경험은?',
    options: [
      { id: 'a', label: '마음이 편안해지는', signal: '안정·위로' },
      { id: 'b', label: '머리가 번쩍하는', signal: '각성·통찰' },
      { id: 'c', label: '빵 터지는', signal: '유머·유쾌' },
      { id: 'd', label: '가슴 뭉클해지는', signal: '감동·정서' },
      { id: 'e', label: '짜릿해지는', signal: '긴장·스릴·몰입' },
    ],
  },
  {
    id: 'tone-8',
    dimension: 'tone',
    prompt: '책을 음료에 비유하면?',
    options: [
      { id: 'a', label: '따뜻한 코코아', signal: '포근·위로·힐링' },
      { id: 'b', label: '시원한 탄산', signal: '경쾌·상쾌·유머' },
      { id: 'c', label: '향긋한 커피', signal: '차분·집중·사색' },
      { id: 'd', label: '깊은 차 한 잔', signal: '고요·여운·깊이' },
      { id: 'e', label: '독한 위스키', signal: '강렬·묵직·자극' },
    ],
  },
  {
    id: 'tone-9',
    dimension: 'tone',
    prompt: '마지막 페이지에서의 반응은?',
    options: [
      { id: 'a', label: '잔잔한 미소', signal: '따뜻·만족·여운' },
      { id: 'b', label: '핑 도는 눈물', signal: '감동·정서·먹먹함' },
      { id: 'c', label: '돋는 소름', signal: '충격·반전·강렬' },
      { id: 'd', label: '깊은 한숨', signal: '먹먹·묵직·여운' },
      { id: 'e', label: '멍한 여운', signal: '사유·잔상·깊이' },
    ],
  },
  {
    id: 'tone-10',
    dimension: 'tone',
    prompt: '지금 가장 필요한 결은?',
    options: [
      { id: 'a', label: '다정한 위로', signal: '위로·공감·힐링' },
      { id: 'b', label: '날카로운 각성', signal: '자극·통찰·직언' },
      { id: 'c', label: '가벼운 웃음', signal: '유머·경쾌' },
      { id: 'd', label: '조용한 동행', signal: '잔잔·사색·동행' },
      { id: 'e', label: '뜨거운 자극', signal: '열정·긴장·몰입' },
    ],
  },

  // ══ challenge: 난이도/도전 ════════════════════════════
  {
    id: 'challenge-1',
    dimension: 'challenge',
    prompt: '독서 난이도, 어느 쪽이 좋아요?',
    options: [
      { id: 'a', label: '술술 읽히는 게 좋아요', signal: '쉬운·가독성·대중성' },
      { id: 'b', label: '좀 씹어먹는 맛이 있어야', signal: '밀도·깊이·난이도 있는' },
      { id: 'c', label: '중간 어디쯤', signal: '적당한 무게·균형' },
    ],
  },
  {
    id: 'challenge-2',
    dimension: 'challenge',
    prompt: '낯선 분야 앞에서 당신은?',
    options: [
      { id: 'a', label: '낯설어도 부딪혀볼래요', signal: '도전·확장·미지의 분야' },
      { id: 'b', label: '익숙한 취향 안에서', signal: '안정·검증된 취향' },
      { id: 'c', label: '살짝만 벗어나기', signal: '완만한 확장·인접 취향' },
    ],
  },
  {
    id: 'challenge-3',
    dimension: 'challenge',
    prompt: '어려운 책을 만나면?',
    options: [
      { id: 'a', label: '정복 욕구가 뿜뿜', signal: '도전·난이도 선호' },
      { id: 'b', label: '부담스러워 패스', signal: '쉬운·대중성 선호' },
      { id: 'c', label: '조금씩 도전해봄', signal: '완만한 도전·균형' },
    ],
  },
  {
    id: 'challenge-4',
    dimension: 'challenge',
    prompt: '독서의 재미는 어디서?',
    options: [
      { id: 'a', label: '쉽게 술술 몰입될 때', signal: '가독성·몰입·대중성' },
      { id: 'b', label: '어려운 걸 정복했을 때', signal: '난이도·성취·깊이' },
      { id: 'c', label: '몰랐던 걸 배울 때', signal: '배움·확장·지식' },
    ],
  },
  {
    id: 'challenge-5',
    dimension: 'challenge',
    prompt: '원하는 지식 수준은?',
    options: [
      { id: 'a', label: '입문자용 친절한', signal: '입문·쉬움·대중성' },
      { id: 'b', label: '중급, 적당히 깊은', signal: '중급·균형' },
      { id: 'c', label: '전문가급 깊이', signal: '심화·전문·난이도' },
    ],
  },
  {
    id: 'challenge-6',
    dimension: 'challenge',
    prompt: '낯선 개념을 만나면?',
    options: [
      { id: 'a', label: '흥미로워서 더 파고듦', signal: '탐구·도전·깊이' },
      { id: 'b', label: '어려우면 가볍게 넘김', signal: '가독성·대중성' },
      { id: 'c', label: '필요한 만큼만', signal: '실용·균형' },
    ],
  },
  {
    id: 'challenge-7',
    dimension: 'challenge',
    prompt: '완독 성취감은 어디서 와요?',
    options: [
      { id: 'a', label: '편하게 다 읽어냈을 때', signal: '가독성·완결·대중성' },
      { id: 'b', label: '어려운 걸 해냈을 때', signal: '난이도·정복·깊이' },
      { id: 'c', label: '몰랐던 걸 알게 됐을 때', signal: '배움·지식·확장' },
    ],
  },
  {
    id: 'challenge-8',
    dimension: 'challenge',
    prompt: '책을 고르는 기준은?',
    options: [
      { id: 'a', label: '부담 없이 즐길 것', signal: '가벼움·오락·대중성' },
      { id: 'b', label: '성장하려 도전할 것', signal: '성장·난이도·도전' },
      { id: 'c', label: '그때그때 기분대로', signal: '유연·균형' },
    ],
  },
  {
    id: 'challenge-9',
    dimension: 'challenge',
    prompt: '독서에 쓰고 싶은 뇌의 양은?',
    options: [
      { id: 'a', label: '쉬듯이 편하게', signal: '가독성·휴식형' },
      { id: 'b', label: '적당히 굴리며', signal: '균형·중급' },
      { id: 'c', label: '빡세게 사고하며', signal: '난이도·심화·사유' },
    ],
  },
  {
    id: 'challenge-10',
    dimension: 'challenge',
    prompt: '이해 안 되는 부분을 만나면?',
    options: [
      { id: 'a', label: '넘어가도 괜찮아', signal: '가벼움·흐름 중시' },
      { id: 'b', label: '끝까지 파고들래', signal: '탐구·깊이·난이도' },
      { id: 'c', label: '다시 읽어보는 편', signal: '성실·균형·이해 중시' },
    ],
  },

  // ══ discovery: 화제작 ↔ 숨은책 ↔ 고전 ═════════════════
  {
    id: 'discovery-1',
    dimension: 'discovery',
    prompt: '어떤 책에 더 끌려요?',
    options: [
      { id: 'a', label: '지금 다들 보는 화제작', signal: '베스트셀러·화제성·트렌드' },
      { id: 'b', label: '아무도 모르는 숨은 명작', signal: '히든젬·비주류·발굴' },
      { id: 'c', label: '시간이 검증한 스테디셀러', signal: '고전·스테디·검증된 명작' },
    ],
  },
  {
    id: 'discovery-2',
    dimension: 'discovery',
    prompt: '신상 vs 검증, 당신의 선택은?',
    options: [
      { id: 'a', label: '따끈한 신간이 좋아요', signal: '신간·최신·트렌드' },
      { id: 'b', label: '오래 사랑받은 게 좋아요', signal: '스테디·고전·검증' },
    ],
  },
  {
    id: 'discovery-3',
    dimension: 'discovery',
    prompt: '보통 어떻게 책을 발견해요?',
    options: [
      { id: 'a', label: '베스트셀러 순위 보고', signal: '화제성·인기·트렌드' },
      { id: 'b', label: '우연히 발견해서', signal: '발굴·세렌디피티·히든젬' },
      { id: 'c', label: '추천·입소문 듣고', signal: '추천·검증·화제' },
      { id: 'd', label: '고전 목록에서', signal: '고전·스테디·검증' },
    ],
  },
  {
    id: 'discovery-4',
    dimension: 'discovery',
    prompt: '남들 다 읽은 책, 당신은?',
    options: [
      { id: 'a', label: '나도 봐야지', signal: '화제작·트렌드 동참' },
      { id: 'b', label: '굳이 안 봐', signal: '비주류·독자적 취향' },
      { id: 'c', label: '궁금하긴 해', signal: '균형·선택적' },
    ],
  },
  {
    id: 'discovery-5',
    dimension: 'discovery',
    prompt: '나만 아는 책을 발견하면?',
    options: [
      { id: 'a', label: '보물 찾은 듯 짜릿', signal: '히든젬·발굴·독자적' },
      { id: 'b', label: '그냥 그런가 보다', signal: '무던·화제 무관' },
      { id: 'c', label: '얼른 공유하고파', signal: '공유·화제·추천' },
    ],
  },
  {
    id: 'discovery-6',
    dimension: 'discovery',
    prompt: '서점 매대에서 눈이 가는 곳은?',
    options: [
      { id: 'a', label: '베스트셀러 코너', signal: '인기·화제성·트렌드' },
      { id: 'b', label: '신간 매대', signal: '신간·최신' },
      { id: 'c', label: '구석의 숨은 책', signal: '히든젬·발굴·비주류' },
      { id: 'd', label: '스테디셀러 명작 코너', signal: '고전·스테디·검증' },
    ],
  },
  {
    id: 'discovery-7',
    dimension: 'discovery',
    prompt: '책 고르는 성향은?',
    options: [
      { id: 'a', label: '검증된 인기작 안전하게', signal: '베스트셀러·안전·검증' },
      { id: 'b', label: '새롭고 낯선 것 모험', signal: '발굴·모험·히든젬' },
      { id: 'c', label: '시간이 증명한 고전', signal: '고전·스테디' },
    ],
  },
  {
    id: 'discovery-8',
    dimension: 'discovery',
    prompt: '화제의 신간 vs 잊혀진 명작?',
    options: [
      { id: 'a', label: '화제의 신간', signal: '신간·트렌드·화제' },
      { id: 'b', label: '잊혀진 명작', signal: '발굴·고전·히든젬' },
      { id: 'c', label: '둘 다 좋아', signal: '균형·유연' },
    ],
  },
  {
    id: 'discovery-9',
    dimension: 'discovery',
    prompt: '추천받고 싶은 책은?',
    options: [
      { id: 'a', label: '요즘 제일 뜨는 책', signal: '트렌드·화제성·인기' },
      { id: 'b', label: '아무도 모르는 책', signal: '히든젬·발굴·비주류' },
      { id: 'c', label: '평생 남을 책', signal: '고전·스테디·명작' },
    ],
  },
  {
    id: 'discovery-10',
    dimension: 'discovery',
    prompt: '독서 취향을 한마디로?',
    options: [
      { id: 'a', label: '트렌드에 민감한 화제작 러버', signal: '트렌드·베스트셀러·화제' },
      { id: 'b', label: '숨은 보석 캐는 개척자', signal: '히든젬·발굴·독자적' },
      { id: 'c', label: '검증된 명작만 찾는 클래식파', signal: '고전·스테디·검증' },
    ],
  },
];
