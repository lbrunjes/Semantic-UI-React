import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface DropdownTextProps extends StrictDropdownTextProps {
  [key: string]: any
}

export interface StrictDropdownTextProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent
}

/**
 * A dropdown contains a selected value.
 */
const DropdownText = React.forwardRef<HTMLDivElement, DropdownTextProps>(function (props, ref) {
  const { children, className, content } = props
  const classes = cx('divider', className)
  const rest = getUnhandledProps(DropdownText, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType
      aria-atomic
      aria-live='polite'
      role='alert'
      {...rest}
      className={classes}
      ref={ref}
    >
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<DropdownTextProps, HTMLDivElement>

DropdownText.displayName = 'DropdownText'
DropdownText.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

DropdownText.create = createShorthandFactory(DropdownText, (val) => ({ content: val }))

export default DropdownText
