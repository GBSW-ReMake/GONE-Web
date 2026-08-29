# API Client 규칙

## 기본 설정

- Axios 인스턴스는 `src/api/client.ts`에서 관리한다.
- API 주소는 `VITE_API_BASE_URL` 환경변수로 관리한다.
- 모든 요청은 공통 응답과 에러 처리 규칙을 따른다.

## 인증

- 인증이 필요한 요청에는 Access Token을 Bearer 형식으로 전달한다.
- 401 응답은 Refresh Token 재발급 흐름을 거친다.
- 재발급 실패 시 인증 상태를 초기화하고 로그인 화면으로 이동한다.

## API 함수 규칙

API 함수는 화면 컴포넌트에 직접 작성하지 않고 `src/api/`에 분리한다.
