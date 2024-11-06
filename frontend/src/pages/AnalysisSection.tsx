import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { analysisAnomalyScore, analysisImpulseFactor } from '@/lib/actions'
import type { RootState } from '@/store'
import type { TableRow } from '@/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface Props {
  tempFileUrl?: string
}

const AnalysisSection: React.FC<Props> = ({ tempFileUrl }) => {
  const [loading, setLoading] = useState(false)
  const { currentFILE, currentDIR, encoding } = useSelector(
    (state: RootState) => state.setting
  )
  const [success, setSuccess] = useState(false)
  const [rows, setRows] = useState<TableRow[]>([])

  useEffect(() => {
    setLoading(false)
    setSuccess(false)
    setRows([])
  }, [currentFILE, currentDIR])

  const handleClick = async () => {
    if (!tempFileUrl) return

    try {
      setLoading(true)
      setSuccess(false)

      const anomalyScore = await analysisAnomalyScore(tempFileUrl, encoding)
      const impulseFactor = await analysisImpulseFactor(tempFileUrl, encoding)

      setRows([anomalyScore, impulseFactor])

      console.log(rows)

      setSuccess(true)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col py-5">
      <h2 className="mb-2 text-2xl font-semibold text-stone-800">
        3. 데이터 분석
      </h2>
      <p className="text-xs text-stone-400">
        사이드바에서 분석 방법을 선택 후 진행해주세요
      </p>
      {success && (
        <div className="my-5 w-full rounded-md bg-green-100/60 px-5 py-3 text-green-600">
          데이터 분석이 성공적으로 마무리되었습니다
        </div>
      )}
      {tempFileUrl && (
        <div className="grid gap-y-2">
          {rows.length > 0 && (
            <DataTable
              columns={[
                {
                  header: 'metric',
                  accessorKey: 'metric'
                },
                {
                  header: 'value',
                  accessorKey: 'value'
                }
              ]}
              data={rows}
            />
          )}
          <Button
            onClick={() => handleClick()}
            disabled={loading}
            className="mt-5"
          >
            데이터 분석 시작
          </Button>
        </div>
      )}
    </div>
  )
}

export default AnalysisSection
