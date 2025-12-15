import { useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { classNames } from '../../utils/classNames'
import type { SearchBarProps } from '../../types/components.types'

export default function SearchBar({
  id = 'search',
  name = 'search',
  placeholder = 'Search',
  value,
  onChange,
  onSearch,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  buttonId = 'searchButton',
}: SearchBarProps) {
  const { t } = useTranslation()
  const [internal, setInternal] = useState('')
  const currentValue = value ?? internal

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (onChange) onChange(v)
    else setInternal(v)
  }

  const triggerSearch = () => {
    if (onSearch) onSearch(currentValue)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      triggerSearch()
    }
  }

  return (
    <div className={classNames('relative mt-2 flex items-center', className)}>
      <input
        type="text"
        name={name}
        id={id}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKey}
        placeholder={placeholder}
        className={classNames(
          'block w-full h-12 rounded-xl border-0 py-2 pl-2 pr-16 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-5',
          inputClassName,
        )}
      />
      <button
        type="button"
        id={buttonId}
        onClick={triggerSearch}
        className={classNames(
          'absolute inset-y-0 right-0 flex items-center justify-center h-12 w-14 bg-primary text-white rounded-r-xl hover:bg-gradient-brand focus:outline-none',
          buttonClassName,
        )}
        aria-label={t('general.search')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
    </div>
  )
}
