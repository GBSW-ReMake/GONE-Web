# API 클라이언트 규칙

## 기본 원칙

- Axios 인스턴스는 `src/api/client.ts` 한 곳에서 관리한다.
- API 주소는 `VITE_API_BASE_URL`로 주입한다.
- API 함수는 도메인별 파일로 분리한다. 예: `src/api/auth.ts`, `src/api/outing.ts`.
- 컴포넌트는 URL, 헤더, 토큰 저장 방식을 알지 않고 API 함수만 호출한다.
- Request·Response 타입은 `src/types`에 두고 백엔드 명세와 맞춘다.

## 요청 흐름

```text
화면 이벤트 → 도메인 API 함수 → 공통 Axios client → 서버 응답
→ 성공 데이터 또는 표준 에러 변환 → 화면 상태 갱신
```

## 인증 헤더

```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

- 토큰을 URL, 로그, 에러 메시지에 출력하지 않는다.
- Access Token은 인증이 필요한 요청에만 붙인다.

## 401 처리

```text
요청 → 401 → Refresh Token 재발급
→ 성공: 원래 요청 1회 재시도
→ 실패: 인증 상태 삭제 후 /login 이동
```

- 같은 요청을 무한 재시도하지 않는다.
- 재발급 요청 자체가 401이면 다시 재발급하지 않는다.
- 여러 요청이 동시에 만료되면 재발급 요청을 하나로 합치는 방식을 검토한다.

## 에러 처리

| 상태 | 의미           | 화면 처리                  |
| ---: | -------------- | -------------------------- |
|  400 | 잘못된 요청    | 입력값 또는 요청 내용 안내 |
|  401 | 인증 만료·실패 | 재발급 또는 로그인 이동    |
|  403 | 권한 없음      | 권한 없음 상태 표시        |
|  404 | 대상 없음      | 없는 데이터 안내           |
|  409 | 상태 충돌      | 최신 상태 안내 후 재시도   |
|  429 | 요청 과다      | 잠시 후 재시도 안내        |
|  5xx | 서버 오류      | 재시도 버튼과 장애 안내    |

실제 Error Code와 메시지는 `API_REFERENCE.md` 및 백엔드 명세를 기준으로 갱신한다.

## API 함수 예시

```ts
export const getMyProfile = async (): Promise<User> => {
  const { data } = await apiClient.get<ApiResponse<User>>('/users/me')
  return data.data
}
```

컴포넌트에서 API 응답 전체를 전역 상태에 저장하지 말고 필요한 화면 모델만 사용한다.
