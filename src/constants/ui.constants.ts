/**
 * UI Constants
 * 
 * Centralized UI-related constants for the application.
 */

/**
 * Component Display Constants
 */
export const SKELETON_COUNT = 4 as const;
export const DEFAULT_PAGE_SIZE = 100 as const;
export const DEFAULT_REFRESH_TRIGGER = 0 as const;

/**
 * Form Validation Constants
 */
export const MAX_FEEDBACK_LENGTH = 500 as const;
export const MIN_FEEDBACK_LENGTH = 10 as const;

/**
 * Timeout Constants
 */
export const DEFAULT_TIMEOUT = 5000 as const;
export const DEBOUNCE_DELAY = 300 as const;

/**
 * Badge Variants
 */
export const BADGE_VARIANTS = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
} as const;

/**
 * Badge Colors (Tailwind classes)
 */
export const BADGE_COLORS = {
  success: 'border-green-500 text-green-700 bg-green-50',
  warning: 'border-yellow-500 text-yellow-700 bg-yellow-50',
  info: 'border-blue-500 text-blue-700 bg-blue-50',
  error: 'border-red-500 text-red-700 bg-red-50',
} as const;

/**
 * Default Values
 */
export const DEFAULT_BORDER_COLOR = 'border-gray-200' as const;
export const ICON_BACKGROUND_COLOR = 'rgba(33, 82, 228, 0.125)' as const;
