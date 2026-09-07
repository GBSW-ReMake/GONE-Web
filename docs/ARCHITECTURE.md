# 웹 프론트엔드 아키텍처

## 목표

GONE Web은 역할별 관리 화면과 학교 생활 기능을 제공하는 Next.js 웹 클라이언트로 전환한다. 화면 컴포넌트가 모든 책임을 갖지 않도록 화면·도메인 데이터·공통 UI·서버 통신을 분리한다.

> 인증 화면은 Next.js App Router로 이식 완료했다. 이전 Vite 구조와 QA는 비교 이력으로만 보존하며, 이후 기능은 아래 구조를 따른다.

## 기술 스택과 책임

| 기술               | 책임                                   | 사용 위치                        |
| ------------------ | -------------------------------------- | -------------------------------- |
| React              | 화면과 컴포넌트 구성                   | `src/features`, `src/components` |
| TypeScript         | 데이터 형태와 함수 계약 검증           | `src/**/*.ts`, `src/**/*.tsx`    |
| Next.js            | App Router, 개발 서버, 프로덕션 번들링 | `src/app`                        |
| Axios              | HTTP 요청과 인증 헤더 처리             | `src/api`                        |
| Zustand            | 여러 화면이 공유하는 클라이언트 상태   | `src/stores`                     |
| Next.js App Router | URL과 화면, 레이아웃 연결              | `src/app`                        |
| Prettier/ESLint    | 코드 스타일과 오류 검사                | 프로젝트 루트                    |

## 폴더 구조

```text
src/app/
├── (auth)/       로그인·회원가입 공통 layout과 공개 화면
├── (dashboard)/  인증 이후 역할별 화면과 layout
├── layout.tsx    애플리케이션 공통 layout
└── globals.css   Tailwind import와 전역 기본값
src/
├── api/          API 클라이언트와 도메인별 요청 함수
├── components/   두 개 이상 화면에서 재사용하는 UI
├── features/     URL에 직접 종속되지 않는 도메인별 화면 컴포넌트
├── constants/    변하지 않는 키, 라벨, 옵션
├── hooks/        재사용 가능한 Client Hook
├── stores/       인증·전역 UI 등 클라이언트 상태
├── types/        도메인·API 공통 타입
├── mocks/        백엔드 미연동 개발용 Fixture
└── utils/        순수 변환·검증 함수
public/
└──             로고·학교 이미지 등 URL로 제공할 정적 리소스
```

## 책임 분리 규칙

- `src/app/**/page.tsx`: URL에 대응하는 화면 조합과 화면 단위 데이터 연결만 담당한다.
- `src/app/**/layout.tsx`: 여러 화면이 공유하는 레이아웃과 접근 제어 경계를 담당한다.
- `components`: 특정 URL이나 역할에 종속되지 않는 UI를 둔다.
- `api`: Axios 호출과 API 응답 변환을 둔다. 컴포넌트에서 직접 `axios.get`을 호출하지 않는다.
- `stores`: 새로고침 이후에도 남아야 하는 값인지 검토한 뒤 저장한다. localStorage를 사용하는 Store는 Client Component에서만 호출한다.
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
- `useState`, `useEffect`, Zustand, 이벤트 핸들러, localStorage를 사용하는 파일에는 필요한 범위에서 `'use client'`를 선언한다.
- 서버 컴포넌트에서 브라우저 전용 API를 직접 호출하지 않는다.

## Vite에서 Next.js로 전환한 결과

- React Router의 route 설정은 `src/app` 디렉터리의 `page.tsx`·`layout.tsx`로 옮긴다.
- `import.meta.env.VITE_*`는 `process.env.NEXT_PUBLIC_*`로 변경한다.
- `useNavigate`·React Router `Link`는 Next.js의 `useRouter`·`Link`로 변경한다.
- Vite 전용 설정과 의존성은 제거했고, 기존 인증 Mock QA와 Next.js Mock QA를 비교해 동작 차이를 확인했다.
