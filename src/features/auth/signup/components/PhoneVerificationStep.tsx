import type { ChangeEvent } from 'react'

import { Input } from '../../../../components/Input'
import type {
  PhoneVerificationStatus,
  SignUpFieldErrors,
  SignUpFormState,
} from '../types'

type PhoneVerificationStepProps = {
  form: SignUpFormState
  errors: SignUpFieldErrors
  status: PhoneVerificationStatus
  message: string
  cooldownRemaining: number
  isSending: boolean
  isVerifying: boolean
  phoneError?: string
  verificationError?: string
  onPhoneNumberChange: (event: ChangeEvent<HTMLInputElement>) => void
  onVerificationCodeChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSendCode: () => void
  onVerifyCode: () => void
}

const formatPhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber.length <= 3) {
    return phoneNumber
  }

  if (phoneNumber.length <= 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`
  }

  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`
}

export const PhoneVerificationStep = ({
  form,
  errors,
  status,
  message,
  cooldownRemaining,
  isSending,
  isVerifying,
  phoneError,
  verificationError,
  onPhoneNumberChange,
  onVerificationCodeChange,
  onSendCode,
  onVerifyCode,
}: PhoneVerificationStepProps) => {
  return (
    <>
      <Input
        autoComplete="tel"
        autoFocus
        disabled={isSending || status === 'verified'}
        endAdornment={
          <button
            className="h-7 w-[76px] cursor-pointer rounded border border-[#98a0aa] bg-transparent p-0 !text-[12px] font-bold leading-none whitespace-nowrap text-[#98a0aa] hover:border-[#667085] hover:text-[#667085] focus-visible:outline-2 focus-visible:outline-[#5b8def] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={
              isSending || status === 'verified' || cooldownRemaining > 0
            }
            onClick={onSendCode}
            type="button"
          >
            {isSending
              ? '발송 중...'
              : cooldownRemaining > 0
                ? `재발송 (${cooldownRemaining}초)`
                : status === 'sent'
                  ? '다시 받기'
                  : '인증번호 받기'}
          </button>
        }
        error={errors.phoneNumber ?? phoneError}
        helperText={message}
        helperTone={status === 'verified' ? 'success' : 'default'}
        id="phoneNumber"
        inputMode="numeric"
        label="휴대폰 번호"
        maxLength={13}
        name="phoneNumber"
        onChange={onPhoneNumberChange}
        placeholder="010-0000-0000"
        value={formatPhoneNumber(form.phoneNumber)}
      />
      {status !== 'idle' && (
        <Input
          autoComplete="one-time-code"
          disabled={isVerifying || status === 'verified'}
          endAdornment={
            <button
              className="h-7 w-[76px] cursor-pointer rounded border border-[#5b8def] bg-transparent p-0 !text-[12px] font-bold leading-none whitespace-nowrap text-[#5b8def] hover:border-[#477bdc] hover:text-[#477bdc] focus-visible:outline-2 focus-visible:outline-[#5b8def] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isVerifying || status === 'verified'}
              onClick={onVerifyCode}
              type="button"
            >
              {status === 'verified'
                ? '인증 완료'
                : isVerifying
                  ? '확인 중...'
                  : '인증 확인'}
            </button>
          }
          error={errors.verificationCode ?? verificationError}
          id="verificationCode"
          inputMode="numeric"
          label="인증번호"
          maxLength={6}
          name="verificationCode"
          onChange={onVerificationCodeChange}
          placeholder="인증번호를 입력해주세요"
          value={form.verificationCode}
        />
      )}
    </>
  )
}
