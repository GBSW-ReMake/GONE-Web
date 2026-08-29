# 환경 설정

## 요구 사항

| 도구    | 버전         |
| ------- | ------------ |
| Node.js | 22 이상      |
| pnpm    | 11.19.0 기준 |

패키지 관리자는 팀 전체가 `pnpm`으로 통일하고 `pnpm-lock.yaml`을 함께 커밋한다.

## 시작하기

```bash
pnpm install
pnpm dev
```

## 환경변수

`.env.example`을 복사해 `.env.local`을 만들고 로컬 값을 작성한다.

```env
VITE_API_BASE_URL=http://localhost:9090
```

- Vite에서 브라우저에 노출할 값은 `VITE_` 접두사를 사용한다.
- `.env.local`, 운영 비밀값, 토큰을 Git에 올리지 않는다.
- 환경변수가 없을 때는 앱 시작 시 알아보기 쉬운 오류를 보여준다.
- 배포 환경의 값은 Vercel 프로젝트 설정으로 관리한다.

## 명령어

```bash
pnpm dev          # 개발 서버
pnpm build        # 타입 검사 및 프로덕션 빌드
pnpm lint         # ESLint 검사
pnpm format       # Prettier 자동 정리
pnpm format:check # 포맷 검사
```

## 문제 해결 순서

1. Node.js와 pnpm 버전을 확인한다.
2. `.env.local`과 API 주소를 확인한다.
3. `pnpm install`로 lockfile 기준 의존성을 설치한다.
4. 개발 서버와 백엔드 서버의 포트를 확인한다.
5. 브라우저 Network 탭에서 요청 URL·상태 코드·응답을 확인한다.
