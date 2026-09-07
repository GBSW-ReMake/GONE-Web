// 인증 도메인에서 서버와 주고받는 Request·Response 모양을 한 곳에서 관리한다.
// API 명세가 바뀌면 화면 코드보다 먼저 이 타입을 수정해 타입 오류로 누락을 찾는다.
export type UserRole = 'STUDENT' | 'TEACHER' | 'DISCIPLINE' | 'ADMIN'

export type AuthStatus =
  'idle' | 'initializing' | 'authenticated' | 'unauthenticated'

// `<T>`는 응답 안에 들어갈 실제 데이터 타입을 나중에 전달받는 제네릭 자리다.
// 예: ApiResponse<LoginResponse>이면 data의 타입이 LoginResponse가 된다.
// 성공 응답에는 T 데이터가 있고 실패 응답에는 data가 null이라는 서버 계약을 union으로 표현한다.
// success를 검사하면 TypeScript가 data의 실제 타입을 자동으로 좁혀준다.
export type ApiResponse<T> =
  | {
      success: true
      data: T
      message: string
      code: null
    }
  | {
      success: false
      data: null
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

// API 명세서 기준 회원가입 Request에는 name을 보내지 않는다.
export type SignUpRequest = {
  loginId: string
  password: string
  phoneNumber: string
  ticket: string
}

// API 명세서와 Server dev 모두 가입 성공 시 로그인과 같은 토큰 묶음을 반환한다.
export type SignUpResponse = LoginResponse

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
  role: UserRole
}
