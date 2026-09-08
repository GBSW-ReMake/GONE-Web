import type { ChangeEvent } from 'react'

import { Input } from '../../../../components/Input'
import type { SignUpFormState } from '../types'

type AccountStepProps = {
  form: SignUpFormState
  loginIdError?: string
  loginIdHelperText?: string
  isLoginIdAvailable: boolean
  onLoginIdChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const AccountStep = ({
  form,
  loginIdError,
  loginIdHelperText,
  isLoginIdAvailable,
  onLoginIdChange,
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
    </>
  )
}
