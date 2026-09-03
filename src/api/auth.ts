import { apiClient } from './client'
import { mockLogin } from '../mocks/auth'
import type {
  ApiResponse,
  LoginIdCheckResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  NameCheckResponse,
  PhoneSendCodeRequest,
  PhoneSendCodeResponse,
  PhoneVerifyCodeRequest,
  PhoneVerifyCodeResponse,
  ReissueRequest,
  ReissueResponse,
  SignUpRequest,
  SignUpResponse,
} from '../types/auth'

// 인증 API 호출을 화면에서 분리한 계층이다.
// 화면은 Endpoint와 Axios를 직접 알지 않고 이 함수만 호출한다.

// 전화번호 인증번호를 발송하고 만료 시간을 받는다.
export const sendPhoneCode = async (
  request: PhoneSendCodeRequest,
): Promise<ApiResponse<PhoneSendCodeResponse>> => {
  const response = await apiClient.post<ApiResponse<PhoneSendCodeResponse>>(
    '/api/v1/auth/phone/send-code',
    request,
  )

  return response.data
}

// 인증번호를 검증하고 회원가입에 사용할 ticket을 받는다.
export const verifyPhoneCode = async (
  request: PhoneVerifyCodeRequest,
): Promise<ApiResponse<PhoneVerifyCodeResponse>> => {
  const response = await apiClient.post<ApiResponse<PhoneVerifyCodeResponse>>(
    '/api/v1/auth/phone/verify-code',
    request,
  )

  return response.data
}

// 회원가입 전에 아이디 사용 가능 여부를 확인한다.
export const checkLoginId = async (
  loginId: string,
): Promise<ApiResponse<LoginIdCheckResponse>> => {
  const response = await apiClient.get<ApiResponse<LoginIdCheckResponse>>(
    '/api/v1/auth/login-id/check',
    { params: { loginId } },
  )

  return response.data
}

// API 명세서에 이름 중복 확인 계약이 있어 공통 인증 API로 제공한다.
export const checkName = async (
  name: string,
): Promise<ApiResponse<NameCheckResponse>> => {
  const response = await apiClient.get<ApiResponse<NameCheckResponse>>(
    '/api/v1/auth/name/check',
    { params: { name } },
  )

  return response.data
}

// 회원가입을 요청한다. 성공 응답 형태는 API 명세서의 SignUpResponse를 따른다.
export const signUp = async (
  request: SignUpRequest,
): Promise<ApiResponse<SignUpResponse>> => {
  const response = await apiClient.post<ApiResponse<SignUpResponse>>(
    '/api/v1/auth/signup',
    request,
  )

  return response.data
}

// 로그인 API다. 백엔드가 없을 때만 환경변수로 Mock 함수를 사용한다.
export const login = async (
  request: LoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
  if (import.meta.env.VITE_API_MODE === 'mock') {
    // 운영·실서버 모드에서는 이 분기를 타지 않고 실제 API를 호출한다.
    return mockLogin(request)
  }

  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/v1/auth/login',
    request,
  )

  return response.data
}

// Access Token이 만료됐을 때 Refresh Token으로 새 토큰을 요청한다.
export const reissueToken = async (
  request: ReissueRequest,
): Promise<ApiResponse<ReissueResponse>> => {
  const response = await apiClient.post<ApiResponse<ReissueResponse>>(
    '/api/v1/auth/reissue',
    request,
  )

  return response.data
}

// 로그인한 사용자의 역할과 학적·프로필 정보를 조회한다.
export const getMe = async (): Promise<ApiResponse<MeResponse>> => {
  const response =
    await apiClient.get<ApiResponse<MeResponse>>('/api/v1/users/me')

  return response.data
}

// 서버 로그아웃과 클라이언트 토큰 정리를 연결할 때 사용한다.
export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>(
    '/api/v1/auth/logout',
  )

  return response.data
}
