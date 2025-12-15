/**
 * Number formatting utilities for metrics display
 */

/**
 * Format a number into a short string (K/M/B/T)
 */
export const formatShortNumber = (num: number): string => {
  if (num === 0) return '0';
  if (num < 1_000) return num.toFixed(0);
  if (num < 1_000_000) return `${(num / 1_000).toFixed(1)}K`;
  if (num < 1_000_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num < 1_000_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  return `${(num / 1_000_000_000_000).toFixed(1)}T`;
};

/**
 * Format bytes into human readable string (B/KB/MB/GB)
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * Format duration in seconds to human readable string (ms/s)
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 0.001) return `${(seconds * 1_000_000).toFixed(0)}μs`;
  if (seconds < 1) return `${(seconds * 1000).toFixed(1)}ms`;
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs.toFixed(0)}s`;
};
