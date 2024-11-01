import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import DefaultLayout from './components/layouts/DefaultLayout'
import { fetchFileList } from './lib/actions'
import MainPage from './pages'
import type { RootState } from './store'
import { setCurrentFile, setFileList } from './store/setting-state-slice'

function App() {
  const dispatch = useDispatch()
  const dataPath = useSelector((state: RootState) => state.setting.currentDIR)

  useEffect(() => {
    const fetchFileListData = async () => {
      const result = await fetchFileList(dataPath)
      dispatch(setFileList({ fileList: result.files }))
      dispatch(setCurrentFile({ currentFile: undefined }))
      toast.success('File List Updated')
    }

    fetchFileListData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPath])

  const ScrollToTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [pathname])

    return null
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<MainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
