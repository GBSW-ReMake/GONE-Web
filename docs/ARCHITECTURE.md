# 웹 프론트엔드 아키텍처

## 기술 스택

- React
- TypeScript
- Vite
- pnpm
- Axios
- Zustand
- React Router

## 폴더 구조

```text
src/
├── api/          API 요청
├── assets/       이미지와 정적 리소스
├── components/   재사용 UI
├── constants/    상수
├── hooks/        공통 Hook
├── layouts/      공통 레이아웃
├── pages/        라우트 화면
├── routes/       라우팅과 접근 제어
├── stores/       전역 상태
├── styles/       전역 스타일과 토큰
├── types/        공통 타입
└── utils/        공통 유틸리티
```

화면은 `pages`, 재사용 UI는 `components`, 서버 통신은 `api`에 둔다.
