import type { SignUpFormState } from './types'

export const phoneResendCooldownSeconds = 30

export const initialSignUpForm: SignUpFormState = {
  loginId: '',
  password: '',
  passwordConfirmation: '',
  phoneNumber: '',
  verificationCode: '',
}

export const loginIdPattern = /^[a-zA-Z0-9]{4,20}$/
export const passwordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,20}$/
export const phoneNumberPattern = /^010\d{8}$/
export const verificationCodePattern = /^\d{6}$/

export const signUpErrorMessages: Record<string, string> = {
  COMMON_001: '입력한 정보의 형식을 다시 확인해주세요.',
  COMMON_006: '회원가입 요청이 겹쳤습니다. 잠시 후 다시 시도해주세요.',
  AUTH_001: '인증번호가 일치하지 않습니다.',
  AUTH_002: '인증번호가 만료되었습니다. 다시 요청해주세요.',
  AUTH_003: '인증 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.',
  AUTH_004: '인증번호를 다시 요청하려면 잠시 기다려주세요.',
  AUTH_005: '휴대폰 인증이 만료되었습니다. 인증을 다시 진행해주세요.',
  AUTH_006: '인증한 휴대폰 번호와 입력한 번호가 일치하지 않습니다.',
  AUTH_009: '문자 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
  GBSW_001: '학교 학적 명단에서 해당 휴대폰 번호를 찾을 수 없습니다.',
  USER_001: '이미 가입된 학적 정보입니다.',
  USER_002: '이미 사용 중인 아이디입니다.',
}
