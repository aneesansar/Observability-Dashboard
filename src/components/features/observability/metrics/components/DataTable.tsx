interface TableColumn {
  key: string;
  label: string;
  className?: string;
}

interface DataTableProps {
  columns: TableColumn[];
  data: any[];
  className?: string;
}

export function DataTable({ columns, data, className = '' }: DataTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                className={`text-gray-900 h-10 px-2 text-left align-middle font-medium whitespace-nowrap ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 border-b transition-colors">
              {columns.map((column) => (
                <td 
                  key={column.key} 
                  className={`p-2 align-middle whitespace-nowrap ${column.className || ''}`}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
