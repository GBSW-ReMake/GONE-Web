# [#4] 로그인 인증 런타임 오류 보고서

> **심각도**: Critical 🔴  
> **발견일**: 2026-09-01  
> **발견 브랜치**: `feat/4-로그인-회원가입-인증`  
> **관련 PR**: 없음  
> **상태**: 해결 완료

## 증상 요약

Mock 로그인에서 로그인 성공 처리를 실행할 때 `setAuthTokens is not a function` 오류가 발생해 로그인 흐름이 중단됐다.

## 재현 방법

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

## 관련 파일과 링크

- `src/pages/LoginPage.tsx`: 로그인 요청과 오류 처리
- `src/stores/authStore.ts`: 인증 토큰 상태와 저장 action
- `src/mocks/fixtures/auth.ts`: Mock 로그인 응답 Fixture
- `docs/WORKFLOW.md`: 한국어 사용자 노출 오류 규칙
- `docs/QA_CONVENTION.md`: 영어 오류 노출 QA 규칙
- 관련 Issue: [#4 로그인·회원가입 인증 흐름 구현](https://github.com/GBSW-ReMake/GONE-Web/issues/4)
- 관련 PR: 없음
