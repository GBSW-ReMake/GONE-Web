# Backend 연동 문서

GONE Web이 의존하는 인증·사용자·외출·스쿨캠핑·상벌점·급식·시간표·알림 API의 연동 기준과 변경 기록을 관리한다.

## 기준

- 최종 API 계약은 GONE Server의 실제 코드·Swagger·Notion 명세를 확인한다.
- 웹에서 확인한 내용은 `docs/API_REFERENCE.md`와 기능별 계획서에 기록한다.
- 백엔드 구현 또는 API 계약이 확정되면 필요한 도메인 문서를 추가한다.
- 확정되지 않은 Endpoint, 응답 필드, 권한은 추측하지 않는다.

## 기능별 연동 문서에 기록할 내용

- Endpoint와 HTTP Method
- 인증 필요 여부와 허용 역할
- Path·Query·Request Body
- 성공 응답과 빈 데이터 형태
- 상태 코드·Error Code·화면 문구
- 페이지네이션·정렬·날짜 형식
- 변경일과 백엔드 관련 PR 또는 이슈

## API 변경 절차

```text
백엔드 계약 변경 확인
→ 담당자와 영향 범위 확인
→ API 문서·타입·기능 계획서 갱신
→ 웹 구현 및 QA
→ 관련 PR에 변경 내용 기록
```
