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

export interface PopupContentProps extends StrictPopupContentProps {
  [key: string]: any
}

export interface StrictPopupContentProps {
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
 * A PopupContent displays the content body of a Popover.
 */
const PopupContent = React.forwardRef<HTMLDivElement, PopupContentProps>(function (props, ref) {
  const { children, className, content } = props
  const classes = cx('content', className)
  const rest = getUnhandledProps(PopupContent, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<PopupContentProps, HTMLDivElement>

PopupContent.displayName = 'PopupContent'
PopupContent.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** The content of the Popup */
  children: PropTypes.node,

  /** Classes to add to the Popup content className. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,
}

PopupContent.create = createShorthandFactory(PopupContent, (children) => ({ children }))

export default PopupContent
