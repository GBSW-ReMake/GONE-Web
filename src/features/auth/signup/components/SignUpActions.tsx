import type { SignUpStep } from '../types'

type SignUpActionsProps = {
  step: SignUpStep
  isReady: boolean
  isSubmitting: boolean
  formError: string
  onPrevious: () => void
}

import { Button } from '../../../../components/Button'

export const SignUpActions = ({
  step,
  isReady,
  isSubmitting,
  formError,
  onPrevious,
}: SignUpActionsProps) => {
  return (
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
        {step === 2 && (
          <Button
            className="flex-1"
            onClick={onPrevious}
            type="button"
            variant="secondary"
          >
            이전
          </Button>
        )}
        <Button
          className="flex-1"
          disabled={!isReady}
          loading={isSubmitting}
          loadingLabel="회원가입 중..."
          type="submit"
        >
          {step === 1 ? '다음' : '회원가입'}
        </Button>
      </div>
    </div>
  )
}
