import { CSVEncoding, type SettingState } from '@/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState: SettingState = {
  currentDIR: 'data',
  currentFILE: undefined,
  selectedMethods: [],
  fileList: [],
  csvColumns: [],
  encoding: CSVEncoding.CP949,
  skipRows: 0,
  nullMethod: 'dropna',
  tempFileUrl: undefined
}

const settingStateSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setCurrentDIR: (origin, action: PayloadAction<{ currentDIR: string }>) => {
      return {
        ...origin,
        currentDIR: action.payload.currentDIR
      }
    },
    setCurrentFile: (
      origin,
      action: PayloadAction<{ currentFile?: string }>
    ) => {
      return {
        ...origin,
        currentFILE: action.payload.currentFile
      }
    },
    setSelectedMethods: (
      origin,
      action: PayloadAction<{ seletedMethods: string[] }>
    ) => {
      return {
        ...origin,
        selectedMethods: [...action.payload.seletedMethods]
      }
    },
    setFileList: (origin, action: PayloadAction<{ fileList: string[] }>) => {
      return {
        ...origin,
        fileList: [...action.payload.fileList]
      }
    },
    setCsvColumns: (
      origin,
      action: PayloadAction<{ csvColumns: string[] }>
    ) => {
      return {
        ...origin,
        csvColumns: [...action.payload.csvColumns]
      }
    },
    setEncoding: (origin, action: PayloadAction<{ encoding: CSVEncoding }>) => {
      return {
        ...origin,
        encoding: action.payload.encoding
      }
    },
    setSkipRows: (origin, action: PayloadAction<{ skipRows: number }>) => {
      return {
        ...origin,
        skipRows: action.payload.skipRows
      }
    },
    setNullMethod: (
      origin,
      action: PayloadAction<{ nullMethod: 'dropna' | 'interpolation' }>
    ) => {
      return {
        ...origin,
        nullMethod: action.payload.nullMethod
      }
    },
    setTempFileUrl: (
      origin,
      action: PayloadAction<{ tempFileUrl: string }>
    ) => {
      return {
        ...origin,
        tempFileUrl: action.payload.tempFileUrl
      }
    }
  }
})

export const {
  setCurrentDIR,
  setCurrentFile,
  setSelectedMethods,
  setFileList,
  setCsvColumns,
  setNullMethod,
  setEncoding,
  setTempFileUrl,
  setSkipRows
} = settingStateSlice.actions

export default settingStateSlice.reducer
