import type { ReactNode } from "react";

/**
 * Badge variant types for StatsCard component
 */
export type BadgeVariant = "success" | "warning" | "info" | "error";

/**
 * Trend indicator configuration for StatsCard
 */
export interface TrendConfig {
  readonly value: string;
  readonly isPositive: boolean;
  readonly label?: string;
}

/**
 * Badge configuration for StatsCard
 */
export interface BadgeConfig {
  readonly label: string;
  readonly variant: BadgeVariant;
}

/**
 * Props for the StatsCard component
 */
export interface StatsCardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly value: string | number;
  readonly icon: ReactNode;
  readonly trend?: TrendConfig;
  readonly badge?: BadgeConfig;
  readonly borderColor?: string;
}

/**
 * Badge color mapping for different variants
 */
export type BadgeColorMap = Record<BadgeVariant, string>;
