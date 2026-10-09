import * as React from 'react'

import { childrenUtils, cx, getComponentType, getUnhandledProps, getKeyOnly } from '../../lib'
import RevealContent from './RevealContent'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface RevealProps extends StrictRevealProps {
  [key: string]: any
}

export interface StrictRevealProps {
  /** An element type to render as (string or function). */
  as?: any

  /** An active reveal displays its hidden content. */
  active?: boolean

  /** An animation name that will be applied to Reveal. */
  animated?:
    | 'fade'
    | 'small fade'
    | 'move'
    | 'move right'
    | 'move up'
    | 'move down'
    | 'rotate'
    | 'rotate left'

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A disabled reveal will not animate when hovered. */
  disabled?: boolean

  /** An element can show its content without delay. */
  instant?: boolean
}

/**
 * A reveal displays additional content in place of previous content when activated.
 */
const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(function (props, ref) {
  const { active, animated, children, className, content, disabled, instant } = props

  const classes = cx(
    'ui',
    animated,
    getKeyOnly(active, 'active'),
    getKeyOnly(disabled, 'disabled'),
    getKeyOnly(instant, 'instant'),
    'reveal',
    className,
  )
  const rest = getUnhandledProps(Reveal, props)
  const ElementType = getComponentType(props)

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<RevealProps, HTMLDivElement> & {
  Content: typeof RevealContent
}

Reveal.displayName = 'Reveal'
Reveal.handledProps = [
  'active',
  'animated',
  'as',
  'children',
  'className',
  'content',
  'disabled',
  'instant',
]

Reveal.Content = RevealContent

export default Reveal
