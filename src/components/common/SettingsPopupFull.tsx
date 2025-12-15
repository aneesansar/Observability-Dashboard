import { useState, type ChangeEvent } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { SettingsPopupFullProps } from '../../types/components.types'

export default function SettingsPopupFull({
  onClose,
  t,
  systemPrompt: pSystemPrompt = 'You are an experienced expert in standards (DIN, ISO and related special standards). You respond exclusively in German and never answer the question directly.',
  temperature: pTemperature = 0.1,
  relevantDocs: pRelevantDocs = 5,
  model: pModel = 'small',
  sortByDate: pSortByDate = true,
  columns: pColumns = { rating: true, text: true, document: true, createdAt: true, result: true },
  onSystemPromptChange,
  onTemperatureChange,
  onRelevantDocsChange,
  onModelChange,
  onSortByDateChange,
  onColumnsChange,
  onApply,
  onReset,
}: SettingsPopupFullProps) {
  const [systemPrompt, setSystemPrompt] = useState(pSystemPrompt)
  const [temperature, setTemperature] = useState(pTemperature)
  const [relevantDocs, setRelevantDocs] = useState(pRelevantDocs)
  const [model, setModel] = useState<'small' | 'medium'>(pModel)
  const [sortByDate, setSortByDate] = useState(pSortByDate)
  const [columns, setColumns] = useState<Record<string, boolean>>(pColumns)

  const handleSystemPrompt = (v: string) => {
    setSystemPrompt(v)
    onSystemPromptChange?.(v)
  }
  const handleTemperature = (v: number) => {
    setTemperature(v)
    onTemperatureChange?.(v)
  }
  const handleRelevantDocs = (v: number) => {
    setRelevantDocs(v)
    onRelevantDocsChange?.(v)
  }
  const handleModel = (v: 'small' | 'medium') => {
    setModel(v)
    onModelChange?.(v)
  }
  const handleSortByDate = (v: boolean) => {
    setSortByDate(v)
    onSortByDateChange?.(v)
  }
  const handleColumnChange = (key: string, v: boolean) => {
    const next = { ...columns, [key]: v }
    setColumns(next)
    onColumnsChange?.(next)
  }

  const apply = () => {
    onApply?.({ systemPrompt, temperature, relevantDocs, model, sortByDate, columns })
  }

  const reset = () => {
    onReset?.()
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
              {t('settings.title') || 'Settings'}
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
          {/* System prompt */}
          <div className="mb-2">
            <h3 className="text-lg font-medium leading-6 text-gray-900 text-left">{t('settings.system_prompt') || 'Systemaufforderung'}</h3>
            <textarea
              placeholder={t('settings.system_prompt_placeholder') || 'Bitte geben Sie die Systemaufforderung ein'}
              className="w-full mt-2 px-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              rows={4}
              value={systemPrompt}
              onChange={(e) => handleSystemPrompt(e.target.value)}
            />
          </div>

          {/* Temperature */}
          <div className="mb-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900 text-left">{t('settings.temperature') || 'Temperatur'}</h3>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleTemperature(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm mt-2 text-left">{temperature.toFixed(1)}</div>
          </div>

          {/* Relevant documents */}
          <div className="mb-2">
            <h3 className="text-lg font-medium leading-6 text-gray-900 text-left">{t('settings.relevant_docs') || 'Relevante Dokumente'}</h3>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={relevantDocs}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleRelevantDocs(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="text-sm mt-2 text-left">{relevantDocs}</div>
          </div>

          {/* Top row: model and sort */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-1/2 pr-2">
              <h3 className="text-lg font-medium leading-6 text-gray-900 text-left">{t('settings.model') || 'Modellauswahl'}</h3>
              <select
                className="w-full mt-1 py-2 px-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                value={model}
                onChange={(e) => handleModel(e.target.value as 'small' | 'medium')}
              >
                <option value="small">{t('settings.model_small') || 'Klein'}</option>
                <option value="medium">{t('settings.model_medium') || 'Mittel'}</option>
              </select>
            </div>

            <div className="w-1/2 pl-2">
              <h3 className="text-lg font-medium leading-6 text-gray-900 text-left">{t('settings.toggleFeature') || t('settings.sort') || 'Sortierung'}</h3>
              <div className="mt-2 flex items-center">
                <button
                  type="button"
                  aria-label={t('general.toggle_sort_date')}
                  onClick={() => handleSortByDate(!sortByDate)}
                  className="relative inline-block align-middle select-none"
                  style={{ height: 20, width: 40, borderRadius: 10 }}
                >
                  <span
                    className="block h-full w-full transition-colors duration-200"
                    style={{
                      background: sortByDate ? '#2152E4' : '#c4c9cf',
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                  />
                  <span
                    className="absolute transition-transform duration-200"
                    style={{
                      height: 10,
                      width: 10,
                      background: '#000',
                      borderRadius: '50%',
                      top: 5,
                      transform: `translateX(${sortByDate ? 5 : -15}px)`,
                    }}
                  />
                </button>
                <span className="ml-2 text-left">{sortByDate ? (t('settings.on') || 'An') : (t('settings.off') || 'Aus')}</span>
              </div>
            </div>
          </div>

          {/* Columns */}
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 text-left">{t('filter.columns') || 'Spalten auswählen'}</h3>
          <div className="space-y-2">
            {Object.entries(columns).map(([key, checked]) => (
              <div key={key} className="flex items-center justify-start py-2 border-b border-gray-200">
                <div className="w-1/3 text-sm font-medium text-left">{t(`table.${key}`) || key}</div>
                <div className="flex items-center w-2/3">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-secondary rounded focus:ring-secondary mr-2"
                    checked={!!checked}
                    onChange={(e) => handleColumnChange(key, e.target.checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 shrink-0 bg-white rounded-b-lg">
          <button
            className="text-white rounded bg-primary font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 hover:bg-gradient-brand"
            type="button"
            onClick={reset}
          >
            {t('button.reset') || 'Zurücksetzen'}
          </button>
          <button
            className="text-white rounded bg-primary font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 hover:bg-gradient-brand"
            type="button"
            onClick={apply}
          >
            {t('button.apply') || 'Anwenden'}
          </button>
        </div>
      </div>
    </>
  )
}
