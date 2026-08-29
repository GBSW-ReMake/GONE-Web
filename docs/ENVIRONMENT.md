# 환경 설정

## 실행 환경

```text
Node.js 22 이상
pnpm 11.19.0
```

## 환경변수

```env
VITE_API_BASE_URL=http://localhost:9090
```

- 로컬 값은 `.env.local`에 작성한다.
- `.env.local`과 실제 비밀값은 Git에 올리지 않는다.
- 배포 환경의 환경변수는 Vercel 설정에서 관리한다.

## 명령어

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```
