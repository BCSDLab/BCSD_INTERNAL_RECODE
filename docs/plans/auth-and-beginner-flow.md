# 인증 플로우 개선 + 비기너 지원 플로우

## 현재 상태

### 로그인 (`/login` — `LoginPage.tsx`)
- Google OAuth 버튼
- 가입된 계정 → 로그인 완료 → `/members`
- 미가입 계정 → 백엔드 401 `"member not found, registration required"` → `/register`로 리다이렉트 (googleToken 전달)
- 에러 시 "로그인에 실패했습니다" Alert

### 회원가입 (`/register` — `RegisterPage.tsx`)
- 4단계 위저드: Google 인증 → 정보 입력(이름, 학과, 학번, 전화번호) → 학교 이메일 인증 → 트랙 선택
- `/login`에서 리다이렉트 시 `location.state.googleToken`으로 1단계 스킵
- 하단에 "이미 계정이 있으신가요? 로그인" 링크

### 백엔드 (`auth/service.py`)
```python
def login(google_token, settings, sheets):
    profile = google_auth.verify_token(google_token, settings.google_client_id)
    member = sheets.find_row("members", "email", profile["email"])
    if not member:
        raise Unauthorized("member not found, registration required")
    # ... JWT 발급
```

---

## 변경 계획

### 1. 로그인 페이지 (`/login`) 수정

**현재 문제**: 미가입 계정으로 로그인 시도 → 401 에러 → `/register`로 리다이렉트.
이 과정에서 사용자에게 "로그인에 실패했습니다" Alert가 잠깐 보일 수 있음.

**변경**:
- 미가입 계정 401 에러 시 Alert 표시하지 않고, toast로 "가입이 필요합니다. 회원가입 페이지로 이동합니다." 표시 후 리다이렉트
- 하단에 "처음이신가요? 회원가입" 링크 추가 (현재는 없음)

**코드 변경**: `LoginPage.tsx`
```tsx
// onError에서 registration required인 경우 isError 표시 안 함
if (apiError.message?.includes("registration required")) {
  toast.info("가입이 필요합니다. 회원가입 페이지로 이동합니다.");
  navigate("/register", {
    state: { googleToken: credentialResponse.credential },
  });
  return; // Alert 표시 방지
}
```

하단 링크:
```tsx
<CardFooter className="justify-center">
  <Link to="/register" className="text-sm text-muted-foreground hover:underline">
    처음이신가요? 회원가입
  </Link>
</CardFooter>
```

### 2. 회원가입 페이지 (`/register`) — 경고 배너 추가

**위저드 상단 (Stepper 위)에 경고 배너**:
```
⚠️ BCSD에서 계속 사용할 Google 계정으로 가입해주세요.
   다른 계정으로 가입하면 나중에 변경이 어렵습니다.
```

**구현**: `RegisterPage.tsx`
```tsx
<Card className="w-full max-w-md">
  <Alert className="mx-4 mt-4">
    <AlertTriangle className="h-4 w-4" />
    <AlertDescription>
      BCSD에서 계속 사용할 Google 계정으로 가입해주세요.
      다른 계정으로 가입하면 나중에 변경이 어렵습니다.
    </AlertDescription>
  </Alert>
  <CardHeader>
    <Stepper steps={STEPS} currentStep={state.step} />
  </CardHeader>
  ...
</Card>
```

### 3. 이미 가입된 계정으로 회원가입 시도

**현재**: 백엔드에서 어떤 응답을 주는지 확인 필요.
- 이미 가입된 이메일로 `POST /v1/auth/register` 호출 시?
- 확인 필요: 409 Conflict? 400 Bad Request?

**프론트 대응**:
- 에러 발생 시 toast: "이미 가입된 계정입니다." + `/login`으로 이동 링크

---

## 비기너 지원 플로우

### 전체 흐름

```
bcsdlab.com "지원하러 가기"
  │  (모집기간 아니면 "현재 모집 기간이 아닙니다" 표시)
  ▼
internal.bcsdlab.com/login
  ├─ 기존 회원 → 로그인 완료 → /apply (또는 대시보드)
  └─ 미가입 → toast + /register 리다이렉트
       → ⚠️ 경고 배너 표시
       → 4단계 위저드 완료
       → 가입 완료 → /apply
  ▼
/apply (비기너 지원 페이지)
  │  자체 폼 (구글폼 스타일 UI, 백엔드 DB 직접 저장)
  │  - 지원 동기
  │  - 희망 트랙 (이미 가입 시 선택했으므로 자동 채움)
  │  - 기타 질문 (관리자가 설정 가능하면 좋음)
  ▼
지원 완료 → /apply/status (지원 상태 페이지)
  │  "지원이 완료되었습니다. 검토 중입니다."
  │  상태: 검토 중 / 납부 대기 / 승인 완료 / 반려
  ▼
[관리자/부회장] 지원자 목록 확인
  │  /admin/applications (또는 기존 멤버 관리에 탭 추가)
  │  지원자 정보 확인 → 납부 확인 → 승인/반려
  ▼
승인 시:
  │  지원자 상태 → Beginner로 변경
  │  슬랙 온보딩 안내 (초대 링크 표시 or 이메일 발송)
  ▼
비기너 활동 시작
```

### 4. 비기너 지원 페이지 (`/apply`)

**접근 조건**: 로그인 필수 (ProtectedRoute)
**조건 분기**:
- 이미 비기너/레귤러/멘토 → "이미 활동 중인 회원입니다" 표시
- 이미 지원서 제출 → `/apply/status`로 리다이렉트
- 모집 기간 아님 → "현재 모집 기간이 아닙니다. 다음 모집을 기다려주세요." 표시
- 지원 가능 → 폼 표시

**폼 필드** (초안, 관리자가 변경 가능하면 이상적):
- 이름 (자동 채움, 수정 불가 — 가입 시 입력한 값)
- 이메일 (자동 채움, 수정 불가)
- 학교 이메일 (자동 채움, 수정 불가)
- 희망 트랙 (자동 채움, 수정 가능 — 가입 시 선택한 트랙)
- 지원 동기 (textarea, 필수)
- 기타 질문 (추후 관리자 설정 기능으로 확장 가능)

**백엔드 필요**:
```graphql
type Mutation {
  submitApplication(input: ApplicationInput!): Application!
}

input ApplicationInput {
  track: String!
  motivation: String!
  # 추후 확장: answers: [AnswerInput!]
}

type Application {
  id: String!
  memberId: String!
  track: String!
  motivation: String!
  status: ApplicationStatus!
  createdAt: String!
  updatedAt: String!
}

enum ApplicationStatus {
  PENDING      # 검토 중
  PAYMENT_WAIT # 납부 대기
  APPROVED     # 승인
  REJECTED     # 반려
}
```

### 5. 지원 상태 페이지 (`/apply/status`)

**접근 조건**: 로그인 필수
**표시 내용**:
- 지원 일시
- 현재 상태 (배지): 검토 중 / 납부 대기 / 승인 / 반려
- 상태별 안내 메시지:
  - 검토 중: "지원서를 검토 중입니다. 결과를 기다려주세요."
  - 납부 대기: "회비 납부가 확인되면 승인됩니다." + 납부 안내 정보
  - 승인: "축하합니다! BCSD 비기너로 승인되었습니다." + 슬랙 온보딩 안내
  - 반려: "아쉽게도 이번에는 함께하지 못하게 되었습니다." + 사유(선택)

**백엔드 필요**:
```graphql
type Query {
  myApplication: Application  # 내 지원서 조회 (없으면 null)
}
```

### 6. 관리자 지원자 관리

**위치**: `/admin/applications` 또는 기존 멤버 관리 페이지에 탭 추가

**기능**:
- 지원자 목록 (DataTable 재사용)
- 컬럼: 이름, 이메일, 희망 트랙, 지원일, 상태
- 상태 변경: 검토 중 → 납부 대기 → 승인 / 반려
- 일괄 승인/반려 (체크박스 선택)

**백엔드 필요**:
```graphql
type Query {
  applications(filter: ApplicationFilterInput): PagedApplications!
}

type Mutation {
  updateApplicationStatus(id: ID!, status: ApplicationStatus!): Application!
  batchUpdateApplicationStatus(ids: [ID!]!, status: ApplicationStatus!): [Application!]!
}

input ApplicationFilterInput {
  page: Int = 1
  size: Int = 20
  sorts: [SortFieldInput!]
  status: String
  track: String
}
```

### 7. 슬랙 온보딩

**Slack 무료 플랜 제약**: `admin.invites` API 사용 불가.

**대안**:
- 승인 시 슬랙 초대 링크를 지원 상태 페이지에 표시
- 초대 링크는 환경변수 또는 관리자 설정으로 관리
- 추후 유료 플랜 전환 시 자동 초대로 업그레이드 가능

### 8. 모집 기간 관리

**방법**: 관리자 설정 페이지에서 모집 시작/종료일 설정

**백엔드 필요**:
```graphql
type Query {
  recruitmentPeriod: RecruitmentPeriod
}

type Mutation {
  setRecruitmentPeriod(input: RecruitmentPeriodInput!): RecruitmentPeriod!
}

type RecruitmentPeriod {
  startDate: String!
  endDate: String!
  isActive: Boolean!
}

input RecruitmentPeriodInput {
  startDate: String!
  endDate: String!
}
```

**프론트 사용**:
- bcsdlab.com에서 `recruitmentPeriod.isActive`로 "지원하러 가기" / "모집 기간이 아닙니다" 분기
- `/apply`에서도 동일하게 체크

---

## 라우트 추가 정리

```
/login                  — 로그인 (기존, 수정)
/register               — 회원가입 (기존, 경고 배너 추가)
/apply                  — 비기너 지원 폼 (신규)
/apply/status           — 지원 상태 확인 (신규)
/admin/applications     — 관리자 지원자 관리 (신규)
```

---

## 백엔드 요청사항 종합

### 인증 관련
1. 학교 이메일 기반 다중 Google 계정 연결 (장기)
   - `member ↔ google_accounts` 다대일 관계
   - 회원가입 시 학교 이메일로 기존 회원 확인
   - 로그인 시 Google 계정 → 연결된 회원 조회

2. 이미 가입된 계정으로 회원가입 시도 시 명확한 에러 응답
   - 409 Conflict + `"already registered"` 메시지 권장

### 비기너 지원 관련
3. GraphQL 스키마 추가:
   - `Application` 타입 + `ApplicationStatus` enum
   - `submitApplication` mutation
   - `myApplication` query
   - `applications` query (관리자용, 필터/페이지네이션)
   - `updateApplicationStatus` mutation
   - `batchUpdateApplicationStatus` mutation

4. 모집 기간 관리:
   - `RecruitmentPeriod` 타입
   - `recruitmentPeriod` query
   - `setRecruitmentPeriod` mutation (관리자)

### 기존 미반영
5. `MemberFilterInput`에 email, department, studentId, phone 필터 추가
6. `MemberType`에 department, studentId, phone 필드 추가 (목록 쿼리)
7. production에서 GraphiQL UI 비활성화 (`graphiql=False`)
8. `GET /s/{code}` 만료 시 `302 /expired`로 리다이렉트

---

## 구현 순서

### Phase 1: 인증 플로우 개선 (프론트 단독)
1. LoginPage — toast + 리다이렉트 개선, "처음이신가요?" 링크 추가
2. RegisterPage — 경고 배너 추가

### Phase 2: 비기너 지원 폼 (프론트 + 백엔드)
3. 백엔드: Application 스키마 + submitApplication + myApplication
4. 프론트: `/apply` 지원 폼 페이지
5. 프론트: `/apply/status` 지원 상태 페이지

### Phase 3: 관리자 지원자 관리 (프론트 + 백엔드)
6. 백엔드: applications query + updateApplicationStatus mutation
7. 프론트: `/admin/applications` 지원자 관리 페이지 (DataTable 재사용)

### Phase 4: 모집 기간 관리
8. 백엔드: RecruitmentPeriod 스키마
9. 프론트: 관리자 설정 + /apply 모집 기간 체크

### Phase 5: 슬랙 온보딩
10. 승인 시 슬랙 초대 링크 표시

### Phase 6: 학교 이메일 기반 인증 (백엔드 구조 변경)
11. 백엔드: 다중 Google 계정 연결
12. 프론트: 계정 연결 UI (필요 시)
