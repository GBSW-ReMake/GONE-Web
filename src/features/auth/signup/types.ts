export type SignUpFormState = {
  loginId: string
  password: string
  passwordConfirmation: string
  phoneNumber: string
  verificationCode: string
}

export type SignUpFieldErrors = Partial<Record<keyof SignUpFormState, string>>

export type LoginIdStatus = 'idle' | 'checking' | 'available' | 'unavailable'

export type PhoneVerificationStatus = 'idle' | 'sent' | 'verified'

export type SignUpStep = 1 | 2
