import { useState } from 'react';
import { ChartColumnIcon, ChartPieIcon, GlobeIcon } from 'lucide-react';
import { BarChartComponent } from './BarChartComponent';
import { PieChartComponent } from './PieChartComponent';
import { SubTabNavigation } from './SubTabNavigation';
import { formatShortNumber } from '@/utils/format';

interface HttpRequestData {
  handler: string;
  requests: number;
}

interface StatusCodeData {
  code: string;
  count: number;
  percentage: string;
}

interface HttpMethodData {
  method: string;
  count: number;
}

interface HttpRequestsSectionProps {
  totalRequests: number;
  httpRequestsData: HttpRequestData[];
  statusCodesData: StatusCodeData[];
  httpMethodsData: HttpMethodData[];
  className?: string;
}

export function HttpRequestsSection({ 
  totalRequests, 
  httpRequestsData, 
  statusCodesData, 
  httpMethodsData,
  className = ''
}: HttpRequestsSectionProps) {
  const [httpSubTab, setHttpSubTab] = useState('handlers');

  const subTabs = [
    { id: 'handlers', label: 'Handlers', icon: <ChartColumnIcon className="h-3 w-3" /> },
    { id: 'status', label: 'Status', icon: <ChartPieIcon className="h-3 w-3" /> },
    { id: 'methods', label: 'Methods', icon: <ChartColumnIcon className="h-3 w-3" /> }
  ];

  const COLORS = {
    blue: '#3b82f6',
    green: '#34C759',
    orange: '#f97316',
    red: '#ef4444',
    purple: '#7c26a6',
    gray: '#6b7280'
  };

  return (
    <div className={`bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 ${className}`}>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
        <h4 className="text-base font-medium">HTTP Requests</h4>
        <GlobeIcon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="px-6 pb-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatShortNumber(totalRequests)}</div>
            <div className="text-sm text-gray-500">Total Requests</div>
          </div>
          
          <SubTabNavigation 
            subTabs={subTabs}
            activeSubTab={httpSubTab}
            onSubTabChange={setHttpSubTab}
          />
          
          <div className="flex-1 outline-none">
            {httpSubTab === 'handlers' && (
              <BarChartComponent 
                data={httpRequestsData}
                dataKey="requests"
                xAxisDataKey="handler"
                height={150}
                fill={COLORS.blue}
                angle={-45}
              />
            )}
            
            {httpSubTab === 'status' && (
              <div className="w-full h-[150px] flex flex-col items-center justify-center">
                <PieChartComponent
                  data={statusCodesData}
                  dataKey="count"
                  nameKey="code"
                  height={120}
                  innerRadius={30}
                  outerRadius={50}
                  colors={[COLORS.purple, COLORS.blue, COLORS.gray, COLORS.gray]}
                  showLegend={false}
                />
                {/* Legend */}
                <div className="flex justify-center gap-4 text-xs mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-600 rounded"></div>
                    <span>2xx</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded"></div>
                    <span>4xx</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded"></div>
                    <span>Other</span>
                  </div>
                </div>
              </div>
            )}
            
            {httpSubTab === 'methods' && (
              <BarChartComponent 
                data={httpMethodsData}
                dataKey="count"
                xAxisDataKey="method"
                height={150}
                fill={COLORS.green}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
