import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ModalHeaderProps extends StrictModalHeaderProps {
  [key: string]: any
}

export interface StrictModalHeaderProps {
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
 * A modal can have a header.
 */
const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(function (props, ref) {
  const { children, className, content } = props
  const classes = cx('header', className)
  const rest = getUnhandledProps(ModalHeader, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ModalHeaderProps, HTMLDivElement>

ModalHeader.displayName = 'ModalHeader'
ModalHeader.handledProps = ['as', 'children', 'className', 'content']

ModalHeader.create = createShorthandFactory(ModalHeader, (content: React.ReactNode) => ({
  content,
}))

export default ModalHeader
