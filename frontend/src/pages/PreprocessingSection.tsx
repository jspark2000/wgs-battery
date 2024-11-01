import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { downloadCSV, preprocessingData } from '@/lib/actions'
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

  const handleClick = async (dataPath: string) => {
    await downloadCSV(dataPath)
  }

  return (
    <div className="grid w-full grid-cols-2 gap-x-3 gap-y-4 pt-10">
      <div className="col-span-2 flex justify-between">
        <h1 className="text-xl font-semibold text-stone-950">Preprocessing</h1>
        <Select defaultValue="dropna">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dropna">dropna</SelectItem>
            <SelectItem value="interpolation">interpolation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data && (
        <>
          <div>
            <h2 className="pb-5 text-lg font-semibold text-zinc-400">
              Raw Data
            </h2>
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
          <div>
            <h2 className="pb-5 text-lg font-semibold text-zinc-400">
              Processed Data
            </h2>
            <DataTable
              columns={data.origin.columns.map((column) => {
                return { header: column, accessorKey: column }
              })}
              data={data.origin.rows}
            />
            <p className="pb-3 pt-5">
              rows: {data.processed.shape[0]}, columns:{' '}
              {data.processed.shape[1]}
            </p>
            <Button
              variant={'outline'}
              onClick={() => handleClick(data.temp_file_name)}
            >
              Download CSV
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default PreprocessingSection
