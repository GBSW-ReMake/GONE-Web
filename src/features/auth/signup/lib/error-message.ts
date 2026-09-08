import { isAxiosError } from 'axios'

import type { ApiResponse } from '../../../../types/auth'
import { signUpErrorMessages } from '../constants'

export const getSignUpResponseMessage = (
  response: ApiResponse<unknown>,
  fallback: string,
): string => {
  return (response.code && signUpErrorMessages[response.code]) ?? fallback
}

export const getSignUpRequestErrorMessage = (
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
