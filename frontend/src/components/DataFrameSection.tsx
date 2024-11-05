import type { DataFrameInfo } from '@/types'
import { DataTable } from './ui/data-table'

interface Props {
  dataframe?: DataFrameInfo
}

const DataFrameSection: React.FC<Props> = ({ dataframe }) => {
  return (
    <>
      {dataframe && (
        <div>
          <h2 className="pb-1.5 font-bold text-zinc-600">
            데이터프레임 미리보기
          </h2>
          <DataTable
            columns={dataframe.column_info.map((column) => {
              return {
                header: column.column_name,
                accessorKey: column.column_name
              }
            })}
            data={dataframe.rows}
          />
          <h2 className="pt-8 font-bold text-zinc-600">데이터프레임 정보</h2>
          <p className="pb-1.5 pt-1 text-sm">
            크기: {dataframe.dataframe_info.total_rows} x{' '}
            {dataframe.dataframe_info.total_cols}
          </p>
          <DataTable
            columns={[
              { header: '컬럼명', accessorKey: 'column_name' },
              { header: '데이터타입', accessorKey: 'dtype' },
              { header: '결측치 개수', accessorKey: 'null_count' },
              {
                header: '결측치 비율',
                accessorKey: 'null_percentage',
                cell: (cell) => {
                  return cell.row.getValue('null_percentage') + '%'
                }
              }
            ]}
            data={dataframe.column_info}
          />
        </div>
      )}
    </>
  )
}

export default DataFrameSection
