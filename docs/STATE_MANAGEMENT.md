# 상태 관리

## 상태 분류

| 상태 종류    | 예시                           | 저장 위치                                |
| ------------ | ------------------------------ | ---------------------------------------- |
| 서버 상태    | 외출증 목록, 급식, 사용자 정보 | 화면 Hook 또는 API 응답 캐시             |
| 인증 상태    | 토큰, 사용자, 초기화 상태      | `src/stores/authStore.ts`                |
| 전역 UI 상태 | 전역 알림 수, 사이드바 열림    | Zustand, 실제 공유가 필요할 때           |
| 화면 상태    | 입력값, 탭, 모달               | 해당 컴포넌트 `useState`                 |
| URL 상태     | 검색어, 페이지, 필터           | Next.js `searchParams`·`useSearchParams` |

## 선택 기준

- 한 화면에서만 쓰는 값은 컴포넌트 상태로 둔다.
- 여러 화면이 함께 읽고 변경하는 값만 Zustand에 둔다.
- 서버에서 다시 받을 수 있는 목록을 무조건 전역 Store에 복제하지 않는다.
- 새로고침 시 사라져도 되는 값인지 먼저 판단한다.

## Store 규칙

- 도메인 단위로 Store를 나눈다.
- 상태와 상태를 변경하는 action을 함께 둔다.
- 컴포넌트가 localStorage를 직접 읽고 쓰지 않게 한다.
- 로그아웃 시 인증 관련 값과 사용자 정보를 모두 초기화한다.
- 비밀번호, Refresh Token 등 민감정보는 일반 UI 상태로 노출하지 않는다.
- Zustand와 localStorage를 사용하는 Store·화면은 Client Component 경계 안에서만 실행한다.
- 서버 컴포넌트에 클라이언트 Store를 직접 import하지 말고, 필요한 값을 props로 전달한다.

## 인증 상태 수명주기

```text
idle → initializing → authenticated
  └────────────────→ unauthenticated
```

- `accessToken`, `refreshToken`: API 인증과 재발급에 사용한다.
- `accessTokenExpiresAt`: 만료 시각을 기록해 토큰 갱신 결과를 추적한다.
- `user`: `GET /api/v1/users/me`에서 받은 역할·학적·프로필 정보다.
- `status`: 인증 초기화 중에는 `initializing`, 성공 후에는 `authenticated`로 둔다.
- 토큰·사용자 정보가 없거나 재발급에 실패하면 `clearAuth()`로 `unauthenticated`가 된다.

## 서버 데이터 화면 상태

```text
idle → loading → success
              ├→ empty
              └→ error → retry
```

요청 중 이전 데이터가 보이는지, 재요청 시 버튼을 비활성화할지 기능 계획서에 기록한다.
