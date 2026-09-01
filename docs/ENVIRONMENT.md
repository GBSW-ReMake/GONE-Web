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
VITE_API_MODE=mock
```

- Vite에서 브라우저에 노출할 값은 `VITE_` 접두사를 사용한다.
- `.env.local`, 운영 비밀값, 토큰을 Git에 올리지 않는다.
- 환경변수가 없을 때는 앱 시작 시 알아보기 쉬운 오류를 보여준다.
- 배포 환경의 값은 Vercel 프로젝트 설정으로 관리한다.
- `VITE_API_MODE=mock`은 백엔드 없이 화면·상태·API 흐름을 검증할 때만 사용한다.
- `VITE_API_MODE=real`은 실제 GONE Server에 연결할 때 사용한다.
- 운영 환경에서는 `VITE_API_MODE=real`만 허용하고 Mock Handler와 Fixture가 요청을 가로채지 않게 한다.
- Mock 데이터는 테스트 재현을 위해 저장소에 남길 수 있지만 운영 화면에 노출되면 안 된다.

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

## 백엔드 미연동 테스트 원칙

백엔드가 준비되지 않았을 때는 컴포넌트 안에 임시 배열을 직접 넣지 않고, 실제 API 요청을 가로채는 Mock API 계층을 사용한다.

- `src/mocks/fixtures`: 정상·빈·오류 응답용 고정 데이터
- `src/mocks/handlers`: 실제 API와 같은 요청 경로와 응답 정의
- `VITE_API_MODE`: Mock과 실제 서버 전환 스위치

Mock을 사용한 테스트는 프론트 화면과 API 함수의 동작 확인이다. 인증 토큰, 서버 권한, DB 저장 결과까지 확인한 것은 아니므로 실제 서버 연결 테스트를 별도로 남긴다.
