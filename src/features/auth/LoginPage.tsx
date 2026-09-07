'use client'

import { isAxiosError } from 'axios'
import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { login } from '../../api/auth'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { useAuthStore } from '../../stores/authStore'
import type { ApiResponse, LoginRequest } from '../../types/auth'

// public 폴더의 정적 로고를 URL로 사용한다. Next.js에서는 이런 자산을 브라우저 경로로 제공한다.
const goneLogo = '/gone-logo.svg'

// Record<string, string>은 "문자열 코드"를 key로, "문자열 안내 문구"를 value로 갖는 객체 타입이다.
const loginErrorMessages: Record<string, string> = {
  AUTH_001: '아이디 또는 비밀번호를 확인해주세요.',
  AUTH_002: '이미 로그인된 사용자입니다.',
  AUTH_004: '아이디 또는 비밀번호를 확인해주세요.',
  AUTH_005: '인증 정보가 만료되었습니다. 다시 로그인해주세요.',
  AUTH_008: '이미 사용 중인 아이디입니다.',
}

// API 코드가 화면 문구가 아니므로 사용자에게 보여줄 한국어 메시지로 변환한다.
const getLoginResponseMessage = (response: ApiResponse<unknown>): string => {
  return (
    (response.code && loginErrorMessages[response.code]) ??
    '로그인에 실패했습니다. 입력한 정보를 확인해주세요.'
  )
}

// 네트워크 오류도 JavaScript 원문 메시지 대신 안전한 한국어 안내만 노출한다.
const getLoginErrorMessage = (error: unknown): string => {
  // unknown은 어떤 오류가 올지 모른다는 뜻이다. Axios 오류인지 확인한 뒤에만 response를 읽는다.
  if (isAxiosError<ApiResponse<null>>(error)) {
    // isAxiosError<ApiResponse<null>>의 `<...>`는 Axios 오류 안의 response.data 타입을 알려준다.
    const response = error.response?.data

    return response
      ? getLoginResponseMessage(response)
      : '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
  }

  return '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
}

const LoginPage = () => {
  const router = useRouter()
  // 로그인 성공 후 토큰을 저장할 Store action만 구독한다.
  const setAuthTokens = useAuthStore((state) => state.setAuthTokens)
  const [form, setForm] = useState<LoginRequest>({
    identifier: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target

    // 현재 form을 복사하고 [name]에 해당하는 입력값만 덮어쓴다.
    // 함수형 setState는 바로 전 상태를 기준으로 업데이트해 빠른 입력에서도 값을 잃지 않는다.
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setError('')
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault()

    if (!form.identifier || !form.password || isSubmitting) {
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      // 화면은 API Endpoint를 직접 다루지 않고 도메인 API 함수만 호출한다.
      const response = await login(form)

      if (!response.success) {
        setError(getLoginResponseMessage(response))
        return
      }

      setAuthTokens(response.data)
      // 역할별 보호 라우트는 후속 작업에서 연결하고 현재는 홈으로 이동한다.
      router.push('/')
    } catch (requestError) {
      setError(getLoginErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <header className="flex flex-col gap-[34px]">
        <img alt="GONE" className="block h-[30px] w-[109.3px]" src={goneLogo} />
        <div className="flex flex-col gap-[14px]">
          <h1
            className="m-0 text-[24px] font-bold leading-normal text-[#1f2937]"
            id="login-title"
          >
            편리한 학교생활의 시작
          </h1>
          <p className="m-0 text-[14px] font-[510] leading-normal text-[#98a0aa]">
            선생님으로 로그인하고 필요한 학교 서비스를 간편하게 이용해보세요.
          </p>
        </div>
      </header>

      <form className="flex flex-col gap-[60px]" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-[35px]">
          <Input
            autoComplete="username"
            id="identifier"
            label="아이디"
            name="identifier"
            onChange={handleChange}
            placeholder="아이디 또는 전화번호를 입력해주세요"
            value={form.identifier}
          />
          <Input
            autoComplete="current-password"
            id="password"
            label="비밀번호"
            name="password"
            onChange={handleChange}
            placeholder="비밀번호를 입력해주세요"
            type="password"
            value={form.password}
          />
        </div>

        <div className="flex flex-col items-center gap-10">
          {error && (
            <p
              className="m-0 -mb-4 -mt-6 self-stretch text-center text-[12px] leading-[18px] text-[#d84c4c]"
              role="alert"
            >
              {error}
            </p>
          )}
          <Button
            disabled={!form.identifier || !form.password}
            loading={isSubmitting}
            loadingLabel="로그인 중..."
            type="submit"
          >
            로그인
          </Button>
          <p className="m-0 text-[14px] font-[510] leading-normal text-[#1f2937]">
            계정이 없으신가요?{' '}
            <Link
              className="font-[590] text-[#5b8def] no-underline focus-visible:outline-2 focus-visible:outline-[#5b8def] focus-visible:outline-offset-3"
              href="/signup"
            >
              회원가입
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
