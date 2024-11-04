import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { getRawDataFrameInfo } from '@/lib/actions'
import type { RootState } from '@/store'
import { setCsvColumns } from '@/store/setting-state-slice'
import { CSVEncoding, type RawDataFrame } from '@/types'
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
  const [data, setData] = useState<RawDataFrame>()

  useEffect(() => {
    const fetchData = async () => {
      if (currentFILE) {
        const result = await getRawDataFrameInfo(currentDIR, currentFILE)
        setData(result)

        if (result) {
          setTempFileUrl('test')
          dispatch(
            setCsvColumns({
              csvColumns: result.column_info.map((col) => col.column_name)
            })
          )
        }
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFILE])

  return (
    <div className="grid w-full gap-y-4 pt-10">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-stone-950">
          0. Raw 데이터 확인 및 전처리
        </h1>
      </div>

      {data && (
        <>
          <div>
            <DataTable
              columns={data.column_info.map((column) => {
                return {
                  header: column.column_name,
                  accessorKey: column.column_name
                }
              })}
              data={data.rows}
            />
            <h2 className="pt-10 font-bold text-zinc-600">데이터프레임 정보</h2>
            <p className="pb-3 pt-1 text-sm">
              크기: {data.dataframe_info.total_rows} x{' '}
              {data.dataframe_info.total_cols}
            </p>
            <DataTable
              columns={[
                { header: '컬럼명', accessorKey: 'column_name' },
                { header: '데이터타입', accessorKey: 'dtype' },
                { header: '결측치 개수', accessorKey: 'null_count' },
                {
                  header: '결측치 비율',
                  accessorKey: 'null_percentage',
                  cell: (data) => {
                    return data.row.getValue('null_percentage') + '%'
                  }
                }
              ]}
              data={data.column_info}
            />

            <h2 className="pt-10 font-bold text-zinc-600">
              데이터프레임 전처리
            </h2>
            <div className="grid w-full grid-cols-3 gap-2">
              <div>
                <Label htmlFor="encoding">encoding</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={CSVEncoding.CP949}>CP949</SelectItem>
                      <SelectItem value={CSVEncoding.ASCII}>ASCII</SelectItem>
                      <SelectItem value={CSVEncoding.UTF8}>UTF8</SelectItem>
                      <SelectItem value={CSVEncoding.UTF16}>UTF16</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="skip-row">skip row</Label>
                <Input
                  id="skip-row"
                  type="number"
                  placeholder="건너 뛸 row 수"
                />
              </div>
              <div>
                <Label htmlFor="encoding">Null 값 처리</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="interpolation">
                        interpolation
                      </SelectItem>
                      <SelectItem value="dropna">dropna</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="mt-10 w-full">전처리</Button>
          </div>
        </>
      )}
    </div>
  )
}

export default PreprocessingSection
