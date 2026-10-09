import PropTypes from 'prop-types'
import * as React from 'react'

import type { ForwardRefComponent } from '../../generic'
import { cx, getComponentType, getUnhandledProps } from '../../lib'

export interface ButtonOrProps extends StrictButtonOrProps {
  [key: string]: any
}

export interface StrictButtonOrProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Additional classes. */
  className?: string

  /** Or buttons can have their text localized, or adjusted by using the text prop. */
  text?: number | string
}

/**
 * Button groups can contain conditionals.
 */
const ButtonOr = React.forwardRef<HTMLDivElement, ButtonOrProps>(function (props, ref) {
  const { className, text } = props

  const classes = cx('or', className)
  const rest = getUnhandledProps(ButtonOr, props)
  const ElementType = getComponentType(props)

  return <ElementType {...rest} className={classes} data-text={text} ref={ref} />
}) as ForwardRefComponent<ButtonOrProps, HTMLDivElement>

ButtonOr.displayName = 'ButtonOr'
ButtonOr.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Additional classes. */
  className: PropTypes.string,

  /** Or buttons can have their text localized, or adjusted by using the text prop. */
  text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default ButtonOr
