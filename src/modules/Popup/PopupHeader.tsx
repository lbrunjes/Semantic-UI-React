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

export interface PopupHeaderProps extends StrictPopupHeaderProps {
  [key: string]: any
}

export interface StrictPopupHeaderProps {
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
 * A PopupHeader displays a header in a Popover.
 */
const PopupHeader = React.forwardRef<HTMLDivElement, PopupHeaderProps>(function (props, ref) {
  const { children, className, content } = props

  const classes = cx('header', className)
  const rest = getUnhandledProps(PopupHeader, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<PopupHeaderProps, HTMLDivElement>

PopupHeader.displayName = 'PopupHeader'
PopupHeader.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

PopupHeader.create = createShorthandFactory(PopupHeader, (children) => ({ children }))

export default PopupHeader
