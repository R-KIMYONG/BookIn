# 📚 책 In (BookIn)

> 도서 정보 탐색과 사용자 의견 공유를 한 곳에서 — 알라딘 OpenAPI 기반 도서 커뮤니티

🔗 **Live**: [book-in-two.vercel.app](https://book-in-two.vercel.app/)

---

## 프로젝트 소개

- **한 줄 정리**: 알라딘 OpenAPI로 도서 정보를 제공하고, 사용자 간 댓글·좋아요·북마크를 통해 의견을 공유할 수 있는 도서 커뮤니티 웹사이트
- **주요 가치**: 카테고리·베스트셀러·신간을 빠르게 탐색하고, 마음에 든 책에 태그/메모를 붙여 개인 서재로 관리

## ⏳ 제작 기간

- **MVP 개발**: 2024/07/08 ~ 2024/07/14 (팀 프로젝트)
- **개인 리팩토링 및 기능 확장**: 2024/07 ~ 현재 진행 중

---

## 🛠 기술 스택

### Frontend

<div align='left'>
<img src="https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=Next.js&logoColor=white" />
<img src="https://img.shields.io/badge/React%2019-20232a?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</div>

### State / Data

<div align='left'>
<img src="https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white" />
<img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white" />
</div>

### Backend / Infra

<div align='left'>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/Aladin%20OpenAPI-FF6F00?style=for-the-badge&logo=bookstack&logoColor=white" />
</div>

### Editor / Utilities

- **에디터**: Tiptap v3 (StarterKit + Placeholder)
- **HTML sanitize**: DOMPurify, sanitize-html
- **메일**: Nodemailer (비밀번호 재설정 / 이메일 인증)
- **유틸**: dayjs, uuid, lucide-react

### Test

<div align='left'>
<img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" />
<img src="https://img.shields.io/badge/MSW-FF6A33?style=for-the-badge&logo=mock-service-worker&logoColor=white" />
<img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" />
<img src="https://img.shields.io/badge/Testing%20Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white" />
</div>

---

## 📑 주요 기능

### 메인 페이지

- 알라딘 OpenAPI 기반 베스트셀러 / 신간 / 추천도서 진열
- **SSR 하이드레이션** 기반 초기 진입 최적화
- 카테고리(국내·외서·eBook) 분류 진입

### 카테고리 페이지

- `Bestseller / ItemNewAll / ItemNewSpecial / BlogBest / ItemEditorChoice` 쿼리 타입 전환
- `Book / Foreign / eBook` 타겟 전환
- 페이지네이션 (알라딘 정책상 최대 50페이지)

### 상세 페이지

- 도서 정보 (가격·표지·소개·구매 링크)
- **댓글** 조회 / 작성 / 수정 / 삭제 (낙관적 업데이트)
- **좋아요** 기능 (낙관적 업데이트, 비로그인 사용자 안내)
- **북마크** + 메모 + 태그 관리

### 마이페이지

- 내 책(myBooks): 북마크 / 댓글 / 좋아요한 책 통합 관리
- **검색 / 정렬 / 필터** 통합 UI (탭 간 상태 일관성 유지)
- 계정 설정: 아이디·비밀번호·닉네임·아바타 변경, 회원 탈퇴

### 인증

- Supabase Auth 기반 로그인 / 회원가입 / 이메일 인증
- 비밀번호 재설정 (메일 토큰 발급 → 확인 → 변경)
- 소셜 로그인 UI 컴포넌트

---

## 🔩 프로젝트 구조

도메인 단위 모듈 구조로 정리되어 있으며, `app` 라우팅 / 재사용 `components` / 도메인 비즈니스 로직 `shared`로 책임을 분리했습니다.

```
BookIn/
├── public/                          # 정적 자산
├── supabase/                        # supabase 마이그레이션 / config
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # 로그인·회원가입·비밀번호 재설정·이메일 확인
│   │   ├── (private)/               # 로그인 필요 — mypage, settings
│   │   │   └── mypage/_components/  # MyBookSection·Header·Pagination·Sidebar
│   │   ├── (public)/                # 비로그인 접근 가능
│   │   │   ├── (detailMainPage)/    # 도서 상세 + Comment 컴포넌트
│   │   │   ├── category/            # 카테고리 페이지 (검색 기능 추가 예정)
│   │   │   ├── marketing/
│   │   │   ├── terms/
│   │   │   └── terms_of_use/
│   │   ├── api/                     # Route Handlers
│   │   │   ├── aladin/              #   list / search / last-page
│   │   │   ├── auth/                #   callback / email-callback / password-reset
│   │   │   ├── bookmark/            #   memo / tags
│   │   │   ├── comment/
│   │   │   ├── like/                #   count / user
│   │   │   ├── mybooks/             #   bookmarks / comments / likes
│   │   │   └── user/                #   avatar / email / me / nickname / password / tags
│   │   ├── actions/                 # Server Actions
│   │   ├── layout.tsx · page.tsx · providers
│   │
│   ├── components/                  # 재사용 UI 컴포넌트
│   │   ├── book/
│   │   ├── bookmark/
│   │   ├── common/                  # ui (Button, Dropdown) / filters / SkeletonGrid
│   │   ├── form/                    # PasswordFields 등
│   │   ├── home/
│   │   ├── icons/                   # 소셜 로그인 아이콘 포함
│   │   ├── layout/                  # header / session
│   │   ├── modal/
│   │   └── session/
│   │
│   ├── hooks/                       # 도메인별 커스텀 훅
│   │   ├── auth/ · book/ · bookmark/ · comment/
│   │   ├── like/ · mybooks/ · mypage/
│   │   ├── url/                     # URL 쿼리 동기화
│   │   └── common/
│   │
│   ├── shared/
│   │   ├── api/                     # 클라이언트 API 래퍼 (mybooks 등)
│   │   ├── constants/               # category / search / pagination / auth / time …
│   │   ├── context/                 # React Context
│   │   ├── domain/                  # 도메인 비즈니스 로직
│   │   │   ├── aladin/ · auth/ · book/ · bookmark/ · category/
│   │   │   ├── comment/ · countdown/ · detail/ · like/
│   │   │   ├── mybooks/ · mypage/ · search/ · session/
│   │   │   ├── tag/ · terms/ · user/
│   │   ├── lib/                     # 외부 의존 래퍼·헬퍼
│   │   │   ├── aladin/ · auth/ · book/ · bookmark/ · comment/
│   │   │   ├── crypto/ · date/ · like/ · mail/(+templates)
│   │   │   ├── message/             # RESULT_CODE 기반 메시지 시스템
│   │   │   ├── network/ · server/(entities, mybooks)
│   │   │   ├── supabase/            # client / server / middleware
│   │   │   └── toast/
│   │   ├── providers/               # QueryClient 등 전역 Provider
│   │   ├── types/
│   │   └── utils/                   # navigation / security / validation
│   │
│   ├── stores/                      # Zustand 스토어
│   ├── data/                        # 정적 JSON 데이터 (장르 등)
│   ├── test/                        # 테스트 유틸 · msw 핸들러
│   ├── __test__/                    # 단위 테스트
│   └── middleware.ts                # Supabase 세션 미들웨어
│
├── next.config.mjs · tailwind.config.ts · tsconfig.json
├── vitest.config.ts · vitest.setup.ts
└── .env.local
```

### 폴더 분리 원칙

- **`app/`** — 라우팅·페이지 셸·서버 컴포넌트 / Route Handler. 라우트별 종속 컴포넌트는 `_components/`에 둠
- **`components/`** — 라우트와 무관하게 재사용 가능한 UI
- **`hooks/`** — 도메인별 React 훅 (`useXxxQuery`, `useXxxMutation` 등 TanStack Query 통합)
- **`shared/domain/`** — 비즈니스 규칙·도메인 모델 (UI/프레임워크 비의존)
- **`shared/lib/`** — Supabase·메일·암호화 등 외부 시스템 어댑터
- **`stores/`** — Zustand 전역 상태 (검색·필터·UI 상태 등)

---

## 🚀 시작하기

### 환경 변수 (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ALADIN_TTB_KEY=...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# 메일 발송용
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
```

### 스크립트

```bash
yarn dev          # 개발 서버
yarn build        # 프로덕션 빌드
yarn start        # 빌드 결과 실행
yarn lint         # ESLint
yarn test         # vitest watch
yarn test:run     # vitest 1회 실행 (CI)
yarn test:ui      # vitest UI
yarn genTypes     # supabase 스키마 → TypeScript 타입 생성
```

---

## ⚡ 주요 리팩토링 / 개선 이력

| 항목                           | 내용                                                               |
| ------------------------------ | ------------------------------------------------------------------ |
| **폰트 로딩 최적화**           | `next/font` 기반 CJK self-host 전환으로 CLS / LCP 개선             |
| **SSR 하이드레이션 전면 적용** | 전체 페이지에 SSR + TanStack Query prefetch / dehydrate 패턴 통일  |
| **메시지 시스템 통합**         | RESULT_CODE 기반 toast 메시지 구조 정리 — 클라/서버 동일 코드 사용 |
| **폴더 구조 재정리**           | 도메인 단위 모듈 구조 (`shared/domain` · `shared/lib`)로 책임 분리 |
| **myBooks 통합**               | 북마크·댓글·좋아요 탭 검색·정렬·필터 단일 상태로 통합              |
| **댓글 / 좋아요 / 북마크**     | 낙관적 업데이트 + invalidation 전략 적용                           |
| **이미지 최적화**              | `next/image` 일괄 전환으로 LCP 개선                                |

---

## 🧪 테스트 전략

- **단위 / 통합**: Vitest + React Testing Library
- **API mocking**: MSW (`src/test/msw`)
- **E2E**: Playwright (검색·인증·도서 상세 등 핵심 플로우)
- **타입 안전성**: Supabase 스키마 → TypeScript 타입 자동 생성 (`yarn genTypes`)

---

## 🛠 트러블슈팅 (대표 사례)

<details>
<summary><b>1. 댓글 수정 / 삭제 시 화면 즉시 반영 안 됨</b></summary>

- **원인**: invalidate 후 refetch 타이밍과 사용자 체감 사이의 간극
- **조치**: TanStack Query 낙관적 업데이트(`onMutate` → `setQueryData`) 적용 + Pagination total 카운트까지 일관성 유지

</details>

<details>
<summary><b>2. 마이페이지 ID 수정 시 값이 잘려서 저장</b></summary>

- **원인**: `useState` + `setTimeout` 조합과 `onAuthStateChange` 비동기 흐름이 맞물려 입력값이 일부만 반영
- **조치**: 입력값을 `useRef`로 관리해 리렌더 타이밍 영향 제거

</details>

<details>
<summary><b>3. 도서 이미지 LCP 지연</b></summary>

- **원인**: 외부 도메인 이미지 + 일반 `<img>` 태그
- **조치**: `next/image` 전환 + `priority` / `sizes` 지정, 카테고리 페이지 첫 화면 이미지 우선 로드

</details>

<details>
<summary><b>4. 폰트로 인한 CLS</b></summary>

- **원인**: 외부 CDN CJK 폰트 로드 지연
- **조치**: `next/font` self-host로 전환, preload + display swap 전략 적용

</details>

<details>
<summary><b>5. Supabase Route Handler 500 에러</b></summary>

- **원인**: `request.json()` 미사용 + 잘못된 환경변수 형식
- **조치**: `.env.local` URL/Key 형식 교정, `NextResponse.json()` 명시적 반환으로 정리

</details>

---

## 📌 진행 중 / 예정

- [ ] 카테고리 페이지 검색 기능 (`feat/category-search`)
- [ ] 알라딘 검색 API 통합 UI / URL 쿼리 동기화
- [ ] 검색 결과 페이지네이션 / 정렬 옵션 확장
