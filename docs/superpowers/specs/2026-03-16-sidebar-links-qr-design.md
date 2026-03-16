# 사이드바 확장 + URL 단축 + QR 코드 디자인 스펙

## 개요

BCSD 내부 관리 시스템에 URL 단축 관리와 QR 코드 생성 기능을 추가하고, 멤버 상세를 사이드 시트로 전환한다.

## 사전 준비

shadcn 컴포넌트 및 의존성 추가:
```bash
pnpm dlx shadcn@latest add sheet dialog chart
pnpm add recharts date-fns
```

## 변경 범위

### 1. 사이드바 확장

메뉴 3개 + 하단 로그아웃:
- 멤버 관리 (`Users` 아이콘, 기존)
- URL 단축 (`Link` 아이콘) → `/links`
- QR 코드 (`QrCode` 아이콘) → `/qr`

### 2. 멤버 관리 — 사이드 시트 전환

기존 `/members/:memberId` 별도 페이지를 제거하고, 테이블 행 클릭 시 우측 사이드 시트로 상세 정보를 표시한다.

**사이드 시트 내용:**
- 이름 + 상태 배지
- 이메일, 학교 이메일, 학부, 학번, 전화번호, 트랙, 납부 상태, 가입일

**변경 사항:**
- `MemberDetailPage.tsx` 제거
- `/members/:memberId` 라우트 제거
- `MembersPage.tsx`에 사이드 시트 통합
- 선택된 멤버 ID를 URL 파라미터(`?member=`)로 관리 (공유 가능)
- `useMember` 훅은 `use-members.ts`에 유지, `MemberSheet`에서 import

### 3. URL 단축 관리

**라우트:** `/links`

#### 타입 정의

```typescript
// src/types/link.ts
interface LinkResponse {
  id: string;
  code: string;
  title: string;
  description: string;
  url: string;
  creator_id: string;
  created_at: string;
  expires_at: string;
  expired_at: string;
  expired: string;        // "active" | "expired" — 백엔드에서 계산
  updated_at: string;
}

interface DailyClick {
  date: string;           // "2026-03-15"
  count: number;
}

interface LinkDetail extends LinkResponse {
  total_clicks: number;
  daily_clicks: DailyClick[];
}

interface CreateLinkRequest {
  title: string;
  url: string;
  code?: string;
  description?: string;
  expires_at?: string;    // ISO datetime
}

interface UpdateLinkRequest {
  title?: string;
  description?: string;
  expires_at?: string;
}

interface CreatorOption {
  id: string;
  name: string;
}

interface LinkFiltersResponse {
  creators: CreatorOption[];
}
```

#### 목록 (테이블)

| 컬럼 | 소스 |
|------|------|
| 제목 | `title` |
| 단축 URL | `code` → `s/{code}` 형태로 표시 |
| 생성자 | `creator_id` → 이름 (필터 API `creators`에서 매핑) |
| 생성일 | `created_at` |
| 상태 | `expired` 필드 — "활성"(초록) / "만료"(빨강) 배지 |
| 만료일 | `expires_at` — 빈 문자열이면 "무기한" 표시 |

**빈 상태:** 링크가 없을 때 "등록된 링크가 없습니다" + "새 링크" CTA 버튼 표시. 필터 적용 후 결과 없을 때 "검색 결과가 없습니다" 표시.

#### 필터

- 생성자 드롭다운: `GET /v1/shorten/filters` → `creators: CreatorOption[]`
- 상태 드롭다운: 전체(`expired` 파라미터 생략) / 활성(`expired=active`) / 만료(`expired=expired`)
- 필터 상태는 `useSearchParams`로 URL에 저장
- **필터 변경 시 page를 1로 리셋** (멤버 목록과 동일 패턴)
- 텍스트 검색은 백엔드 미지원이므로 없음

**페이지네이션:** 멤버 목록과 동일 패턴 (page, size=20)

#### 생성 (센터 다이얼로그)

- "새 링크" 버튼 → shadcn Dialog 열림
- 필드: 제목(필수), URL(필수), 단축 코드(선택, placeholder: "자동 생성"), 설명(선택), 만료일(선택, date input)
- 제출 → `POST /v1/shorten` → `queryClient.invalidateQueries({ queryKey: ["links"] })` + 다이얼로그 닫기 + 성공 토스트

#### 수정 (센터 다이얼로그 재사용)

`CreateLinkDialog` 컴포넌트를 생성/수정 모드로 사용:
```typescript
interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: LinkDetail;  // 있으면 수정 모드, 없으면 생성 모드
}
```
- 수정 모드: `editData`로 폼 초기값 설정, 코드 필드 비활성화
- 수정 제출: `POST /v1/shorten/{link_id}` (백엔드가 POST 사용)

#### 상세 (사이드 시트)

- 행 클릭 → `GET /v1/shorten/{link_id}` → 우측 사이드 시트
- 선택된 링크 ID를 URL 파라미터(`?link=`)로 관리 — 필터 파라미터와 공존
- Escape 키 또는 X 버튼으로 닫기 → `?link=` 파라미터 제거
- 표시 정보: 제목, 원본 URL, 단축 코드(`s/{code}`), 생성자, 상태, 만료일, 설명
- 액션 버튼:
  - 수정: 다이얼로그 열기 (위 수정 참조)
  - 토글: `PATCH /v1/shorten/{link_id}/toggle` → 상태 반전 + 토스트
  - 삭제: shadcn AlertDialog로 확인 → `DELETE /v1/shorten/{link_id}` → 시트 닫기 + 토스트
- 클릭 통계:
  - 총 클릭 수 (`total_clicks`)
  - 일별 클릭 바 차트 (`daily_clicks`) — shadcn chart (recharts BarChart), 백엔드 반환 데이터 전체 표시

#### 캐시 전략

모든 mutation(생성/수정/토글/삭제) 성공 시 `queryClient.invalidateQueries({ queryKey: ["links"] })`로 목록 새로고침. 낙관적 업데이트 사용하지 않음.

### 4. QR 코드 생성

**라우트:** `/qr`

**타입 정의:**
```typescript
// src/types/qr.ts
interface QrParams {
  text: string;
  format: "png" | "svg";
  size: number;
}
```

**UI:**
- 텍스트/URL 입력 (max 2000자, 초과 시 인라인 에러 "최대 2000자까지 입력 가능합니다")
- 포맷 선택: PNG / SVG (기본 PNG)
- 크기 입력: 100~1000px (기본 300)
- QR 미리보기 영역: 이미지 표시
- 액션 버튼: 다운로드 + 클립보드 복사
  - 다운로드: blob을 `<a download>` 링크로 저장
  - 복사: PNG → `navigator.clipboard.write(ClipboardItem)`, SVG → blob을 PNG canvas로 변환 후 복사. 실패 시 토스트 "클립보드 복사에 실패했습니다"

**API 호출:**
- `GET /v1/qr?text=...&format=...&size=...` — **`responseType: 'blob'`** 으로 요청
- 응답 blob을 `URL.createObjectURL(blob)`로 미리보기 URL 생성
- 컴포넌트 언마운트 또는 URL 변경 시 `URL.revokeObjectURL`로 정리

**동작:**
- 텍스트 입력 시 디바운스(500ms, `useDebounce(text, 500)`) 후 자동 미리보기 갱신
- 포맷/크기 변경 시에도 미리보기 갱신
- 텍스트 비어있으면 미리보기 숨김
- API 에러 시 토스트 "QR 코드 생성에 실패했습니다"

## 공통 패턴

### 사이드 시트
- shadcn Sheet 컴포넌트 (side="right")
- 멤버 관리, URL 단축 모두 동일한 시트 패턴
- 시트 열림/닫힘 상태는 URL 파라미터로 관리 — 필터 상태에 영향 없음

### 에러/로딩
- 기존 패턴 유지: Skeleton(로딩), Alert(에러), Sonner(토스트)
- 생성/수정/삭제/토글 성공 시 토스트 알림

### 레이아웃
- AppLayout 변경 없음 (Sidebar 240px + 메인 콘텐츠)
- 각 페이지는 `<Outlet />` 안에 렌더링

## 새 파일 목록

```
src/
  api/
    links.ts               # URL 단축 API 함수
    qr.ts                  # QR 코드 API 함수 (responseType: 'blob')
  hooks/
    use-links.ts           # useLinks, useLinkDetail, useLinkFilters, mutation 훅들
    use-qr.ts              # useQrPreview
  types/
    link.ts                # LinkResponse, LinkDetail, CreateLinkRequest 등
    qr.ts                  # QrParams
  pages/
    links/
      LinksPage.tsx        # 목록 + 필터 + 사이드 시트
      LinkDialog.tsx       # 생성/수정 센터 다이얼로그 (mode: create | edit)
      LinkSheet.tsx        # 상세 사이드 시트 (통계 포함)
    qr/
      QrPage.tsx           # QR 생성 페이지
  components/
    common/
      MemberSheet.tsx      # 멤버 상세 사이드 시트 (MembersPage에서 사용)
```

## 수정 파일 목록

| 파일 | 변경 내용 |
|------|-----------|
| `src/App.tsx` | `/links`, `/qr` 라우트 추가, `/members/:memberId` 제거 |
| `src/components/layout/Sidebar.tsx` | URL 단축(`Link`), QR 코드(`QrCode`) 메뉴 추가 |
| `src/pages/members/MembersPage.tsx` | 행 클릭 → 사이드 시트로 변경, `MemberSheet` 연동 |

## 삭제 파일 목록

| 파일 | 이유 |
|------|------|
| `src/pages/members/MemberDetailPage.tsx` | 사이드 시트로 대체 |

## 백엔드 API 매핑

| 프론트 동작 | API | 비고 |
|------------|-----|------|
| 링크 목록 | `GET /v1/shorten?page=&size=&creator_id=&expired=` | expired: "active"/"expired"/생략 |
| 링크 필터 옵션 | `GET /v1/shorten/filters` | `{ creators: CreatorOption[] }` |
| 링크 생성 | `POST /v1/shorten` | |
| 링크 상세 | `GET /v1/shorten/{link_id}` | LinkDetail 반환 |
| 링크 수정 | `POST /v1/shorten/{link_id}` | 백엔드가 POST 사용 |
| 링크 토글 | `PATCH /v1/shorten/{link_id}/toggle` | |
| 링크 삭제 | `DELETE /v1/shorten/{link_id}` | |
| QR 생성 | `GET /v1/qr?text=&format=&size=` | `responseType: 'blob'` |
| 멤버 상세 | `GET /v1/members/{member_id}` | 기존 |
