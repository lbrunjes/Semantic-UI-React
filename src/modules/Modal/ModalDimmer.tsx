import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
  useClassNamesOnNode,
  getKeyOnly,
  useMergedRefs,
} from '../../lib'
import type { ForwardRefComponent, SemanticShorthandContent } from '../../generic'

export interface ModalDimmerProps extends StrictModalDimmerProps {
  [key: string]: any
}

export interface StrictModalDimmerProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A dimmer can be blurred. */
  blurring?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** A dimmer can center its contents in the viewport. */
  centered?: boolean

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A dimmer can be inverted. */
  inverted?: boolean

  /** The node where the modal should mount. Defaults to document.body. */
  mountNode?: any

  /** A dimmer can make body scrollable. */
  scrolling?: boolean
}

/**
 * A modal has a dimmer.
 */
const ModalDimmer = React.forwardRef<HTMLDivElement, ModalDimmerProps>(function (props, ref) {
  const { blurring, children, className, centered, content, inverted, mountNode, scrolling } = props
  const elementRef = useMergedRefs(ref, React.useRef(undefined))

  const classes = cx(
    'ui',
    getKeyOnly(inverted, 'inverted'),
    getKeyOnly(!centered, 'top aligned'),
    'page modals dimmer transition visible active',
    className,
  )
  const bodyClasses = cx(
    'dimmable dimmed',
    getKeyOnly(blurring, 'blurring'),
    getKeyOnly(scrolling, 'scrolling'),
  )

  const rest = getUnhandledProps(ModalDimmer, props)
  const ElementType = getComponentType(props)

  useClassNamesOnNode(mountNode, bodyClasses)

  React.useEffect(() => {
    elementRef.current?.style?.setProperty('display', 'flex', 'important')
  }, [])

  return (
    <ElementType {...rest} className={classes} ref={elementRef}>
      {childrenUtils.isNil(children) ? content : children}
    </ElementType>
  )
}) as ForwardRefComponent<ModalDimmerProps, HTMLDivElement>

ModalDimmer.displayName = 'ModalDimmer'
ModalDimmer.handledProps = [
  'as',
  'blurring',
  'centered',
  'children',
  'className',
  'content',
  'inverted',
  'mountNode',
  'scrolling',
]

ModalDimmer.create = createShorthandFactory(ModalDimmer, (content: React.ReactNode) => ({
  content,
}))

export default ModalDimmer
