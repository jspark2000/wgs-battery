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
  }, [setting.currentDIR, setting.currentFILE])

  const handleClick = async () => {
    if (!setting.currentFILE) return

    setIsFetching(true)

    try {
      const result = await checkIntegrity(
        setting.currentDIR,
        setting.currentFILE,
        'dropna'
      )

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
        True
      </span>
    ) : (
      <span className="rounded-md bg-red-100/60 px-2 py-1 text-xs text-red-600">
        False
      </span>
    )
  }

  const renderResult = () => {
    if (!result) return

    if (result.no_duplicates && result.no_missing && result.valid_types) {
      return (
        <div className="w-full rounded-md bg-green-100/60 px-5 py-3 font-semibold text-green-600">
          정합성 테스트를 통과하였습니다
        </div>
      )
    } else {
      return (
        <div className="w-full rounded-md bg-red-100/60 px-5 py-3 font-semibold text-red-600">
          일부 테스트가 실패하였습니다
        </div>
      )
    }
  }

  return (
    <div className="flex w-full flex-col py-5">
      <h2 className="mb-2 text-2xl font-semibold text-stone-800">
        1. 데이터 전처리 및 정합성 테스트
      </h2>
      {tempFileUrl && (
        <Button
          onClick={() => handleClick()}
          className="mt-5"
          disabled={isFetching}
        >
          Check Integrity
        </Button>
      )}
      {result && (
        <div className="mb-1 mt-5 flex w-full flex-col space-y-3">
          <h2 className="text-lg font-semibold text-stone-950">CHECK RESULT</h2>
          <p>No missing values: {renderBadge(result.no_missing)}</p>
          <p>No duplicate rows: {renderBadge(result.no_duplicates)}</p>
          <p>Valid data types: {renderBadge(result.valid_types)}</p>
          {renderResult()}
        </div>
      )}
    </div>
  )
}

export default IntegrityTestSection
