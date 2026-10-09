import PropTypes from 'prop-types'
import * as React from 'react'

import {
  getComponentType,
  getUnhandledProps,
  makeDebugger,
  SUI,
  useEventCallback,
  useForceUpdate,
} from '../../lib'
import { getChildMapping, mergeChildMappings } from './utils/childMapping'
import wrapChild from './utils/wrapChild'
import { forEach, mapValues, values } from '../../lib/utils'
import type { ForwardRefComponent, SemanticTRANSITIONS } from '../../generic'
import type { TransitionPropDuration } from './Transition'

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

const debug = makeDebugger('transition_group')

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
function useWrappedChildren(children, animation, duration, directional) {
  debug('wrapChildren()')

  const forceUpdate = useForceUpdate()
  const previousChildren = React.useRef(undefined)

  let wrappedChildren
  React.useEffect(() => {
    previousChildren.current = wrappedChildren
  })

  const handleChildHide = useEventCallback((nothing, childProps) => {
    debug('handleOnHide', childProps)
    const { reactKey } = childProps

    delete previousChildren.current[reactKey]
    forceUpdate()
  })

  // A short circuit for an initial render as there will be no `prevMapping`
  if (typeof previousChildren.current === 'undefined') {
    wrappedChildren = mapValues(getChildMapping(children), (child) =>
      wrapChild(child, handleChildHide, {
        animation,
        duration,
        directional,
      }),
    )
  } else {
    const nextMapping = getChildMapping(children)
    wrappedChildren = mergeChildMappings(previousChildren.current, nextMapping)

    forEach(wrappedChildren, (child, key) => {
      const hasPrev = previousChildren.current[key]
      const hasNext = nextMapping[key]

      const prevChild = previousChildren.current[key]
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
    debug('render')
    debug('props', props)

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
TransitionGroup.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** Named animation event to used. Must be defined in CSS. */
  animation: PropTypes.oneOfType([PropTypes.oneOf(SUI.TRANSITIONS), PropTypes.string]),

  /** Primary content. */
  children: PropTypes.node,

  /** Whether it is directional animation event or not. Use it only for custom transitions. */
  directional: PropTypes.bool,

  /** Duration of the CSS transition animation in milliseconds. */
  duration: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      hide: PropTypes.number.isRequired,
      show: PropTypes.number.isRequired,
    }),
    PropTypes.string,
  ]),
}

export default TransitionGroup
