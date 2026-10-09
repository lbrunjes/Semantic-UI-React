import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ModalContentProps extends StrictModalContentProps {
  [key: string]: any
}

export interface StrictModalContentProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A modal can contain image content. */
  image?: boolean

  /** A modal can use the entire size of the screen. */
  scrolling?: boolean
}

/**
 * A modal can contain content.
 */
const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(function (props, ref) {
  const { children, className, content, image, scrolling } = props

  const classes = cx(
    className,
    getKeyOnly(image, 'image'),
    getKeyOnly(scrolling, 'scrolling'),
    'content',
  )
  const rest = getUnhandledProps(ModalContent, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ModalContentProps, HTMLDivElement>

ModalContent.displayName = 'ModalContent'
ModalContent.handledProps = ['as', 'children', 'className', 'content', 'image', 'scrolling']

ModalContent.create = createShorthandFactory(ModalContent, (content: React.ReactNode) => ({
  content,
}))

export default ModalContent
