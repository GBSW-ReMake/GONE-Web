# GONE Web 디자인 시스템

## 기준

- **Figma Web frame/node를 시각적 기준으로 사용한다.**
- Web desktop frame에서 색상·간격·레이아웃·상태를 확인한다.
- iOS·Android 앱 frame은 공통 흐름과 상태 참고용이며 Web 시각 기준이 아니다.
- 로그인 Web의 우측 비주얼은 제공된 경북소프트웨어마이스터고등학교 건물 사진을 사용하며, 이미지 crop·radius·overlay는 Figma Web frame을 따른다.
- 회원가입 Web은 frame `431:11473`의 중앙 404px 콘텐츠, 상단 로고, 밑줄 Input, 45px CTA를 따른다. Figma의 이름 필드는 최우선 API 계약에 맞춰 휴대폰 인증 필드로 조정한다.
- iOS·Android와 공통되는 브랜드 색상과 상태 의미를 유지한다.
- 색상만으로 상태를 전달하지 않고 텍스트·아이콘·모양을 함께 사용한다.
- 버튼과 입력 요소는 키보드 포커스와 명확한 포커스 링을 제공한다.
- 모바일·태블릿·데스크톱을 고려하고, 확정된 브레이크포인트는 Figma와 맞춘다.

## 의미 토큰

| 토큰             | 기본 값   | 용도                 |
| ---------------- | --------- | -------------------- |
| `brand.primary`  | `#5B8DEF` | 주요 CTA, 선택 상태  |
| `brand.deepNavy` | `#1F2937` | 제목, 강조           |
| `brand.softBlue` | `#EAF1FF` | 선택 배경, 정보 영역 |
| `status.success` | `#34C77B` | 완료, 승인           |
| `status.warning` | `#FFB547` | 대기, 주의           |
| `status.error`   | `#FF5A5F` | 반려, 실패           |

확정 값이 바뀌면 하드코딩된 색을 찾지 말고 CSS 변수 또는 토큰만 수정한다.

## 토큰 계층

```text
Primitive: 색상 원본, 간격, 폰트 크기
→ Semantic: background, text, border, action, status
→ Component: button, input, card, badge
→ Page: 화면별 조합
```

## 컴포넌트 상태

| 컴포넌트     | 필수 상태·변형                                                  |
| ------------ | --------------------------------------------------------------- |
| Button       | Primary / Secondary / Destructive, Enabled / Disabled / Loading |
| TextField    | Default / Focus / Error / Disabled                              |
| Card         | Default / Selected / Status                                     |
| StatusBadge  | Pending / Approved / Rejected / Completed                       |
| EmptyState   | 아이콘, 제목, 설명, 선택적 CTA                                  |
| LoadingState | Skeleton 또는 Progress                                          |
| ErrorState   | 설명, 재시도 CTA                                                |

## 구현 체크

- [ ] Figma의 컴포넌트·간격·문구 확인
- [ ] 공통 토큰 사용
- 화면과 컴포넌트 스타일은 Tailwind utility class를 TSX의 HTML 요소 `className`에 직접 작성한다.
- `App.css`는 사용하지 않으며, `src/app/globals.css`에는 Tailwind import·전역 기본값·공통 keyframe만 둔다.
- 페이지 전용 CSS 선택자(`auth-*`, `signup-*`)를 새로 만들지 않고, 재사용 컴포넌트는 props와 Tailwind 조합으로 확장한다.
- [ ] hover·focus·active·disabled·loading 구현
- [ ] 키보드로 이동·사용 가능
- [ ] 좁은 화면에서 잘리지 않음
- [ ] 상태를 색상 외 텍스트나 아이콘으로도 전달

## Web 검토 체크리스트

- [ ] 구현 대상이 모바일 앱 frame이 아닌 Web frame/node인지 확인
- [ ] 계획서에 Figma URL, `node-id`, frame 이름, 기준 viewport 기록
- [ ] desktop 레이아웃과 responsive 동작을 구분
- [ ] Web frame에 없는 동작은 모바일 화면으로 추측하지 않고 검토 항목으로 기록

## 인증 화면 Web 확장

- Figma 파일은 수정하지 않고, Web 코드의 공통 인증 셸에서 로그인·회원가입 연결 경험을 제공한다.
- 로그인·회원가입 모두 폼은 왼쪽, 학교 건물 비주얼은 오른쪽에 배치한다.
- Motion shared layout 예제의 연결된 전환 감각만 참고하며, 외부 모션 런타임은 추가하지 않는다.
- 비주얼·폼 패널은 공통 `AuthLayout`에서 고정하고, 라우트가 바뀐 때 왼쪽 폼 내용만 교체한다.
- 새 폼은 아래 54px 위치에서 1200ms 동안 opacity·blur·scale이 풀리며 올라오고, 오른쪽 사진은 움직이지 않는다.
- 애니메이션이 정보를 가리거나 입력을 지연시키지 않도록 입력 포커스는 새 화면에 자연스럽게 이동한다.
- `prefers-reduced-motion: reduce`에서는 transition과 keyframe을 끄고 최종 위치만 표시한다.
- 회원가입은 1단계(계정 정보)와 2단계(휴대폰 인증)로 나눠 세로 길이와 인지 부담을 줄인다.
- 800px 이하에서는 비주얼을 숨기고 폼을 중앙에 배치한다.
- 회원가입 제목 안의 `GONE`은 로고 자산을 제목 글자 높이에 맞춰 배치하고, 별도 상단 로고는 생략한다.
- 회원가입 단계는 텍스트 대신 2칸 진행선으로 표현하며, 단계 사이의 세로 여백은 입력과 하단 링크가 답답하지 않은 최소 간격으로 유지한다.
- 인증 화면의 학교 건물 비주얼은 화면 경계가 자연스럽게 이어지도록 별도 `border-radius`를 사용하지 않는다.
- 인증 패널은 데스크톱 좌우 `100px`, 1,400px 이하 `clamp(32px, 8vw, 100px)`, 800px 이하 `24px`의 동일한 좌우 패딩을 사용하고, 폼은 패널의 정중앙에 배치한다.

## Tailwind 구현 규칙

- 현재 Feature 브랜치는 Tailwind v4와 Next.js PostCSS 연동을 사용한다. TSX `className` 스타일 규칙을 유지한다.
- `Button`, `Input`처럼 여러 화면에서 쓰는 컴포넌트도 기본 스타일을 컴포넌트 내부 Tailwind class로 관리한다.
- 화면별 차이는 `className`, `variant` 같은 props로 전달하며 페이지 이름을 포함한 스타일 파일을 추가하지 않는다.
- Tailwind만으로 표현하기 어려운 공통 애니메이션은 `src/app/globals.css`의 `@theme`과 `@keyframes`로 등록하고, TSX에서는 생성된 `animate-*` utility를 사용한다.
- 인증 화면 전환은 Tailwind transition utility와 `src/app/globals.css`의 공통 keyframe만 사용하며 전용 애니메이션 패키지에 의존하지 않는다.
