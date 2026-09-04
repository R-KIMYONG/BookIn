import {
  LucideIcon,
  Cpu,
  BookImage,
  BookMarked,
  Heart,
  Sparkles,
  Fingerprint,
  Ghost,
  PenLine,
  BookOpen,
  ScrollText,
  Plane,
  Landmark,
  Brain,
  Building2,
  FlaskConical,
  Wrench,
  DraftingCompass,
  TrendingUp,
  ChefHat,
  Home,
  Users,
  Activity,
  Dumbbell,
  Scissors,
  Palette,
  Music,
  Smile,
  Baby,
  Languages,
  Scale,
  Newspaper,
  GraduationCap,
  Globe,
} from 'lucide-react';

// [부분일치 키워드, 아이콘] — 위에서부터 첫 매칭 승. 순서가 곧 우선순위.
const ICON_RULES: [string, LucideIcon][] = [
  ['인공지능', Cpu],
  ['만화', BookImage], // 만화>추리, 순정만화, BL만화, 스포츠만화 …
  ['웹툰', BookImage],
  ['라이트노벨', BookMarked],
  ['로맨', Heart], // 로맨스, 로맨틱판타지
  ['판타지', Sparkles], // 퓨전판타지
  ['추리', Fingerprint],
  ['미스터리', Fingerprint],
  ['호러', Ghost],
  ['스릴러', Ghost],
  ['에세이', PenLine], // 외국에세이, 한국에세이(eb) — '외국'보다 먼저
  ['소설', BookOpen], // 일본/프랑스/한국/영미소설, BL소설
  ['고전', ScrollText],
  ['여행', Plane],
  ['역사', Landmark],
  ['인문', Brain], // 교양인문학, 인문/사회 — '사회'보다 먼저
  ['사회', Building2], // 사회과학, 사회학 — '과학'보다 먼저
  ['마르크스', Building2],
  ['과학', FlaskConical],
  ['기술', Wrench],
  ['공학', Wrench],
  ['건축', DraftingCompass],
  ['경제', TrendingUp],
  ['경영', TrendingUp],
  ['요리', ChefHat],
  ['가정', Home], // 가정/원예/인테리어
  ['가족', Users],
  ['건강', Activity], // 건강/취미, 건강/스포츠 — '스포츠'·'취미'보다 먼저
  ['스포츠', Dumbbell],
  ['공예', Scissors], // 공예/취미/수집 — '취미'보다 먼저
  ['취미', Palette],
  ['예술', Palette],
  ['음악', Music],
  ['어린이', Smile],
  ['유아', Baby],
  ['외국어', Languages], // '도서/해외'류보다 먼저
  ['언어', Languages],
  ['법', Scale],
  ['잡지', Newspaper], // 잡지>시사, 해외잡지>… — '해외'보다 먼저
  ['수험서', GraduationCap],
  ['자격증', GraduationCap],
  ['참고서', GraduationCap],
  ['독해', GraduationCap],
  ['교육', GraduationCap],
  ['도서', Globe], // 대만도서, 독일도서
  ['해외', Globe],
];

export const getCategoryIcon = (label: string): LucideIcon => {
  const hit = ICON_RULES.find(([keyword]) => label.includes(keyword));
  return hit ? hit[1] : BookOpen; // 폴백
};
