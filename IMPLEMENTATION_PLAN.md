# Smim — 구현 플랜 (Implementation Plan)

**버전:** 1.1  
**작성일:** 2026-04-21  
**연관 문서:** PRD_SecondBrain.md  
**총 예상 시간:** 31–35h

---

## 전체 Task 맵

```
🔷 기반 세팅
  Task 01  프로젝트 초기 세팅           0.5h
  Task 02  Supabase DB 스키마           1h
  Task 03  Auth (로그인/회원가입)        2h

🔷 저장 파이프라인
  Task 04  아티클 URL 저장 API          2h
  Task 05  YouTube URL 저장 API         1.5h
  Task 06  Railway 미디어 서버 세팅      2h
  Task 07  Instagram URL 저장 API       3h
  Task 08  파일 업로드 저장 API (PDF/TXT/MD)  2h
  Task 09  텍스트 직접 입력 API          1h

🔷 UI
  Task 10  홈 대시보드 UI               3h
  Task 11  입력 모달 UI (5탭)           3h
  Task 12  콘텐츠 상세 페이지            1.5h

🔷 복습 기능
  Task 13  SM-2 로직 + 리뷰 API        2h
  Task 14  복습 화면 UI                 2h

🔷 마무리
  Task 15  주간 이메일                  2h
  Task 16  E2E 테스트 + 배포            3h
```

---

## 환경 변수 (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
FIRECRAWL_API_KEY=
RESEND_API_KEY=
CRON_SECRET=
RAILWAY_MEDIA_SERVER_URL=   # Task 06 완료 후 채움
RAILWAY_API_KEY=            # Task 06 완료 후 채움
```

---

## 상세 플랜

---

### Task 01: 프로젝트 초기 세팅

**File(s):** `package.json`, `.env.local`, `vitest.config.ts`, `next.config.ts`

```
Steps:
  1. Next.js 앱 생성
     npx create-next-app@latest smim --typescript --tailwind --app
     cd smim

  2. 패키지 설치
     npm install @supabase/supabase-js @anthropic-ai/sdk resend
     npm install youtube-transcript firecrawl-js
     npm install next-pwa
     npm install -D vitest @vitejs/plugin-react @testing-library/react
     npm install -D @testing-library/jest-dom jsdom

  3. vitest.config.ts 생성
     import { defineConfig } from 'vitest/config'
     import react from '@vitejs/plugin-react'
     export default defineConfig({
       plugins: [react()],
       test: {
         environment: 'jsdom',
         setupFiles: ['./vitest.setup.ts'],
       },
     })

  4. vitest.setup.ts 생성
     import '@testing-library/jest-dom'

  5. next.config.ts — next-pwa 설정
     const withPWA = require('next-pwa')({ dest: 'public' })
     module.exports = withPWA({ ... })

  6. public/manifest.json 생성
     {
       "name": "스밈",
       "short_name": "Smim",
       "theme_color": "#2D3A8C",
       "background_color": "#F8F7F4",
       "display": "standalone",
       "start_url": "/dashboard"
     }

  7. .env.local 키 세팅 (위 환경변수 참조)

  8. package.json scripts 추가
     "test": "vitest",
     "test:ui": "vitest --ui"
```

**Verification:** `npm run dev` → localhost:3000 정상 렌더 확인

---

### Task 02: Supabase DB 스키마

**File(s):** `supabase/migrations/001_init.sql`

```sql
-- contents 테이블
create table contents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users not null,
  type          text not null check (type in ('article','youtube','instagram','text')),
  url           text,
  title         text not null,
  full_text     text not null,
  summary       text not null,
  category      text not null,
  tags          text[] default '{}',
  thumbnail_url text,
  created_at    timestamptz default now()
);

-- review_schedule 테이블
create table review_schedule (
  id             uuid primary key default gen_random_uuid(),
  content_id     uuid references contents(id) on delete cascade,
  user_id        uuid references auth.users not null,
  next_review_at date not null default current_date + 1,
  interval_days  int not null default 1,
  ease_factor    numeric not null default 2.5,
  review_count   int not null default 0
);

-- email_logs 테이블
create table email_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  sent_at     timestamptz default now(),
  content_ids uuid[] not null
);

-- subscriptions 테이블
create table subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users not null unique,
  plan                text not null default 'free',
  status              text not null default 'active',
  current_period_end  timestamptz,
  created_at          timestamptz default now()
);

-- RLS 활성화
alter table contents enable row level security;
alter table review_schedule enable row level security;
alter table subscriptions enable row level security;

create policy "본인 데이터만" on contents
  for all using (auth.uid() = user_id);
create policy "본인 데이터만" on review_schedule
  for all using (auth.uid() = user_id);
create policy "본인 데이터만" on subscriptions
  for all using (auth.uid() = user_id);
```

**Verification:** Supabase 대시보드에서 테이블 4개 생성 확인

---

### Task 03: Supabase Auth

**File(s):**
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`
- `middleware.ts`
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`

```
Steps:
  1. lib/supabase/client.ts — 브라우저용 클라이언트
     import { createBrowserClient } from '@supabase/ssr'
     export const createClient = () =>
       createBrowserClient(
         process.env.NEXT_PUBLIC_SUPABASE_URL!,
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
       )

  2. lib/supabase/server.ts — 서버 컴포넌트용
     import { createServerClient } from '@supabase/ssr'
     (cookies() 사용)

  3. lib/supabase/admin.ts — 서버 전용 admin 클라이언트
     import { createClient } from '@supabase/supabase-js'
     export const adminClient = createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.SUPABASE_SERVICE_ROLE_KEY!
     )

  4. middleware.ts — 비로그인 시 /login 리다이렉트
     protected routes: /dashboard, /review, /articles

  5. app/(auth)/login/page.tsx
     - 이메일 + 패스워드 폼
     - supabase.auth.signInWithPassword()
     - 성공 시 /dashboard 리다이렉트

  6. app/(auth)/signup/page.tsx
     - 이메일 + 패스워드 + 확인 폼
     - supabase.auth.signUp()
     - 성공 시 이메일 확인 안내

Tests (RED → GREEN):
  - 로그인 폼 렌더 테스트
  - 미들웨어 리다이렉트 로직 단위 테스트
  - 비로그인 상태 /dashboard 접근 → /login 리다이렉트 확인
```

**Verification:** 회원가입 → 로그인 → /dashboard 진입 확인

---

### Task 04: 아티클 URL 저장 API

**File(s):**
- `lib/scraper.ts`
- `lib/ai.ts`
- `app/api/contents/route.ts`

```
Steps:
  1. lib/scraper.ts — scrapeArticle(url: string)
     import FirecrawlApp from 'firecrawl-js'
     const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })
     → { title: string, markdown: string } 반환
     → 실패 시 에러 throw

  2. lib/ai.ts — analyzeContent(text: string, type: string)
     Claude API 호출:
     """
     다음 글을 읽고 JSON으로만 응답해. 다른 텍스트 없이 JSON만:
     {
       "summary": "3줄 핵심 요약",
       "category": "기술/개발 | 비즈니스/마케팅 | 투자/경제 | 라이프스타일 | 기타 중 하나",
       "tags": ["태그1", "태그2", "태그3"]
     }
     글: {text}
     """
     → JSON.parse() 후 반환
     → 파싱 실패 시 category: "기타" 기본값

  3. app/api/contents/route.ts (POST) — article 케이스
     body: { url, type: "article" }
     → scrapeArticle(url)
     → analyzeContent(markdown)
     → supabase contents INSERT
     → supabase review_schedule INSERT
     → 201 반환

Tests (RED → GREEN):
  - analyzeContent() 단위 테스트 (mock Claude 응답)
  - POST { url, type: "article" } → 201 + DB 행 생성
  - POST url 없을 때 → 400
  - 스크래핑 실패 시 → 500
```

**Verification:** `curl -X POST /api/contents -d '{"url":"https://...","type":"article"}'` → DB 확인

---

### Task 05: YouTube URL 저장 API

**File(s):**
- `lib/youtube.ts`
- `app/api/contents/route.ts` (기존 파일 수정)

```
Steps:
  1. lib/youtube.ts — getYoutubeTranscript(url: string)
     import { YoutubeTranscript } from 'youtube-transcript'
     videoId 추출: url.match(/(?:v=|youtu\.be\/)([^&\n?]+)/)
     → YoutubeTranscript.fetchTranscript(videoId)
     → transcript 텍스트 합산 반환
     → 자막 없을 시 에러 throw (message: "자막 없음")

  2. app/api/contents/route.ts — youtube 케이스 추가
     body: { url, type: "youtube" }
     → getYoutubeTranscript(url)
       실패 시: 400 + "자막을 찾을 수 없습니다. 텍스트로 직접 입력해주세요"
     → analyzeContent(transcript)
     → supabase INSERT (thumbnail_url: youtube 썸네일 URL)
     → review_schedule INSERT
     → 201 반환

Tests (RED → GREEN):
  - getYoutubeTranscript() videoId 추출 테스트
  - POST { url, type: "youtube" } 성공 케이스
  - 자막 없는 영상 → 400 반환 확인
```

**Verification:** YouTube URL POST → DB에 transcript 기반 요약 저장 확인

---

### Task 06: Railway 미디어 서버 세팅

**File(s) (별도 Railway 프로젝트):**
- `railway-media/main.py`
- `railway-media/requirements.txt`
- `railway-media/Dockerfile`

```
Steps:
  1. Railway 새 프로젝트 생성 (smim-media)

  2. railway-media/requirements.txt
     fastapi
     uvicorn
     yt-dlp
     anthropic
     python-multipart

  3. railway-media/Dockerfile
     FROM python:3.11-slim
     RUN apt-get update && apt-get install -y ffmpeg
     COPY requirements.txt .
     RUN pip install -r requirements.txt
     COPY . .
     CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

  4. railway-media/main.py — FastAPI 서버
     POST /process-instagram
       body: { url: string, api_key: string }
       → api_key 검증 (RAILWAY_API_KEY)
       → yt-dlp로 /tmp 다운로드
       → 타입 감지:
           영상 → ffmpeg 프레임 3장 추출 → 각 프레임 base64
           이미지 → 슬라이드 전체 base64 목록
       → Claude Vision API 호출 → 텍스트 추출
       → /tmp 파일 즉시 삭제
       → { title, full_text } 반환

  5. Railway 환경변수 세팅
     ANTHROPIC_API_KEY=
     RAILWAY_API_KEY=   (랜덤 시크릿 생성)

  6. Railway 배포 → URL 확인
     → .env.local에 RAILWAY_MEDIA_SERVER_URL, RAILWAY_API_KEY 저장

Tests:
  - curl로 /process-instagram 직접 호출 → 응답 확인
  - 영상 URL → full_text 반환 확인
  - 카드뉴스 URL → 슬라이드 텍스트 합산 확인
```

**Verification:** Railway URL로 curl 테스트 → full_text 정상 반환

---

### Task 07: Instagram URL 저장 API

**File(s):**
- `lib/instagram.ts`
- `app/api/contents/route.ts` (기존 파일 수정)

```
Steps:
  1. lib/instagram.ts — processInstagram(url: string)
     Railway 미디어 서버로 POST 요청:
     fetch(`${RAILWAY_MEDIA_SERVER_URL}/process-instagram`, {
       method: 'POST',
       body: JSON.stringify({ url, api_key: RAILWAY_API_KEY })
     })
     → { title, full_text } 반환
     → 실패 시 에러 throw

  2. app/api/contents/route.ts — instagram 케이스 추가
     body: { url, type: "instagram" }
     → processInstagram(url)
       실패 시: 500 + "처리 실패, 잠시 후 다시 시도해주세요"
     → analyzeContent(full_text)
     → supabase INSERT
     → review_schedule INSERT
     → 201 반환

Tests (RED → GREEN):
  - processInstagram() Railway 호출 mock 테스트
  - POST { url, type: "instagram" } 성공 케이스
  - Railway 서버 에러 시 → 500 반환 확인
```

**Verification:** 릴스 URL + 카드뉴스 URL 각각 POST → DB 저장 확인

---

### Task 08: 파일 업로드 저장 API

**File(s):**
- `lib/fileParser.ts`
- `app/api/contents/route.ts` (기존 파일 수정)

```
Steps:
  1. 패키지 설치
     npm install pdf-parse multer
     npm install -D @types/pdf-parse @types/multer

  2. lib/fileParser.ts — parseFile(file: File)
     확장자 감지:
       .pdf → pdf-parse로 텍스트 추출
         import pdfParse from 'pdf-parse'
         const data = await pdfParse(buffer)
         return { title: filename, text: data.text }

       .txt / .md → buffer.toString('utf-8')
         return { title: filename, text: content }

       그 외 → 에러 throw ("지원하지 않는 파일 형식")

     파일 크기 검증: 10MB 초과 시 에러 throw

  3. app/api/contents/route.ts — file 케이스 추가
     body: FormData { file: File, type: "file" }
     → 파일 크기 검증 (10MB)
     → 확장자 검증 (.pdf / .txt / .md)
     → parseFile(file) → { title, text }
     → analyzeContent(text)
     → supabase INSERT (url: null, thumbnail_url: null)
     → review_schedule INSERT
     → 201 반환

  4. 전체 분기 최종 정리
     type === "article"   → scrapeArticle → analyzeContent
     type === "youtube"   → getYoutubeTranscript → analyzeContent
     type === "instagram" → processInstagram → analyzeContent
     type === "file"      → parseFile → analyzeContent
     type === "text"      → analyzeContent (직통)
     else                 → 400 Bad Request

Tests (RED → GREEN):
  - parseFile() PDF 텍스트 추출 테스트 (mock pdf-parse)
  - parseFile() TXT 파일 읽기 테스트
  - parseFile() MD 파일 읽기 테스트
  - 지원하지 않는 확장자 → 400 확인
  - 10MB 초과 파일 → 400 확인
  - POST FormData { file, type: "file" } → 201 + DB 저장 확인
```

**Verification:** PDF 업로드 → 텍스트 추출 → 요약 저장 확인

---

### Task 09: 텍스트 직접 입력 API

**File(s):**
- `app/api/contents/route.ts` (기존 파일 수정)

```
Steps:
  1. app/api/contents/route.ts — text 케이스 추가
     body: { title, text, type: "text" }
     → analyzeContent(text)
     → supabase INSERT
     → review_schedule INSERT
     → 201 반환

  2. 전체 분기 최종 정리
     type === "article"   → scrapeArticle → analyzeContent
     type === "youtube"   → getYoutubeTranscript → analyzeContent
     type === "instagram" → processInstagram → analyzeContent
     type === "file"      → parseFile → analyzeContent
     type === "text"      → analyzeContent (직통)
     else                 → 400 Bad Request

Tests (RED → GREEN):
  - POST { title, text, type: "text" } → 201 확인
  - type 없을 때 → 400 확인
  - title + text 모두 없을 때 → 400 확인
```

**Verification:** Postman으로 텍스트 POST → DB 저장 + review_schedule 행 확인

---

### Task 10: 홈 대시보드 UI

**File(s):**
- `app/(dashboard)/dashboard/page.tsx`
- `components/ContentCard.tsx`
- `components/CategoryFilter.tsx`
- `components/ReviewBanner.tsx`

```
Steps:
  1. app/(dashboard)/dashboard/page.tsx
     - Supabase에서 contents 조회 (user_id 기준)
     - review_schedule에서 next_review_at <= today 카운트
     - 카테고리별 그룹핑

  2. components/CategoryFilter.tsx
     탭 목록: [전체 | 기술/개발 | 비즈니스/마케팅 | 투자/경제 | 라이프스타일 | 기타]
     선택된 탭에 따라 필터링

  3. components/ContentCard.tsx
     - 타입 배지 (📄🎬📱✏️)
     - 제목 (최대 2줄)
     - 카테고리 칩
     - 요약 (최대 3줄)
     - 날짜
     - 썸네일 (youtube/instagram)
     - 모바일: 1열 / PC: 2~3열 그리드

  4. components/ReviewBanner.tsx
     오늘 복습 대상 n건 → /review 링크
     n === 0 이면 배너 숨김

  5. "+" FAB 버튼
     모바일: 우하단 고정 (fixed bottom-6 right-6)
     PC: 상단 네비 바 안

Tests (RED → GREEN):
  - ContentCard 렌더 테스트 (타입별 배지 확인)
  - CategoryFilter 탭 클릭 → 필터 변경 테스트
  - ReviewBanner n=0 → 숨김 테스트
  - ReviewBanner n>0 → 카운트 표시 테스트
```

**Verification:** 저장된 콘텐츠가 카테고리 탭별로 분류되어 표시

---

### Task 11: 입력 모달 UI

**File(s):**
- `components/AddContentModal.tsx`

```
Steps:
  1. 5탭 구조
     [📄 아티클] [🎬 YouTube] [📱 Instagram] [📎 파일] [✏️ 텍스트]

  2. 탭별 입력 폼
     아티클/YouTube/Instagram: URL 입력 필드
     파일: 드래그 앤 드롭 + 클릭 업로드 (PDF/TXT/MD)
           파일명 + 크기 미리보기
           확장자/크기 유효성 검사
     텍스트: 제목 + 텍스트 textarea

  3. 제출 → POST /api/contents 호출
     미디어(Instagram) 처리 시 안내 문구:
     "AI가 분석 중입니다. 최대 2분 소요될 수 있어요."

  4. 로딩 스피너 (처리 중)

  5. 완료 → 모달 닫힘 + 카드 목록 갱신

  6. 모바일: 풀스크린 바텀시트
     PC: 센터 모달 (max-w-lg)

  7. 에러 메시지 표시
     - YouTube 자막 없음 → "자막을 찾을 수 없습니다. 텍스트 탭으로 입력해주세요"
     - Instagram 실패 → "처리에 실패했습니다. 잠시 후 다시 시도해주세요"
     - 잘못된 파일 형식 → "PDF, TXT, MD 파일만 지원합니다"
     - 파일 크기 초과 → "파일 크기는 10MB 이하여야 합니다"

Tests (RED → GREEN):
  - 모달 열기/닫기 테스트
  - 5탭 전환 테스트
  - 파일 탭 확장자 유효성 검사 테스트
  - 파일 크기 초과 → 에러 메시지 테스트
  - 로딩 상태 표시 테스트
  - 에러 메시지 표시 테스트
```

**Verification:** PDF 업로드 → 로딩 → 카드 즉시 반영 확인

---

### Task 12: 콘텐츠 상세 페이지

**File(s):**
- `app/(dashboard)/contents/[id]/page.tsx`

```
Steps:
  1. content_id로 Supabase 조회

  2. 상단 헤더
     - 타입 배지 (📄🎬📱✏️)
     - 제목
     - 카테고리 칩 + 태그들
     - 날짜

  3. 중단: 요약 박스
     배경색 강조 (인디고 계열 연한 배경)
     "AI 요약" 레이블

  4. 하단: 전문 (full_text 마크다운 렌더)
     npm install react-markdown

  5. 하단 버튼
     - 원문 링크 버튼 (url 있을 때만)
     - YouTube/Instagram: 원본 URL로 이동

  6. 모바일: 단일 컬럼 스크롤
     PC: 좌측 요약 고정 / 우측 전문 스크롤 (2컬럼)

Tests (RED → GREEN):
  - 페이지 렌더 + 데이터 표시 테스트
  - url 없을 때 원문 링크 버튼 숨김 테스트
  - 마크다운 렌더 확인
```

**Verification:** 카드 클릭 → 상세 페이지 → 요약 + 전문 정상 표시

---

### Task 13: SM-2 복습 로직 + 리뷰 API

**File(s):**
- `lib/sm2.ts`
- `app/api/reviews/route.ts`

```
Steps:
  1. lib/sm2.ts — calculateNextReview(ease: number, interval: number, quality: number)
     quality: 5(기억남) / 3(희미함) / 1(잊었음)

     if quality >= 3:
       interval = Math.round(interval * ease)
       ease = ease + (0.1 - (5 - quality) * 0.08)
     else:
       interval = 1
       ease = Math.max(1.3, ease - 0.2)

     return {
       nextInterval: interval,
       nextEase: parseFloat(ease.toFixed(2)),
       nextReviewAt: addDays(new Date(), interval)
     }

  2. app/api/reviews/route.ts (POST)
     body: { content_id, quality }
     → review_schedule 조회
     → calculateNextReview()
     → review_schedule UPDATE
       next_review_at, interval_days, ease_factor, review_count+1
     → 200 반환

Tests (RED → GREEN):
  - calculateNextReview(2.5, 1, 5) → interval 증가 확인
  - calculateNextReview(2.5, 7, 1) → interval=1 리셋 확인
  - ease_factor 최솟값 1.3 보장 확인
  - quality=5 연속 3회 → 1→2→5→13일 시퀀스 확인
  - POST /api/reviews → DB 갱신 확인
```

**Verification:** quality=5 연속 3회 → interval 1→2→5→13 증가 확인

---

### Task 14: 복습 화면 UI

**File(s):**
- `app/(dashboard)/review/page.tsx`
- `components/ReviewCard.tsx`

```
Steps:
  1. app/(dashboard)/review/page.tsx
     - review_schedule에서 next_review_at <= today 조회
     - contents JOIN으로 제목/요약/타입 가져오기
     - 남은 복습 수 카운터 표시

  2. components/ReviewCard.tsx
     상태 A — 요약 숨김:
       타입 배지 + 제목 + 카테고리
       "요약 보기" 버튼

     상태 B — 요약 노출:
       + 요약 박스
       하단 3버튼:
         [기억남 ✅]  [희미함 🤔]  [잊었음 ❌]

  3. 버튼 클릭 → POST /api/reviews { content_id, quality }
     → 다음 카드로 전환 (애니메이션)

  4. 모두 완료 시 완료 화면
     "오늘 복습 끝! 🎉"
     오늘 복습한 수 + 대시보드로 돌아가기 버튼

  5. 모바일: 풀스크린 카드
     PC: 카드 중앙 배치 (max-w-2xl mx-auto)

Tests (RED → GREEN):
  - ReviewCard 렌더 테스트
  - "요약 보기" 클릭 → 요약 노출 토글 테스트
  - 버튼 클릭 → POST /api/reviews 호출 확인
  - 버튼 클릭 → 다음 카드 전환 테스트
  - 복습 0개 → 완료 화면 바로 표시 테스트
  - 마지막 카드 완료 → 완료 화면 전환 테스트
```

**Verification:** 복습 대상 3개 → 버튼 3회 클릭 → 완료 화면 확인

---

### Task 15: 주간 요약 이메일

**File(s):**
- `lib/email.ts`
- `app/api/cron/weekly-email/route.ts`
- `vercel.json`

```
Steps:
  1. lib/email.ts — sendWeeklySummary(userId: string, contents: Content[])
     Resend API HTML 이메일:
     제목: "스밈 — 이번 주 저장한 {n}개의 지식"
     내용:
       [타입 배지] 제목
       → 요약 1줄
       (반복)
     푸터: "smim.app에서 보기" 링크

  2. app/api/cron/weekly-email/route.ts (GET)
     - Authorization 헤더 검증: Bearer {CRON_SECRET}
       불일치 시 401 반환
     - adminClient로 전체 유저 조회
     - 유저별 최근 7일 contents 조회
     - 1건 이상이면 sendWeeklySummary()
     - email_logs INSERT (content_ids 배열)
     - 200 반환

  3. vercel.json 생성
     {
       "crons": [{
         "path": "/api/cron/weekly-email",
         "schedule": "0 23 * * 0"
       }]
     }
     (일요일 23:00 UTC = 월요일 08:00 KST)

Tests (RED → GREEN):
  - CRON_SECRET 없으면 401 반환 테스트
  - 콘텐츠 0개인 유저 → 이메일 스킵 확인
  - sendWeeklySummary mock 테스트 (Resend 호출 확인)
  - email_logs INSERT 확인
```

**Verification:** curl로 cron API 수동 호출 → Resend 대시보드에서 발송 확인

---

### Task 16: E2E 통합 테스트 + 배포

**File(s):**
- `__tests__/e2e.test.ts`
- `vercel.json`

```
Steps:
  1. 전체 플로우 통합 테스트
     시나리오 A: 아티클 저장 플로우
       회원가입 → 로그인 → URL 저장 → 카드 확인 → 상세 페이지

     시나리오 B: 파일 업로드 플로우
       PDF 업로드 → 텍스트 추출 → 요약 카드 확인

     시나리오 C: 복습 플로우
       복습 화면 진입 → 요약 보기 → 버튼 클릭 → DB 갱신 확인

     시나리오 D: 이메일 플로우
       cron API 호출 → email_logs 확인

     시나리오 B: 복습 플로우
       복습 화면 진입 → 요약 보기 → 버튼 클릭 → DB 갱신 확인

     시나리오 C: 이메일 플로우
       cron API 호출 → email_logs 확인

  2. npm run test → 전체 통과 확인

  3. Vercel 배포
     - Vercel 프로젝트 연결 (smim)
     - 환경변수 전체 세팅
     - vercel --prod

  4. Railway 미디어 서버 프로덕션 확인
     - RAILWAY_MEDIA_SERVER_URL 환경변수 업데이트

  5. 프로덕션 URL 전체 플로우 재확인
     - 회원가입 → 로그인
     - 아티클 URL 저장 → 카드 표시
     - YouTube URL 저장
     - 복습 버튼 작동
     - 모바일 PWA 설치 확인
```

**Verification:** 프로덕션 URL에서 전체 플로우 정상 동작 확인

---

## 커밋 전략

```
각 Task 완료 시:
  git add .
  git commit -m "feat: Task {N} — {제목}"

예시:
  feat: Task 01 — 프로젝트 초기 세팅
  feat: Task 04 — 아티클 URL 저장 API
  feat: Task 09 — 홈 대시보드 UI
```

---

## 주요 의존성 체크

```
Task 04~09는 Task 02(DB) + Task 03(Auth) 완료 후 시작
Task 06(Railway)은 Task 07 이전에 반드시 완료
Task 10~12(UI)는 Task 04 완료 후 시작 가능
Task 13(SM-2)는 Task 02 완료 후 바로 시작 가능 (독립적)
Task 16(배포)는 Task 15까지 모두 완료 후 진행
```
