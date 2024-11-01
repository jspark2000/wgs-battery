import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { preprocessingData } from '@/lib/actions'
import type { RootState } from '@/store'
import { setCsvColumns } from '@/store/setting-state-slice'
import type { ProcessedData } from '@/types'
import { useEffect, useState, type SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface Props {
  setTempFileUrl: React.Dispatch<SetStateAction<string | undefined>>
}

const PreprocessingSection: React.FC<Props> = ({ setTempFileUrl }) => {
  const dispatch = useDispatch()
  const { currentFILE, currentDIR } = useSelector(
    (state: RootState) => state.setting
  )
  const [data, setData] = useState<ProcessedData>()

  useEffect(() => {
    const fetchData = async () => {
      if (currentFILE) {
        const result = await preprocessingData(currentDIR, currentFILE)
        setData(result)

        if (result) {
          setTempFileUrl(result.temp_file_name)
          dispatch(setCsvColumns({ csvColumns: result.processed.columns }))
        }
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFILE])

  return (
    <div className="grid w-full grid-cols-2 gap-x-3 gap-y-4 pt-10">
      <div className="col-span-2 flex justify-between">
        <h1 className="text-xl font-semibold text-stone-950">
          Raw 데이터 확인
        </h1>
      </div>

      {data && (
        <>
          <div>
            <DataTable
              columns={data.origin.columns.map((column) => {
                return { header: column, accessorKey: column }
              })}
              data={data.origin.rows}
            />
            <p className="pb-3 pt-5">
              rows: {data.origin.shape[0]}, columns: {data.origin.shape[1]}
            </p>
            <Button variant={'outline'}>Download CSV</Button>
          </div>
        </>
      )}
    </div>
  )
}

export default PreprocessingSection
