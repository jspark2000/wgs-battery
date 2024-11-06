import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { fetchVisualizationImage } from '@/lib/actions'
import type { RootState } from '@/store'
import { VisualizationType } from '@/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface Props {
  tempFileUrl?: string
}

const VisualizationSection: React.FC<Props> = ({ tempFileUrl }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [image, setImage] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [visualType, setVisualType] = useState<VisualizationType>(
    VisualizationType.LINE
  )
  const setting = useSelector((state: RootState) => state.setting)
  const csvColumns = useSelector((state: RootState) => state.setting.csvColumns)
  const [column, setColumn] = useState<string>('')

  useEffect(() => {
    setColumn('')
    setImage(null)
    setLoading(false)
  }, [setting.currentDIR, setting.currentFILE, setting.tempFileUrl])

  const handleClick = async () => {
    if (!setting.tempFileUrl) return

    try {
      setLoading(true)

      const response = await fetchVisualizationImage(
        setting.tempFileUrl,
        setting.encoding,
        visualType,
        column
      )

      const imageUrl = URL.createObjectURL(response)
      setImage(imageUrl)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const cleanupImage = () => {
    if (image) {
      URL.revokeObjectURL(image)
    }
  }

  useEffect(() => {
    return () => cleanupImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image])

  return (
    <div className="flex w-full flex-col py-5">
      <h2 className="mb-2 text-2xl font-semibold text-stone-800">
        2. 데이터 시각화
      </h2>
      {tempFileUrl && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-5">
          <Label className="text-xs text-stone-600">차트 종류</Label>
          <Label className="text-xs text-stone-600">컬럼</Label>
          <Select
            value={visualType}
            onValueChange={(value) => setVisualType(value as VisualizationType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="시각화 타입" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>선 그래프</SelectLabel>
                <SelectItem value={VisualizationType.LINE}>
                  Line Plot
                </SelectItem>
                <SelectItem value={VisualizationType.CONTROL}>
                  Control Chart
                </SelectItem>
                <SelectItem value={VisualizationType.PARETO}>
                  Pareto Chart
                </SelectItem>
                <SelectItem value={VisualizationType.FFT}>FFT</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>기타</SelectLabel>
                <SelectItem value={VisualizationType.SPECTOGRAM}>
                  Spectogram
                </SelectItem>
                <SelectItem value={VisualizationType.HISTOGRAM}>
                  Histogram
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={column} onValueChange={(value) => setColumn(value)}>
            <SelectTrigger>
              <SelectValue placeholder="컬럼을 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {csvColumns.map((col) => {
                return (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleClick()}
            className="col-span-2 mt-5"
            disabled={loading || !column}
          >
            시각화 하기
          </Button>
        </div>
      )}
      {image && (
        <div className="mt-4">
          <img
            src={image}
            alt="Generated Visualization"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  )
}

export default VisualizationSection
