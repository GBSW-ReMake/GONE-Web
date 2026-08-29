# GONE Web

경북소프트웨어고등학교 교내 관리 서비스 GONE의 웹 프론트엔드입니다.

## 기술 스택

- React
- TypeScript
- Vite
- pnpm

## 시작하기

### 요구 사항

- Node.js 22 이상
- pnpm 10 이상

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### 빌드

```bash
pnpm build
```

### 린트

```bash
pnpm lint
```

## 환경변수

`.env.example`을 복사해서 `.env.local`을 만들고 환경에 맞는 값을 입력합니다.

```bash
cp .env.example .env.local
```

실제 환경변수 파일은 보안상 Git에 올리지 않습니다.

## 브랜치

```text
main                    배포 기준
dev                     개발 통합
feat/{이슈번호}-{기능명}  기능 개발
fix/{이슈번호}-{기능명}   버그 수정
```

기능 개발은 `dev`에서 기능 브랜치를 만든 뒤 PR로 병합합니다.

## 문서

프론트엔드 개발 문서는 [`docs/`](./docs/)에서 관리합니다.

## 관련 레포지토리

- [GONE Server](https://github.com/GBSW-ReMake/GONE-server-V1)
- [GONE iOS](https://github.com/GBSW-ReMake/GONE-iOS)
- [GONE Android](https://github.com/GBSW-ReMake/GONE-Android)
