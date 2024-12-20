import fetcher from '@/lib/fetcher'
import type {
  AnalysisOptions,
  CSVEncoding,
  IntegrationCheckResult,
  ProcessedData,
  DataFrameInfo,
  VisualizationType,
  TableRow
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

export const downloadCSV = async (file_path: string, new_file_name: string) => {
  const response = await fetcher.post(
    `/files/preprocessed/download`,
    { file_path, new_file_name },
    {
      responseType: 'blob'
    }
  )

  const blob = new Blob([response.data])
  const downloadUrl = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = new_file_name
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

export const checkIntegrity = async (
  file_path: string,
  encoding: CSVEncoding
) => {
  return await fetcher
    .post<IntegrationCheckResult>('/data/check-integrity', {
      file_path,
      encoding
    })
    .then((result) => result.data)
}

export const fetchVisualizationImage = async (
  file_path: string,
  encoding: CSVEncoding,
  visualization_type: VisualizationType,
  column: string
) => {
  return await fetcher
    .post(
      '/data/visualize/image',
      {
        file_path,
        visualization_type,
        encoding,
        column
      },
      {
        responseType: 'blob'
      }
    )
    .then((result) => result.data)
}

export const analysisImpulseFactor = async (
  file_path: string,
  encoding: CSVEncoding
) => {
  return await fetcher
    .post<TableRow>('/analysis/impulse_factor/calculate', {
      file_path,
      encoding
    })
    .then((result) => result.data)
}

export const analysisAnomalyScore = async (
  file_path: string,
  encoding: CSVEncoding
) => {
  return await fetcher
    .post<TableRow>('/analysis/anomaly_score/calculate', {
      file_path,
      encoding
    })
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
