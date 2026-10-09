import PropTypes from 'prop-types'
import * as React from 'react'

import {
  childrenUtils,
  customPropTypes,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ButtonContentProps extends StrictButtonContentProps {
  [key: string]: any
}

export interface StrictButtonContentProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Initially hidden, visible on hover. */
  hidden?: boolean

  /** Initially visible, hidden on hover. */
  visible?: boolean
}

/**
 * Used in some Button types, such as `animated`.
 */
const ButtonContent = React.forwardRef<HTMLDivElement, ButtonContentProps>(function (props, ref) {
  const { children, className, content, hidden, visible } = props

  const classes = cx(
    getKeyOnly(visible, 'visible'),
    getKeyOnly(hidden, 'hidden'),
    'content',
    className,
  )
  const rest = getUnhandledProps(ButtonContent, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ButtonContentProps, HTMLDivElement>

ButtonContent.displayName = 'ButtonContent'
ButtonContent.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for primary content. */
  content: customPropTypes.contentShorthand,

  /** Initially hidden, visible on hover. */
  hidden: PropTypes.bool,

  /** Initially visible, hidden on hover. */
  visible: PropTypes.bool,
}

export default ButtonContent
