import type { BadgeColorMap } from '@/types';

export const BADGE_COLORS: Readonly<BadgeColorMap> = {
  success: "border-green-500 text-green-700 bg-green-50",
  warning: "border-yellow-500 text-yellow-700 bg-yellow-50",
  info: "border-blue-500 text-blue-700 bg-blue-50",
  error: "border-red-500 text-red-700 bg-red-50",
} as const;

export const DEFAULT_BORDER_COLOR = "border-gray-200" as const;
export const ICON_BACKGROUND_COLOR = "rgba(33, 82, 228, 0.125)" as const;
