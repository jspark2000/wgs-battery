import DataFrameSection from '@/components/DataFrameSection'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
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
import {
  downloadCSV,
  getRawDataFrameInfo,
  preprocessingData
} from '@/lib/actions'
import type { RootState } from '@/store'
import {
  setCsvColumns,
  setEncoding,
  setNullMethod,
  setSkipRows,
  setTempFileUrl
} from '@/store/setting-state-slice'
import { CSVEncoding, type DataFrameInfo, type ProcessedData } from '@/types'
import { FileDownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const PreprocessingSection: React.FC = () => {
  const dispatch = useDispatch()
  const {
    currentFILE,
    currentDIR,
    nullMethod,
    encoding,
    skipRows,
    tempFileUrl
  } = useSelector((state: RootState) => state.setting)
  const [data, setData] = useState<DataFrameInfo>()
  const [processedData, setProcessedData] = useState<ProcessedData>()
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (currentFILE) {
        const result = await getRawDataFrameInfo(currentDIR, currentFILE)
        setData(result)
        setProcessedData(undefined)

        if (result) {
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

  const handleClick = async () => {
    if (!currentFILE) return

    try {
      setIsFetching(true)

      const result = await preprocessingData(
        currentDIR,
        currentFILE,
        encoding,
        nullMethod,
        skipRows
      )

      setProcessedData(result)
      dispatch(setTempFileUrl({ tempFileUrl: result.temp_file_name }))
      dispatch(
        setCsvColumns({
          csvColumns: result.info.column_info.map((col) => col.column_name)
        })
      )
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleDownload = async () => {
    if (!tempFileUrl) return

    await downloadCSV(
      tempFileUrl,
      `${currentFILE?.split('.')[0]}_preprocessed.csv`
    )
  }

  return (
    <div className="grid w-full pt-10">
      <div className="mb-5 flex justify-between">
        <h1 className="text-2xl font-semibold text-stone-950">
          0. Raw 데이터 확인 및 전처리
        </h1>
      </div>

      <DataFrameSection dataframe={data} />

      <h2 className="pt-10 font-bold text-zinc-600">전처리 방법 선택</h2>

      <div className="grid w-full grid-cols-3 gap-2">
        <div>
          <Label htmlFor="encoding">encoding</Label>
          <Select
            defaultValue={encoding}
            onValueChange={(value) =>
              dispatch(setEncoding({ encoding: value as CSVEncoding }))
            }
          >
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
            defaultValue={0}
            onChange={(event) =>
              dispatch(
                setSkipRows({ skipRows: parseInt(event.target.value, 10) })
              )
            }
          />
        </div>
        <div>
          <Label htmlFor="encoding">Null 값 처리</Label>
          <Select
            defaultValue={nullMethod}
            onValueChange={(value) =>
              dispatch(
                setNullMethod({
                  nullMethod: value as 'interpolation' | 'dropna'
                })
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="interpolation">interpolation</SelectItem>
                <SelectItem value="dropna">dropna</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-5">
        <Button
          disabled={isFetching}
          onClick={() => handleClick()}
          className="w-full"
        >
          전처리
        </Button>
        {typeof processedData !== 'undefined' && (
          <Dialog>
            <DialogTrigger>
              <Button
                disabled={typeof processedData === 'undefined'}
                className="w-full"
                variant={'outline'}
              >
                전처리 결과보기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>전처리 결과</DialogTitle>
                <DialogDescription>
                  encoding: {encoding}, skip_rows: {skipRows}, null:{' '}
                  {nullMethod}
                </DialogDescription>
              </DialogHeader>
              <div>
                <div className="mb-5 flex items-center justify-between rounded-md border border-zinc-400/80 px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <FileDownIcon className="h-8 w-auto text-zinc-600" />
                    <p>{currentFILE?.split('.')[0]}_preprocessed.csv</p>
                  </div>
                  <Button onClick={() => handleDownload()} variant={'outline'}>
                    다운로드
                  </Button>
                </div>
                <DataFrameSection dataframe={processedData?.info} />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button">창닫기</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

export default PreprocessingSection
