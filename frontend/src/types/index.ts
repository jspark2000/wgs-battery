export interface SettingState {
  currentDIR: string
  currentFILE?: string
  fileList: string[]
  selectedMethods: string[]
  csvColumns: string[]
}

export interface DataFrameRow {
  [key: string]: string | number | boolean | null | Date
}

export interface DataFrame {
  shape: number[]
  columns: string[]
  rows: DataFrameRow[]
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
