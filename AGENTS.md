<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## GONE 작업 오류 기록 강제 규칙

- 터미널·빌드·TypeScript·ESLint·브라우저 콘솔·화면 QA에서 오류, 경고, 예상과 다른 동작을 발견하면 **코드 수정 전에** `docs/fe/issues/`에 기록한다.
- 제품 코드가 아니라 `.next` 캐시·생성 파일·환경 설정이 원인이어도 개발이나 QA를 막았으면 기록 대상이다.
- 기록 순서는 `발견 환경 → 재현 방법 → 예상·실제 결과 → 원인 → 수정 → 동일 절차 재검증`이다.
- 수정 후 같은 재현 절차를 다시 실행하고, 같은 issue MD의 수정 내용과 재검증 결과를 갱신한다.
- issue MD가 갱신되지 않은 오류는 해결 완료·QA 완료·커밋·Push 대상으로 표시하지 않는다.
- 별도 파일이 과한 단순 오류라도 관련 기능의 기존 QA 문서에 반드시 추가한다. “간단한 문제”라는 이유로 기록을 생략하지 않는다.
