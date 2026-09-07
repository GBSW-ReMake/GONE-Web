'use client'

import { isAxiosError } from 'axios'
import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  checkLoginId,
  sendPhoneCode,
  signUp,
  verifyPhoneCode,
} from '../../api/auth'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { useAuthStore } from '../../stores/authStore'
import type { ApiResponse } from '../../types/auth'

// public 폴더의 정적 로고를 URL로 사용한다. Next.js에서는 이런 자산을 브라우저 경로로 제공한다.
const goneLogo = '/gone-logo.svg'

// 화면에서만 필요한 비밀번호 확인·인증번호까지 포함한 회원가입 입력 상태다.
// 실제 회원가입 Request에는 passwordConfirmation과 verificationCode를 보내지 않는다.
type SignUpFormState = {
  loginId: string
  password: string
  passwordConfirmation: string
  phoneNumber: string
  verificationCode: string
}

// keyof SignUpFormState는 위 객체의 key만 모은 타입이다.
// Partial<Record<...>>은 각 입력 key에 오류 문자열을 선택적으로 저장하는 객체를 만든다.
type SignUpFieldErrors = Partial<Record<keyof SignUpFormState, string>>

// 문자열 리터럴 union은 아래 네 상태 외의 잘못된 문자열이 들어오는 것을 막는다.
type LoginIdStatus = 'idle' | 'checking' | 'available' | 'unavailable'

type PhoneVerificationStatus = 'idle' | 'sent' | 'verified'

// 회원가입은 계정 정보와 휴대폰 인증을 나눠 보여줘 한 화면이 답답해지지 않게 한다.
type SignUpStep = 1 | 2

const phoneResendCooldownSeconds = 30

const initialForm: SignUpFormState = {
  loginId: '',
  password: '',
  passwordConfirmation: '',
  phoneNumber: '',
  verificationCode: '',
}

// Server dev의 Bean Validation과 Notion API 명세서에 적힌 입력 규칙을 동일하게 사용한다.
// passwordPattern의 (?=...)들은 실제 문자를 소비하지 않고 영문·숫자·특수문자 포함 여부만 미리 확인한다.
const loginIdPattern = /^[a-zA-Z0-9]{4,20}$/
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,20}$/
const phoneNumberPattern = /^010\d{8}$/
const verificationCodePattern = /^\d{6}$/

const signUpErrorMessages: Record<string, string> = {
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

// API 코드가 그대로 화면에 노출되지 않도록 사용자용 한국어 문구로 변환한다.
const getSignUpResponseMessage = (
  response: ApiResponse<unknown>,
  fallback: string,
): string => {
  return (response.code && signUpErrorMessages[response.code]) ?? fallback
}

// unknown 오류는 Axios 오류로 확인된 경우에만 response.data를 안전하게 읽는다.
const getSignUpRequestErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (isAxiosError<ApiResponse<null>>(error)) {
    const response = error.response?.data

    if (error.response?.status === 404) {
      return signUpErrorMessages.GBSW_001
    }

    return response
      ? getSignUpResponseMessage(response, fallback)
      : '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
  }

  return fallback
}

const SignUpPage = () => {
  const router = useRouter()
  const setAuthTokens = useAuthStore((state) => state.setAuthTokens)
  const [form, setForm] = useState<SignUpFormState>(initialForm)
  const [fieldErrors, setFieldErrors] = useState<SignUpFieldErrors>({})
  const [formError, setFormError] = useState('')
  const [loginIdStatus, setLoginIdStatus] = useState<LoginIdStatus>('idle')
  const [phoneStatus, setPhoneStatus] =
    useState<PhoneVerificationStatus>('idle')
  const [phoneMessage, setPhoneMessage] = useState('')
  const [ticket, setTicket] = useState('')
  const [phoneCodeExpiresAt, setPhoneCodeExpiresAt] = useState<number | null>(
    null,
  )
  const [phoneResendAvailableAt, setPhoneResendAvailableAt] = useState<
    number | null
  >(null)
  const [phoneCooldownRemaining, setPhoneCooldownRemaining] = useState(0)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<SignUpStep>(1)

  // 아이디 입력이 멈춘 뒤 500ms 후에만 요청하는 debounce로 불필요한 API 호출을 줄인다.
  useEffect(() => {
    const loginId = form.loginId.trim()

    if (!loginIdPattern.test(loginId)) {
      return
    }

    // cleanup이 실행되면 이전 요청 결과가 새 아이디 상태를 덮어쓰지 못하게 막는다.
    let isCurrentRequest = true
    const timeoutId = window.setTimeout(() => {
      const requestLoginIdCheck = async (): Promise<void> => {
        setLoginIdStatus('checking')

        try {
          const response = await checkLoginId(loginId)

          if (!isCurrentRequest) {
            return
          }

          if (!response.success) {
            setLoginIdStatus('unavailable')
            setFieldErrors((currentErrors) => ({
              ...currentErrors,
              loginId: getSignUpResponseMessage(
                response,
                '아이디 중복 확인에 실패했습니다.',
              ),
            }))
            return
          }

          setLoginIdStatus(
            response.data.available ? 'available' : 'unavailable',
          )
        } catch (requestError) {
          if (!isCurrentRequest) {
            return
          }

          setLoginIdStatus('unavailable')
          setFieldErrors((currentErrors) => ({
            ...currentErrors,
            loginId: getSignUpRequestErrorMessage(
              requestError,
              '아이디 중복 확인에 실패했습니다. 잠시 후 다시 시도해주세요.',
            ),
          }))
        }
      }

      // setTimeout 콜백은 Promise를 기다리지 않으므로 void로 반환값을 사용하지 않음을 표시한다.
      void requestLoginIdCheck()
    }, 500)

    return () => {
      isCurrentRequest = false
      window.clearTimeout(timeoutId)
    }
  }, [form.loginId])

  // 인증번호 유효시간과 재발송 대기시간을 매초 계산해 화면에 반영한다.
  useEffect(() => {
    if (phoneStatus !== 'sent' || !phoneCodeExpiresAt) {
      return
    }

    const updatePhoneTimers = (): void => {
      const now = Date.now()
      const expiresInSeconds = Math.max(
        0,
        Math.ceil((phoneCodeExpiresAt - now) / 1000),
      )
      const cooldownInSeconds = phoneResendAvailableAt
        ? Math.max(0, Math.ceil((phoneResendAvailableAt - now) / 1000))
        : 0

      setPhoneCooldownRemaining(cooldownInSeconds)

      if (expiresInSeconds === 0) {
        // 5분이 지나면 기존 인증번호와 ticket을 폐기하고 다시 발송하도록 돌린다.
        setPhoneStatus('idle')
        setTicket('')
        setPhoneMessage(
          '인증번호가 만료되었습니다. 다시 인증번호를 받아주세요.',
        )
        setPhoneCodeExpiresAt(null)
        setPhoneResendAvailableAt(null)
        setPhoneCooldownRemaining(0)
        setForm((currentForm) => ({ ...currentForm, verificationCode: '' }))
        return
      }

      setPhoneMessage(
        `인증번호를 발송했습니다. ${Math.ceil(expiresInSeconds / 60)}분 안에 입력해주세요.`,
      )
    }

    updatePhoneTimers()
    const timerId = window.setInterval(updatePhoneTimers, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [phoneCodeExpiresAt, phoneResendAvailableAt, phoneStatus])

  const handleLoginIdChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const loginId = event.target.value

    setForm((currentForm) => ({ ...currentForm, loginId }))
    setLoginIdStatus('idle')
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      loginId: undefined,
    }))
    setFormError('')
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const password = event.target.value

    setForm((currentForm) => ({ ...currentForm, password }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      password: undefined,
      passwordConfirmation: undefined,
    }))
    setFormError('')
  }

  const handlePasswordConfirmationChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const passwordConfirmation = event.target.value

    setForm((currentForm) => ({ ...currentForm, passwordConfirmation }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      passwordConfirmation: undefined,
    }))
    setFormError('')
  }

  const handlePhoneNumberChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    // 정규식으로 숫자가 아닌 문자를 제거하고 API가 받는 11자리까지만 저장한다.
    const phoneNumber = event.target.value.replace(/\D/g, '').slice(0, 11)

    setForm((currentForm) => ({
      ...currentForm,
      phoneNumber,
      verificationCode: '',
    }))
    // 번호가 바뀌면 이전 번호로 받은 ticket은 더 이상 사용할 수 없다.
    setPhoneStatus('idle')
    setPhoneMessage('')
    setTicket('')
    setPhoneCodeExpiresAt(null)
    setPhoneResendAvailableAt(null)
    setPhoneCooldownRemaining(0)
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      phoneNumber: undefined,
      verificationCode: undefined,
    }))
    setFormError('')
  }

  const handleVerificationCodeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const verificationCode = event.target.value.replace(/\D/g, '').slice(0, 6)

    setForm((currentForm) => ({ ...currentForm, verificationCode }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      verificationCode: undefined,
    }))
    setFormError('')
  }

  const handleSendPhoneCode = async (): Promise<void> => {
    if (isSendingCode || phoneCooldownRemaining > 0) {
      return
    }

    if (!phoneNumberPattern.test(form.phoneNumber)) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        phoneNumber: '휴대폰 번호를 01012345678 형식으로 입력해주세요.',
      }))
      return
    }

    setIsSendingCode(true)
    setFormError('')

    try {
      const response = await sendPhoneCode({ phoneNumber: form.phoneNumber })

      if (!response.success) {
        setFieldErrors((currentErrors) => ({
          ...currentErrors,
          phoneNumber: getSignUpResponseMessage(
            response,
            '인증번호 발송에 실패했습니다.',
          ),
        }))
        return
      }

      const now = Date.now()

      setPhoneStatus('sent')
      setPhoneCodeExpiresAt(now + response.data.expiresIn * 1000)
      setPhoneResendAvailableAt(now + phoneResendCooldownSeconds * 1000)
      setPhoneCooldownRemaining(phoneResendCooldownSeconds)
      setPhoneMessage('인증번호를 발송했습니다. 5분 안에 입력해주세요.')
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        phoneNumber: undefined,
        verificationCode: undefined,
      }))
      setForm((currentForm) => ({
        ...currentForm,
        verificationCode: '',
      }))
    } catch (requestError) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        phoneNumber: getSignUpRequestErrorMessage(
          requestError,
          '인증번호 발송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        ),
      }))
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyPhoneCode = async (): Promise<void> => {
    if (isVerifyingCode) {
      return
    }

    if (
      phoneStatus !== 'sent' ||
      !phoneCodeExpiresAt ||
      Date.now() >= phoneCodeExpiresAt
    ) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        verificationCode: '인증번호가 만료되었습니다. 다시 요청해주세요.',
      }))
      return
    }

    if (!verificationCodePattern.test(form.verificationCode)) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        verificationCode: '인증번호 숫자 6자리를 입력해주세요.',
      }))
      return
    }

    setIsVerifyingCode(true)
    setFormError('')

    try {
      const response = await verifyPhoneCode({
        phoneNumber: form.phoneNumber,
        code: form.verificationCode,
      })

      if (!response.success) {
        setFieldErrors((currentErrors) => ({
          ...currentErrors,
          verificationCode: getSignUpResponseMessage(
            response,
            '인증번호 확인에 실패했습니다.',
          ),
        }))
        return
      }

      setTicket(response.data.ticket)
      setPhoneStatus('verified')
      setPhoneMessage('휴대폰 인증이 완료되었습니다.')
    } catch (requestError) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        verificationCode: getSignUpRequestErrorMessage(
          requestError,
          '인증번호가 일치하지 않습니다.',
        ),
      }))
    } finally {
      setIsVerifyingCode(false)
    }
  }

  // 1단계에서 API를 호출하기 전에 아이디와 비밀번호 입력을 검증한다.
  const validateStepOne = (): SignUpFieldErrors => {
    const nextErrors: SignUpFieldErrors = {}

    if (!loginIdPattern.test(form.loginId.trim())) {
      nextErrors.loginId = '아이디는 영문과 숫자로 4~20자 입력해주세요.'
    } else if (loginIdStatus !== 'available') {
      nextErrors.loginId = '사용 가능한 아이디인지 확인해주세요.'
    }

    if (!passwordPattern.test(form.password)) {
      nextErrors.password =
        '비밀번호는 영문·숫자·특수문자를 포함해 8~20자 입력해주세요.'
    }

    if (form.password !== form.passwordConfirmation) {
      nextErrors.passwordConfirmation = '비밀번호가 일치하지 않습니다.'
    }

    return nextErrors
  }

  // 2단계에서는 인증이 끝났고 서버가 발급한 ticket이 있는지 확인한다.
  const validateStepTwo = (): SignUpFieldErrors => {
    const nextErrors: SignUpFieldErrors = {}

    if (!phoneNumberPattern.test(form.phoneNumber)) {
      nextErrors.phoneNumber =
        '휴대폰 번호를 01012345678 형식으로 입력해주세요.'
    }

    if (phoneStatus === 'idle') {
      nextErrors.phoneNumber = '휴대폰 인증을 완료해주세요.'
    } else if (phoneStatus !== 'verified' || !ticket) {
      nextErrors.verificationCode = '휴대폰 인증을 완료해주세요.'
    }

    return nextErrors
  }

  const handlePreviousStep = (): void => {
    setCurrentStep(1)
    setFieldErrors({})
    setFormError('')
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const nextErrors = currentStep === 1 ? validateStepOne() : validateStepTwo()

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }

    if (currentStep === 1) {
      setFieldErrors({})
      setFormError('')
      setCurrentStep(2)
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      // passwordConfirmation과 verificationCode 대신 검증 결과인 ticket만 서버에 보낸다.
      const response = await signUp({
        loginId: form.loginId.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber,
        ticket,
      })

      if (!response.success) {
        setFormError(
          getSignUpResponseMessage(response, '회원가입에 실패했습니다.'),
        )
        return
      }

      // 회원가입 성공 응답이 토큰을 바로 주므로 로그인 API를 다시 호출하지 않는다.
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

  const loginIdHelperText =
    loginIdStatus === 'checking'
      ? '아이디 중복 여부를 확인하고 있습니다.'
      : loginIdStatus === 'available'
        ? '사용 가능한 아이디입니다.'
        : undefined

  const loginIdError =
    fieldErrors.loginId ??
    (form.loginId && !loginIdPattern.test(form.loginId.trim())
      ? '아이디는 영문과 숫자로 4~20자 입력해주세요.'
      : loginIdStatus === 'unavailable'
        ? '이미 사용 중인 아이디입니다.'
        : undefined)

  const isStepOneReady =
    loginIdPattern.test(form.loginId.trim()) &&
    loginIdStatus === 'available' &&
    passwordPattern.test(form.password) &&
    form.password === form.passwordConfirmation

  const isStepTwoReady = phoneStatus === 'verified' && Boolean(ticket)

  return (
    <div className="flex w-full -translate-y-6 flex-col gap-10">
      <header className="flex flex-col gap-0">
        <div className="flex flex-col gap-[14px]">
          <h1
            className="m-0 flex items-center gap-2 text-[24px] font-bold leading-normal text-[#1f2937]"
            id="signup-title"
          >
            <img alt="GONE" className="block h-6 w-auto" src={goneLogo} />
            <span>시작하기</span>
          </h1>
          <p className="m-0 text-[14px] font-[510] leading-normal text-[#98a0aa]">
            회원가입 후 다양한 학교 서비스를 이용해보세요
          </p>
        </div>
      </header>

      <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
        {/* 현재 단계와 완료한 단계를 텍스트 대신 두 칸 진행선으로 보여준다. */}
        <div
          aria-label={`회원가입 ${currentStep}단계`}
          aria-valuemax={2}
          aria-valuemin={1}
          aria-valuenow={currentStep}
          className="flex w-full gap-1.5"
          role="progressbar"
        >
          {[1, 2].map((step) => (
            <span
              className={`block h-[3px] flex-1 rounded-full transition-colors duration-200 motion-reduce:transition-none ${
                currentStep >= step ? 'bg-[#5b8def]' : 'bg-[#eef1f5]'
              }`}
              key={step}
            />
          ))}
        </div>

        <div className="flex flex-col gap-[26px]">
          {currentStep === 1 ? (
            <>
              <Input
                autoComplete="username"
                autoFocus
                error={loginIdError}
                helperText={loginIdHelperText}
                helperTone={
                  loginIdStatus === 'available' ? 'success' : 'default'
                }
                id="loginId"
                label="아이디"
                maxLength={20}
                name="loginId"
                onChange={handleLoginIdChange}
                placeholder="영문과 숫자로 4~20자 입력해주세요"
                value={form.loginId}
              />

              <Input
                autoComplete="new-password"
                error={fieldErrors.password}
                id="password"
                label="비밀번호"
                maxLength={20}
                name="password"
                onChange={handlePasswordChange}
                placeholder="영문·숫자·특수문자를 포함해 8~20자"
                type="password"
                value={form.password}
              />

              <Input
                autoComplete="new-password"
                error={fieldErrors.passwordConfirmation}
                id="passwordConfirmation"
                label="비밀번호 확인"
                maxLength={20}
                name="passwordConfirmation"
                onChange={handlePasswordConfirmationChange}
                placeholder="비밀번호를 다시 입력해주세요"
                type="password"
                value={form.passwordConfirmation}
              />
            </>
          ) : (
            <>
              <Input
                autoComplete="tel"
                autoFocus
                disabled={isSendingCode || phoneStatus === 'verified'}
                endAdornment={
                  <button
                    className="min-w-[96px] cursor-pointer border-0 bg-transparent px-1.5 py-1 text-[12px] font-bold text-[#5b8def] hover:text-[#477bdc] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#5b8def] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-[#98a0aa]"
                    disabled={
                      isSendingCode ||
                      phoneStatus === 'verified' ||
                      phoneCooldownRemaining > 0
                    }
                    onClick={handleSendPhoneCode}
                    type="button"
                  >
                    {isSendingCode
                      ? '발송 중...'
                      : phoneCooldownRemaining > 0
                        ? `재발송 (${phoneCooldownRemaining}초)`
                        : phoneStatus === 'sent'
                          ? '다시 받기'
                          : '인증번호 받기'}
                  </button>
                }
                error={fieldErrors.phoneNumber}
                helperText={phoneMessage}
                helperTone={phoneStatus === 'verified' ? 'success' : 'default'}
                id="phoneNumber"
                inputMode="numeric"
                label="휴대폰 번호"
                maxLength={11}
                name="phoneNumber"
                onChange={handlePhoneNumberChange}
                placeholder="01012345678"
                value={form.phoneNumber}
              />

              {phoneStatus !== 'idle' && (
                <Input
                  autoComplete="one-time-code"
                  disabled={isVerifyingCode || phoneStatus === 'verified'}
                  endAdornment={
                    <button
                      className="min-w-[96px] cursor-pointer border-0 bg-transparent px-1.5 py-1 text-[12px] font-bold text-[#5b8def] hover:text-[#477bdc] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#5b8def] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-[#98a0aa]"
                      disabled={isVerifyingCode || phoneStatus === 'verified'}
                      onClick={handleVerifyPhoneCode}
                      type="button"
                    >
                      {phoneStatus === 'verified'
                        ? '인증 완료'
                        : isVerifyingCode
                          ? '확인 중...'
                          : '인증 확인'}
                    </button>
                  }
                  error={fieldErrors.verificationCode}
                  id="verificationCode"
                  inputMode="numeric"
                  label="인증번호"
                  maxLength={6}
                  name="verificationCode"
                  onChange={handleVerificationCodeChange}
                  placeholder="인증번호 6자리를 입력해주세요"
                  value={form.verificationCode}
                />
              )}
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          {formError && (
            <p
              className="m-0 -mb-4 -mt-6 self-stretch text-center text-[12px] leading-[18px] text-[#d84c4c]"
              role="alert"
            >
              {formError}
            </p>
          )}
          <div className="flex w-full gap-3">
            {currentStep === 2 && (
              <Button
                className="flex-1"
                onClick={handlePreviousStep}
                type="button"
                variant="secondary"
              >
                이전
              </Button>
            )}
            <Button
              className="flex-1"
              disabled={currentStep === 1 ? !isStepOneReady : !isStepTwoReady}
              loading={isSubmitting}
              loadingLabel="회원가입 중..."
              type="submit"
            >
              {currentStep === 1 ? '다음' : '회원가입'}
            </Button>
          </div>
          <p className="m-0 text-[14px] font-[510] leading-normal text-[#1f2937]">
            이미 계정이 있으신가요?{' '}
            <Link
              className="font-[590] text-[#5b8def] no-underline focus-visible:outline-2 focus-visible:outline-[#5b8def] focus-visible:outline-offset-3"
              href="/login"
            >
              로그인
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default SignUpPage
