import * as React from 'react'

import { createShorthandFactory, cx, getComponentType, getUnhandledProps } from '../../lib'
import type { ForwardRefComponent } from '../../generic'

export interface DropdownSearchInputProps extends StrictDropdownSearchInputProps {
  [key: string]: any
}

export interface StrictDropdownSearchInputProps {
  /** An element type to render as (string or function). */
  as?: any

  /** An input can have the auto complete. */
  autoComplete?: string

  /** Additional classes. */
  className?: string

  /** An input can receive focus. */
  tabIndex?: number | string

  /** The HTML input type. */
  type?: string

  /** Stored value. */
  value?: number | string
}

/**
 * A search item sub-component for Dropdown component.
 */
const DropdownSearchInput = React.forwardRef<HTMLInputElement, DropdownSearchInputProps>(
  function (props, ref) {
    const { autoComplete = 'off', className, tabIndex, type = 'text', value } = props

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e?.target?.value

      props?.onChange?.(e, { ...props, value: newValue })
    }

    const classes = cx('search', className)
    const ElementType = getComponentType(props, { defaultAs: 'input' })
    const rest = getUnhandledProps(DropdownSearchInput, props)

    return (
      <ElementType
        aria-autocomplete='list'
        {...rest}
        autoComplete={autoComplete}
        className={classes}
        onChange={handleChange}
        ref={ref}
        tabIndex={tabIndex}
        type={type}
        value={value}
      />
    )
  },
) as ForwardRefComponent<DropdownSearchInputProps, HTMLInputElement>

DropdownSearchInput.displayName = 'DropdownSearchInput'
DropdownSearchInput.handledProps = ['as', 'autoComplete', 'className', 'tabIndex', 'type', 'value']

DropdownSearchInput.create = createShorthandFactory(DropdownSearchInput, (type: string) => ({
  type,
}))

export default DropdownSearchInput
