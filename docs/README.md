# GONE Web 문서

GONE Web 프론트엔드의 설계, 개발 규칙, API 계약, 기능 개발 기록을 관리한다.

## 문서 기준과 우선순위

| 확인 대상        | 확인할 내용                       | 기준이 충돌할 때 |
| ---------------- | --------------------------------- | ---------------- |
| Notion           | 기능 목적, 사용자 역할, 업무 정책 | 기획·정책 기준   |
| Figma            | 화면 구조, 컴포넌트, 간격, 색상   | 시각·UX 기준     |
| GONE Server      | API 경로, 요청·응답, 권한, 에러   | 기술 계약 기준   |
| GONE iOS/Android | 기능 흐름과 공통 도메인 용어      | 보조 참고 기준   |
| 이 문서          | 웹 구현 규칙과 기록 방식          | 웹 작업 기준     |

정책이나 API가 확정되지 않았다면 임의로 구현하지 않고 계획서의 `결정 필요 항목`에 기록한다.

## 문서 구조

```text
docs/
├── README.md
├── ARCHITECTURE.md
├── API_REFERENCE.md
├── API_CLIENT.md
├── AUTH_FLOW.md
├── BRANCH_STRATEGY.md
├── COMMIT_CONVENTION.md
├── DESIGN_SYSTEM.md
├── ENVIRONMENT.md
├── QA_CONVENTION.md
├── ROLE_PERMISSION.md
├── ROUTE_MAP.md
├── SENTENCE_REFINEMENT.md
├── STATE_MANAGEMENT.md
├── WORKFLOW.md
└── fe/
    ├── README.md
    ├── plans/
    ├── issues/
    └── reports/
```

## 기능 문서 흐름

```text
계획서 작성
→ 담당자 검토
→ GitHub Issue·브랜치 생성
→ 구현
→ QA 및 이슈 기록
→ 최종 보고서 작성
→ PR 리뷰
→ dev 병합
```

## 문서 갱신 규칙

- API 계약이 바뀌면 `API_REFERENCE.md`와 기능 계획서를 함께 갱신한다.
- 공통 인증 방식이 바뀌면 `API_CLIENT.md`와 `AUTH_FLOW.md`를 함께 갱신한다.
- 라우트나 권한이 바뀌면 `ROUTE_MAP.md`와 `ROLE_PERMISSION.md`를 함께 갱신한다.
- 디자인 토큰이나 공통 컴포넌트가 바뀌면 `DESIGN_SYSTEM.md`를 갱신한다.
- 작업 결과는 관련 최종 보고서에 남긴다.
