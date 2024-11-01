import { Button } from '@/components/ui/button'
import { fetchAnalysisImage } from '@/lib/actions'
import type { RootState } from '@/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface Props {
  tempFileUrl?: string
}

const AnalysisSection: React.FC<Props> = ({ tempFileUrl }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [image, setImage] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { currentFILE, currentDIR, selectedMethods } = useSelector(
    (state: RootState) => state.setting
  )
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setImage(null)
    setLoading(false)
    setSuccess(false)
  }, [currentFILE, currentDIR])

  const handleClick = async () => {
    if (!currentFILE) return

    try {
      setLoading(true)
      setSuccess(false)
      const response = await fetchAnalysisImage(currentDIR, currentFILE, {
        use_z_score:
          selectedMethods.filter((item) => item === 'z-score').length !== 0,
        use_pca: selectedMethods.filter((item) => item === 'pca').length !== 0,
        use_autoencoder:
          selectedMethods.filter((item) => item === 'autoencoder').length !== 0
      })

      const imageUrl = URL.createObjectURL(response)
      setImage(imageUrl)
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
        3. Data Analysis
      </h2>
      <p className="text-xs text-stone-400">
        사이드바에서 분석 방법을 선택해주세요
      </p>
      {success && (
        <div className="mt-5 w-full rounded-md bg-green-100/60 px-5 py-3 font-semibold text-green-600">
          Analizing Successfully Finished
        </div>
      )}
      {tempFileUrl && (
        <div className="grid gap-y-2">
          {image && (
            <div className="mt-1">
              <img
                src={image}
                alt="Generated Visualization"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}
          <Button
            onClick={() => handleClick()}
            disabled={loading}
            className="mt-5"
          >
            Analysis
          </Button>
        </div>
      )}
    </div>
  )
}

export default AnalysisSection
