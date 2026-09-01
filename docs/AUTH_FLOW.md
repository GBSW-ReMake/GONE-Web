# 인증 흐름

## 인증 기준 우선순위

인증 기능의 API·정책은 **Notion API 명세서 → Notion 하위 페이지 → 담당자가 승인한 추천안** 순서로 확정한다. Notion API 명세서와 하위 페이지에 없는 항목은 임의로 확정하지 않고 추천안을 먼저 제시한다. 담당자가 추천안대로 진행하라고 승인한 경우에만 Web 구현 기준으로 사용한다.

## 인증 값

| 값            | 역할                | 저장·사용 기준                     |
| ------------- | ------------------- | ---------------------------------- |
| Access Token  | API 요청 인증       | 요청 헤더에 사용, 만료 시 재발급   |
| Refresh Token | Access Token 재발급 | 일반 API 요청에 직접 사용하지 않음 |
| 사용자 정보   | 화면·권한 표시      | 인증 성공 후 조회·저장             |

토큰의 실제 저장 방식과 재발급 Endpoint는 백엔드 계약을 기준으로 확정한다. 토큰은 로그와 URL에 남기지 않는다.

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

## 회원가입

```text
아이디 중복 확인
→ 비밀번호 입력·검증
→ 휴대폰 인증
→ 회원가입
→ Access/Refresh Token 저장
→ 로그인 API 재호출 없이 사용자 정보 조회 후 역할별 기본 화면 이동
→ 가입 완료
```

Notion 내부 문서가 회원가입의 이름 입력·토큰 발급·완료 후 이동을 다르게 정의하지만, **API 명세서를 최우선 기준으로 확정한다.** 회원가입은 이름을 Request로 받지 않고, 성공 시 Access/Refresh Token을 발급하며, 로그인 API를 중복 호출하지 않고 자동 로그인한다. Server `dev`와 차이가 발견되면 API 명세서 기준을 유지한 채 담당자·백엔드 확인 항목으로 보고한다.

## 만료와 재발급

```text
API 요청
→ 401 응답
→ Refresh Token으로 재발급
→ 성공: 원래 요청 1회 재시도
→ 실패: 토큰 삭제·store 초기화·/login 이동
```

## 로그아웃

- `POST /api/v1/auth/logout`을 호출한다.
- Access Token, Refresh Token, 사용자 정보를 모두 제거한다.
- 보호된 페이지에 남아 있지 않도록 `/login`으로 이동한다.

## 보호 라우트

- 로그인 여부만 필요한 라우트와 역할까지 필요한 라우트를 구분한다.
- 프론트의 라우트 가드는 UX용이다. 실제 권한 검증은 서버가 담당한다.
- 권한이 없으면 403 전용 화면을 보여주고, 로그인하지 않았으면 `/login`으로 보낸다.
