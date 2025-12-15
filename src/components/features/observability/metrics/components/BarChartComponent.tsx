import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface BarChartComponentProps {
  data: any[];
  dataKey: string;
  xAxisDataKey: string;
  height?: number;
  fill?: string;
  angle?: number;
  className?: string;
}

export function BarChartComponent({ 
  data, 
  dataKey, 
  xAxisDataKey, 
  height = 200, 
  fill = '#3b82f6',
  angle = -45,
  className = ''
}: BarChartComponentProps) {
  return (
    <div className={`w-full h-[${height}px] ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisDataKey} 
            angle={angle} 
            textAnchor="end" 
            height={angle !== 0 ? 60 : undefined}
            tick={{ fontSize: 10 }}
          />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey={dataKey} fill={fill} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
