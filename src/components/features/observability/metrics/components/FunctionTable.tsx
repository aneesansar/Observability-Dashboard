import { formatShortNumber, formatDuration } from '@/utils/format';

interface FunctionData {
  name: string;
  calls: number;
  avgDurationSeconds: number | null;
}

interface FunctionTableProps {
  functions: FunctionData[];
  totalFunctionCalls: number;
  className?: string;
}

export function FunctionTable({ functions, totalFunctionCalls, className = '' }: FunctionTableProps) {
  const columns = [
    { key: 'name', label: 'Function Name', className: 'font-mono text-sm' },
    { key: 'calls', label: 'Calls', className: 'font-medium' },
    { key: 'avgDuration', label: 'Avg Duration', className: 'font-mono text-sm' },
    { key: 'totalDuration', label: 'Total Duration', className: 'font-mono text-sm' },
    { key: 'percentage', label: '%', className: 'text-gray-500' },
    { key: 'impact', label: 'Impact' }
  ];

  const tableData = functions.map((func) => {
    const percentage = totalFunctionCalls > 0 ? (func.calls / totalFunctionCalls * 100).toFixed(1) : '0.0';
    const impact = func.calls > 1000000 ? 'High' : func.calls > 1000 ? 'Medium' : 'Low';
    const impactColor = impact === 'High' ? 'bg-red-500' : impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500';
    const avgDuration = func.avgDurationSeconds ? func.avgDurationSeconds * 1000 : 0; // Convert to ms
    const totalDuration = avgDuration * func.calls;

    return {
      name: func.name,
      calls: formatShortNumber(func.calls),
      avgDuration: formatDuration(avgDuration),
      totalDuration: formatDuration(totalDuration),
      percentage: `${percentage}%`,
      impact: (
        <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 text-white border-transparent ${impactColor}`}>
          {impact}
        </span>
      )
    };
  });

  return (
    <div className={className}>
      <div className="overflow-x-auto">
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
            {tableData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b transition-colors">
                <td className="p-2 align-middle whitespace-nowrap font-mono text-sm">{row.name}</td>
                <td className="p-2 align-middle whitespace-nowrap font-medium">{row.calls}</td>
                <td className="p-2 align-middle whitespace-nowrap font-mono text-sm">{row.avgDuration}</td>
                <td className="p-2 align-middle whitespace-nowrap font-mono text-sm">{row.totalDuration}</td>
                <td className="p-2 align-middle whitespace-nowrap text-gray-500">{row.percentage}</td>
                <td className="p-2 align-middle whitespace-nowrap">{row.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
