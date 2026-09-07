# 인증 흐름

## 인증 기준 우선순위

인증 기능의 API·정책은 **Notion API 명세서 → Notion 하위 페이지 → 담당자가 승인한 추천안** 순서로 확정한다. Notion API 명세서와 하위 페이지에 없는 항목은 임의로 확정하지 않고 추천안을 먼저 제시한다. 담당자가 추천안대로 진행하라고 승인한 경우에만 Web 구현 기준으로 사용한다.

## 현재 Next.js 기준

- 인증 화면은 Next.js App Router의 `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`로 이식한다.
- 로그인·회원가입 공통 셸은 `src/app/(auth)/layout.tsx`에서 공유한다.
- Zustand·localStorage·입력 이벤트를 사용하는 인증 화면과 Store는 Client Component로 유지한다.
- 전환 전 Vite에서 검증한 API 계약·토큰 저장·Mock Fixture·한국어 오류 처리는 유지하고 화면 연결 방식을 Next.js로 교체했다.
- 인증 초기화는 `src/features/auth/AuthInitializer.tsx`, 보호 라우트 로딩 경계는 `src/app/(dashboard)/layout.tsx`가 담당한다.

## 인증 값

| 값            | 역할                | 저장·사용 기준                     |
| ------------- | ------------------- | ---------------------------------- |
| Access Token  | API 요청 인증       | 요청 헤더에 사용, 만료 시 재발급   |
| Refresh Token | Access Token 재발급 | 일반 API 요청에 직접 사용하지 않음 |
| 사용자 정보   | 화면·권한 표시      | 인증 성공 후 조회·저장             |

Access Token·Refresh Token과 Access Token 만료 시각은 MVP 기준 localStorage와 Zustand Store에 함께 저장한다. 토큰은 로그와 URL에 남기지 않는다.

## 로그인

```text
/login 진입
→ 아이디·비밀번호 입력 검증
→ 로그인 API 요청
→ Access/Refresh Token 저장
→ 내 정보 조회
→ 역할별 기본 화면 이동
```

### 인증 API 계약

| 기능                 | API                                   | Request 핵심                                   | 성공 결과                                         |
| -------------------- | ------------------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| 휴대폰 인증번호 발송 | `POST /api/v1/auth/phone/send-code`   | `phoneNumber` (하이픈 없음)                    | 인증번호 만료 시간                                |
| 휴대폰 인증번호 확인 | `POST /api/v1/auth/phone/verify-code` | `phoneNumber`, 6자리 `code`                    | 10분 유효 `ticket`                                |
| 아이디 중복 확인     | `GET /api/v1/auth/login-id/check`     | `loginId` query                                | `available`                                       |
| 회원가입             | `POST /api/v1/auth/signup`            | `loginId`, `password`, `phoneNumber`, `ticket` | API 명세서에는 Access/Refresh Token 발급으로 기록 |
| 로그인               | `POST /api/v1/auth/login`             | `identifier`, `password`                       | Access/Refresh Token 발급                         |
| 토큰 재발급          | `POST /api/v1/auth/reissue`           | `refreshToken`                                 | 새 Access/Refresh Token 발급                      |
| 로그아웃             | `POST /api/v1/auth/logout`            | Bearer 토큰, 바디 없음                         | 성공 메시지                                       |
| 내 정보 조회         | `GET /api/v1/users/me`                | Bearer 토큰                                    | 사용자·학적·프로필 정보                           |
| 이름 변경            | `PATCH /api/v1/users/me/name`         | `name`                                         | 성공 메시지                                       |

`GET /api/v1/auth/name/check`는 회원가입 단계가 아니라 가입 후 별명 변경 화면에서 저장 전에 사용한다. 회원가입 Request에는 이름·별명을 포함하지 않는다.

## 회원가입

```text
로그인 화면에서 회원가입 선택
→ 비주얼이 왼쪽으로 이동하고 회원가입 폼이 오른쪽에 표시
→ 1단계: 아이디 중복 확인·비밀번호 입력·검증
→ 2단계: 휴대폰 인증
→ 회원가입
→ Access/Refresh Token 저장
→ 로그인 API 재호출 없이 사용자 정보 조회 후 역할별 기본 화면 이동
→ 가입 완료
```

Notion 내부 문서가 회원가입의 이름 입력·토큰 발급·완료 후 이동을 다르게 정의하지만, **API 명세서를 최우선 기준으로 확정한다.** 회원가입은 이름을 Request로 받지 않고, 성공 시 Access/Refresh Token을 발급하며, 로그인 API를 중복 호출하지 않고 자동 로그인한다. Server `dev`와 차이가 발견되면 API 명세서 기준을 유지한 채 담당자·백엔드 확인 항목으로 보고한다.

Figma Web 회원가입 화면의 이름 입력 위치는 API 계약에 맞춰 휴대폰 번호 입력으로 사용하고, 인증번호 발송 후 인증번호 입력을 조건부로 표시한다. 아이디는 형식이 유효하고 입력이 멈춘 뒤 중복 확인 API를 호출한다.

### Web 인증 화면 전환

- Figma Web의 정적 시각 기준은 유지하고, 화면 연결 경험은 Web 코드의 공통 인증 셸에서 제공한다.
- 로그인·회원가입 모두 폼은 왼쪽, 학교 건물 비주얼은 오른쪽에 고정한다.
- 상태 변경 시 패널과 사진은 움직이지 않고, 새 폼만 아래 54px 위치에서 1200ms 동안 opacity·blur·scale이 풀리며 올라온다.
- 사용자가 `/login` 또는 `/signup`으로 직접 접근해도 왼쪽 폼·오른쪽 사진 배치를 동일하게 표시한다.
- `prefers-reduced-motion: reduce`에서는 폼 진입 애니메이션을 제거한다.

### 회원가입 단계

- 1단계는 아이디·비밀번호·비밀번호 확인만 보여준다.
- 1단계 검증을 통과하면 2단계로 이동한다.
- 2단계는 휴대폰 번호·인증번호를 보여주고, 인증 성공으로 받은 `ticket`을 회원가입 Request에 사용한다.
- 인증번호는 API 응답의 `expiresIn`을 기준으로 5분 동안 유효하며, 만료 시 인증 상태와 ticket을 폐기한다.
- 인증번호 재발송 버튼은 발송 후 30초 동안 잠그고 남은 초를 표시한다.
- `이전`으로 1단계로 돌아갈 수 있다. 전화번호가 바뀌면 기존 `ticket`과 인증 상태를 초기화한다.
- 800px 이하에서는 비주얼을 숨기고 폼 중심으로 동작한다.
- 회원가입 제목의 `GONE`은 로고 자산을 제목 높이에 맞춰 사용하고, 별도 상단 로고는 표시하지 않는다.
- 회원가입 단계명 텍스트는 표시하지 않고 2칸 진행선으로 현재 단계를 전달한다.
- 로그인·회원가입 폼은 각 인증 패널의 정중앙에 배치하고, 인증 패널은 좌우 동일한 패딩을 사용한다. 좌우 이동하는 비주얼에는 모서리 둥글기를 적용하지 않는다.

## 만료와 재발급

```text
API 요청
→ 401 응답
→ Refresh Token으로 재발급
→ 성공: 원래 요청 1회 재시도
→ 실패: 토큰 삭제·store 초기화·/login 이동
```

- 여러 API가 동시에 401을 반환해도 재발급 요청은 한 번만 보낸다.
- 재발급 Endpoint 자체가 401이면 다시 재발급하지 않는다.
- 재발급에 실패하면 사용자 정보까지 초기화하고 `/login`으로 이동한다.

## 인증 초기화와 Splash

```text
보호 라우트 진입
→ localStorage에서 토큰 확인
→ 토큰 없음: 인증 상태 삭제·/login 이동
→ 토큰 있음: GET /api/v1/users/me
→ Access Token 만료: 401 인터셉터가 재발급 후 원래 요청 재시도
→ 사용자 정보·역할 저장
→ 역할별 첫 화면 이동
```

- 사용자 정보를 확인하는 동안 보호 화면 대신 `Splash`를 표시한다.
- `/login`, `/signup`은 공개 라우트라 초기화 리다이렉트 대상에서 제외한다.
- 역할별 첫 화면은 `STUDENT=/student`, `TEACHER=/teacher`, `DISCIPLINE=/discipline`, `ADMIN=/admin`으로 연결한다.

## 로그아웃

- `POST /api/v1/auth/logout`을 호출한다.
- Access Token, Refresh Token, 사용자 정보를 모두 제거한다.
- 보호된 페이지에 남아 있지 않도록 `/login`으로 이동한다.

## 보호 라우트

- 로그인 여부만 필요한 라우트와 역할까지 필요한 라우트를 구분한다.
- 프론트의 라우트 가드는 UX용이다. 실제 권한 검증은 서버가 담당한다.
- 권한이 없으면 403 전용 화면을 보여주고, 로그인하지 않았으면 `/login`으로 보낸다.
