import type { SettingState } from '@/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState: SettingState = {
  currentDIR: 'data',
  currentFILE: undefined,
  selectedMethods: [],
  fileList: [],
  csvColumns: []
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
    }
  }
})

export const {
  setCurrentDIR,
  setCurrentFile,
  setSelectedMethods,
  setFileList,
  setCsvColumns
} = settingStateSlice.actions

export default settingStateSlice.reducer
