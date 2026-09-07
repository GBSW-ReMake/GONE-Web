# [#4] 로그인 인증 런타임 오류 보고서

> **심각도**: Critical 🔴  
> **발견일**: 2026-09-01  
> **발견 브랜치**: `feat/4-로그인-회원가입-인증`  
> **관련 PR**: 없음  
> **상태**: 해결 완료

## 증상 요약

Mock 로그인에서 로그인 성공 처리를 실행할 때 `setAuthTokens is not a function` 오류가 발생해 로그인 흐름이 중단됐다.

## 재현 방법

> 이 QA 보고서는 Next.js 전환 전 Vite 구현 기준의 과거 기록이다. Next.js 전환 후에는 `NEXT_PUBLIC_API_MODE=mock pnpm dev`로 동일 시나리오를 재검증한다.

1. `VITE_API_MODE=mock pnpm dev`로 GONE-Web을 실행한다.
2. `/login`에 진입한다.
3. 아이디와 비밀번호에 임시 데이터를 입력한다.
4. 로그인 버튼을 클릭한다.
5. 로그인 성공 후 토큰을 저장하는 단계에서 오류를 확인한다.

## 예상 동작

Mock 로그인 응답을 받은 뒤 Access Token과 Refresh Token을 저장하고 `/`로 이동한다.

## 실제 동작

`LoginPage`가 `authStore`의 `setAuthTokens`를 호출했지만 Store에 해당 action이 없어 `setAuthTokens is not a function` 오류가 발생했다.

## 발생 환경

- 브라우저·버전: Codex In-app Browser
- 운영체제: macOS
- 화면 크기: Figma 기준 1920×1200
- 테스트 계정 역할: 학생·교사 실계정이 아닌 Mock 임시 계정
- 커밋: 작업 중 발견, 수정 시점에는 미커밋

## 증빙

- 스크린샷·영상: 없음
- 콘솔 로그: `setAuthTokens is not a function`
- Network 요청·응답: Mock 모드이므로 실제 Network 요청 없음
- 관련 API 상태 코드: 해당 없음

## 원인 분석

`LoginPage.tsx`는 로그인 성공 시 `setAuthTokens`를 사용하도록 구현됐지만, 실제 `authStore.ts`에는 기존 `setAccessToken`만 남아 있었다. 화면과 Store의 action 계약이 일치하지 않아 런타임에서 `undefined`를 함수처럼 호출했다.

## 수정 내용

- `authStore`에 `refreshToken` 상태를 추가했다.
- Access Token과 Refresh Token을 함께 저장하는 `setAuthTokens` action을 추가했다.
- 로그아웃 시 두 토큰을 모두 제거하도록 수정했다.
- 사용자 화면에 원본 JavaScript·Axios 영어 오류가 노출되지 않도록 한국어 안내 문구로 변환했다.

## 재검증 결과

- 재현 여부: 재현되지 않음
- 확인한 브라우저: Codex In-app Browser
- 확인한 상태:
  - Mock 로그인 성공
  - `/` 이동 성공
  - 브라우저 콘솔 오류 0건
  - `pnpm build`, `pnpm lint`, `pnpm format:check` 통과

## Next.js 전환 후 재검증

- 실행: `NEXT_PUBLIC_API_MODE=mock pnpm dev --hostname 127.0.0.1 --port 5176`
- Next.js App Router `/login`, `/signup`, `/` 직접 접근 정상
- Mock 로그인 성공·홈 이동 정상
- 회원가입 1·2단계, 아이디 중복 확인, 휴대폰 인증, 가입 성공·홈 이동 정상
- 390px 반응형 가로 넘침 없음
- 브라우저 콘솔 오류 0건
- `pnpm lint`, `pnpm format:check`, `pnpm build` 통과

## 관련 파일과 링크

- `src/features/auth/LoginPage.tsx`: 로그인 요청과 오류 처리
- `src/stores/authStore.ts`: 인증 토큰 상태와 저장 action
- `src/mocks/fixtures/auth.ts`: Mock 로그인 응답 Fixture
- `docs/WORKFLOW.md`: 한국어 사용자 노출 오류 규칙
- `docs/QA_CONVENTION.md`: 영어 오류 노출 QA 규칙
- 관련 Issue: [#4 로그인·회원가입 인증 흐름 구현](https://github.com/GBSW-ReMake/GONE-Web/issues/4)
- 관련 PR: 없음

---

## Motion 패키지 도입 검토 중 pnpm Store 불일치

> **심각도**: Minor 🟡<br>
> **발견일**: 2026-09-08<br>
> **상태**: 해결 완료

### 발견 환경

- 브랜치: `feat/4-로그인-회원가입-인증`
- 패키지 관리자: pnpm 11.19.0
- 실행 명령: `pnpm add motion`

### 재현 방법

1. GONE-Web 루트에서 `pnpm add motion`을 실행한다.
2. pnpm이 `node_modules`가 연결된 Store와 현재 사용하려는 Store를 비교하는 단계에서 실패한다.

### 예상 결과

- 도입 검토 단계에서 의존성이 정상적으로 변경되거나, 사용하지 않기로 한 의존성은 제거된다.

### 실제 결과

- `ERR_PNPM_META_FETCH_FAIL`로 레지스트리 접근이 차단됐다.
- `ERR_PNPM_UNEXPECTED_STORE`로 기존 `/Users/heojaewon/Library/pnpm/store/v11`과 현재 환경의 저장소 위치가 다름을 확인했다.
- 2026-09-08 사용자 결정으로 Motion 의존성을 제거하는 과정에서 제한된 권한으로 pnpm Store SQLite 파일을 열지 못해 `ERR_SQLITE_ERROR` 가 추가로 발생했다.

### 원인

- 현재 `node_modules`는 사용자 pnpm Store에 연결되어 있지만, 작업 환경은 프로젝트 내부 Store를 사용하려고 해 연결 위치가 충돌했다.
- 제한된 네트워크로 npm 레지스트리 metadata를 조회하지 못했다.

### 수정 및 재검증

- 사용자 요청으로 외부 Motion 패키지를 사용하지 않는 것으로 방향을 변경했다.
- 기존 pnpm Store를 명시해 임시 설치된 `motion` 13.2.0을 제거했다.
- `package.json`·`pnpm-lock.yaml`에 `motion` 의존성이 남지 않았음을 확인했다.
- CSS keyframe 구현 후 `pnpm format:check`, `pnpm lint`, `pnpm build`가 모두 통과했다.

---

## CSS 전환 수정 후 Next.js 생성 타입 중복

> **심각도**: Minor 🟡<br>
> **발견일**: 2026-09-08<br>
> **상태**: 해결 완료

### 발견 환경

- Next.js 16.3.4 Webpack production build
- 실행: `pnpm format:check`, `pnpm lint`, `pnpm build`

### 재현 방법

1. 기존 개발 서버의 `.next` 생성물이 남은 상태에서 `pnpm build`를 실행한다.
2. TypeScript 검사 단계의 `.next/dev/types` 경로를 확인한다.

### 예상 결과

- production build가 컴파일·TypeScript 검사를 끝내고 성공한다.

### 실제 결과

- 컴파일과 ESLint는 통과했다.
- `.next/dev/types/cache-life.d 3.ts`, `.next/dev/types/routes.d 3.ts`에서 기존 생성 타입과 중복된 identifier 오류가 발생했다.

### 원인

- Next.js 개발 생성물에 동일한 타입 파일의 중복 복사본이 남아 production TypeScript 검사에 함께 포함됐다.

### 수정 및 재검증

- 소스나 사용자 데이터가 아닌 Next.js 생성 캐시 `.next`만 정리한다.
- 같은 `pnpm build`를 다시 실행해 중복 오류가 사라졌는지 확인한다.
- 기존 `.next`를 `/tmp/GONE-Web-next-cache-20260908`로 이동해 보존한 후 재빌드했다.
- TypeScript 중복 오류가 재현되지 않았고 production build가 통과했다.

---

## Mock 개발 서버 로컬 포트 권한 오류

> **심각도**: Minor 🟡<br>
> **발견일**: 2026-09-08<br>
> **상태**: 해결 완료

### 발견 환경과 재현 방법

- 제한된 작업 환경에서 `NEXT_PUBLIC_API_MODE=mock pnpm dev --hostname 127.0.0.1 --port 5176`을 실행했다.

### 예상·실제 결과

- 예상: `127.0.0.1:5176`에 Mock 개발 서버가 실행된다.
- 실제: `listen EPERM: operation not permitted 127.0.0.1:5176`으로 서버가 시작되지 않았다.

### 원인·수정·재검증

- 소스가 아닌 작업 환경의 로컬 포트 bind 권한 제한이 원인이다.
- 동일한 Mock 서버 명령을 로컬 포트 권한으로 재실행하고 `/login`·`/signup` 전환을 재검증한다.
- 이미 Mock 모드로 실행 중이던 `http://127.0.0.1:3000`을 사용해 로그인→회원가입→로그인 전환을 재검증했다.
- 두 화면 모두 왼쪽 폼·오른쪽 사진 배치를 유지했고, 담당자 최종 조정값인 1200ms·54px CSS 폼 상승 전환과 콘솔 오류·경고 0건을 확인했다.

---

## 최종 보고서 Markdown 포맷 검사 실패

> **심각도**: Minor 🟡
> **발견일**: 2026-09-08
> **상태**: 해결 완료

### 발견 환경·재현

- 인증 배치·모션 변경을 최종 보고서 표에 추가한 후 `pnpm format:check`를 실행했다.
- `docs/fe/reports/feat-4-로그인-회원가입-인증-final-report.md`의 Markdown 표 정렬이 Prettier 기준과 달라 검사가 실패했다.

### 예상·실제 결과

- 예상: 모든 Markdown 문서가 Prettier 형식 검사를 통과한다.
- 실제: 최종 보고서 1개 파일이 포맷 검사에서 실패했다.

### 원인·수정·재검증

- 긴 텍스트가 추가된 Markdown 표의 칸 너비가 아직 자동 정렬되지 않은 것이 원인이다.
- 해당 보고서에 Prettier를 적용하고 `pnpm format:check`로 동일 절차를 재검증한다.
- 최종 보고서 표를 Prettier로 정렬한 후 `pnpm format:check`가 통과했다.

---

## 역할별 이동 후 보호 라우트 404

> **심각도**: Major 🟠<br>
> **발견일**: 2026-09-08<br>
> **상태**: 해결 완료

### 발견 환경

- 브랜치: `feat/4-로그인-회원가입-인증`
- 실행 모드: `NEXT_PUBLIC_API_MODE=mock`
- 브라우저: Chrome
- Mock 사용자 역할: `TEACHER`

### 재현 방법

1. `/login`에서 임의의 아이디와 비밀번호를 입력한다.
2. 로그인 버튼을 눌러 Mock 로그인을 완료한다.
3. `/`에서 사용자 정보 조회 후 역할별 첫 화면으로 이동하는 결과를 확인한다.

### 예상 결과

- Mock 사용자 역할이 `TEACHER`이므로 `/teacher` 보호 화면이 표시된다.

### 실제 결과

- `/teacher`로 URL은 이동하지만 Next.js 404 화면이 표시된다.
- production build의 Route 목록에도 `/student`, `/teacher`, `/discipline`, `/admin`이 없다.

### 원인 가설과 영향 범위

- `AuthInitializer`와 역할 경로 상수는 구현됐지만 `src/app` 아래 역할별 `page.tsx`와 보호 레이아웃 파일이 누락됐다.
- 로그인·회원가입 성공 후 자동 로그인은 토큰 저장까지만 성공하고 실제 역할별 화면에 진입할 수 없다.

### 수정 내용

- `src/app/(dashboard)/layout.tsx`에 인증 상태 확인과 Splash 경계를 추가했다.
- `/`, `/student`, `/teacher`, `/discipline`, `/admin`의 App Router 페이지를 추가했다.
- 역할별 페이지는 기대 역할과 실제 사용자 역할이 다르면 내용을 노출하지 않고 올바른 역할 경로로 이동할 때까지 Splash를 표시한다.

### 재검증 결과

- Mock 로그인 후 `/teacher`에 정상 진입하고 환영 화면·로그아웃 버튼이 표시되는 것을 확인했다.
- `TEACHER` 사용자가 `/student`에 직접 접근하면 `/teacher`로 돌아오는 것을 확인했다.
- 로그아웃 후 `/admin`에 직접 접근하면 `/login`으로 이동하는 것을 확인했다.
- `pnpm build` Route 목록에 `/`, `/student`, `/teacher`, `/discipline`, `/admin`이 모두 생성됐다.

---

## Chrome 확장 속성으로 인한 hydration 경고

> **심각도**: Minor 🟡<br>
> **발견일**: 2026-09-08<br>
> **상태**: 해결 완료

### 발견 환경과 재현

- Chrome 확장 프로그램이 활성화된 개발 환경에서 `/login`·`/signup`·`/teacher`를 열고 콘솔을 확인했다.

### 예상·실제 결과

- 예상: React hydration 경고가 없다.
- 실제: 서버가 만든 `<body>`에는 없던 `cz-shortcut-listen="true"` 속성이 브라우저에서 주입되어 hydration 불일치 경고가 기록됐다.

### 원인 가설과 영향 범위

- 경고의 diff가 확장 프로그램이 `<body>`에 추가한 속성 하나만 가리키므로 현재 제품 코드의 서버·클라이언트 렌더 결과 차이보다는 브라우저 확장 프로그램 주입이 원인으로 보인다.
- 사용자 기능은 중단되지 않지만 콘솔 오류 0건 기준을 확인하려면 확장 영향을 제거하거나 명시적으로 억제해야 한다.

### 수정 내용

- Root Layout의 `<body>`에 `suppressHydrationWarning`을 적용했다.
- 이 속성은 브라우저 확장이 `<body>`에 추가한 속성 차이만 억제하며 하위 제품 UI의 실제 hydration 문제는 계속 확인할 수 있다.

### 재검증 결과

- 확장 주입이 없는 Codex In-app Browser에서 전체 인증 흐름을 재검증했고 콘솔 오류·경고 0건을 확인했다.

---

## 최종 QA 기록의 trailing whitespace 검사 실패

> **심각도**: Minor 🟡<br>
> **발견일**: 2026-09-08<br>
> **상태**: 해결 완료

### 발견 환경·재현

- 역할 라우트 404와 hydration 경고를 이 문서에 추가한 뒤 `git diff --check`를 실행했다.

### 예상·실제 결과

- 예상: 변경 파일의 공백 오류가 없다.
- 실제: Blockquote 줄바꿈에 사용한 줄 끝 공백 4곳이 `trailing whitespace`로 검출됐다.

### 원인·수정 계획

- Markdown 강제 줄바꿈을 공백 두 칸으로 작성한 것이 원인이다.
- 기존 문서에서 검증된 `<br>` 표기로 교체한 뒤 같은 명령을 재실행한다.

### 재검증 결과

- `<br>` 표기로 교체한 뒤 `git diff --check`가 통과했다.

---

## Mock 실패 시나리오 Fixture 부족

> **심각도**: Major 🟠<br>
> **발견일**: 2026-09-08<br>
> **상태**: 해결 완료

### 발견 환경·재현

1. `src/mocks/auth.ts`의 로그인·회원가입 Mock 분기를 확인한다.
2. Mock 모드에서 로그인 실패와 학적 매칭 실패를 재현할 입력값을 찾는다.

### 예상·실제 결과

- 예상: 계획서의 정상·로딩·오류 상태를 고정 입력으로 반복 검증할 수 있다.
- 실제: 로그인은 모든 입력에 성공하고, 회원가입도 모든 유효 입력에 성공해 로그인 실패와 `GBSW_001` 학적 매칭 실패를 화면에서 재현할 수 없다.

### 원인 가설과 영향 범위

- 정상 흐름 중심의 Fixture만 만들어져 오류 QA용 조건이 빠졌다.
- 실제 백엔드가 없는 현재 환경에서는 주요 한국어 오류 화면을 검증할 수 없다.
- 401 재발급은 Axios 인터셉터에서 일어나지만 Mock API가 Axios를 통하지 않으므로 별도 통합 테스트 또는 실제 백엔드가 필요하다.

### 수정 내용

- 최종 Mock QA 동안 로그인 실패 식별자 `invalid`와 학적 매칭 실패 전화번호 `01000000000`을 임시 Fixture로 추가했다.
- 담당자 요청에 따라 QA 종료 후 `src/mocks` 전체와 `NEXT_PUBLIC_API_MODE` 분기를 제거하고 실제 API 호출만 남겼다.
- 401 재발급은 Mock API가 Axios를 통하지 않는 구조였으므로 코드·빌드 검증까지만 수행하고 실제 Backend 통합 QA로 남겼다.

### 재검증 결과

- `invalid` 로그인에서 `아이디 또는 비밀번호를 확인해주세요.`가 표시됐다.
- `01000000000` 회원가입에서 `학교 학적 명단에서 해당 휴대폰 번호를 찾을 수 없습니다.`가 표시됐다.
- 잘못된 인증번호 `000000`과 정상 인증번호 `123456`을 각각 검증했다.
- 정상 회원가입 후 `/teacher` 자동 이동을 확인한 뒤 Mock 폴더를 제거했다.
- Mock 제거 후 `src`와 `.env.example`에 Mock import·환경변수 참조가 없고 lint·format·build가 통과했다.

---

## 기존 Next 개발 서버 lock으로 신규 Mock 서버 실행 실패

> **심각도**: Minor 🟡<br>
> **발견일**: 2026-09-08<br>
> **상태**: 해결 완료

### 발견 환경·재현

- 기존 `localhost:3000` 개발 서버가 실행 중인 상태에서 현재 변경사항을 분리 검증하려고 `NEXT_PUBLIC_API_MODE=mock pnpm dev --hostname 127.0.0.1 --port 5176`을 실행했다.

### 예상·실제 결과

- 예상: 5176 포트에 현재 소스 기준 Mock 서버가 실행된다.
- 실제: 기존 PID 65897이 `.next/dev/lock`을 사용하고 있어 `Another next dev server is already running`으로 종료됐다.

### 원인·수정 계획

- 같은 프로젝트의 기존 Next 개발 서버와 새 서버가 동일한 `.next` 디렉터리를 동시에 사용하려 한 것이 원인이다.
- 기존 서버를 종료한 뒤 현재 브랜치 소스로 Mock 서버를 다시 실행한다.

### 재검증 결과

- 기존 서버를 정상 종료하고 `127.0.0.1:5176`에서 현재 브랜치의 Mock 서버를 실행했다.
- 로그인·회원가입·역할별 보호 라우트 QA를 완료한 뒤 서버도 정상 종료했다.

---

## 제한된 네트워크에서 GitHub Issue 조회 실패

> **심각도**: Minor 🟡<br>
> **발견일**: 2026-09-08<br>
> **상태**: 해결 완료

### 발견 환경·재현

- 최종 QA 후 Issue #4 체크리스트를 확인하려고 `gh issue view 4`를 실행했다.

### 예상·실제 결과

- 예상: GitHub Issue 제목·상태·본문을 읽는다.
- 실제: 제한된 실행 환경에서 `api.github.com` 연결이 차단되어 조회하지 못했다.

### 원인·수정 계획

- 제품 코드가 아니라 현재 명령 실행 환경의 외부 네트워크 제한이 원인이다.
- 허용된 네트워크 권한으로 동일한 읽기 명령을 재실행한다.

### 재검증 결과

- 허용된 네트워크 권한으로 같은 명령을 재실행해 OPEN 상태의 Issue #4 본문과 체크리스트를 확인했다.

---

## Issue #4 최종 QA 요약

> **검증일**: 2026-09-08<br>
> **검증 기준**: Next.js App Router·Tailwind v4·최종 Mock 제거 전 브라우저 시나리오<br>
> **결과**: 실제 Backend 통합 항목을 제외한 Web 자체 QA 통과

| 구분                 | 결과      | 확인 내용                                                          |
| -------------------- | --------- | ------------------------------------------------------------------ |
| 로그인 입력·로딩     | 통과      | 빈 입력 비활성화, 요청 중 중복 제출 잠금                           |
| 로그인 실패          | 통과      | 임시 실패 입력에서 한국어 오류 표시                                |
| 로그인 성공          | 통과      | 토큰 저장 후 `users/me` Mock 역할 기준 `/teacher` 이동             |
| 회원가입 1단계       | 통과      | 형식 검사, 아이디 중복·사용 가능 상태, 비밀번호 일치 검사          |
| 회원가입 2단계       | 통과      | 전화번호 형식, 인증번호 실패·성공, ticket 기반 제출                |
| 학적 매칭 실패       | 통과      | `GBSW_001` 사용자 안내 표시                                        |
| 회원가입 자동 로그인 | 통과      | 가입 성공 후 로그인 API 재호출 없이 `/teacher` 이동                |
| 인증번호 재발송      | 통과      | 발송 직후 30초 잠금, 30초 후 `다시 받기` 활성화                    |
| 인증번호 5분 만료    | 코드 검증 | 실제 5분 대기는 생략하고 만료 시 상태·ticket 초기화 로직 확인      |
| 보호 라우트          | 통과      | 비인증 접근 차단, 다른 역할 경로 접근 시 본인 역할 경로로 이동     |
| 로그아웃             | 통과      | 클라이언트 인증 초기화 후 `/login` 이동                            |
| 반응형               | 통과      | 390×844에서 비주얼 숨김, `scrollWidth=clientWidth=390`             |
| 키보드·접근성        | 통과      | 로그인 포커스 순서, label 연결, 오류 alert, progressbar 확인       |
| reduced motion       | 코드 검증 | `motion-reduce:animate-none`·transition 제거 클래스 확인           |
| 브라우저 콘솔        | 통과      | 최종 시나리오 오류·경고 0건                                        |
| 정적 검사            | 통과      | `git diff --check`, `pnpm format:check`, `pnpm lint`, `pnpm build` |
| 실제 Backend·SMS·DB  | 미검증    | Backend와 테스트 데이터가 준비된 환경에서 별도 통합 QA 필요        |

### Mock 제거 결과

- 최종 브라우저 QA를 마친 뒤 담당자 요청대로 `src/mocks` 폴더를 삭제했다.
- `src/api/auth.ts`는 모든 인증 요청을 실제 GONE Server로 전송한다.
- `.env.example`에는 `NEXT_PUBLIC_API_BASE_URL`만 남기고 Mock 전환 변수를 제거했다.
- 과거 Mock 재현 기록은 이 QA 문서에 이력으로만 보존한다.

---

## 최종 QA 표 Markdown 포맷 검사 실패

> **심각도**: Minor 🟡<br>
> **발견일**: 2026-09-08<br>
> **상태**: 해결 완료

### 발견 환경·재현

- 최종 QA 결과를 QA 보고서와 최종 개발 보고서의 Markdown 표에 반영한 뒤 `pnpm format:check`를 실행했다.

### 예상·실제 결과

- 예상: 모든 문서가 Prettier 형식 검사를 통과한다.
- 실제: 두 보고서의 표 열 너비가 자동 정렬 기준과 달라 검사가 실패했다.

### 수정 계획·재검증 결과

- 두 보고서에만 Prettier를 적용하고 같은 형식 검사를 다시 실행한다.
- 두 보고서를 자동 정렬한 뒤 `pnpm format:check`가 통과했다.

## 최종 자동검증 중 Prettier 캐시 경로 오류 — 2026-09-08

- 발견 환경: GONE-Web 최종 커밋 직전, macOS 로컬 환경, Next.js `.next` 생성 캐시 존재
- 재현 방법: `pnpm format:check`
- 예상 결과: 저장소 파일 포맷 검사 통과
- 실제 결과: Prettier가 `.next/static/chunks 2` 경로를 스캔하는 중 `Unknown system error -70`을 출력하고 종료 코드 2로 종료
- 원인: 제품 소스가 아닌 Next.js 생성 캐시 경로를 Prettier가 검사하는 환경 오류로 추정
- 영향 범위: 포맷 검사만 차단하며 애플리케이션 빌드·런타임 동작과 무관
- 수정: `.prettierignore`에 Next.js 생성 캐시와 의존성·빌드 출력 디렉터리를 등록했다.
- 재검증: 동일 명령 재실행 후 통과 여부를 아래에 기록한다.

### 재검증 결과

- `pnpm format:check`: 통과
