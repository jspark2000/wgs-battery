import type { RootState } from '@/store'
import {
  setCurrentDIR,
  setCurrentFile,
  setSelectedMethods
} from '@/store/setting-state-slice'
import { AnalysisMethod } from '@/types'
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { Sidebar, SidebarContent, SidebarSeparator } from './ui/sidebar'

export function AppSidebar() {
  const dispatch = useDispatch()
  const fileList = useSelector((state: RootState) => state.setting.fileList)
  const currentDIR = useSelector((state: RootState) => state.setting.currentDIR)
  const selectedMethods = useSelector(
    (state: RootState) => state.setting.selectedMethods
  )
  const selectedFile = useSelector(
    (state: RootState) => state.setting.currentFILE
  )
  const [dir, setDir] = useState('')
  const updateDataPath = () => {
    dispatch(setCurrentDIR({ currentDIR: dir }))
    setDir('')
  }
  const updateSelectedFile = (filename: string) => {
    dispatch(setCurrentFile({ currentFile: filename }))
  }
  const updateSelectedMethods = (methods: string[]) => {
    dispatch(setSelectedMethods({ seletedMethods: methods }))
  }

  const methods = [
    {
      id: 'anomaly',
      label: 'Feature based Anomaly Scoring',
      value: AnalysisMethod.Anomaly
    },
    {
      id: 'impact-factor',
      label: 'Impact Factor',
      value: AnalysisMethod.ImpactFactor
    },
    { id: 'mscred', label: 'MSCRED', value: AnalysisMethod.MSCRED },
    { id: 'if', label: 'IF', value: AnalysisMethod.IF },
    { id: 'rrcf', label: 'RRCF', value: AnalysisMethod.RRCF }
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex w-full flex-col space-y-5 px-4 py-5">
          <img
            src="./images/logo_2.png"
            className="my-5 h-14 w-auto object-contain"
          />
          <h4 className="text-lg font-semibold">파일 관리 및 설정</h4>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="cur" className="text-xs font-normal">
              현재 폴더 경로
            </Label>
            <Input id="cur" value={currentDIR} disabled />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="folder_path" className="text-xs font-normal">
              변경할 폴더 경로
            </Label>
            <Input
              id="folder_path"
              value={dir}
              onChange={(e) => setDir(e.target.value)}
            />
            <div className="mt-1 grid w-full gap-1.5">
              <Button
                className="text-xs font-semibold"
                onClick={() => updateDataPath()}
              >
                변경하기
              </Button>
              {/* <Button className="text-xs font-semibold" variant={'outline'}>
                Merge
              </Button> */}
            </div>
          </div>

          <SidebarSeparator />

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="files" className="text-xs font-normal">
              현재 폴더 내 파일 선택
            </Label>
            <Select
              value={selectedFile}
              onValueChange={(e) => updateSelectedFile(e)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    fileList.length > 0 ? '파일 선택' : '폴더가 비어있습니다'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>파일목록</SelectLabel>
                  {fileList.map((file, index) => {
                    return (
                      <SelectItem key={index} value={file}>
                        {file}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <SidebarSeparator />

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <div className="col-span-full">
              <Label className="mb-1.5 text-xs font-normal">파일 업로드</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-stone-200 bg-white px-6 py-5">
                <div className="text-center">
                  <DocumentArrowUpIcon
                    aria-hidden="true"
                    className="mx-auto h-8 w-8 text-stone-900"
                  />
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
                      />
                    </label>
                    <p className="pl-1 text-xs">또는 드래그앤 드랍</p>
                  </div>
                  <p className="text-xs leading-5 text-stone-400">최대 200MB</p>
                </div>
              </div>
            </div>
          </div>

          <SidebarSeparator />

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label className="mb-1.5 text-xs font-normal">분석 방법 선택</Label>
            {methods.map((method) => (
              <div key={method.id} className="flex items-center space-x-2">
                <Checkbox
                  className="rounded-sm"
                  id={method.id}
                  checked={selectedMethods.includes(method.value)}
                  onCheckedChange={(checked) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    checked
                      ? updateSelectedMethods([
                          ...selectedMethods,
                          method.value
                        ])
                      : updateSelectedMethods(
                          selectedMethods.filter(
                            (item) => item !== method.value
                          )
                        )
                  }}
                />
                <label
                  htmlFor={method.id}
                  className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {method.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
