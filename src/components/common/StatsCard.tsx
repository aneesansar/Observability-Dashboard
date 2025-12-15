import type { FC } from "react";
import type { StatsCardProps } from "@/types";
import {
  DEFAULT_BORDER_COLOR,
  ICON_BACKGROUND_COLOR,
} from "./StatsCard.constants";

/**
 * StatsCard Component
 * 
 * A reusable statistics card component for displaying metrics with icons,
 * badges, and trend indicators.
 * 
 * @param props - StatsCard component props
 * @returns Rendered stats card component
 */
const StatsCard: FC<StatsCardProps> = ({
  title,
  subtitle,
  value,
  icon,
  trend,
  borderColor = DEFAULT_BORDER_COLOR,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border ${borderColor} group cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col h-full`}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-start gap-2">
          <div
            className="p-1.5 rounded-full shrink-0"
            style={{ backgroundColor: ICON_BACKGROUND_COLOR }}
          >
            <div className="h-4 w-4 text-primary">{icon}</div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm text-gray-600 text-left">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500 text-left">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        <div className="flex flex-col items-start">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                    <polyline points="16 17 22 17 22 11"></polyline>
                  </svg>
                )}
                <span>{trend.value}</span>
                {trend.label && (
                  <span className="text-xs text-gray-500">{trend.label}</span>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
