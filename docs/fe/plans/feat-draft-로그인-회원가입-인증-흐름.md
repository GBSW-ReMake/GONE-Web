# 로그인·회원가입 인증 흐름 계획서

> **상태**: 검토 대기  
> **작성일**: 2026-08-31  
> **작성자**: 허재원  
> **관련 이슈**: [#4 로그인·회원가입 인증 흐름 구현](https://github.com/GBSW-ReMake/GONE-Web/issues/4)  
> **브랜치**: Issue 생성 후 기입

## 0. 기준 우선순위와 이번 계획의 확정값

### 기준 우선순위

1. Notion API 명세서
2. Notion 하위 페이지(기능정의서, ErrorCode, 정책 등)
3. Notion에 없는 내용은 담당자에게 확인하고, 담당자가 추천안대로 진행하라고 승인한 경우 추천안 확정

Figma Web frame/node는 Web 화면의 시각·UX 기준으로 사용한다. GONE Server·iOS·Android는 API 구현 검증과 공통 인증 흐름 참고용으로 사용하며 Notion 기준을 덮어쓰지 않는다.

### Notion에 정의되지 않아 추천안으로 확정한 값

- Web에는 별도 역할 선택 화면을 두지 않는다. 회원가입 성공 후 자동 로그인하고 `GET /api/v1/users/me`로 역할을 확인한 뒤 역할별 기본 화면으로 이동한다.
- API가 Refresh Token을 JSON으로 반환하고 현재 Web authStore가 localStorage 기반이므로 MVP에서는 Access/Refresh Token을 localStorage에 저장한다. 이후 HttpOnly Cookie를 지원하면 보안 저장 방식으로 전환한다.
- 이번 인증 Issue에는 로그인, 회원가입, 휴대폰 인증, 아이디 중복 확인, 토큰 저장·재발급, 자동 로그인, `users/me`, 로그아웃을 포함한다.
- 비밀번호 변경, 회원탈퇴, 프로필 이미지, 관리자 학적 등록, OAuth 2.1과 실제 역할별 서비스 화면은 이번 Issue에서 제외한다.

## 1. 목적과 배경

- 사용자 문제: GONE-Web은 현재 초기 Vite 화면과 인증 저장소 골격만 있어 로그인·회원가입을 사용할 수 없다.
- 해결하려는 가치: GONE의 공통 인증 흐름을 Web에서도 제공하고, Figma Web 기준의 일관된 화면 경험으로 이후 학생·교사·선도부·관리자 기능의 진입 기반을 만든다.
- 이번 범위에 포함하지 않는 것: 홈·외출·스쿨캠핑·상벌점·급식·시간표 등 인증 이후 도메인 기능, 관리자 기능 전체.

## 2. 공식 자료 확인 결과

### Figma Web 기준

- 파일: https://www.figma.com/design/l3MKhDJ6ciT7gfSvTpiYNI/경소마고-관리시스템
- 로그인 Web frame: `430:10986`, 1920×1200
  - 좌측 약 404px 콘텐츠 영역과 우측 배경 영역으로 구성
  - 우측 비주얼 영역에는 경북소프트웨어마이스터고등학교 건물 사진을 배경 이미지로 사용
  - 첨부된 학교 건물 사진은 로그인 화면의 브랜드·학교 정체성을 표현하는 자산으로 취급하며, 구현 시 Figma의 crop·radius·overlay 값을 우선 확인
  - GONE 로고, 로그인 안내 문구, 아이디/전화번호 입력, 비밀번호 입력, 로그인 CTA, 회원가입 링크를 포함
- 회원가입 Web frame: `431:11473`, 1920×1200
  - 중앙 약 404px 콘텐츠 영역으로 구성
  - GONE 로고, 회원가입 제목·설명, 4개 입력 영역, 회원가입 CTA, 로그인 링크를 포함
- 모바일 frame `14:1509`, `14:1759`는 iOS/Android 참고용이며 Web 레이아웃 기준에서 제외한다.
- Web Figma의 4개 입력 영역의 정확한 필드 순서와 responsive breakpoint는 담당자 검토 및 Server API 계약 확인 후 확정한다.

### GONE Server `dev`

- 저장소: https://github.com/GBSW-ReMake/GONE-server-V1/tree/dev
- `auth` 도메인과 JWT 보안 구조가 존재한다.
- 확인된 인증 관련 구조: 로그인, 회원가입, 아이디·이름 중복 확인 DTO, 휴대폰 인증 발송·검증 DTO, 토큰 재발급 DTO, 인증 테스트.
- 확인된 주요 경로: `src/main/java/com/remake/gone/auth`, `postman/collections/gone-auth.postman_collection.json`, `docs/domain/auth`.

### GONE iOS `dev`

- 저장소: https://github.com/GBSW-ReMake/GONE-iOS/tree/dev
- `Features/Auth` 아래 Splash, Login, Signup, RoleSelection 흐름이 분리되어 있다.
- `LoginViewModelTests.swift`, `SignupViewModelTests.swift`가 존재한다.

### GONE Android `dev`

- 저장소: https://github.com/GBSW-ReMake/GONE-Android/tree/dev
- `lib/features/auth` 아래 splash, login, signup, role selection과 `auth_flow_notifier.dart`가 존재한다.
- `doc/fe/issues/issue-03-auth-flow-qa.md`에 인증 흐름 QA 기록이 있다.

### Notion

- 페이지: https://app.notion.com/p/ReMake-3a887687e1a880759966d59065946c06
- 브라우저에서 ReMake 워크스페이스의 기능정의서와 API 명세 링크를 확인했다.
- 로그인은 아이디 또는 전화번호와 비밀번호를 사용한다.
- 회원가입은 전화번호 인증 완료 후 아이디·비밀번호·전화번호·인증 ticket을 제출한다. 이름은 API Request에 포함하지 않는다.
- 전화번호 인증번호 유효시간은 실제 기준 5분, 회원가입 ticket 유효시간은 10분이다.
- 전화번호 인증 API는 `POST /api/v1/auth/phone/send-code`, `POST /api/v1/auth/phone/verify-code`로 정의되어 있다.
- 인증번호 재발송은 30초 쿨다운을 적용한다.
- 회원가입은 ticket·전화번호 일치·학적 명단 매칭·아이디 중복 확인을 통과해야 하며, 학적 매칭 실패 시 가입 자체가 실패한다.
- API 명세서의 `AUTH_003`에는 회원가입 성공 시 Access Token·Refresh Token을 즉시 발급한다고 기록되어 있다.
- API 명세서의 `AUTH_003` Request에는 `name`이 없고, 학적 데이터 기반으로 서버가 이름/닉네임을 생성한다고 기록되어 있다.
- 기존 기능정의서의 “이름 입력·가입 후 로그인 이동·토큰 없음”과 API 명세서가 충돌하지만, **API 명세서 기준으로 회원가입 Request·완료 동작을 확정한다.**
- 프로필 사진은 현재 User와 연결되지 않아 이번 범위에서 제외한다.
- 비밀번호 변경과 로그아웃은 MVP, 회원탈퇴는 2차 고도화다.
- API 명세서의 인증 API View에서 `AUTH_001`~`AUTH_013` 중 로그인·회원가입 관련 인증 API를 확인했고, 문서 충돌은 API 명세서 기준으로 정리했다.
- ErrorCode 페이지의 `AUTH_008`은 `INVALID_REFRESH_TOKEN`으로 기록되어 있지만 API 명세서 기준 `AUTH_008`은 아이디 중복 확인이다. ErrorCode 문서는 정리 대상이다.

#### ReMake 연결 페이지 확인 결과

- 기능정의서: 인증 기능, 학적 자동 매칭, 전화번호 인증, 로그인·로그아웃 정책을 확인했다.
- API 명세서: 인증·사용자·파일·관리자·외출 API View를 확인했다.
- ErrorCode: 공통·인증·외출·상벌점·학적·파일·스쿨캠핑 오류 코드를 확인했으며 `AUTH_008` 번호 충돌이 있다.
- 정책: 현재 페이지에는 비밀번호 정책 항목이 있으며 상세 정책은 추가 확정이 필요하다.
- OAuth 2.1 도입 검토: 기존 GONE 계정 기반 OIDC/OAuth는 장기 확장 방향이다. 현재 Web 로그인·회원가입 MVP 범위에는 포함하지 않는다.
- 개인정보 처리 방침·고객 지원: 현재 인증 API 계약이나 Web 화면 구현을 추가로 결정할 내용은 확인되지 않았다.

## 3. 사용자 시나리오

### 로그인

```text
사용자가 /login에 진입한다
→ 아이디와 비밀번호를 입력한다
→ 로그인 요청을 보낸다
→ 성공하면 인증 정보를 저장한다
→ 사용자 정보와 역할을 확인한다
→ 역할에 맞는 홈으로 이동한다
```

### 회원가입

```text
사용자가 /signup에 진입한다
→ 전화번호를 입력하고 인증번호를 요청한다
→ 인증번호를 검증하고 10분짜리 ticket을 받는다
→ Figma Web frame의 입력 영역과 Web 레이아웃을 기준으로 입력 흐름을 진행한다
→ 아이디·비밀번호·전화번호를 입력한다
→ 이름은 Request로 받지 않고 학적 데이터 기준으로 서버가 생성한다
→ 회원가입 요청을 보낸다
→ Access/Refresh Token을 저장하고 로그인 API 재호출 없이 역할별 화면으로 이동한다
```

## 4. 화면과 UX

- 진입 경로: `/login`, `/signup`
- 공개 라우트: 로그인과 회원가입은 인증 없이 접근한다.
- 정상 상태: 입력값과 다음 행동이 명확하게 보인다.
- 로딩 상태: 로그인·가입·인증번호 요청 버튼을 잠그고 진행 상태를 보여준다.
- 오류 상태: 필드별 입력 오류, 중복 오류, 인증번호 오류, 인증 실패, 네트워크 오류를 구분한다.
- 권한 거부 상태: 인증 화면 자체에는 해당 없음. 로그인 이후 역할 라우트에서 처리한다.
- 반응형: Figma Web desktop 기준을 구현하고, 태블릿·모바일 동작은 별도로 정의한다.
- 로그인 이미지: 우측 비주얼 영역의 학교 건물 사진을 사용한다. 이미지가 없을 때 임의 이미지로 대체하지 않고 담당자 검토 항목으로 기록한다.
- 접근성: label 연결, 키보드 이동, focus-visible, 오류 `role="alert"`, 버튼 type 명시.
- Figma: https://www.figma.com/design/l3MKhDJ6ciT7gfSvTpiYNI/경소마고-관리시스템

## 5. API와 데이터

현재 웹 로컬 문서에서 확인된 인증 계약:

| 기능                   | Method | Endpoint                         | 인증                                                                         |
| ---------------------- | ------ | -------------------------------- | ---------------------------------------------------------------------------- |
| 로그인                 | POST   | `/api/v1/auth/login`             | 불필요                                                                       |
| 전화번호 인증번호 발송 | POST   | `/api/v1/auth/phone/send-code`   | 불필요                                                                       |
| 전화번호 인증번호 확인 | POST   | `/api/v1/auth/phone/verify-code` | 불필요                                                                       |
| 토큰 재발급            | POST   | `/api/v1/auth/reissue`           | `refreshToken` Request, 새 토큰 응답                                         |
| 아이디 중복 확인       | GET    | `/api/v1/auth/login-id/check`    | `loginId` query, `available` 응답                                            |
| 이름 중복 확인         | GET    | `/api/v1/auth/name/check`        | `name` query, `available` 응답                                               |
| 회원가입               | POST   | `/api/v1/auth/signup`            | `loginId`, `password`, `phoneNumber`, `ticket`; 성공 시 토큰 발급으로 명세됨 |
| 로그아웃               | POST   | `/api/v1/auth/logout`            | Bearer 토큰, 바디 없음                                                       |

Notion API 명세서 전체 확인 결과와 도메인별 API 목록은 [`docs/API_REFERENCE.md`](../../API_REFERENCE.md)의 `Notion API 명세서 확인 목록`과 `인증 API 상세 확인`에 기록했다. 인증 계획서에서는 로그인·회원가입에 직접 필요한 Auth API만 구현 대상으로 삼고, Conduct·Outing·Timetable·Meal API는 인증 이후 도메인의 계약 참고 자료로 관리한다.

서버 `dev`의 정확한 회원가입·중복 확인 Endpoint와 모든 Request·Response 필드는 서버 원문 또는 Swagger 확인 후 확정한다. 확인 전에는 추측하지 않는다.

### 데이터 흐름

`Page → API 함수 → Axios client → GONE Server → 응답 변환 → authStore → 라우팅`

### 저장 및 보안

- Access Token과 Refresh Token의 저장 방식은 서버·웹 보안 정책 확인 후 확정한다.
- 토큰을 URL, 로그, 에러 메시지에 출력하지 않는다.
- 로그아웃 시 토큰과 사용자 정보를 모두 초기화한다.
- 401은 재발급 후 원래 요청을 1회만 재시도한다.

## 6. 작업 목록

- [ ] 인증 관련 타입과 API 계약 확정
- [ ] 공개 인증 라우트 구성
- [ ] Figma 기반 공통 Input·Button 구현
- [ ] 로그인 화면 UI 구현
- [ ] 로그인 API 연동
- [ ] Figma Web 기준 회원가입 UI 구현
- [ ] 아이디 중복 확인 연동
- [ ] API 명세서 기준 이름 중복 확인 API의 사용 시점 검토
- [ ] 휴대폰 인증 발송·검증 연동
- [ ] 회원가입 API 연동
- [ ] 회원가입 성공 후 자동 로그인 및 역할별 화면 이동
- [ ] 학적 매칭 실패(404) 안내
- [ ] 인증번호 5분 만료·재발송 30초 쿨다운 처리
- [ ] 인증 Store에 사용자 정보와 상태 추가
- [ ] Access Token·Refresh Token 처리
- [ ] 401 재발급 및 로그아웃 처리
- [ ] Splash·인증 초기화 처리
- [ ] 역할별 보호 라우트 처리
- [ ] 정상·로딩·오류·인증 만료 QA
- [ ] 반응형·키보드 접근성 QA
- [ ] 관련 문서와 최종 보고서 작성

## 7. 확정 기준·검증 항목과 위험

### API 명세서 기준으로 확정된 내용

- 회원가입 Request는 `loginId`, `password`, `phoneNumber`, `ticket`을 사용하고 `name`은 포함하지 않는다.
- 회원가입 성공 시 Access Token·Refresh Token을 발급하고 Web은 자동 로그인한다.
- `AUTH_008`은 API 명세서 기준으로 아이디 중복 확인에 사용한다.
- 로그인 성공 후 `GET /api/v1/users/me`로 사용자·학적·프로필 정보를 조회한다.

### 구현 중 검증할 내용

- Server `dev`의 실제 구현이 API 명세서와 다른지 확인한다. 차이가 있어도 Web 계획·Mock 기준은 API 명세서로 유지하고 백엔드 확인 항목으로 보고한다.
- Access Token·Refresh Token 처리와 401 재발급 동작을 API 명세서 기준으로 검증한다.
- ErrorCode 문서의 `AUTH_008`은 API 명세서와 충돌하므로 API 명세서 기준으로 처리하고 문서 정리 대상으로 남긴다.

### 추천안으로 확정된 내용

- Web에는 별도 역할 선택 화면을 두지 않고, 자동 로그인 후 `users/me`의 역할에 따라 기본 화면으로 이동한다.
- MVP에서는 현재 API 응답과 `authStore` 구조에 맞춰 토큰을 localStorage에 저장한다. HttpOnly Cookie 전환은 후속 보안 개선으로 남긴다.

### 운영·QA 의존성

- dev 환경 SMS는 콘솔 출력으로 대체될 수 있으므로 QA에 기록한다.
- 학적 데이터가 사전 등록되어야 하며, 매칭 실패 시 API 명세서의 오류 응답을 기준으로 안내한다.

## 8. 완료 기준

- [ ] Figma Web frame/node와 실제 Web 화면 일치
- [ ] ReMake API 명세서·ErrorCode와 실제 Server `dev` 계약 일치
- [ ] 서버 `dev` API 계약과 타입 일치
- [ ] 로그인·회원가입 정상 흐름 동작
- [ ] 로딩·중복 제출·입력 오류·서버 오류 처리
- [ ] 인증 상태 복구와 401 처리 동작
- [ ] 역할별 보호 라우트 동작
- [ ] `pnpm lint`, `pnpm format:check`, `pnpm build` 통과
- [ ] QA 결과와 발견 이슈 기록
- [ ] 최종 보고서 작성

## 9. 예상 소요 시간

| 작업                      |     예상 시간 |
| ------------------------- | ------------: |
| 공식 자료·API 계약 정리   |       1~2시간 |
| 인증 공통 구조            |       2~3시간 |
| 로그인 UI·API             |       2~3시간 |
| Figma Web 회원가입 UI·API |       4~6시간 |
| QA·문서화                 |       2~3시간 |
| **합계**                  | **11~17시간** |

> **담당자 검토**  
> 승인 여부: 검토 대기  
> 의견:
