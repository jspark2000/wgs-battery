import fetcher from '@/lib/fetcher'
import type {
  AnalysisOptions,
  IntegrationCheckResult,
  ProcessedData,
  RawDataFrame,
  VisualizationType
} from '@/types'

export const healthCheck = async (): Promise<{ message: string }> => {
  return await fetcher.get('/')
}

export const fetchFileList = async (
  data_path: string
): Promise<{ files: string[] }> => {
  return await fetcher
    .get(`/files/list?data_path=${data_path}`)
    .then((result) => result.data)
}

export const downloadCSV = async (data_path: string) => {
  const response = await fetcher.get(`/files/${data_path}/download`, {
    responseType: 'blob'
  })

  const blob = new Blob([response.data])
  const downloadUrl = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = 'data.csv'
  document.body.appendChild(link)
  link.click()

  window.URL.revokeObjectURL(downloadUrl)
  document.body.removeChild(link)
}

export const getRawDataFrameInfo = async (
  file_path: string,
  file_name: string
) => {
  return await fetcher
    .post<RawDataFrame>('/data/raw/show-datafame', {
      file_path,
      file_name
    })
    .then((result) => result.data)
}

export const preprocessingData = async (
  filePath: string,
  fileName: string,
  method = 'dropna'
) => {
  return await fetcher
    .post<ProcessedData>('/data/preprocess', {
      file_path: filePath,
      file_name: fileName,
      method
    })
    .then((result) => result.data)
}

export const checkIntegrity = async (
  filePath: string,
  fileName: string,
  method = 'dropna'
) => {
  return await fetcher
    .post<IntegrationCheckResult>('/data/check-integrity', {
      file_path: filePath,
      file_name: fileName,
      method
    })
    .then((result) => result.data)
}

export const fetchVisualizationImage = async (
  filePath: string,
  fileName: string,
  visualType: VisualizationType,
  column: string
) => {
  return await fetcher
    .post(
      '/data/visualize/image',
      {
        file_path: filePath,
        file_name: fileName,
        visualization_type: visualType,
        column: column,
        columns: []
      },
      {
        responseType: 'blob'
      }
    )
    .then((result) => result.data)
}

export const fetchAnalysisImage = async (
  filePath: string,
  fileName: string,
  options: AnalysisOptions
) => {
  return await fetcher
    .post(
      '/data/analysis',
      {
        file_path: filePath,
        file_name: fileName,
        ...options
      },
      {
        responseType: 'blob'
      }
    )
    .then((result) => result.data)
}
