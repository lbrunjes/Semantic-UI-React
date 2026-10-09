import * as React from 'react'

import { cx, normalizeTransitionDuration, SUI, getKeyOnly } from '../../lib'
import TransitionGroup from './TransitionGroup'
import {
  computeStatuses,
  TRANSITION_STATUS_ENTERED,
  TRANSITION_STATUS_ENTERING,
  TRANSITION_STATUS_EXITED,
  TRANSITION_STATUS_EXITING,
  TRANSITION_STATUS_INITIAL,
  TRANSITION_STATUS_UNMOUNTED,
} from './utils/computeStatuses'
import { includes, invoke } from '../../lib/utils'
import type { SemanticTRANSITIONS } from '../../generic'

export type TRANSITION_STATUSES = 'ENTERED' | 'ENTERING' | 'EXITED' | 'EXITING' | 'UNMOUNTED'

export interface TransitionProps extends StrictTransitionProps {
  [key: string]: any
}

export interface StrictTransitionProps {
  /** Named animation event to used. Must be defined in CSS. */
  animation?: SemanticTRANSITIONS | string

  /** Primary content. */
  children?: React.ReactNode

  /** Whether it is directional animation event or not. Use it only for custom transitions. */
  directional?: boolean

  /** Duration of the CSS transition animation in milliseconds. */
  duration?: number | string | TransitionPropDuration

  /** Show the component; triggers the enter or exit animation. */
  visible?: boolean

  /** Wait until the first "enter" transition to mount the component (add it to the DOM). */
  mountOnShow?: boolean

  /**
   * Callback on each transition that changes visibility to shown.
   *
   * @param {null}
   * @param {object} data - All props with status.
   */
  onComplete?: (nothing: null, data: TransitionEventData) => void

  /**
   * Callback on each transition that changes visibility to hidden.
   *
   * @param {null}
   * @param {object} data - All props with status.
   */
  onHide?: (nothing: null, data: TransitionEventData) => void

  /**
   * Callback on each transition that changes visibility to shown.
   *
   * @param {null}
   * @param {object} data - All props with status.
   */
  onShow?: (nothing: null, data: TransitionEventData) => void

  /**
   * Callback on animation start.
   *
   * @param {null}
   * @param {object} data - All props with status.
   */
  onStart?: (nothing: null, data: TransitionEventData) => void

  /** React's key of the element. */
  reactKey?: string

  /** Run the enter animation when the component mounts, if it is initially shown. */
  transitionOnMount?: boolean

  /** Unmount the component (remove it from the DOM) when it is not shown. */
  unmountOnHide?: boolean
}

export interface TransitionEventData extends TransitionProps {
  status: TRANSITION_STATUSES
}

export interface TransitionPropDuration {
  hide: number
  show: number
}

interface TransitionComponent extends React.ComponentClass<TransitionProps> {
  Group: typeof TransitionGroup
}

const TRANSITION_CALLBACK_TYPE: Record<string, string> = {
  [TRANSITION_STATUS_ENTERED]: 'show',
  [TRANSITION_STATUS_EXITED]: 'hide',
}
const TRANSITION_STYLE_TYPE: Record<string, string> = {
  [TRANSITION_STATUS_ENTERING]: 'show',
  [TRANSITION_STATUS_EXITING]: 'hide',
}

/**
 * A transition is an animation usually used to move content in or out of view.
 */
const Transition = class Transition extends React.Component<TransitionProps, any> {
  declare timeoutId: any

  static Group = TransitionGroup

  state: any = {
    status: TRANSITION_STATUS_INITIAL,
  }

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------

  static getDerivedStateFromProps(props: TransitionProps, state: any) {
    const derivedState = computeStatuses({
      mountOnShow: props.mountOnShow,
      status: state.status,
      transitionOnMount: props.transitionOnMount,
      visible: props.visible,
      unmountOnHide: props.unmountOnHide,
    })

    return derivedState
  }

  componentDidMount() {
    this.updateStatus({})
  }

  componentDidUpdate(prevProps: TransitionProps, prevState: any) {
    this.updateStatus(prevState)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  // ----------------------------------------
  // Callback handling
  // ----------------------------------------

  handleStart = (nextStatus: string) => {
    const { duration } = this.props

    const durationType = TRANSITION_CALLBACK_TYPE[nextStatus]
    const durationValue = normalizeTransitionDuration(duration, durationType)

    if (durationValue === 0) {
      this.setState({ status: nextStatus })
    } else {
      this.timeoutId = setTimeout(() => this.setState({ status: nextStatus }), durationValue)
    }
  }

  updateStatus = (prevState: any) => {
    if (prevState.status !== this.state.status) {
      // Timeout should be cleared in any case as previous can lead set to unexpected `nextStatus`
      clearTimeout(this.timeoutId)

      if (this.state.nextStatus) {
        this.handleStart(this.state.nextStatus)
      }
    }

    if (!prevState.animating && this.state.animating) {
      this.props?.onStart?.(null, { ...this.props, status: this.state.status })
    }

    if (prevState.animating && !this.state.animating) {
      const callback = this.state.status === TRANSITION_STATUS_ENTERED ? 'onShow' : 'onHide'

      this.props?.onComplete?.(null, { ...this.props, status: this.state.status })
      invoke(this.props, callback, null, { ...this.props, status: this.state.status })
    }
  }

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  computeClasses = () => {
    const { animation, directional, children } = this.props
    const { animating, status } = this.state

    const childClasses = (children as any)?.props?.className
    const isDirectional =
      directional == null ? includes(SUI.DIRECTIONAL_TRANSITIONS, animation) : directional

    if (isDirectional) {
      return cx(
        animation,
        childClasses,
        getKeyOnly(animating, 'animating'),
        getKeyOnly(status === TRANSITION_STATUS_ENTERING, 'in'),
        getKeyOnly(status === TRANSITION_STATUS_EXITING, 'out'),
        getKeyOnly(status === TRANSITION_STATUS_EXITED, 'hidden'),
        getKeyOnly(status !== TRANSITION_STATUS_EXITED, 'visible'),
        'transition',
      )
    }

    return cx(animation, childClasses, getKeyOnly(animating, 'animating transition'))
  }

  computeStyle = () => {
    const { children, duration } = this.props
    const { status } = this.state

    const childStyle = (children as any)?.props?.style
    const type = TRANSITION_STYLE_TYPE[status]
    const animationDuration = type && `${normalizeTransitionDuration(duration, type)}ms`

    return { ...childStyle, animationDuration }
  }

  // ----------------------------------------
  // Render
  // ----------------------------------------

  render() {
    const { children } = this.props
    const { nextStatus, status } = this.state

    if (status === TRANSITION_STATUS_UNMOUNTED) {
      return null
    }

    return React.cloneElement(children as React.ReactElement<any>, {
      className: this.computeClasses(),
      style: this.computeStyle(),
      ...(process.env.NODE_ENV !== 'production' && {
        'data-test-status': status,
        'data-test-next-status': nextStatus,
      }),
    })
  }
}

Transition.handledProps = [
  'animation',
  'children',
  'directional',
  'duration',
  'mountOnShow',
  'onComplete',
  'onHide',
  'onShow',
  'onStart',
  'reactKey',
  'transitionOnMount',
  'unmountOnHide',
  'visible',
]

Transition.defaultProps = {
  animation: 'fade',
  duration: 500,
  visible: true,
  mountOnShow: true,
  transitionOnMount: false,
  unmountOnHide: false,
}
export default Transition as TransitionComponent
