export interface SettingState {
  currentDIR: string
  currentFILE?: string
  fileList: string[]
  selectedMethods: string[]
  csvColumns: string[]
  encoding: CSVEncoding
  skipRows: number
  nullMethod: 'dropna' | 'interpolation'
}

export interface DataFrame {
  shape: number[]
  columns: string[]
  rows: TableRow[]
}

export interface RawDataFrame {
  column_info: DataFrameColumnInfo[]
  dataframe_info: {
    total_rows: number
    total_cols: number
  }
  rows: TableRow[]
}

export interface DataFrameColumnInfo {
  column_name: string
  dtype: string
  non_null_count: number
  null_count: number
  null_percnetage: number
}

export interface TableRow {
  [key: string]: string | number | boolean | null | Date
}

export interface ProcessedData {
  origin: DataFrame
  processed: DataFrame
  temp_file_name: string
}

export interface IntegrationCheckResult {
  no_duplicates: boolean
  no_missing: boolean
  valid_types: boolean
  range_issues: {
    [key: string]: string
  }
  type_issues: {
    [key: string]: string
  }
}

export enum VisualizationType {
  LINE = 'Line Plot',
  CONTROL = 'Control Chart',
  PARETO = 'Pareto Chart',
  SCATTER = 'Scatter Plot',
  SPECTOGRAM = 'Spectogram',
  HISTOGRAM = 'Histogram',
  FFT = 'FFT'
}

export interface AnalysisOptions {
  use_z_score: boolean
  use_pca: boolean
  use_autoencoder: boolean
}

export enum CSVEncoding {
  CP949 = 'CP949',
  EUCKR = 'EUCKR',
  UTF16 = 'UTF16',
  UTF8 = 'UTF8',
  ASCII = 'ASCII'
}
