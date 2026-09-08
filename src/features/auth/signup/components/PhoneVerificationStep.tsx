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
            className="min-w-[96px] cursor-pointer border-0 bg-transparent px-1.5 py-1 text-[12px] font-bold text-[#5b8def] hover:text-[#477bdc] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#5b8def] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-[#98a0aa]"
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
        maxLength={11}
        name="phoneNumber"
        onChange={onPhoneNumberChange}
        placeholder="01012345678"
        value={form.phoneNumber}
      />
      {status !== 'idle' && (
        <Input
          autoComplete="one-time-code"
          disabled={isVerifying || status === 'verified'}
          endAdornment={
            <button
              className="min-w-[96px] cursor-pointer border-0 bg-transparent px-1.5 py-1 text-[12px] font-bold text-[#5b8def] hover:text-[#477bdc] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#5b8def] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-[#98a0aa]"
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
          placeholder="인증번호 6자리를 입력해주세요"
          value={form.verificationCode}
        />
      )}
    </>
  )
}
