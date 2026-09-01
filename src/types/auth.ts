export type UserRole = 'STUDENT' | 'TEACHER' | 'DISCIPLINE' | 'ADMIN'

export type ApiResponse<T> = {
  success: boolean
  data: T
  message: string
  code: string | null
}

export type PhoneSendCodeRequest = {
  phoneNumber: string
}

export type PhoneSendCodeResponse = {
  expiresIn: number
}

export type PhoneVerifyCodeRequest = {
  phoneNumber: string
  code: string
}

export type PhoneVerifyCodeResponse = {
  ticket: string
  expiresIn: number
}

export type LoginIdCheckResponse = {
  available: boolean
}

export type NameCheckResponse = {
  available: boolean
}

export type LoginRequest = {
  identifier: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
}

export type SignUpRequest = {
  loginId: string
  password: string
  name: string
  phoneNumber: string
  ticket: string
}

export type SignUpResponse = null

export type ReissueRequest = {
  refreshToken: string
}

export type ReissueResponse = LoginResponse

export type MeResponse = {
  name: string
  hasProfileImage: boolean
  profileImageUrl: string | null
  realName: string
  grade: number | null
  classNo: number | null
  role?: UserRole
}
