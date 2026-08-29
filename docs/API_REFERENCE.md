# API Reference

## 기준

API의 최종 계약은 GONE Server의 실제 코드와 Notion API 명세서를 기준으로 확인한다.
이 문서는 프론트 화면에서 사용하는 API를 요청 시점과 함께 정리한다.

## 공통 응답

```json
{
  "success": true,
  "data": {},
  "message": "string",
  "code": null
}
```

## 인증 헤더

```http
Authorization: Bearer {accessToken}
```

## 도메인 목록

- Auth: 로그인, 회원가입, 토큰 재발급
- User: 내 정보와 사용자 검색
- Outing: 외출증 신청·승인·거절·출발·복귀
- Schoolcamp: 스쿨캠핑 일정과 신청
- Conduct: 상점·벌점
- Meal/Timetable: 급식과 시간표
- Notification: 알림함

구체적인 Request, Response, ErrorCode는 API 변경 시 백엔드 문서와 함께 갱신한다.
