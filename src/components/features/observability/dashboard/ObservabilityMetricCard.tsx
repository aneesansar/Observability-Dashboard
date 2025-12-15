import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS } from '@/components/common/charts';
import type { ObservabilityMetricCardProps } from '@/types/components.types';

export default function ObservabilityMetricCard({
  title,
  subtitle,
  badgeLabel,
  badgeVariant,
  value,
  trendValue,
  trendDirection,
  trendText,
  icon,
  data,
  valueKey = 'value',
  borderColorClass,
  chartType = 'area',
}: ObservabilityMetricCardProps) {
  const isPositive = trendDirection === 'up';
  const trendColorClass = isPositive ? 'text-green-600' : 'text-red-600';

  const badgeBorderClass =
    badgeVariant === 'warning'
      ? 'border-yellow-500 text-yellow-700'
      : badgeVariant === 'success'
      ? 'border-green-500 text-green-700'
      : badgeVariant === 'info'
      ? 'border-blue-500 text-blue-700'
      : 'border-gray-300 text-gray-700';

  const areaColor =
    badgeVariant === 'warning'
      ? CHART_COLORS.warning
      : badgeVariant === 'success'
      ? CHART_COLORS.success
      : badgeVariant === 'info'
      ? CHART_COLORS.info
      : CHART_COLORS.primary;

  return (
    <div className={`bg-white text-gray-900 flex flex-col gap-6 rounded-xl border group cursor-pointer transition-shadow duration-200 hover:shadow-md ${borderColorClass ?? 'border-gray-200'}`}>
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-1.5 rounded-full bg-primary/10">
                <span className="h-4 w-4 text-primary flex items-center justify-center">
                  {icon}
                </span>
              </div>
            )}
            <div className="flex flex-col items-start text-left">
              <h3 className="font-medium text-sm text-gray-700">{title}</h3>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          {badgeLabel && (
            <span
              className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs h-5 ${badgeBorderClass}`}
            >
              {badgeLabel}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 space-y-3">
        <div className="text-left">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {trendValue !== undefined && trendText && (
            <div className={`flex items-center gap-1 text-sm ${trendColorClass}`}>
              <span>{isPositive ? '+' : '-'}{trendValue}</span>
              <span className="text-xs text-gray-500">{trendText}</span>
            </div>
          )}
        </div>
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={data}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barCategoryGap={8}
                barGap={2}
              >
                <Tooltip
                  cursor={{ fill: 'rgba(148, 163, 184, 0.15)' }}
                  contentStyle={{
                    margin: 0,
                    padding: '4px 8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 4,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                  }}
                />
                <Bar
                  dataKey={valueKey}
                  fill={areaColor}
                  radius={[2, 2, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            ) : (
              <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    margin: 0,
                    padding: '4px 8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 4,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={valueKey}
                  stroke={CHART_COLORS.primary}
                  fill="url(#miniGradient)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
