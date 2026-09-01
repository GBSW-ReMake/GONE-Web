import { apiClient } from './client'
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

export async function sendPhoneCode(
  request: PhoneSendCodeRequest,
): Promise<ApiResponse<PhoneSendCodeResponse>> {
  const response = await apiClient.post<ApiResponse<PhoneSendCodeResponse>>(
    '/api/v1/auth/phone/send-code',
    request,
  )

  return response.data
}

export async function verifyPhoneCode(
  request: PhoneVerifyCodeRequest,
): Promise<ApiResponse<PhoneVerifyCodeResponse>> {
  const response = await apiClient.post<ApiResponse<PhoneVerifyCodeResponse>>(
    '/api/v1/auth/phone/verify-code',
    request,
  )

  return response.data
}

export async function checkLoginId(
  loginId: string,
): Promise<ApiResponse<LoginIdCheckResponse>> {
  const response = await apiClient.get<ApiResponse<LoginIdCheckResponse>>(
    '/api/v1/auth/login-id/check',
    { params: { loginId } },
  )

  return response.data
}

export async function checkName(
  name: string,
): Promise<ApiResponse<NameCheckResponse>> {
  const response = await apiClient.get<ApiResponse<NameCheckResponse>>(
    '/api/v1/auth/name/check',
    { params: { name } },
  )

  return response.data
}

export async function signUp(
  request: SignUpRequest,
): Promise<ApiResponse<SignUpResponse>> {
  const response = await apiClient.post<ApiResponse<SignUpResponse>>(
    '/api/v1/auth/signup',
    request,
  )

  return response.data
}

export async function login(
  request: LoginRequest,
): Promise<ApiResponse<LoginResponse>> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/v1/auth/login',
    request,
  )

  return response.data
}

export async function reissueToken(
  request: ReissueRequest,
): Promise<ApiResponse<ReissueResponse>> {
  const response = await apiClient.post<ApiResponse<ReissueResponse>>(
    '/api/v1/auth/reissue',
    request,
  )

  return response.data
}

export async function getMe(): Promise<ApiResponse<MeResponse>> {
  const response = await apiClient.get<ApiResponse<MeResponse>>(
    '/api/v1/users/me',
  )

  return response.data
}

export async function logout(): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(
    '/api/v1/auth/logout',
  )

  return response.data
}
