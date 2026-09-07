import { isAxiosError } from 'axios'
import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { login } from '../api/auth'
import goneLogo from '../assets/gone-logo.svg'
import schoolBuilding from '../assets/school-building.png'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useAuthStore } from '../stores/authStore'
import type { ApiResponse, LoginRequest } from '../types/auth'

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
  const navigate = useNavigate()
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
      navigate('/')
    } catch (requestError) {
      setError(getLoginErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <div className="auth-content">
          <header className="auth-header">
            <img alt="GONE" className="auth-logo" src={goneLogo} />
            <div className="auth-intro">
              <h1 id="login-title">편리한 학교생활의 시작</h1>
              <p>
                선생님으로 로그인하고 필요한 학교 서비스를 간편하게
                이용해보세요.
              </p>
            </div>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-fields">
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

            <div className="auth-actions">
              {error && (
                <p className="auth-form__error" role="alert">
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
              <p className="auth-signup-link">
                계정이 없으신가요? <Link to="/signup">회원가입</Link>
              </p>
            </div>
          </form>
        </div>
      </section>

      <div className="auth-visual" aria-hidden="true">
        <img alt="" src={schoolBuilding} />
      </div>
    </main>
  )
}

export default LoginPage
