import { classNames } from '../../utils/classNames'
import type { PageTitleProps } from '../../types/components.types'

export default function PageTitle({
  children,
  htmlFor,
  right,
  rightWidthClass = 'w-1/4',
  containerClassName = '',
  labelClassName = '',
}: PageTitleProps) {
  return (
    <div className={classNames('flex items-center space-x-2 flex-1', containerClassName)}>
      <label htmlFor={htmlFor} className={classNames('text-2xl font-bold text-black sm:text-3xl', labelClassName)}>
        {children}
      </label>
      {right !== undefined ? (
        <div className={classNames(rightWidthClass, 'mt-1')}>{right}</div>
      ) : (
        <div className={classNames(rightWidthClass, 'mt-1')} />
      )}
    </div>
  )
}
