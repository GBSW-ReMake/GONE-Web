'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'

import { AccountStep } from './signup/components/AccountStep'
import { PhoneVerificationStep } from './signup/components/PhoneVerificationStep'
import { SignUpActions } from './signup/components/SignUpActions'
import { SignUpProgress } from './signup/components/SignUpProgress'
import { useSignUpForm } from './signup/hooks/useSignUpForm'

const SignUpPage = () => {
  const signUpForm = useSignUpForm()
  const { form, fieldErrors, phoneVerification } = signUpForm

  const phoneVerificationStepProps = {
    cooldownRemaining: phoneVerification.cooldownRemaining,
    errors: fieldErrors,
    form,
    isSending: phoneVerification.isSending,
    isVerifying: phoneVerification.isVerifying,
    message: phoneVerification.message,
    onPhoneNumberChange: signUpForm.handlePhoneNumberChange,
    onSendCode: signUpForm.handleSendCode,
    onVerificationCodeChange: signUpForm.handleVerificationCodeChange,
    onVerifyCode: signUpForm.handleVerifyCode,
    phoneError:
      phoneVerification.status === 'idle' ? phoneVerification.error : undefined,
    status: phoneVerification.status,
    verificationError:
      phoneVerification.status === 'idle' ? undefined : phoneVerification.error,
  } satisfies ComponentProps<typeof PhoneVerificationStep>

  return (
    <div className="flex w-full -translate-y-6 flex-col gap-10">
      <header className="flex flex-col gap-0">
        <div className="flex flex-col gap-[14px]">
          <h1
            className="m-0 flex items-center gap-2 text-[24px] font-bold leading-normal text-[#1f2937]"
            id="signup-title"
          >
            <img alt="GONE" className="block h-6 w-auto" src="/gone-logo.svg" />
            <span>시작하기</span>
          </h1>
          <p className="m-0 text-[14px] font-[510] leading-normal text-[#98a0aa]">
            회원가입 후 다양한 학교 서비스를 이용해보세요
          </p>
        </div>
      </header>

      <form className="flex flex-col gap-7" onSubmit={signUpForm.handleSubmit}>
        <SignUpProgress step={signUpForm.step} />

        <div className="flex flex-col gap-[26px]">
          {signUpForm.step === 1 ? (
            <AccountStep
              errors={fieldErrors}
              form={form}
              isLoginIdAvailable={signUpForm.loginIdStatus === 'available'}
              loginIdError={signUpForm.loginIdError}
              loginIdHelperText={signUpForm.loginIdHelperText}
              onLoginIdChange={signUpForm.handleLoginIdChange}
              onPasswordChange={signUpForm.handlePasswordChange}
              onPasswordConfirmationChange={
                signUpForm.handlePasswordConfirmationChange
              }
            />
          ) : (
            <PhoneVerificationStep {...phoneVerificationStepProps} />
          )}
        </div>

        <SignUpActions
          formError={signUpForm.formError}
          isReady={
            signUpForm.step === 1
              ? signUpForm.isAccountStepReady
              : signUpForm.isPhoneStepReady
          }
          isSubmitting={signUpForm.isSubmitting}
          onPrevious={signUpForm.handlePreviousStep}
          step={signUpForm.step}
        />

        <p className="m-0 text-center text-[14px] font-[510] leading-normal text-[#1f2937]">
          이미 계정이 있으신가요?{' '}
          <Link
            className="font-[590] text-[#5b8def] no-underline focus-visible:outline-2 focus-visible:outline-[#5b8def] focus-visible:outline-offset-3"
            href="/login"
          >
            로그인
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignUpPage
