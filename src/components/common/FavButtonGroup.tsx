import { classNames } from '../../utils/classNames'
import type { FavButtonGroupProps } from '../../types/components.types'

export default function FavButtonGroup({
  className = '',
  buttonWrapperClassName = '',
  buttonClassName = '',
  favoriteAriaLabel = 'Add to favorites',
  copyAriaLabel = 'Copy URL',
  folderAriaLabel = 'Folder',
  onFavoriteClick,
  onCopyClick,
  onFolderClick,
}: FavButtonGroupProps) {
  // TODO: Hidden for now - remove this return null to restore
  return null;

  return (
    <div className={classNames('flex items-center space-x-2', className)}>
      {/* Favorite */}
      <div className={classNames('relative inline-block', buttonWrapperClassName)}>
        <div className="bg-primary text-white p-1 rounded flex items-center justify-center w-9 h-9 hover:bg-gradient-brand">
          <button
            type="button"
            aria-label={favoriteAriaLabel}
            onClick={onFavoriteClick}
            className={classNames('text-white hover:text-white px-1 py-0', buttonClassName)}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Copy URL */}
      <div className={classNames('relative inline-block', buttonWrapperClassName)}>
        <div className="bg-primary text-white p-1 rounded flex items-center justify-center w-9 h-9 hover:bg-gradient-brand">
          <button
            type="button"
            aria-label={copyAriaLabel}
            onClick={onCopyClick}
            className={classNames('text-white hover:text-white px-1 py-0', buttonClassName)}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="80"
                y="80"
                width="256"
                height="256"
                rx="28"
                ry="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="32"
                strokeLinejoin="round"
              />
              <rect
                x="176"
                y="176"
                width="256"
                height="256"
                rx="28"
                ry="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="32"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Folder */}
      <div className={classNames('relative inline-block', buttonWrapperClassName)}>
        <div className="bg-primary text-white p-1 rounded flex items-center justify-center w-9 h-9 hover:bg-gradient-brand">
          <button
            type="button"
            aria-label={folderAriaLabel}
            onClick={onFolderClick}
            className={classNames('text-white hover:text-white px-1 py-0', buttonClassName)}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M440 432H72a40 40 0 0 1-40-40V120a40 40 0 0 1 40-40h75.89a40 40 0 0 1 22.19 6.72l27.84 18.56a40 40 0 0 0 22.19 6.72H440a40 40 0 0 1 40 40v240a40 40 0 0 1-40 40zM32 192h448"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
