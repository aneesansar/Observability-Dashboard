import { useMemo } from 'react'
import configurations from '../../config/filterConfig'

export function useConfiguration() {
  // Determine active configuration; default to 'skandia'
  const key = (import.meta as any)?.env?.VITE_FILTER_CONFIG || 'skandia'
  // Fallback safely if key not present
  const config = useMemo(() => (configurations as any)[key] || configurations.skandia, [key])
  return config
}
