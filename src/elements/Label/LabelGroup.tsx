import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
import type {
  ForwardRefComponent,
  SemanticCOLORS,
  SemanticShorthandContent,
  SemanticSIZES,
} from '../../generic'

export interface LabelGroupProps extends StrictLabelGroupProps {
  [key: string]: any
}

export interface StrictLabelGroupProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Primary content. */
  children?: React.ReactNode

  /** Labels can share shapes. */
  circular?: boolean

  /** Additional classes. */
  className?: string

  /** Label group can share colors together. */
  color?: SemanticCOLORS

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** Label group can share sizes together. */
  size?: SemanticSIZES

  /** Label group can share tag formatting. */
  tag?: boolean
}

/**
 * A label can be grouped.
 */
const LabelGroup = React.forwardRef<HTMLDivElement, LabelGroupProps>(function (props, ref) {
  const { children, circular, className, color, content, size, tag } = props

  const classes = cx(
    'ui',
    color,
    size,
    getKeyOnly(circular, 'circular'),
    getKeyOnly(tag, 'tag'),
    'labels',
    className,
  )
  const rest = getUnhandledProps(LabelGroup, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<LabelGroupProps, HTMLDivElement>

LabelGroup.displayName = 'LabelGroup'
LabelGroup.handledProps = [
  'as',
  'children',
  'circular',
  'className',
  'color',
  'content',
  'size',
  'tag',
]

export default LabelGroup
