/**
 * Chart Color Constants
 * 
 * Centralized color definitions for all charts to ensure consistency
 * with the application's design system from index.css.
 * 
 * Application colors:
 * - primary: rgb(34 89 230) = #2259E6
 * - secondary: rgb(107 110 128) = #6B6E80
 * - secondary-500: rgb(192 147 74) = #C0934A (gold)
 * - lavender: rgb(209 217 229) = #D1D9E5
 * - light-blue: rgb(194 222 229) = #C2DEE5
 * - mimi-pink: rgb(242 219 227) = #F2DBE3
 * - parchment: rgb(242 232 207) = #F2E8CF
 * - mint-green: rgb(207 235 232) = #CFEBE8
 * - slate-gray: rgb(117 125 140) = #757D8C
 * - charcoal: rgb(51 61 77) = #333D4D
 * - rich-black: rgb(15 23 31) = #0F171F
 * - gradient-brand: #2152E4 to #7C26A6
 */

export const CHART_COLORS = {
  // Primary application colors
  primary: '#2259E6',       // primary - main brand blue
  primaryDark: '#2152E4',   // gradient start
  purple: '#7C26A6',        // gradient end - purple accent
  
  // Semantic status colors (using app palette)
  success: '#22c55e',       // green for positive/success states
  error: '#ef4444',         // red for negative/error states
  warning: '#C0934A',       // secondary-500 gold for warnings/running
  info: '#2259E6',          // primary blue for info states
  
  // Application palette colors
  mintGreen: '#CFEBE8',     // mint-green - soft success
  lightBlue: '#C2DEE5',     // light-blue - soft info
  mimiPink: '#F2DBE3',      // mimi-pink - soft accent
  parchment: '#F2E8CF',     // parchment - soft warning
  lavender: '#D1D9E5',      // lavender - neutral
  
  // Neutrals
  slateGray: '#757D8C',     // slate-gray
  charcoal: '#333D4D',      // charcoal
  richBlack: '#0F171F',     // rich-black
} as const;

// Feedback chart specific colors
export const FEEDBACK_COLORS = {
  positive: CHART_COLORS.success,
  negative: CHART_COLORS.error,
  pending: CHART_COLORS.warning,      // gold for pending
  reviewed: CHART_COLORS.primary,     // primary blue for reviewed
} as const;

// Pipeline chart specific colors
export const PIPELINE_COLORS = {
  completed: CHART_COLORS.success,
  failed: CHART_COLORS.error,
  running: CHART_COLORS.primary,      // primary blue for running
  total: CHART_COLORS.purple,         // purple accent for total
} as const;

// Document chart specific colors
export const DOCUMENT_COLORS = {
  ingested: CHART_COLORS.primary,     // primary blue for ingested
  processed: CHART_COLORS.success,    // green for processed
  failed: CHART_COLORS.error,         // red for failed
} as const;
