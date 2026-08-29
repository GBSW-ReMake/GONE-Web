# GONE Web 브랜치 전략

```text
main                         배포 기준
dev                          개발 통합
feat/{이슈번호}-{기능명}       기능 개발
fix/{이슈번호}-{기능명}        버그 수정
docs/{이슈번호}-{문서명}       문서 수정
```

- 기능은 `dev`에서 기능 브랜치를 만든다.
- 기능 브랜치에서 작업한 뒤 `dev`로 PR을 만든다.
- `main`은 PR을 통해서만 변경한다.
- 기능 하나는 하나의 Issue와 하나의 브랜치로 관리한다.
- 계획서 검토 전에는 기능 브랜치를 만들지 않는다.
- PR 병합 후 작업 브랜치는 삭제한다.
- 긴급 운영 수정은 담당자와 협의한 뒤 `hotfix/*`를 사용한다.

## 작업 시작 명령어

```bash
git checkout dev
git pull origin dev
git checkout -b feat/<이슈번호>-<기능명>
```

## PR 기준

- Base: `dev`
- Compare: `feat/*`, `fix/*`, `docs/*`
- 제목: `type: 작업 내용 (#이슈번호)`
- 본문: 변경 내용, 검증 방법, 관련 문서, `Closes #이슈번호`
