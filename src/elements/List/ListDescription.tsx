import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ListDescriptionProps extends StrictListDescriptionProps {
  [key: string]: any
}

export interface StrictListDescriptionProps {
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
 * A list item can contain a description.
 */
const ListDescription = React.forwardRef<HTMLDivElement, ListDescriptionProps>(
  function (props, ref) {
    const { children, className, content } = props

    const classes = cx(className, 'description')
    const rest = getUnhandledProps(ListDescription, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<ListDescriptionProps, HTMLDivElement>

ListDescription.displayName = 'ListDescription'
ListDescription.handledProps = ['as', 'children', 'className', 'content']

ListDescription.create = createShorthandFactory(ListDescription, (content) => ({ content }))

export default ListDescription
