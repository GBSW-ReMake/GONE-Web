# API 명세 참조 규칙

## 기준 문서

API의 최종 계약은 GONE Server의 실제 코드·Swagger·Notion API 명세를 함께 확인한다. 이 파일은 웹이 사용하는 API를 찾기 쉽게 정리하는 인덱스이며, 백엔드 명세를 복사해 두는 곳이 아니다.

변경이 생기면 백엔드 담당자와 계약을 먼저 확정한 뒤 이 문서와 해당 기능 계획서를 함께 수정한다.

## 도메인 인덱스

| 도메인       | 주요 기능                       | 프론트 위치 예시          |
| ------------ | ------------------------------- | ------------------------- |
| Auth         | 로그인, 회원가입, 토큰 재발급   | `src/api/auth.ts`         |
| User         | 내 정보, 사용자 검색            | `src/api/user.ts`         |
| Outing       | 외출증 신청·승인·거절·출발·복귀 | `src/api/outing.ts`       |
| Schoolcamp   | 스쿨캠핑 일정·신청              | `src/api/schoolcamp.ts`   |
| Conduct      | 상점·벌점 조회·등록             | `src/api/conduct.ts`      |
| Meal         | 급식 조회                       | `src/api/meal.ts`         |
| Timetable    | 시간표 조회                     | `src/api/timetable.ts`    |
| Notification | 알림 목록·읽음 처리             | `src/api/notification.ts` |

## Notion API 명세서 확인 목록

2026-09-01에 ReMake의 API 명세서 페이지 `9c098d114f94423aa0e16ae3aeddac91`의 `Default view`를 실제로 확인했다. 아래는 현재 화면에서 확인된 API 목록이다. 세부 Request·Response는 해당 Notion 원문과 GONE Server `dev` 계약을 함께 기준으로 삼는다.

| API 코드 | Method | Endpoint | 확인된 핵심 내용 |
| --- | --- | --- | --- |
| `CONDUCT_008` | GET | `/api/v1/conduct-records` | 학생·상벌점 유형·기간 필터, 페이지네이션, 상벌점 목록 |
| `CONDUCT_007` | GET | `/api/v1/conduct-records/summary` | 학생별 상벌점 합계와 기준 초과 여부 |
| `CONDUCT_006` | GET | `/api/v1/conduct-records/me` | 현재 사용자 상벌점 목록, 필터, 페이지네이션 |
| `CONDUCT_005` | GET | `/api/v1/conduct-records/me/summary` | 현재 사용자 상벌점 합계와 기준 초과 여부 |
| `CONDUCT_004` | PATCH | `/api/v1/conduct-records/{id}/cancel` | 취소 사유로 상벌점 상태를 `CANCELED`로 변경 |
| `OUTING_010` | GET | `/api/v1/outings` | 날짜·상태 필터, 페이지네이션, 외출 목록 |
| `OUTING_009` | GET | `/api/v1/outings/active` | 진행 중 외출 목록, 빈 결과는 `content: []`와 `200 OK` |
| `OUTING_011` | POST | `/api/v1/outings/{code}/locations` | 외출 코드별 위도·경도 위치 기록 |
| `OUTING_012` | GET | `/api/v1/outings/{code}/locations` | 외출 코드별 상태와 위치 경로 조회 |
| `TIMETABLE_001` | GET | `/api/v1/timetables` | 날짜별 시간표 조회, 날짜 형식 `yyyyMMdd` |
| `MEAL_001` | GET | `/api/v1/meals` | 날짜·식사 유형별 급식 조회 |

### 공통으로 확인된 응답 규칙

- 기본 응답은 `success`, `data`, `message`, `code` 구조를 사용한다. 단, API별로 `code`가 생략될 수 있으므로 Server 계약을 최종 확인한다.
- 목록 API는 `content`, `page`, `size`, `totalElements`, `totalPages`, `hasNext` 형태의 페이지 응답을 사용한다.
- 날짜는 `yyyyMMdd`, 일시는 ISO-8601 형식을 사용한다.
- 상벌점 유형은 `MERIT | DEMERIT`, 상태는 `ACTIVE | CANCELED`다.
- 외출 상태는 `PENDING | APPROVED | REJECTED | DEPARTED | RETURNED | MISSED`다.
- 빈 목록은 `null`이 아니라 `content: []`로 처리한다.
- 위치 API의 위도 범위는 `-90~90`, 경도 범위는 `-180~180`이다.

## 인증 API 상세 확인

2026-09-01에 API 명세서의 인증 API가 포함된 View에서 아래 내용을 추가 확인했다.

| API 코드 | Method | Endpoint | Request 핵심 | Response 핵심 |
| --- | --- | --- | --- | --- |
| `AUTH_001` | POST | `/api/v1/auth/phone/send-code` | `phoneNumber` (하이픈 없음) | 인증번호 만료 시간 |
| `AUTH_002` | POST | `/api/v1/auth/phone/verify-code` | `phoneNumber`, 6자리 `code` | 10분 유효 `ticket`, `expiresIn` |
| `AUTH_003` | POST | `/api/v1/auth/signup` | `loginId`, `password`, `phoneNumber`, `ticket` | `accessToken`, `refreshToken`, `accessTokenExpiresIn` |
| `AUTH_004` | POST | `/api/v1/auth/login` | `identifier` (ID 또는 전화번호), `password` | `accessToken`, `refreshToken`, `accessTokenExpiresIn` |
| `AUTH_005` | POST | `/api/v1/auth/logout` | Bearer 토큰, 바디 없음 | 성공 메시지 |
| `AUTH_006` | PATCH | `/api/auth/password` | 현재 비밀번호·새 비밀번호 | 성공 메시지 |
| `AUTH_007` | DELETE | `/api/auth/me` | 바디 없음 | 탈퇴 성공 메시지 |
| `AUTH_008` | GET | `/api/v1/auth/login-id/check` | `loginId` | `available` |
| `AUTH_009` | GET | `/api/v1/auth/name/check` | `name` | `available` |
| `AUTH_010` | POST | `/api/v1/auth/reissue` | `refreshToken` | 새 Access/Refresh Token |
| `AUTH_011` | GET | `/api/v1/users/me` | Bearer 토큰 | 내 정보·프로필 정보 |
| `AUTH_012` | PATCH | `/api/v1/users/me/name` | `name` (최대 20자) | 성공 메시지 |
| `AUTH_013` | GET | `/api/v1/users/search` | `query` | 사용자 검색 목록 |

### 인증 API의 문서 충돌 정리

- API 명세서의 `AUTH_003`은 회원가입 Request에서 `name`을 받지 않으며, 학적 데이터 기반으로 서버가 이름/닉네임을 생성한다고 적혀 있다.
- API 명세서의 `AUTH_003`은 가입 성공 시 토큰을 즉시 발급한다고 적혀 있다.
- 기존 Notion 기능정의서에는 이름 입력과 가입 후 `/login` 이동으로 기록되어 있어 서로 충돌한다.
- 구현 전 GONE Server `dev`의 실제 Controller·DTO·Swagger를 최종 계약으로 확정하고, 그 결과에 따라 계획서·타입·Mock Fixture를 함께 갱신한다.
- `AUTH_006`, `AUTH_007`의 문서 경로가 다른 Auth API와 `/api/v1` prefix가 다르므로 Server `dev` 확인 전에는 구현하지 않는다.

### 확인 범위와 주의점

- 위 목록은 Notion API 명세서의 `Default view`에서 확인된 일반 도메인 API 11개다. 인증 API는 별도 View에서 추가 확인했다.
- 인증 API의 로그인·회원가입·휴대폰 인증·토큰 재발급은 Notion 기능정의서와 GONE Server `dev` auth 도메인을 함께 확인한다.
- Notion 표의 권한·예외·설명 칼럼이 화면상 축약되거나 비어 있는 항목은 임의로 채우지 않는다. 실제 연동 전 Server `dev` 코드 또는 Swagger로 확정한다.
- API 명세서가 변경되면 이 목록, 관련 기능 계획서, 타입·Mock Fixture를 함께 갱신한다.

### 인증 관련 불일치 기록

- 기능정의서와 API 명세서가 회원가입 성공 결과를 다르게 설명한다. **API 명세서 기준은 Access/Refresh Token 발급이며, Web은 자동 로그인한다.**
- 기능정의서는 회원가입 이름 입력을 설명하지만 **API 명세서의 `AUTH_003` Request에는 `name`이 없다.** Web 회원가입 Request에도 이름을 포함하지 않는다.
- ErrorCode 페이지의 `AUTH_008`은 `INVALID_REFRESH_TOKEN`으로 등록되어 있지만 API 명세서의 `AUTH_008`은 로그인 ID 중복 확인이다. **API 명세서 기준으로 `AUTH_008`은 로그인 ID 중복 확인으로 처리하고, ErrorCode 문서는 정리 대상이다.**
- Server `dev`가 API 명세서와 다를 경우에도 계획·Mock은 API 명세서 기준을 유지하고 차이를 담당자·백엔드 확인 항목으로 보고한다.

## 현재 View에서 추가 확인된 비인증 API

| API 코드 | Method | Endpoint | 확인된 핵심 내용 |
| --- | --- | --- | --- |
| `OUTING_001` | POST | `/api/v1/outings` | 외출 신청, `CUSTOM` 시간대일 때 시작·종료 시각 필수 |
| `OUTING_002` | PATCH | `/api/v1/outings/{code}/approve` | 외출 승인, 요청 바디 없음 |
| `OUTING_003` | PATCH | `/api/v1/outings/{code}/reject` | 거절 사유 필수, 최대 200자 |
| `OUTING_004` | GET | `/api/v1/outings/me/requests` | 기간·상태 필터와 페이지네이션 |
| `FILE_001` | POST | `/api/v1/files/profile-image/upload-url` | JPEG/PNG, 5MB 이하 presigned upload URL |
| `FILE_002` | POST | `/api/v1/files/profile-image/confirm` | 업로드 key로 저장 완료 확인 |
| `ADMIN_001` | POST | `/api/admin/enrollments/bulk` | 학적 데이터 일괄 등록, 실패 row 보고 |

## 기능별 API 기록 형식

```md
### [기능명] API

- Method: GET / POST / PATCH / DELETE
- Endpoint: `/api/...`
- 인증: 필요 / 불필요
- 권한: STUDENT / TEACHER / DISCIPLINE / ADMIN
- Query/Path: 이름, 타입, 필수 여부
- Body: 필드, 타입, 필수 여부
- Success: 상태 코드와 응답 예시
- Error: 상태 코드, Error Code, 화면 문구
```

## 반드시 확인할 항목

- `null`, 빈 배열, 빈 문자열을 각각 구분한다.
- 날짜·시간 형식과 타임존을 확인한다.
- 페이지네이션의 `page`, `size`, `total` 의미를 확인한다.
- 성공했지만 표시할 데이터가 없는 경우를 빈 상태로 정의한다.
- 401과 403을 인증 만료와 권한 없음으로 구분한다.

## 공통 예시

```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

```json
{
  "success": true,
  "data": {},
  "message": "string",
  "code": null
}
```

위 구조는 공통 예시일 뿐이다. 도메인별 실제 응답은 GONE Server 명세를 우선한다.

## Mock API 사용 규칙

- Mock은 백엔드 미연동 기간의 화면·상태 검증용이다.
- Mock 응답은 실제 GONE Server의 계약과 같은 타입으로 정의한다.
- 컴포넌트에 임시 데이터를 직접 작성하지 않고 API 함수 아래 Mock Handler와 Fixture로 분리한다.
- 실제 API 계약이 확정되지 않은 Endpoint는 Mock으로 먼저 확정하지 않는다.
- 실제 연동 전에는 문서와 PR에 `Mock 검증 완료 / 실제 API 미검증`을 명시한다.
