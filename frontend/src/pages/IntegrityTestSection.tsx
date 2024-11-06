import { Button } from '@/components/ui/button'
import { checkIntegrity } from '@/lib/actions'
import type { RootState } from '@/store'
import type { IntegrationCheckResult } from '@/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

interface Props {
  tempFileUrl?: string
}

const IntegrityTestSection: React.FC<Props> = ({ tempFileUrl }) => {
  const [isFetching, setIsFetching] = useState(false)
  const [result, setResult] = useState<IntegrationCheckResult>()
  const setting = useSelector((state: RootState) => state.setting)

  useEffect(() => {
    setIsFetching(false)
    setResult(undefined)
  }, [setting.currentDIR, setting.currentFILE, setting.tempFileUrl])

  const handleClick = async () => {
    if (!setting.tempFileUrl) return

    setIsFetching(true)

    try {
      const result = await checkIntegrity(setting.tempFileUrl, setting.encoding)

      setResult(result)
    } catch (e) {
      console.log(e)
      toast.error('전처리 과정중 오류 발생')
    } finally {
      setIsFetching(false)
    }
  }

  const renderBadge = (check: boolean) => {
    return check ? (
      <span className="rounded-md bg-green-100/60 px-2 py-1 text-xs text-green-600">
        통과
      </span>
    ) : (
      <span className="rounded-md bg-red-100/60 px-2 py-1 text-xs text-red-600">
        실패
      </span>
    )
  }

  const renderResult = () => {
    if (!result) return

    if (result.no_duplicates && result.no_missing && result.valid_types) {
      return (
        <div className="w-full rounded-md bg-green-100/60 px-5 py-3 text-green-600">
          정합성 테스트를 통과하였습니다
        </div>
      )
    } else {
      return (
        <div className="w-full rounded-md bg-red-100/60 px-5 py-3 text-red-600">
          일부 테스트가 실패하였습니다
        </div>
      )
    }
  }

  return (
    <div className="flex w-full flex-col py-5">
      <h2 className="mb-2 text-2xl font-semibold text-stone-800">
        1. 전처리 데이터 정합성 테스트
      </h2>
      {tempFileUrl && (
        <Button
          onClick={() => handleClick()}
          className="mt-5"
          disabled={isFetching}
        >
          정합성 테스트하기
        </Button>
      )}
      {result && (
        <div className="mb-1 mt-5 flex w-full flex-col space-y-3">
          <h2 className="text-lg font-semibold text-stone-950">CHECK RESULT</h2>
          <p>결측치 존재 여부 검사: {renderBadge(result.no_missing)}</p>
          <p>중복값 검사: {renderBadge(result.no_duplicates)}</p>
          <p>데이터 타입 유효성 검사: {renderBadge(result.valid_types)}</p>
          {renderResult()}
        </div>
      )}
    </div>
  )
}

export default IntegrityTestSection
