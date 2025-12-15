import type { ReactNode, ComponentType } from 'react'

// Shared icon and navigation types (if needed elsewhere)
export type IconType = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>

// FavButtonGroup
export type FavButtonGroupProps = {
  className?: string
  buttonWrapperClassName?: string
  buttonClassName?: string
  favoriteAriaLabel?: string
  copyAriaLabel?: string
  folderAriaLabel?: string
  onFavoriteClick?: () => void
  onCopyClick?: () => void
  onFolderClick?: () => void
}

// PageTitle
export type PageTitleProps = {
  children: ReactNode
  htmlFor?: string
  right?: ReactNode
  rightWidthClass?: string
  containerClassName?: string
  labelClassName?: string
}

// SearchBar
export type SearchBarProps = {
  id?: string
  name?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
  inputClassName?: string
  buttonClassName?: string
  buttonId?: string
}

// SettingsPopup (columns-only)
export type SelectedColumns = Record<string, boolean>
export type SettingsPopupProps = {
  onClose: () => void
  selectedColumns: SelectedColumns
  handleColumnChange: (column: string) => void
  t: (k: string) => string
}

// SettingsPopupFull (full settings)
export type SettingsPopupFullState = {
  systemPrompt: string
  temperature: number
  relevantDocs: number
  model: 'small' | 'medium'
  sortByDate: boolean
  columns: Record<string, boolean>
}

export type SettingsPopupFullProps = {
  onClose: () => void
  t: (k: string) => string
  systemPrompt?: string
  temperature?: number // 0 - 1
  relevantDocs?: number // 1 - 40
  model?: 'small' | 'medium'
  sortByDate?: boolean
  columns?: Record<string, boolean>
  onSystemPromptChange?: (value: string) => void
  onTemperatureChange?: (value: number) => void
  onRelevantDocsChange?: (value: number) => void
  onModelChange?: (value: 'small' | 'medium') => void
  onSortByDateChange?: (value: boolean) => void
  onColumnsChange?: (cols: Record<string, boolean>) => void
  onApply?: (state: SettingsPopupFullState) => void
  onReset?: () => void
}

// FilterBar
export type FilterBarFullSettings = {
  systemPrompt?: string
  temperature?: number
  relevantDocs?: number
  model?: 'small' | 'medium'
  sortByDate?: boolean
  columns?: Record<string, boolean>
  onSystemPromptChange?: (value: string) => void
  onTemperatureChange?: (value: number) => void
  onRelevantDocsChange?: (value: number) => void
  onModelChange?: (value: 'small' | 'medium') => void
  onSortByDateChange?: (value: boolean) => void
  onColumnsChange?: (cols: Record<string, boolean>) => void
  onApply?: (state: SettingsPopupFullState) => void
  onReset?: () => void
}

export type FilterBarProps = {
  className?: string
  categoryOptions?: Array<{ value: string; label: string }>
  selectedCategory?: string
  onCategoryChange?: (value: string) => void
  onAddFilter?: () => void
  initialColumns?: Record<string, boolean>
  popupType?: 'columns' | 'full'
  fullSettings?: FilterBarFullSettings
}

// Layout components
export type Backend = 'alpha' | 'beta' | 'prod'

export type DesktopSidebarProps = {
  isCollapsed?: boolean
  onToggleCollapse?: (collapsed: boolean) => void
}

export type MobileSidebarProps = {
  open: boolean
  onClose: (open: boolean) => void
}

// Table component
export type TableColumn<T> = {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
  hidden?: "sm" | "lg"
}

export type TableProps<T> = {
  data: T[]
  columns: TableColumn<T>[]
  title?: string
  description?: string
  actionButton?: {
    label: string
    onClick: () => void
    className?: string
  }
  onRowAction?: (item: T) => void
  rowActionLabel?: string
  onRowReview?: (item: T) => void
  onRowUpdate?: (item: T) => void
  onRowDelete?: (item: T) => void
  getRowKey: (item: T) => string
  emptyMessage?: string
  // Optional built-in pagination
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
}

// Observability metric card
export type ObservabilityMetricCardProps = {
  title: string
  subtitle?: string
  badgeLabel?: string
  badgeVariant?: 'warning' | 'success' | 'info' | 'default' | 'error'
  value: string
  trendValue?: string
  trendDirection?: 'up' | 'down'
  trendText?: string
  icon?: ReactNode
  data: Array<Record<string, number | string>>
  valueKey?: string
  borderColorClass?: string
  chartType?: 'area' | 'bar'
}
