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

`.env.example`을 복사해 `.env.local`을 만들고 로컬 값을 작성한다. 현재 GONE-Web은 Next.js 기준으로 실행하므로 브라우저 공개 환경변수는 `NEXT_PUBLIC_*`를 사용한다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:9090
```

- Next.js에서 브라우저에 노출할 값은 `NEXT_PUBLIC_` 접두사를 사용한다.
- `.env.local`, 운영 비밀값, 토큰을 Git에 올리지 않는다.
- 환경변수가 없을 때는 앱 시작 시 알아보기 쉬운 오류를 보여준다.
- 배포 환경의 값은 Vercel 프로젝트 설정으로 관리한다.
- 현재 인증 구현은 `NEXT_PUBLIC_API_BASE_URL`을 통해 실제 GONE Server만 호출한다.
- Issue #4에서는 백엔드 준비 전 Mock API·Fixture로 Web 자체 QA를 수행한 뒤 Mock 코드와 `NEXT_PUBLIC_API_MODE` 분기를 제거했다.
- 실제 Backend·SMS·학적 DB 통합 QA 전에는 서버 주소와 테스트 계정을 별도로 준비한다.

> 이전 Vite QA 명령에서 사용한 `VITE_*` 변수는 과거 실행 기록으로만 보존한다.

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

## 백엔드 미연동 테스트 이력

백엔드가 준비되지 않은 기능은 실제 API와 같은 타입·요청·응답을 사용하는 별도 Mock API 계층으로 먼저 검증한다. Issue #4에서는 이 방식으로 Web 자체 QA를 완료한 뒤 제품 코드에서 Mock 계층을 제거했다.

Mock QA는 프론트 화면과 API 함수의 동작 확인이다. 인증 토큰, 서버 권한, SMS 발송, DB 저장 결과까지 확인한 것은 아니므로 실제 서버 연결 테스트를 별도로 남긴다.
