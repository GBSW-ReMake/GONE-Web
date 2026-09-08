import type { ChangeEvent } from 'react'

import { Input } from '../../../../components/Input'
import type { SignUpFieldErrors, SignUpFormState } from '../types'

type PasswordFieldsProps = {
  form: SignUpFormState
  errors: SignUpFieldErrors
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
  onPasswordConfirmationChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const PasswordFields = ({
  form,
  errors,
  onPasswordChange,
  onPasswordConfirmationChange,
}: PasswordFieldsProps) => {
  return (
    <>
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
