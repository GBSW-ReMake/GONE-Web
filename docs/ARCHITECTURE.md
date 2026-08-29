# 웹 프론트엔드 아키텍처

## 목표

GONE Web은 역할별 관리 화면과 학교 생활 기능을 제공하는 React 웹 클라이언트다. 화면 컴포넌트가 모든 책임을 갖지 않도록 화면·도메인 데이터·공통 UI·서버 통신을 분리한다.

## 기술 스택과 책임

| 기술            | 책임                                 | 사용 위치                     |
| --------------- | ------------------------------------ | ----------------------------- |
| React           | 화면과 컴포넌트 구성                 | `src/pages`, `src/components` |
| TypeScript      | 데이터 형태와 함수 계약 검증         | `src/**/*.ts`, `src/**/*.tsx` |
| Vite            | 개발 서버와 프로덕션 번들링          | 프로젝트 루트                 |
| Axios           | HTTP 요청과 인증 헤더 처리           | `src/api`                     |
| Zustand         | 여러 화면이 공유하는 클라이언트 상태 | `src/stores`                  |
| React Router    | URL과 화면, 접근 제어 연결           | `src/routes`                  |
| Prettier/ESLint | 코드 스타일과 오류 검사              | 프로젝트 루트                 |

## 폴더 구조

```text
src/
├── api/          API 클라이언트와 도메인별 요청 함수
├── assets/       이미지, 아이콘, 폰트 등 정적 리소스
├── components/   두 개 이상 화면에서 재사용하는 UI
├── constants/    변하지 않는 키, 라벨, 옵션
├── hooks/        재사용 가능한 React Hook
├── layouts/      인증·역할·페이지 공통 레이아웃
├── pages/        URL에 직접 대응하는 화면 조합
├── routes/       라우트, 보호 라우트, 권한 검사
├── stores/       인증·전역 UI 등 클라이언트 상태
├── styles/       전역 CSS와 디자인 토큰
├── types/        도메인·API 공통 타입
└── utils/        순수 변환·검증 함수
```

## 책임 분리 규칙

- `pages`: 화면 조합과 화면 단위 데이터 연결만 담당한다.
- `components`: 특정 URL이나 역할에 종속되지 않는 UI를 둔다.
- `api`: Axios 호출과 API 응답 변환을 둔다. 컴포넌트에서 직접 `axios.get`을 호출하지 않는다.
- `stores`: 새로고침 이후에도 남아야 하는 값인지 검토한 뒤 저장한다.
- `types`: API 응답 타입과 화면 모델을 구분하고 `any` 사용을 피한다.
- `utils`: React 상태나 브라우저 전역에 의존하지 않는 순수 함수를 둔다.

## 데이터 흐름

```text
Page → Hook 또는 이벤트 핸들러 → 도메인 API 함수 → Axios client
→ Backend API → 응답 타입 변환 → 상태 갱신 → Component 렌더링
```

## 구현 기준

- API 호출 상태는 `idle | loading | success | empty | error`를 구분한다.
- 권한은 라우트와 버튼에서 UX를 제어하되, 보안 판단은 백엔드 응답을 따른다.
- 페이지가 사라질 때 취소가 필요한 요청은 AbortController를 고려한다.
- 공통 UI는 실제 화면에서 두 번 이상 필요할 때 추출한다.
