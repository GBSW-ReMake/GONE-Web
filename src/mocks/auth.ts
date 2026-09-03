import type { ApiResponse, LoginRequest, LoginResponse } from '../types/auth'
import { mockLoginResponse } from './fixtures/auth'

// 백엔드 없이 로그인 화면을 재현하기 위한 개발 전용 API 함수다.
// 실제 서버와 동일한 Promise·Response 형태를 유지해 화면 코드를 바꾸지 않는다.
export const mockLogin = async (
  _request: LoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 350)
  })

  return mockLoginResponse
}
