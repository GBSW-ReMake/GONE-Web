import { useEffect, useState } from 'react'

import { sendPhoneCode, verifyPhoneCode } from '../../../../api/auth'
import {
  getSignUpRequestErrorMessage,
  getSignUpResponseMessage,
} from '../lib/error-message'
import {
  phoneNumberPattern,
  phoneResendCooldownSeconds,
  verificationCodePattern,
} from '../constants'
import type { PhoneVerificationStatus } from '../types'

export const usePhoneVerification = (phoneNumber: string) => {
  const [status, setStatus] = useState<PhoneVerificationStatus>('idle')
  const [message, setMessage] = useState('')
  const [ticket, setTicket] = useState('')
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(
    null,
  )
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    if (status !== 'sent' || !expiresAt) {
      return
    }

    const updateTimers = (): void => {
      const now = Date.now()
      const expiresInSeconds = Math.max(0, Math.ceil((expiresAt - now) / 1000))
      const cooldownInSeconds = resendAvailableAt
        ? Math.max(0, Math.ceil((resendAvailableAt - now) / 1000))
        : 0

      setCooldownRemaining(cooldownInSeconds)

      if (expiresInSeconds === 0) {
        setStatus('idle')
        setTicket('')
        setMessage('인증번호가 만료되었습니다. 다시 인증번호를 받아주세요.')
        setExpiresAt(null)
        setResendAvailableAt(null)
        setCooldownRemaining(0)
        return
      }

      setMessage(
        `인증번호를 발송했습니다. ${Math.ceil(expiresInSeconds / 60)}분 안에 입력해주세요.`,
      )
    }

    updateTimers()
    const timerId = window.setInterval(updateTimers, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [expiresAt, resendAvailableAt, status])

  const reset = (): void => {
    setStatus('idle')
    setMessage('')
    setTicket('')
    setExpiresAt(null)
    setResendAvailableAt(null)
    setCooldownRemaining(0)
    setError(undefined)
  }

  const sendCode = async (): Promise<void> => {
    if (isSending || cooldownRemaining > 0) {
      return
    }

    if (!phoneNumberPattern.test(phoneNumber)) {
      setError('휴대폰 번호를 하이픈 없이 01012345678 형식으로 입력해주세요.')
      return
    }

    setIsSending(true)
    setError(undefined)

    try {
      const response = await sendPhoneCode({ phoneNumber })

      if (!response.success) {
        setError(
          getSignUpResponseMessage(response, '인증번호 발송에 실패했습니다.'),
        )
        return
      }

      const now = Date.now()
      setStatus('sent')
      setExpiresAt(now + response.data.expiresIn * 1000)
      setResendAvailableAt(now + phoneResendCooldownSeconds * 1000)
      setCooldownRemaining(phoneResendCooldownSeconds)
      setMessage('인증번호를 발송했습니다. 5분 안에 입력해주세요.')
      setError(undefined)
    } catch (requestError) {
      setError(
        getSignUpRequestErrorMessage(
          requestError,
          '인증번호 발송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        ),
      )
    } finally {
      setIsSending(false)
    }
  }

  const verifyCode = async (verificationCode: string): Promise<void> => {
    if (isVerifying) {
      return
    }

    if (!expiresAt || Date.now() >= expiresAt) {
      setError('인증번호가 만료되었습니다. 다시 요청해주세요.')
      return
    }

    if (!verificationCodePattern.test(verificationCode)) {
      setError('인증번호 숫자 6자리를 입력해주세요.')
      return
    }

    setIsVerifying(true)
    setError(undefined)

    try {
      const response = await verifyPhoneCode({
        phoneNumber,
        code: verificationCode,
      })

      if (!response.success) {
        setError(
          getSignUpResponseMessage(response, '인증번호 확인에 실패했습니다.'),
        )
        return
      }

      setTicket(response.data.ticket)
      setStatus('verified')
      setMessage('인증이 완료되었습니다.')
    } catch (requestError) {
      setError(
        getSignUpRequestErrorMessage(
          requestError,
          '인증번호가 일치하지 않습니다.',
        ),
      )
    } finally {
      setIsVerifying(false)
    }
  }

  return {
    status,
    message,
    ticket,
    expiresAt,
    cooldownRemaining,
    isSending,
    isVerifying,
    error,
    reset,
    sendCode,
    verifyCode,
  }
}
