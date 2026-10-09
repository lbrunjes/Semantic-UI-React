import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import StepDescription from './StepDescription'
import StepTitle from './StepTitle'
import type {
  SemanticShorthandItem,
  SemanticShorthandContent,
  ForwardRefComponent,
} from '../../generic'
import type { StepDescriptionProps } from './StepDescription'
import type { StepTitleProps } from './StepTitle'

export interface StepContentProps extends StrictStepContentProps {
  [key: string]: any
}

export interface StrictStepContentProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Shorthand for StepDescription. */
  description?: SemanticShorthandItem<StepDescriptionProps>

  /** Shorthand for StepTitle. */
  title?: SemanticShorthandItem<StepTitleProps>
}

/**
 * A step can contain a content.
 */
const StepContent = React.forwardRef<HTMLDivElement, StepContentProps>(function (props, ref) {
  const { children, className, content, description, title } = props
  const classes = cx('content', className)
  const rest = getUnhandledProps(StepContent, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }

  if (!childrenUtils.isNil(content)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {content}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {StepTitle.create(title, { autoGenerateKey: false })}
      {StepDescription.create(description, { autoGenerateKey: false })}
    </ElementType>
  )
}) as ForwardRefComponent<StepContentProps, HTMLDivElement>

StepContent.displayName = 'StepContent'
StepContent.handledProps = ['as', 'children', 'className', 'content', 'description', 'title']

StepContent.create = createShorthandFactory(StepContent, (content) => ({ content }))

export default StepContent
