import PropTypes from 'prop-types'
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

    const handleChange = (e) => {
      const newValue = e?.target?.value

      // eslint-disable-next-line react/prop-types -- a DOM event handler, it is not declared in propTypes to be passed with other HTML props
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
DropdownSearchInput.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** An input can have the auto complete. */
  autoComplete: PropTypes.string,

  /** Additional classes. */
  className: PropTypes.string,

  /** An input can receive focus. */
  tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /** The HTML input type. */
  type: PropTypes.string,

  /** Stored value. */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

DropdownSearchInput.create = createShorthandFactory(DropdownSearchInput, (type) => ({ type }))

export default DropdownSearchInput
