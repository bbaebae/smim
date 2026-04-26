# PRD: 스밈 (Smim) — AI 기반 콘텐츠 저장 & 복습 시스템

**버전:** 1.8  
**작성일:** 2026-04-14  
**상태:** 초안

---

## 1. 개요 (Executive Summary)

스밈(Smim)은 사용자가 웹 아티클, 텍스트, YouTube 영상, Instagram 릴스·카드뉴스를 저장하면 Claude AI가 자동으로 요약·분류하고, SM-2 알고리즘 기반의 간격 반복(Spaced Repetition)으로 망각 전에 복습을 유도하는 지식 관리 웹 앱이다. 매주 월요일 아침에 지난 주 저장 콘텐츠를 이메일로 요약 발송한다.

**서비스명:** 스밈 / Smim  
**슬로건:** 지식이 스며드는 곳  
**브랜드 컬러:** 딥 인디고 #2D3A8C · 워터 블루 #5B9BD5 · 오프화이트 #F8F7F4  
**도메인:** smim.app (또는 smim.kr)

**핵심 가치 제안:** "읽고 보고 잊어버리는 콘텐츠"를 "지식이 스며드는 경험"으로 바꿔준다.

---

## 2. 문제 정의

### 현재 상황
- 사람들은 매일 수십 개의 아티클을 읽지만 2주 후 기억에 남는 비율은 10% 미만 (에빙하우스 망각 곡선)
- 기존 북마크/저장 도구(Pocket, Notion)는 저장은 쉽지만 **복습 알림 기능이 없어** 실질적 학습으로 이어지지 않음
- AI 요약이 없어 재방문 시 전문을 다시 읽어야 하는 마찰이 큼

### 목표 사용자
| 페르소나 | 설명 | 핵심 니즈 |
|----------|------|-----------|
| 지식 노동자 | 개발자, 마케터, 투자자 등 정보 집약적 업무 종사자 | 많은 정보를 효율적으로 내재화 |
| 자기계발 독자 | 블로그·뉴스레터 구독자 | 읽은 내용을 오래 기억하고 싶음 |
| 학습자 | 직무 전환·사이드 프로젝트를 준비 중인 사람 | 분야별로 정리된 개인 지식 베이스 |

---

## 3. 목표 및 성공 지표

### 목표 (Objectives)
1. 아티클 저장 마찰 최소화 — URL 하나로 저장 완료
2. AI 자동 분류/요약으로 재방문 시간 80% 단축
3. SM-2 기반 복습 스케줄로 장기 기억 정착률 향상

### 성공 지표 (KPIs)
| 지표 | 목표치 (출시 후 3개월) |
|------|----------------------|
| 아티클 저장 → 복습 완료 전환율 | ≥ 60% |
| 주간 복습 완료 유저 비율 | ≥ 40% |
| 이메일 오픈율 | ≥ 35% |
| 30일 리텐션 | ≥ 30% |

---

## 4. 기능 범위

### In Scope (v1)
- 이메일/패스워드 회원가입 및 로그인
- URL 입력 → 자동 스크래핑 + AI 요약/분류/태그 (웹 아티클)
- YouTube URL → 자막 추출 + AI 요약/분류/태그
- Instagram URL → 릴스 영상 분석 + AI 요약/분류/태그 (Railway 처리)
- 카드뉴스 이미지 업로드 → Claude Vision OCR + AI 요약/분류/태그
- 파일 업로드 (PDF / TXT / MD) → 텍스트 추출 + AI 요약/분류/태그
- 홈 대시보드 — 카테고리별 콘텐츠 카드 그리드 (콘텐츠 타입 배지 표시)
- 콘텐츠 상세 페이지 — 요약 + 전문/자막 + 원문 링크
- SM-2 기반 복습 스케줄 자동 계산
- 복습 화면 — 기억남 / 희미함 / 잊었음 3단계 평가
- 주간 요약 이메일 자동 발송 (매주 월요일 08:00 KST)

### Out of Scope (v1)
- 소셜 기능 (공유, 팔로우)
- 모바일 앱 (iOS / Android)
- 브라우저 익스텐션
- TikTok / Twitter 등 기타 소셜 플랫폼
- 팀/조직 플랜

---

## 5. 사용자 스토리

### 저장
- **US-01** 유저로서 웹 아티클 URL을 붙여넣기 하면 자동으로 스크래핑·요약되어 저장된다
- **US-02** 유저로서 YouTube URL을 입력하면 자막이 추출되어 요약·저장된다
- **US-03** 유저로서 Instagram 릴스 URL을 입력하면 영상이 분석되어 요약·저장된다
- **US-04** 유저로서 카드뉴스 이미지를 업로드하면 텍스트가 추출되어 요약·저장된다
- **US-05** 유저로서 PDF / TXT / MD 파일을 업로드하면 텍스트가 추출되어 요약·저장된다
- **US-06** 유저로서 텍스트를 직접 입력해도 AI 요약·분류를 받을 수 있다
- **US-07** 유저로서 저장 중 AI 처리 상태(로딩)를 시각적으로 확인할 수 있다
- **US-08** 유저로서 저장된 콘텐츠에 콘텐츠 타입 배지(아티클/영상/이미지/파일/텍스트)가 표시된다

### 탐색
- **US-08** 유저로서 카테고리 탭을 클릭해 원하는 분야의 콘텐츠만 볼 수 있다
- **US-09** 유저로서 콘텐츠 카드를 클릭하면 요약·전문/자막·원문 링크를 한 화면에서 볼 수 있다
- **US-10** 유저로서 대시보드에서 오늘 복습할 콘텐츠 수를 배너로 확인할 수 있다

### 복습
- **US-11** 유저로서 복습 화면에서 콘텐츠를 한 개씩 보며 기억 여부를 평가할 수 있다
- **US-12** 유저로서 "기억남"을 선택하면 다음 복습일이 지수적으로 늘어난다
- **US-13** 유저로서 "잊었음"을 선택하면 다음 날 다시 복습 대상이 된다
- **US-14** 유저로서 오늘 복습을 모두 완료하면 완료 화면이 표시된다

### 이메일
- **US-15** 유저로서 매주 월요일 아침 지난 주 저장 콘텐츠 요약 목록을 이메일로 받는다
- **US-16** 유저로서 저장 콘텐츠가 없는 주에는 이메일이 발송되지 않는다

---

## 6. 기능 상세 명세

### 6-1. 콘텐츠 저장 API

**입력 케이스 A — 웹 아티클 URL:**
```
POST /api/contents
Body: { url: string, type: "article" }

파이프라인:
  Firecrawl API → { title, markdown }
  → Claude API → { summary, category, tags }
  → Supabase contents INSERT + review_schedule INSERT
응답: 201 Created
```

**입력 케이스 B — YouTube URL:**
```
POST /api/contents
Body: { url: string, type: "youtube" }

파이프라인:
  youtube-transcript → { title, transcript }
  → Claude API → { summary, category, tags }
  → Supabase contents INSERT + review_schedule INSERT
응답: 201 Created

※ 자막 없는 영상: "자막을 찾을 수 없습니다. 텍스트로 직접 입력해주세요" 안내
```

**입력 케이스 C — Instagram URL (릴스):**
```
POST /api/contents
Body: { url: string, type: "instagram" }

파이프라인:
  Vercel API → Railway 미디어 서버로 위임
  yt-dlp → 영상 임시 다운로드 (/tmp)
  ffmpeg → 프레임 3~5장 추출
  Claude Vision API → 장면 분석 + 내레이션 추출
  /tmp 파일 즉시 삭제
  → { title, full_text } 반환 → Vercel
  → Claude API → { summary, category, tags }
  → Supabase contents INSERT + review_schedule INSERT
응답: 201 Created
```

**입력 케이스 D — Instagram URL (릴스 + 카드뉴스 통합):**
```
POST /api/contents
Body: { url: string, type: "instagram" }

파이프라인:
  Vercel API → Railway 미디어 서버로 위임
  yt-dlp → 콘텐츠 다운로드 후 타입 자동 감지
    ├── 영상(릴스)  → ffmpeg 프레임 3~5장 추출
    │                → Claude Vision 장면 분석
    └── 이미지(카드뉴스) → 슬라이드 순서대로 Claude Vision OCR
  /tmp 파일 즉시 삭제
  → { title, full_text } 반환 → Vercel
  → Claude API → { summary, category, tags }
  → Supabase contents INSERT + review_schedule INSERT
응답: 201 Created
```

**입력 케이스 E — 파일 업로드 (PDF / TXT / MD):**
```
POST /api/contents
Body: FormData { file: File, type: "file" }

파이프라인:
  PDF  → pdf-parse로 텍스트 추출
  TXT/MD → 텍스트 그대로 읽기
  → Claude API → { summary, category, tags }
  → Supabase contents INSERT + review_schedule INSERT
응답: 201 Created

지원 형식: .pdf / .txt / .md
최대 파일 크기: 10MB
```

**입력 케이스 F — 텍스트 직접 입력:**
```
POST /api/contents
Body: { title: string, text: string, type: "text" }

파이프라인:
  text → Claude API → { summary, category, tags }
  → Supabase contents INSERT + review_schedule INSERT
응답: 201 Created
```

**콘텐츠 타입 배지:**
📄 아티클 | 🎬 YouTube | 📱 Instagram (릴스·카드뉴스) | 📎 파일 (PDF/TXT/MD) | ✏️ 텍스트

**Claude 분류 카테고리:**
기술/개발 | 비즈니스/마케팅 | 투자/경제 | 라이프스타일 | 기타

**에러 처리:**
| 조건 | 응답 |
|------|------|
| 입력값 없음 | 400 Bad Request |
| 스크래핑 실패 | 500 + 텍스트 입력 fallback 안내 |
| YouTube 자막 없음 | 400 + 직접 입력 안내 |
| Instagram 처리 실패 | 500 + 직접 업로드 안내 |
| 지원하지 않는 파일 형식 | 400 + "PDF, TXT, MD 파일만 지원합니다" |
| 파일 크기 초과 (10MB↑) | 400 + "파일 크기는 10MB 이하여야 합니다" |
| Claude API 실패 | 500 Internal Server Error |

---

### 6-2. SM-2 복습 알고리즘

**quality 값:**
| 버튼 | quality 값 | 의미 |
|------|-----------|------|
| 기억남 ✅ | 5 | 완벽히 기억 |
| 희미함 🤔 | 3 | 단서 보면 기억 |
| 잊었음 ❌ | 1 | 전혀 기억 못함 |

**계산 공식:**
```
if quality >= 3:
  interval = round(interval * ease_factor)
  ease_factor = ease_factor + (0.1 - (5 - quality) × 0.08)
else:
  interval = 1
  ease_factor = max(1.3, ease_factor - 0.2)

next_review_at = today + interval 일
```

**예시 — quality=5 연속 3회:**
| 회차 | interval | ease_factor | 다음 복습 |
|------|----------|-------------|-----------|
| 초기 | 1일 | 2.5 | 내일 |
| 1회차 | 2일 | 2.6 | +2일 |
| 2회차 | 5일 | 2.7 | +5일 |
| 3회차 | 13일 | 2.8 | +13일 |

---

### 6-3. 주간 이메일

- **발송 시각:** 매주 일요일 23:00 UTC (= 월요일 08:00 KST)
- **대상:** 최근 7일 내 저장 아티클 1건 이상인 유저 전체
- **내용:** 아티클 제목 + 1줄 요약 목록
- **보안:** `CRON_SECRET` 헤더 검증 → 미일치 시 401 반환
- **로깅:** `email_logs` 테이블에 발송 기록 저장

---

## 7. 데이터 모델

```sql
contents  -- (기존 articles 테이블 확장)
  id            uuid PK
  user_id       uuid FK → auth.users
  type          text NOT NULL  -- 'article' | 'youtube' | 'instagram' | 'file' | 'text'
  url           text (nullable)
  title         text NOT NULL
  full_text     text NOT NULL
  summary       text NOT NULL
  category      text NOT NULL
  tags          text[]
  thumbnail_url text (nullable)  -- YouTube/Instagram 썸네일
  created_at    timestamptz

review_schedule
  id            uuid PK
  content_id    uuid FK → contents(id) CASCADE DELETE
  user_id       uuid FK → auth.users
  next_review_at date NOT NULL  (default: current_date + 1)
  interval_days  int NOT NULL   (default: 1)
  ease_factor    numeric NOT NULL (default: 2.5)
  review_count   int NOT NULL   (default: 0)

email_logs
  id            uuid PK
  user_id       uuid FK → auth.users
  sent_at       timestamptz
  article_ids   uuid[]
```

**보안:** 모든 테이블 RLS 활성화 — `auth.uid() = user_id` 정책 적용

---

## 8. 기술 스택

| 레이어 | 선택 | 이유 |
|--------|------|------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | SSR/SSG 혼용, 빠른 초기 로드 |
| 반응형 | Mobile First + Tailwind 반응형 prefix | 모바일 우선 설계 후 PC 확장 |
| PWA | next-pwa | 모바일 홈 화면 설치, 앱처럼 사용 가능 |
| Backend/DB | Supabase | Auth·DB·RLS·Edge Functions 일체형 |
| AI 텍스트 | Claude API (claude-sonnet-4-20250514) | 고품질 한국어 요약·분류 |
| AI 비전 | Claude Vision API | 카드뉴스 OCR, 릴스 프레임 분석 |
| 웹 스크래핑 | Firecrawl API | JS 렌더링 지원, 마크다운 변환 |
| YouTube | youtube-transcript (npm) | 자막 추출, 서버 분리 불필요 |
| 미디어 처리 | Railway + yt-dlp + ffmpeg | Instagram 릴스 임시 다운로드·프레임 추출 |
| 파일 저장 | Supabase Storage | 카드뉴스 이미지 임시 보관 |
| 이메일 | Resend API | 개발자 친화적, 높은 전달률 |
| 배포 (앱) | Vercel | Next.js 최적화, Cron 내장 |
| 배포 (미디어) | Railway | yt-dlp + ffmpeg 바이너리 실행 환경 |
| 테스트 | Vitest + React Testing Library | Vite 기반 빠른 단위 테스트 |
| 언어 | TypeScript | 타입 안전성 |

---

## 9. 주요 화면 플로우

```
[로그인/회원가입]
      ↓
[홈 대시보드]
  ├── 카테고리 탭 필터
  ├── 콘텐츠 카드 그리드 (타입 배지: 📄🎬📱✏️)
  ├── 오늘의 복습 배너 (n건)
  └── "+" FAB 버튼
         ↓
    [입력 모달 — 5탭]
      ├── 📄 아티클 URL
      ├── 🎬 YouTube URL
      ├── 📱 Instagram URL (릴스·카드뉴스 자동 감지)
      ├── 📎 파일 업로드 (PDF / TXT / MD)
      └── ✏️ 텍스트 직접 입력
              ↓
         [로딩 — AI 처리 중]
         (미디어는 Railway 처리로 30초~2분 소요 안내)
              ↓
         [카드 목록 갱신]

[복습 화면]
  ├── 콘텐츠 제목 + 타입 배지 + 카테고리 표시
  ├── "요약 보기" 토글
  └── [기억남] [희미함] [잊었음]
              ↓
         [다음 콘텐츠 or 완료 화면]
```

### 반응형 레이아웃 전략

| 화면 | 모바일 | PC |
|------|--------|-----|
| 대시보드 | 1열 카드 스택 | 2~3열 그리드 |
| 입력 모달 | 풀스크린 바텀시트 | 센터 모달 |
| 복습 화면 | 풀스크린 카드 | 카드 중앙 배치 |
| 상세 페이지 | 단일 컬럼 스크롤 | 좌측 요약 / 우측 전문 2컬럼 |
| FAB(+) 버튼 | 우하단 고정 | 상단 네비 바 내 배치 |

```
설계 원칙: Mobile First
  모바일 레이아웃 → md: → lg: 순으로 확장
  아티클 저장·복습은 모바일 사용 비중이 높은 행동 패턴

PWA 설정 시 모바일 홈 화면에 앱처럼 설치 가능 (next-pwa)
```

| Task | 내용 | 예상 시간 |
|------|------|-----------|
| 01 | 프로젝트 초기 세팅 (Next.js + 환경변수 + Vitest + next-pwa) | 0.5h |
| 02 | Supabase DB 스키마 + 마이그레이션 (contents 테이블) | 1h |
| 03 | Supabase Auth (로그인/회원가입 + 미들웨어) | 2h |
| 04 | 콘텐츠 저장 API — 웹 아티클 URL (Firecrawl) | 2h |
| 05 | 콘텐츠 저장 API — YouTube URL (youtube-transcript) | 1.5h |
| 06 | Railway 미디어 서버 세팅 (yt-dlp + ffmpeg) | 2h |
| 07 | 콘텐츠 저장 API — Instagram URL (Railway 연동) | 3h |
| 08 | 콘텐츠 저장 API — 파일 업로드 (PDF/TXT/MD) | 2h |
| 09 | 콘텐츠 저장 API — 텍스트 직접 입력 | 1h |
| 10 | 홈 대시보드 UI (카드 그리드 + 카테고리 필터 + 타입 배지) | 3h |
| 11 | 입력 모달 UI (5탭 + 로딩 + 진행 상태) | 3h |
| 12 | 콘텐츠 상세 페이지 | 1.5h |
| 13 | SM-2 복습 스케줄 로직 + 리뷰 API | 2h |
| 14 | 복습 화면 UI | 2h |
| 15 | 주간 요약 이메일 (Resend + Vercel Cron) | 2h |
| 16 | E2E 통합 테스트 + Vercel/Railway 배포 | 3h |
| **합계** | | **31–35h** |

---

## 11. 리스크 및 대응

| 리스크 | 발생 가능성 | 영향도 | 대응 방안 |
|--------|------------|--------|-----------|
| Firecrawl 스크래핑 실패 | 중 | 중 | 실패 시 텍스트 직접 입력 fallback 안내 |
| YouTube 자막 없는 영상 | 중 | 중 | "자막 없음" 안내 + 텍스트 직접 입력 유도 |
| Instagram yt-dlp 차단 (IP 탐지) | 중 | 높음 | Railway IP 로테이션 또는 프록시 적용, 실패 시 이미지 업로드 fallback |
| Instagram ToS 위반 리스크 | 중 | 높음 | 개인 저장 목적 명시, 서비스 약관에 면책 조항 추가 |
| Railway 미디어 서버 처리 지연 (30초~2분) | 높음 | 중 | 처리 중 진행 상태 UI 표시, 완료 시 푸시 알림 |
| Claude Vision OCR 정확도 (카드뉴스) | 중 | 중 | 요약 결과 유저 확인 후 수정 가능하도록 편집 옵션 제공 |
| Claude API 응답 JSON 파싱 오류 | 저 | 중 | try-catch + 재시도 로직, category="기타" 기본값 |
| Supabase Storage 용량 | 저 | 저 | 카드뉴스 이미지 처리 후 즉시 삭제, 원본 미보관 |

---

## 12. 수익화 구조

### 플랜 설계

| | Free | Pro (월 6,900원) | Annual (연 59,000원) |
|--|------|-----------------|----------------------|
| 아티클 저장 | 월 30건 | 무제한 | 무제한 |
| AI 요약/분류 | ✅ | ✅ | ✅ |
| 복습 기능 | ✅ | ✅ | ✅ |
| 주간 이메일 | ✅ | ✅ | ✅ |
| 카테고리 커스터마이징 | ❌ | ✅ | ✅ |
| AI 질문하기 (RAG) | ❌ | ✅ | ✅ |
| 내보내기 (Notion/Obsidian) | ❌ | ✅ | ✅ |
| 우선 지원 | ❌ | ❌ | ✅ |
| 연간 절약 | — | — | **29% 할인** (월 4,916원 수준 · Pro 12개월 대비 23,800원 절약) |

### 플랜별 포지셔닝

**Free — 습관 형성 구간**
월 30건 제한은 가볍게 써보기엔 충분하지만, 주 10건 이상 저장하는 헤비유저는 한 달 안에 한도에 도달한다. 결제 전환의 자연스러운 트리거로 작동.

**Pro — 핵심 전환 티어**
킬러 피처는 **AI 질문하기 (RAG)**. 저장된 아티클 전체를 벡터 DB(Supabase pgvector)에 색인하고, Claude로 검색·합성한다.
- "내가 저장한 아티클 중 SEO 관련 인사이트 요약해줘"
- "지난 달 읽은 투자 글에서 공통 논지 뽑아줘"

**Annual — 현금 선확보 + 이탈률 감소**
Pro 12개월(82,800원) 대비 23,800원 절약을 전면에 노출. 59,000원이라는 숫자 자체가 깔끔해서 프라이싱 페이지 노출에 유리함. 표현은 "29% 할인"보다 "월 4,916원 · 23,800원 절약"을 앞세워 절약 금액 체감을 극대화. 연간 결제자는 월 결제자 대비 리텐션 평균 2~3배 높음.

### 전환 유도 전략

```
Free → Pro     : 30건 한도 도달 시 업그레이드 배너 노출
Pro → Annual   : 결제 3개월 차에 "연간 전환 시 X원 절약" 인앱 메시지
신규 가입 시    : 프라이싱 페이지에서 Annual 기본 선택 + Pro는 회색 처리
```

### 수익 시뮬레이션

```
Free 유저 1,000명 / Pro 전환 4% / Annual 전환 2% 가정

Pro     40명 × 6,900원  =  276,000원/월
Annual  20명 × 4,916원  =   98,320원/월  (연간 환산)
────────────────────────────────────────
MRR ≈ 374,320원

Free 유저 3,000명 / 전환율 7% 가정 시 (가격 인하 효과)
MRR ≈ 1,122,960원 (~112만원)
```

> 프라이싱 페이지 노출 전략: "29% 할인"보다 "월 4,916원 · 23,800원 절약" 표현을 앞세워 절약 금액 체감 극대화.

### DB 스키마 추가 (수익화 관련)

```sql
-- 구독 상태 관리
create table subscriptions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users not null unique,
  plan           text not null default 'free',  -- 'free' | 'pro' | 'annual'
  status         text not null default 'active', -- 'active' | 'cancelled' | 'expired'
  current_period_end timestamptz,
  created_at     timestamptz default now()
);

alter table subscriptions enable row level security;
create policy "본인 데이터만" on subscriptions
  for all using (auth.uid() = user_id);
```

---

## 13. ⚔️ 경쟁 분석 (Why Me)

### 경쟁자 3개

| 서비스 | 치명적 약점 |
|--------|------------|
| **Pocket** | AI 요약 없음, 복습 알림 없음. 저장하면 90%는 다시 안 열림. "나중에 읽겠다" 심리를 전혀 해결 못 하는 구조 |
| **Notion** | 저장 마찰이 너무 큼. 템플릿 만들고, 직접 입력하고, 태그 달고 — 귀찮아서 안 씀. 복습 스케줄은 직접 설계해야 하고, AI 요약도 불완전함. "세팅하다 지침" 앱 |
| **Readwise** | 하이라이트 중심 구조라 처음부터 밑줄 안 친 콘텐츠는 복습 불가. AI 요약 자동화 없음. 월 $7.99(약 11,000원)로 한국 시장 가격 저항감 있음 |

### 포지셔닝

```
저장 마찰 없음  (URL 하나면 끝, 하이라이트 불필요)
      +
AI 자동 요약·분류  (직접 태그/정리 불필요)
      +
SM-2 복습 스케줄  (언제 복습할지 자동 계산)
      +
한국어 최적화 + 한국 가격  (월 6,900원)
```

Readwise의 복습 기능 + Pocket의 저장 편의성 + 한국 시장 가격을 하나로 묶는 포지셔닝. 서비스명 **스밈(Smim)** — "지식이 스며드는 곳"이라는 슬로건이 이 차별화를 한 문장으로 표현한다.

---

## 14. 📣 첫 고객 100명 확보 전략 (Go-to-Market)

**광고비 0원 / 목표: 런칭 후 4주 내 100명**

### 온라인 채널

**1주차 — 런칭 전 워밍업**
디스콰이엇(disquiet.io)에 "만들고 있습니다" 메이킹 로그 2~3개 게시. 제품보다 과정을 공유. 팔로워 형성 시작.

**2주차 — 베타 모집**
오픈카톡 "생산성 덕후", "개발자 사이드프로젝트" 방에서 "무료 베타 테스터 10명 모집" 포스팅. 피드백 제공 조건으로 Pro 3개월 무료 제공.

**3주차 — Product Hunt 런칭**
영어로 등록. 한국 커뮤니티(디스콰이엇, 개발바닥 오픈채팅)에서 upvote 요청. 상위권 진입 시 해외 유저 유입.

**4주차 — 트위터/X 스레드**
"아티클 100개 저장했더니 생긴 변화" 실사용 후기 스레드. 제품 링크는 마지막에만.

### 오프라인 채널

**스터디/독서 모임 직접 참가**
서울 기준 "책읽아웃", "스터디파이" 등 퇴근길 독서모임에 직접 참가. 모임 후 "이런 거 만들었는데 써보실 분?" 한 마디. 10명 모임에서 3~4명은 확보 가능. 5개 모임 = 약 20명.

### 리퍼럴 부스터

```
"친구 초대 시 둘 다 Pro 1개월 무료"
→ 온보딩 완료 직후 화면에 고정 노출
→ 초기 100명이 각 1명씩만 초대해도 200명
```

---

## 15. ⚠️ 치명적 약점 (Devil's Advocate)

### 약점 1: 복습 자체가 귀찮다

SM-2 복습이 효과적인 건 맞지만 사람들은 원래 복습을 안 한다. Anki가 매니아용으로 남아 있는 이유다. 학습 의지가 높은 사람만 쓰는 도구가 되면 시장이 너무 좁아진다. 대부분의 유저는 아티클 저장만 하다가 복습 화면은 누르지 않는다.

**대응:** 복습을 "해야 하는 것"이 아니라 "자동으로 오는 것"으로 설계. 주간 이메일 안에서 바로 기억남/잊었음 버튼을 누를 수 있게 만들어 앱 진입 마찰 제거. 복습을 이메일로 완결하는 구조.

### 약점 2: Claude API 비용이 수익보다 빠르게 늘어난다

Free 유저가 30건씩 저장하면 Claude API 비용은 계속 나가는데 수익은 0원. 아티클 1건당 3~5원이라도 Free 유저 1,000명 × 30건 = 월 9~15만원이 그냥 나간다. 전환율이 낮으면 적자.

**대응:** Free 플랜 30건 제한 엄수. AI 요약 입력 글자 수 상한(5,000자) 설정. RAG 기능(API 호출 비용이 높은 기능)을 Pro 전용으로 묶어 비용이 수익 구간에서만 발생하도록 설계.

### 약점 3: Notion AI·ChatGPT가 똑같이 만들 수 있다

Notion은 이미 AI 요약이 있고, ChatGPT에 URL을 붙여넣으면 요약된다. 대기업이 "아티클 저장 + 복습" 기능을 추가하는 데 걸리는 시간은 스프린트 1~2개. 독립 앱으로서의 해자(moat)가 약하다.

**대응:** 해자는 기능이 아니라 데이터와 습관에서 나와야 한다. 유저가 6개월치 복습 히스토리와 지식 그래프를 쌓으면 다른 앱으로 이동할 수 없다. 초기에 "내 지식 성장 리포트" 히스토리 시각화를 빠르게 만들어 락인(lock-in)을 높여야 한다. Notion이 카피해도 6개월치 데이터는 가져갈 수 없다.

---

## 16. 오픈 이슈

- [ ] 아티클 삭제 기능 필요 여부 (v1 미포함)
- [ ] 카테고리 커스터마이징 허용 여부
- [ ] 복습 알림 푸시 알림 (이메일 외) 추가 검토
- [ ] 이메일 수신 거부 옵션 필요 여부

---

*본 PRD는 구현 플랜(Stage 3)을 기반으로 작성되었습니다. v1.8 — 파일 업로드 (PDF/TXT/MD) 추가, 입력 탭 5개로 확장.*
