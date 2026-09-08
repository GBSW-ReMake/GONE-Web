import { useEffect, useState } from 'react'

import { checkLoginId } from '../../../../api/auth'
import {
  getSignUpRequestErrorMessage,
  getSignUpResponseMessage,
} from '../lib/error-message'
import { loginIdPattern } from '../constants'
import type { LoginIdStatus } from '../types'

export const useLoginIdCheck = (loginIdValue: string) => {
  const [status, setStatus] = useState<LoginIdStatus>('idle')
  const [error, setError] = useState<string | undefined>()
  const [checkedLoginId, setCheckedLoginId] = useState('')

  const normalizedLoginId = loginIdValue.trim()
  const hasValidFormat = loginIdPattern.test(normalizedLoginId)
  const hasCurrentResult = checkedLoginId === normalizedLoginId

  useEffect(() => {
    const loginId = normalizedLoginId

    if (!loginIdPattern.test(loginId)) {
      return
    }

    let isCurrentRequest = true
    const timeoutId = window.setTimeout(() => {
      const requestLoginIdCheck = async (): Promise<void> => {
        setCheckedLoginId(loginId)
        setStatus('checking')

        try {
          const response = await checkLoginId(loginId)

          if (!isCurrentRequest) {
            return
          }

          if (!response.success) {
            setStatus('unavailable')
            setError(
              getSignUpResponseMessage(
                response,
                '아이디 중복 확인에 실패했습니다.',
              ),
            )
            return
          }

          setStatus(response.data.available ? 'available' : 'unavailable')
          setError(
            response.data.available
              ? undefined
              : '이미 사용 중인 아이디입니다.',
          )
        } catch (requestError) {
          if (!isCurrentRequest) {
            return
          }

          setStatus('unavailable')
          setError(
            getSignUpRequestErrorMessage(
              requestError,
              '아이디 중복 확인에 실패했습니다. 잠시 후 다시 시도해주세요.',
            ),
          )
        }
      }

      void requestLoginIdCheck()
    }, 500)

    return () => {
      isCurrentRequest = false
      window.clearTimeout(timeoutId)
    }
  }, [normalizedLoginId])

  return {
    status: hasValidFormat && hasCurrentResult ? status : 'idle',
    error: hasValidFormat && hasCurrentResult ? error : undefined,
  }
}
