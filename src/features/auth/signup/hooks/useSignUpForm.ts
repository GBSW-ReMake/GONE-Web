import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { signUp } from '../../../../api/auth'
import { useAuthStore } from '../../../../stores/authStore'
import {
  getSignUpRequestErrorMessage,
  getSignUpResponseMessage,
} from '../lib/error-message'
import {
  initialSignUpForm,
  loginIdPattern,
  passwordPattern,
  phoneNumberPattern,
} from '../constants'
import { validateAccountStep, validatePhoneStep } from '../lib/validation'
import { useLoginIdCheck } from './useLoginIdCheck'
import { usePhoneVerification } from './usePhoneVerification'
import type { SignUpFieldErrors, SignUpFormState, SignUpStep } from '../types'

export const useSignUpForm = () => {
  const router = useRouter()
  const setAuthTokens = useAuthStore((state) => state.setAuthTokens)
  const [form, setForm] = useState<SignUpFormState>(initialSignUpForm)
  const [fieldErrors, setFieldErrors] = useState<SignUpFieldErrors>({})
  const [formError, setFormError] = useState('')
  const [step, setStep] = useState<SignUpStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loginIdCheck = useLoginIdCheck(form.loginId)
  const phoneVerification = usePhoneVerification(form.phoneNumber)

  const clearFormError = (): void => {
    setFormError('')
  }

  const handleLoginIdChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm((currentForm) => ({ ...currentForm, loginId: event.target.value }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      loginId: undefined,
    }))
    clearFormError()
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm((currentForm) => ({ ...currentForm, password: event.target.value }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      password: undefined,
      passwordConfirmation: undefined,
    }))
    clearFormError()
  }

  const handlePasswordConfirmationChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setForm((currentForm) => ({
      ...currentForm,
      passwordConfirmation: event.target.value,
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      passwordConfirmation: undefined,
    }))
    clearFormError()
  }

  const handlePhoneNumberChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const phoneNumber = event.target.value.replace(/\D/g, '').slice(0, 11)

    setForm((currentForm) => ({
      ...currentForm,
      phoneNumber,
      verificationCode: '',
    }))
    phoneVerification.reset()
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      phoneNumber: undefined,
      verificationCode: undefined,
    }))
    clearFormError()
  }

  const handleVerificationCodeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setForm((currentForm) => ({
      ...currentForm,
      verificationCode: event.target.value.replace(/\D/g, '').slice(0, 6),
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      verificationCode: undefined,
    }))
    clearFormError()
  }

  const handleNextStep = (): void => {
    const errors = validateAccountStep(form, loginIdCheck.status)

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    clearFormError()
    setStep(2)
  }

  const handlePreviousStep = (): void => {
    setStep(1)
    setFieldErrors({})
    clearFormError()
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    if (step === 1) {
      handleNextStep()
      return
    }

    const errors = validatePhoneStep(
      form,
      phoneVerification.status,
      phoneVerification.ticket,
    )

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    clearFormError()

    try {
      const response = await signUp({
        loginId: form.loginId.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber,
        ticket: phoneVerification.ticket,
      })

      if (!response.success) {
        setFormError(
          getSignUpResponseMessage(response, '회원가입에 실패했습니다.'),
        )
        return
      }

      setAuthTokens(response.data)
      router.push('/')
    } catch (requestError) {
      setFormError(
        getSignUpRequestErrorMessage(
          requestError,
          '회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const loginIdError =
    fieldErrors.loginId ??
    loginIdCheck.error ??
    (form.loginId && !loginIdPattern.test(form.loginId.trim())
      ? '아이디는 영문과 숫자로 4~20자 입력해주세요.'
      : undefined)

  const isAccountStepReady =
    loginIdPattern.test(form.loginId.trim()) &&
    loginIdCheck.status === 'available' &&
    passwordPattern.test(form.password) &&
    form.password === form.passwordConfirmation

  const isPhoneStepReady =
    phoneVerification.status === 'verified' &&
    phoneNumberPattern.test(form.phoneNumber) &&
    Boolean(phoneVerification.ticket)

  const handleSendCode = (): void => {
    void phoneVerification.sendCode()
  }

  const handleVerifyCode = (): void => {
    void phoneVerification.verifyCode(form.verificationCode)
  }

  return {
    step,
    form,
    fieldErrors,
    formError,
    isSubmitting,
    isAccountStepReady,
    isPhoneStepReady,
    loginIdStatus: loginIdCheck.status,
    loginIdError,
    loginIdHelperText:
      loginIdCheck.status === 'checking'
        ? '아이디 중복 여부를 확인하고 있습니다.'
        : loginIdCheck.status === 'available'
          ? '사용 가능한 아이디입니다.'
          : undefined,
    phoneVerification,
    handleLoginIdChange,
    handlePasswordChange,
    handlePasswordConfirmationChange,
    handlePhoneNumberChange,
    handleVerificationCodeChange,
    handleSendCode,
    handleVerifyCode,
    handlePreviousStep,
    handleSubmit,
  }
}
