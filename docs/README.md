# GONE Web 문서 디렉터리

GONE Web 프로젝트의 기획, 개발, QA, API 연동, 릴리즈 기록을 관리한다.

## 구조

```text
docs/
├── README.md
├── WORKFLOW.md
├── BRANCH_STRATEGY.md
├── COMMIT_CONVENTION.md
├── PULL_REQUEST_TEMPLATE.md
├── ARCHITECTURE.md
├── API_REFERENCE.md
├── API_CLIENT.md
├── AUTH_FLOW.md
├── DESIGN_SYSTEM.md
├── ENVIRONMENT.md
├── QA_CONVENTION.md
├── ROLE_PERMISSION.md
├── ROUTE_MAP.md
├── SENTENCE_REFINEMENT.md
├── STATE_MANAGEMENT.md
├── be/
│   └── README.md
└── fe/
    ├── README.md
    ├── plans/
    ├── issues/
    └── reports/
```

## 문서 기준

| 확인 대상            | 확인할 내용                                    | 최종 기준           |
| -------------------- | ---------------------------------------------- | ------------------- |
| Notion 기능정의서    | 기능 목적, 사용자 역할, 업무 정책              | 기획·정책           |
| Notion API 명세서    | Endpoint, Method, Request, Response, 오류 계약 | **API 계약 최우선** |
| Figma Web frame/node | Web 화면 구조, 컴포넌트, 간격, 색상            | 시각·UX             |
| GONE Server          | API, 응답, 권한, 에러                          | 기술 계약           |
| GONE iOS/Android     | 공통 도메인과 사용자 흐름                      | 보조 참고           |
| GONE Web 문서        | 웹 구현 방식과 기록 규칙                       | 웹 구현             |

Notion 내부 문서가 충돌하면 **API 명세서를 최우선 기준**으로 사용한다. 기능정의서·ErrorCode·기타 Notion 문서가 API 명세서와 다르면 API 명세서 기준으로 계획서·타입·Mock Fixture를 작성하고, 차이는 문서 정리 항목으로 기록한다. 기준이 충돌하거나 확정되지 않은 내용은 임의로 결정하지 않고 계획서의 `결정 필요 항목`에 기록한다. **GONE-Web 화면 구현은 Figma Web frame/node만 시각 기준으로 사용한다. iOS·Android 화면은 공통 도메인·상태 흐름 참고용이며 Web 레이아웃 기준으로 사용하지 않는다.**

### GONE 기준 우선순위

요구사항·API·정책이 충돌하거나 비어 있을 때는 다음 순서로 판단한다.

1. Notion API 명세서
2. Notion 하위 페이지(기능정의서, ErrorCode, 정책 등)
3. Notion에 없는 내용은 담당자에게 확인하고, 담당자가 추천안대로 진행하라고 승인하면 제안한 추천안을 확정

Figma Web frame/node는 화면의 시각·UX 기준이며 API·정책의 우선순위를 바꾸지 않는다. GONE Server·iOS·Android는 구현 검증과 공통 흐름 참고 자료로 사용한다.

### Figma Web 기준

- Web 구현 대상은 Figma에서 Web 화면으로 식별되는 frame/node로 확정한다.
- 계획서와 GitHub Issue에 Figma URL, `node-id`, frame 이름과 기준 화면 크기를 기록한다.
- 모바일 앱 frame을 Web 레이아웃으로 변환하거나 추측하지 않는다.
- Web frame이 없거나 의미가 불명확하면 담당자 검토 항목으로 남긴다.

## 문서 작성 순서

기능 개발은 반드시 다음 순서를 지킨다.

1. `fe/plans`에 계획서를 작성한다.
2. 기획·디자인·백엔드 의존성을 확인한다.
3. 담당자에게 계획서 검토와 승인을 받는다.
4. GitHub Issue를 작성한다.
5. 이슈 번호를 포함한 브랜치를 생성한다.
6. 개발·QA·최종 보고·PR을 진행한다.

승인 전에는 Issue 생성, 브랜치 생성, 구현을 시작하지 않는다.

## 파일명 규칙

```text
fe/plans/feat-12-실습실-신청.md
fe/issues/issue-12-실습실-신청-qa.md
fe/reports/feat-12-실습실-신청-final-report.md
```

## 참고 문서

| 문서                                                 | 설명                      |
| ---------------------------------------------------- | ------------------------- |
| [WORKFLOW.md](WORKFLOW.md)                           | 기능 개발 11단계 절차     |
| [BRANCH_STRATEGY.md](BRANCH_STRATEGY.md)             | 브랜치 역할과 병합 규칙   |
| [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md)         | 커밋 메시지와 분리 기준   |
| [PULL_REQUEST_TEMPLATE.md](PULL_REQUEST_TEMPLATE.md) | PR 작성 기준              |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)                 | Figma 기반 디자인 기준    |
| [fe/README.md](fe/README.md)                         | 기능 문서 작성 규칙       |
| [be/README.md](be/README.md)                         | 백엔드 API 연동 문서 기준 |

## 문서 갱신 규칙

- API 계약 변경: `API_REFERENCE.md`, `API_CLIENT.md`, 기능 문서 갱신
- 인증 변경: `AUTH_FLOW.md`, `ROLE_PERMISSION.md` 갱신
- 라우트·역할 변경: `ROUTE_MAP.md`, `ROLE_PERMISSION.md` 갱신
- 디자인 변경: `DESIGN_SYSTEM.md`와 관련 계획서 갱신
- 작업 완료: `fe/reports/`에 최종 결과 기록
