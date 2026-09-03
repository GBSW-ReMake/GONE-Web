# GONE Web 디자인 시스템

## 기준

- **Figma Web frame/node를 시각적 기준으로 사용한다.**
- Web desktop frame에서 색상·간격·레이아웃·상태를 확인한다.
- iOS·Android 앱 frame은 공통 흐름과 상태 참고용이며 Web 시각 기준이 아니다.
- 로그인 Web의 우측 비주얼은 제공된 경북소프트웨어마이스터고등학교 건물 사진을 사용하며, 이미지 crop·radius·overlay는 Figma Web frame을 따른다.
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
- 공통 컴포넌트의 CSS 클래스는 특정 페이지에 종속되지 않도록 `ui-*`를 사용하고, `auth-*`는 로그인·회원가입 화면 조합에만 사용한다.
- [ ] hover·focus·active·disabled·loading 구현
- [ ] 키보드로 이동·사용 가능
- [ ] 좁은 화면에서 잘리지 않음
- [ ] 상태를 색상 외 텍스트나 아이콘으로도 전달

## Web 검토 체크리스트

- [ ] 구현 대상이 모바일 앱 frame이 아닌 Web frame/node인지 확인
- [ ] 계획서에 Figma URL, `node-id`, frame 이름, 기준 viewport 기록
- [ ] desktop 레이아웃과 responsive 동작을 구분
- [ ] Web frame에 없는 동작은 모바일 화면으로 추측하지 않고 검토 항목으로 기록
