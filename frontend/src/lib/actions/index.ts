import fetcher from '@/lib/fetcher'
import type {
  AnalysisOptions,
  CSVEncoding,
  IntegrationCheckResult,
  ProcessedData,
  DataFrameInfo,
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
    .post<DataFrameInfo>('/data/raw/show-datafame', {
      file_path,
      file_name
    })
    .then((result) => result.data)
}

export const preprocessingData = async (
  file_path: string,
  file_name: string,
  encoding: CSVEncoding,
  null_method: 'dropna' | 'interpolation',
  skip_rows = 0
) => {
  return await fetcher
    .post<ProcessedData>('/data/preprocess', {
      file_path,
      file_name,
      encoding,
      null_method,
      skip_rows
    })
    .then((result) => result.data)
}

export const checkIntegrity = async (file_path: string) => {
  return await fetcher
    .post<IntegrationCheckResult>('/data/check-integrity', {
      file_path
    })
    .then((result) => result.data)
}

export const fetchVisualizationImage = async (
  file_path: string,
  visualization_type: VisualizationType,
  column: string
) => {
  return await fetcher
    .post(
      '/data/visualize/image',
      {
        file_path,
        visualization_type,
        column,
        columns: []
      },
      {
        responseType: 'blob'
      }
    )
    .then((result) => result.data)
}

export const fetchAnalysisImage = async (
  file_path: string,
  options: AnalysisOptions
) => {
  return await fetcher
    .post(
      '/data/analysis',
      {
        file_path,
        ...options
      },
      {
        responseType: 'blob'
      }
    )
    .then((result) => result.data)
}
