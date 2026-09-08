import type { ChangeEvent } from 'react'

import { Input } from '../../../../components/Input'
import type { SignUpFieldErrors, SignUpFormState } from '../types'

type AccountStepProps = {
  form: SignUpFormState
  errors: SignUpFieldErrors
  loginIdError?: string
  loginIdHelperText?: string
  isLoginIdAvailable: boolean
  onLoginIdChange: (event: ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  onPasswordConfirmationChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const AccountStep = ({
  form,
  errors,
  loginIdError,
  loginIdHelperText,
  isLoginIdAvailable,
  onLoginIdChange,
  onPasswordChange,
  onPasswordConfirmationChange,
}: AccountStepProps) => {
  return (
    <>
      <Input
        autoComplete="username"
        autoFocus
        error={loginIdError}
        helperText={loginIdHelperText}
        helperTone={isLoginIdAvailable ? 'success' : 'default'}
        id="loginId"
        label="아이디"
        maxLength={20}
        name="loginId"
        onChange={onLoginIdChange}
        placeholder="영문과 숫자로 4~20자 입력해주세요"
        value={form.loginId}
      />
      <Input
        autoComplete="new-password"
        error={errors.password}
        id="password"
        label="비밀번호"
        maxLength={20}
        name="password"
        onChange={onPasswordChange}
        placeholder="영문·숫자·특수문자를 포함해 8~20자"
        type="password"
        value={form.password}
      />
      <Input
        autoComplete="new-password"
        error={errors.passwordConfirmation}
        id="passwordConfirmation"
        label="비밀번호 확인"
        maxLength={20}
        name="passwordConfirmation"
        onChange={onPasswordConfirmationChange}
        placeholder="비밀번호를 다시 입력해주세요"
        type="password"
        value={form.passwordConfirmation}
      />
    </>
  )
}
