# 📌 Contribution Guide

본 프로젝트는 **일관된 아키텍처와 협업 효율을 유지하기 위해 규칙 기반으로 개발됩니다.**

이 문서는 단순한 규칙 나열이 아닌,  
**설계 의도(Why) + 적용 방식(How)을 포함한 개발 기준 문서입니다.**

---

# ✨ 1. 커밋 컨벤션 (Commit Convention)

## 🎯 목적

- 변경 이력 추적
- 기능 단위 개발
- 코드 리뷰 효율 향상

---

## 📌 Type 정의

| Type        | 설명      | 사용 기준                    |
| ----------- | --------- | ---------------------------- |
| ✨ feat     | 기능 추가 | 새로운 기능 구현             |
| 🐛 fix      | 버그 수정 | 오류 및 예외 처리            |
| ♻️ refactor | 리팩토링  | 동작 변경 없이 구조 개선     |
| 💄 style    | UI 변경   | 스타일 변경 (로직 변경 없음) |
| 🚚 move     | 구조 변경 | 파일 이동                    |
| 🔥 remove   | 코드 삭제 | 불필요 코드 제거             |
| 🧹 chore    | 기타 작업 | 설정, 빌드                   |

---

## 🧱 Commit Format

```
<Type>: <Subject>
```

- 변경 사항 1
- 변경 사항 2

### ✅ Example

✨ feat: 비밀번호 재설정 기능 추가

- 토큰 검증 API 구현
- reset-password 페이지 생성

---

## 🚨 규칙

- 한 커밋 = 하나의 책임
- subject는 50자 이내
- 현재형 동사 사용
- UI / 로직 변경 분리

---

# 🌱 2. 브랜치 전략 (Branch Strategy)

## 🎯 목적

- 기능 단위 개발
- 충돌 최소화
- 작업 흐름 명확화

---

## 📌 네이밍 규칙

```
<type>/<scope>-<short-desc>
```

---

## 📌 Type 정의

| Type     | 설명      |
| -------- | --------- |
| feat     | 기능 추가 |
| fix      | 버그 수정 |
| refactor | 리팩토링  |
| chore    | 설정      |

---

## 📌 Scope

auth / api / mypage / ui  
👉 필요 시 확장 가능

---

## 📌 Short Description

- 영어 소문자
- `-` 연결
- 3~5 단어

---

## 🚨 규칙

- 하나의 브랜치 = 하나의 기능
- main / dev 직접 커밋 금지
- 작업 후 즉시 삭제

---

# 🔄 3. 개발 워크플로우

## 📌 흐름

1. 브랜치 생성
2. 기능 개발
3. commit
4. PR → dev
5. 코드 리뷰
6. squash merge
7. 브랜치 삭제

---

## 📌 규칙

- dev = 통합 브랜치
- main = 배포 브랜치
- PR 후 merge 필수

---

## 🔗 서버 요청 아키텍처 (Simple Version)

### 📌 Core Rule

| 유형                    | 방식          |
| ----------------------- | ------------- |
| 외부 API                | `/api`        |
| 내부 조회 (단순)        | Supabase      |
| 내부 조회 (사용자 기준) | `/api`        |
| 데이터 변경             | `/api`        |
| 인증                    | Server Action |

---

## 🔥 판단 기준

다음 기준으로 API 사용 여부를 결정한다:

- 사용자(User) 기준 데이터인가?
  - YES → API 사용
  - NO → Supabase 직접 조회 가능

---

## 📌 예시

### Supabase

- 책 목록
- 검색 결과
- 댓글

### API

- 좋아요 여부
- 북마크 여부
- 내 데이터

---

## 🚨 핵심 원칙

- 단순 조회만 Supabase 허용
- user 관련 데이터는 API
- 모든 변경은 API
## 📌 단순 조회 기준

> [!NOTE]
> 다음 조건을 모두 만족하는 경우 Supabase 직접 조회를 허용한다:
> - 사용자(User) 정보가 필요 없는 경우
> - 데이터 가공이 없는 경우 (raw 조회)
> - 단순 리스트 형태

---

## 📡 HTTP Status

| 상황        | 코드 |
| ----------- | ---- |
| 성공        | 200  |
| 잘못된 요청 | 400  |
| 인증 실패   | 401  |
| 권한 없음   | 403  |
| 서버 오류   | 500  |

---

## 🔍 설계 기준

### 1. Query vs Mutation

- 조회(Read)는 React Query로 처리한다
- 변경(Create / Update / Delete)은 Mutation + API를 사용한다
- 서버 상태와 UI 상태를 분리하여 관리한다

---

### 2. API Layer 분리

- 외부 API 호출은 반드시 Route Handler를 통해 수행한다
- 클라이언트에서 외부 API를 직접 호출하지 않는다

👉 이유:

- 보안 (API Key 보호)
- 요청 구조 통제
- 에러 처리 일원화

---

### 3. Server Action 사용 기준

- 인증(Auth), 세션(Session), redirect가 포함된 경우 사용한다
- `<form action={serverAction}>` 구조에서 활용한다

👉 예:

- 로그인 / 회원가입
- 비밀번호 변경
- 인증 기반 요청
