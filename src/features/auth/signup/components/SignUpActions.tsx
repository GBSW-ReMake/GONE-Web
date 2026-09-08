type SignUpActionsProps = {
  isReady: boolean
  isSubmitting: boolean
  formError: string
}

import { Button } from '../../../../components/Button'

export const SignUpActions = ({
  isReady,
  isSubmitting,
  formError,
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
      <div className="flex w-full">
        <Button
          className="w-full"
          disabled={!isReady}
          loading={isSubmitting}
          loadingLabel="회원가입 중..."
          type="submit"
        >
          회원가입
        </Button>
      </div>
    </div>
  )
}
