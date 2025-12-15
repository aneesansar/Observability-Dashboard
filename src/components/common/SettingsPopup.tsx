import { useConfiguration } from './ConfigurationHook'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { SettingsPopupProps } from '../../types/components.types'

export default function SettingsPopup({ onClose, selectedColumns, handleColumnChange, t }: SettingsPopupProps) {
  const FilterConfig = useConfiguration()

  const columnDefinitions: Record<string, { displayName: string; hasCheckbox: boolean }> = {
    rating: { displayName: t('table.rating'), hasCheckbox: true },
    text: { displayName: t('table.text'), hasCheckbox: true },
    location: { displayName: t('table.location'), hasCheckbox: true },
    ...(FilterConfig.PRODUCT_FILTER
      ? { [FilterConfig.PRODUCT_FILTER]: { displayName: t(`table.${FilterConfig.PRODUCT_FILTER}`), hasCheckbox: true } }
      : {}),
    ...(FilterConfig.TARIF_FILTER
      ? { [FilterConfig.TARIF_FILTER]: { displayName: t(`table.${FilterConfig.TARIF_FILTER}`), hasCheckbox: true } }
      : {}),
    ...(FilterConfig.ENABLE_CLIENT_FILTER ? { client: { displayName: t('table.client'), hasCheckbox: true } } : {}),
    erstellungsdatum: { displayName: t('table.erstellungsdatum'), hasCheckbox: true },
    page_no: { displayName: t('table.page'), hasCheckbox: true },
    headline: { displayName: t('table.headline'), hasCheckbox: true },
    score: { displayName: t('table.score'), hasCheckbox: true },
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/25"
        onClick={onClose}
      />

      {/* Popup Panel */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-2xl max-h-[90vh] rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 flex flex-col">
        {/* Header */}
        <div className="p-6 shrink-0 bg-platinum rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('filter.columns') || 'Column Settings'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-md border border-gray-300 bg-anti-flash-white text-charcoal hover:bg-gradient-brand hover:text-white transition-all"
              aria-label={t('general.close')}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {Object.entries(columnDefinitions).map(([column, { displayName, hasCheckbox }]) => (
              <div key={column} className="flex items-center justify-start py-2 border-b border-gray-200">
                <div className="w-1/3 text-sm font-medium text-left">{displayName}</div>
                <div className="flex items-center w-2/3">
                  {hasCheckbox && (
                    <input
                      type="checkbox"
                      checked={!!selectedColumns[column]}
                      onChange={() => handleColumnChange(column)}
                      className="form-checkbox h-5 w-5 text-secondary rounded focus:ring-secondary mr-2"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 shrink-0 bg-white rounded-b-lg">
          <button
            className="text-white rounded bg-primary font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 hover:bg-gradient-brand"
            type="button"
            onClick={onClose}
          >
            {t('button.close') || 'Close'}
          </button>
        </div>
      </div>
    </>
  )
}
