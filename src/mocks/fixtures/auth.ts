import type { ApiResponse, LoginResponse } from '../../types/auth'

// 테스트 재현용 더미 응답이다. 실제 사용자 토큰이나 운영 데이터가 아니다.
export const mockLoginResponse: ApiResponse<LoginResponse> = {
  success: true,
  data: {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    accessTokenExpiresIn: 3600,
  },
  message: '로그인 성공',
  code: null,
}
