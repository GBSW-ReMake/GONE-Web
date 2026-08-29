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
