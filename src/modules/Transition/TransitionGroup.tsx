import * as React from 'react'

import { getComponentType, getUnhandledProps, useEventCallback, useForceUpdate } from '../../lib'
import { getChildMapping, mergeChildMappings } from './utils/childMapping'
import type { ChildMapping } from './utils/childMapping'
import wrapChild from './utils/wrapChild'
import { forEach, mapValues, values } from '../../lib/utils'
import type { ForwardRefComponent, SemanticTRANSITIONS } from '../../generic'
import type { TransitionEventData, TransitionPropDuration } from './Transition'

export interface TransitionGroupProps extends StrictTransitionGroupProps {
  [key: string]: any
}

export interface StrictTransitionGroupProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Named animation event to used. Must be defined in CSS. */
  animation?: SemanticTRANSITIONS | string

  /** Primary content. */
  children?: React.ReactNode

  /** Whether it is directional animation event or not. Use it only for custom transitions. */
  directional?: boolean

  /** Duration of the CSS transition animation in milliseconds. */
  duration?: number | string | TransitionPropDuration
}

/**
 * Wraps all children elements with proper callbacks and props.
 *
 * @param {React.ReactNode} children
 * @param {String} animation
 * @param {Number|String|Object} duration
 * @param {Boolean} directional
 *
 * @return {Object}
 */
function useWrappedChildren(
  children: React.ReactNode,
  animation: TransitionGroupProps['animation'],
  duration: TransitionGroupProps['duration'],
  directional: TransitionGroupProps['directional'],
) {
  const forceUpdate = useForceUpdate()
  const previousChildren = React.useRef<ChildMapping | undefined>(undefined)

  let wrappedChildren: ChildMapping
  React.useEffect(() => {
    previousChildren.current = wrappedChildren
  })

  const handleChildHide = useEventCallback((nothing: null, childProps: TransitionEventData) => {
    const { reactKey } = childProps

    // The callback is only called by children rendered from a previous mapping, so it is set
    delete previousChildren.current![reactKey!]
    forceUpdate()
  })

  // A short circuit for an initial render as there will be no `prevMapping`
  if (typeof previousChildren.current === 'undefined') {
    wrappedChildren = mapValues(getChildMapping(children), (child: React.ReactElement<any>) =>
      wrapChild(child, handleChildHide, {
        animation,
        duration,
        directional,
      }),
    )
  } else {
    const nextMapping = getChildMapping(children)
    wrappedChildren = mergeChildMappings(previousChildren.current, nextMapping)

    forEach(wrappedChildren, (child: React.ReactElement<any>, key: string) => {
      // `previousChildren.current` is defined in this branch, narrowing is lost in the callback
      const hasPrev = previousChildren.current![key]
      const hasNext = nextMapping[key]

      const prevChild = previousChildren.current![key]
      const isLeaving = !prevChild?.props?.visible

      // Heads up!
      // An item is new (entering), it will be picked from `nextChildren`, so it should be wrapped
      if (hasNext && (!hasPrev || isLeaving)) {
        wrappedChildren[key] = wrapChild(child, handleChildHide, {
          animation,
          duration,
          directional,
          transitionOnMount: true,
        })
        return
      }

      // Heads up!
      // An item is old (exiting), it will be picked from `prevChildren`, so it has been already
      // wrapped, so should be only updated
      if (!hasNext && hasPrev && !isLeaving) {
        wrappedChildren[key] = React.cloneElement(prevChild, { visible: false })
        return
      }

      // Heads up!
      // An item item hasn't changed transition states, but it will be picked from `nextChildren`,
      // so we should wrap it again
      const {
        props: { visible, transitionOnMount },
      } = prevChild

      wrappedChildren[key] = wrapChild(child, handleChildHide, {
        animation,
        duration,
        directional,
        transitionOnMount,
        visible,
      })
    })
  }

  return wrappedChildren
}

/**
 * A Transition.Group animates children as they mount and unmount.
 */
const TransitionGroup = React.forwardRef<HTMLDivElement, TransitionGroupProps>(
  function (props, ref) {
    const children = useWrappedChildren(
      props.children,
      props.animation ?? 'fade',
      props.duration ?? 500,
      props.directional,
    )

    const ElementType = getComponentType(props, { defaultAs: React.Fragment })
    const rest = getUnhandledProps(TransitionGroup, props)

    return (
      <ElementType {...rest} ref={ref}>
        {values(children)}
      </ElementType>
    )
  },
) as ForwardRefComponent<TransitionGroupProps, HTMLDivElement>

TransitionGroup.displayName = 'TransitionGroup'
TransitionGroup.handledProps = ['animation', 'as', 'children', 'directional', 'duration']

export default TransitionGroup
