import {
  loginIdPattern,
  passwordPattern,
  phoneNumberPattern,
  verificationCodePattern,
} from '../constants'
import type {
  LoginIdStatus,
  PhoneVerificationStatus,
  SignUpFieldErrors,
  SignUpFormState,
} from '../types'

export const validateAccountStep = (
  form: SignUpFormState,
  loginIdStatus: LoginIdStatus,
): SignUpFieldErrors => {
  const errors: SignUpFieldErrors = {}

  if (!loginIdPattern.test(form.loginId.trim())) {
    errors.loginId = '아이디는 영문과 숫자로 4~20자 입력해주세요.'
  } else if (loginIdStatus !== 'available') {
    errors.loginId = '사용 가능한 아이디인지 확인해주세요.'
  }

  if (!passwordPattern.test(form.password)) {
    errors.password =
      '비밀번호는 영문·숫자·특수문자를 포함해 8~20자 입력해주세요.'
  }

  if (form.password !== form.passwordConfirmation) {
    errors.passwordConfirmation = '비밀번호가 일치하지 않습니다.'
  }

  return errors
}

export const validatePhoneStep = (
  form: SignUpFormState,
  phoneStatus: PhoneVerificationStatus,
  ticket: string,
): SignUpFieldErrors => {
  const errors: SignUpFieldErrors = {}

  if (!phoneNumberPattern.test(form.phoneNumber)) {
    errors.phoneNumber =
      '휴대폰 번호를 하이픈 없이 01012345678 형식으로 입력해주세요.'
  }

  if (phoneStatus === 'idle') {
    errors.phoneNumber = '휴대폰 인증을 완료해주세요.'
  } else if (phoneStatus !== 'verified' || !ticket) {
    errors.verificationCode = '휴대폰 인증을 완료해주세요.'
  }

  return errors
}

export const isValidVerificationCode = (verificationCode: string): boolean => {
  return verificationCodePattern.test(verificationCode)
}
