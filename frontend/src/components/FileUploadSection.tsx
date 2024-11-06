import fetcher from '@/lib/fetcher'
import type { RootState } from '@/store'
import { setFileList } from '@/store/setting-state-slice'
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid'
import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from './ui/button'

const FileUploadComponent = () => {
  const dispatch = useDispatch()
  const currentDIR = useSelector((state: RootState) => state.setting.currentDIR)
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = async (file: File) => {
    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetcher
        .post<{ files: string[] }>(
          `/files/upload?file_path=${currentDIR}&file_name=${file.name}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0
              console.log(`Upload Progress: ${progress}%`)
            }
          }
        )
        .then((result) => result.data)

      if (response.files) {
        toast.success('파일이 성공적으로 업로드되었습니다.')
        dispatch(setFileList({ fileList: response.files }))
        setFile(null)
      } else {
        throw new Error('업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('업로드 과정 중 오류 발생')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      if (files[0].size > 200 * 1024 * 1024) {
        toast.error('파일 크기는 200MB를 초과할 수 없습니다.')
        return
      }
      setFile(files[0])
    }
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files[0]) {
        if (files[0].size > 200 * 1024 * 1024) {
          toast.error('파일 크기는 200MB를 초과할 수 없습니다.')
          return
        }
        setFile(files[0])
      }
    },
    []
  )

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <div className="col-span-full">
        <label className="mb-1.5 text-xs font-normal">파일 업로드</label>
        <div
          className={`mt-2 flex justify-center rounded-lg border-2 bg-white px-6 py-5 ${isDragging ? 'border-dashed border-stone-400' : 'border-stone-200'} ${file ? 'border-green-500' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <DocumentArrowUpIcon
              aria-hidden="true"
              className={`mx-auto h-8 w-8 ${file ? 'text-green-500' : 'text-stone-900'}`}
            />
            {!file && (
              <div className="mt-4 flex text-xs text-stone-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-stone-600 hover:text-stone-500"
                >
                  <span>파일 선택</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileInput}
                  />
                </label>
                <p className="pl-1 text-xs">또는 드래그앤 드롭</p>
              </div>
            )}
            {file ? (
              <>
                <p className="my-2 text-sm text-green-500">{file.name}</p>
                <Button disabled={isUploading} onClick={() => uploadFile(file)}>
                  업로드
                </Button>
              </>
            ) : (
              <p className="text-xs leading-5 text-stone-400">최대 200MB</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUploadComponent
