import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface StepDescriptionProps extends StrictStepDescriptionProps {
  [key: string]: any
}

export interface StrictStepDescriptionProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent
}

const StepDescription = React.forwardRef<HTMLDivElement, StepDescriptionProps>(
  function (props, ref) {
    const { children, className, content } = props
    const classes = cx('description', className)
    const rest = getUnhandledProps(StepDescription, props)
    const ElementType = getComponentType(props)

    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {childrenUtils.isNil(children) ? content : children}
      </ElementType>
    )
  },
) as ForwardRefComponent<StepDescriptionProps, HTMLDivElement>

StepDescription.displayName = 'StepDescription'
StepDescription.handledProps = ['as', 'children', 'className', 'content']

StepDescription.create = createShorthandFactory(StepDescription, (content) => ({ content }))

export default StepDescription
