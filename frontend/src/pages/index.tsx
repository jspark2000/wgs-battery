import { Separator } from '@/components/ui/separator'
import type { RootState } from '@/store'
import { setTempFileUrl } from '@/store/setting-state-slice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AnalysisSection from './AnalysisSection'
import IntegrityTestSection from './IntegrityTestSection'
import PreprocessingSection from './PreprocessingSection'
import VisualizationSection from './VisualizationSection'

export default function MainPage() {
  const dispatch = useDispatch()
  const tempFileUrl = useSelector(
    (state: RootState) => state.setting.tempFileUrl
  )
  const currentFILE = useSelector(
    (state: RootState) => state.setting.currentFILE
  )

  useEffect(() => {
    dispatch(setTempFileUrl({ tempFileUrl: '' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFILE])

  return (
    <div className="mx-auto flex w-full max-w-screen-md flex-col pb-16">
      <img
        src="images/logo_1.png"
        className="mb-5 h-[200px] object-contain px-24"
      />
      <h1 className="text-center text-5xl font-bold italic text-stone-800">
        WGS Data Mining
      </h1>
      <p className="mt-4 text-center text-sm italic text-stone-400">
        데이터 전처리 및 분석 어플리케이션
      </p>
      <PreprocessingSection />
      <Separator className="mt-10" />
      {tempFileUrl && (
        <>
          <IntegrityTestSection tempFileUrl={tempFileUrl} />
          <VisualizationSection tempFileUrl={tempFileUrl} />
          <AnalysisSection tempFileUrl={tempFileUrl} />
        </>
      )}
    </div>
  )
}
