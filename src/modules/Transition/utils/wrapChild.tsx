import * as React from 'react'
import Transition from '../Transition'
import type { TransitionProps } from '../Transition'

/**
 * Wraps a React element with a Transition component.
 *
 * @param {React.ReactElement} child
 * @param {Function} onHide
 * @param {Object} [options={}]
 * @param {String} [options.animation]
 * @param {Number} [options.duration]
 * @param {Boolean} [options.directional]
 * @param {Boolean} [options.transitionOnMount=false]
 * @param {Boolean} [options.visible=true]
 */
export default function wrapChild(
  child: React.ReactElement<any>,
  onHide: TransitionProps['onHide'],
  options: any = {},
) {
  // Children come from `Children.toArray()`, so they always have a string key
  const key = child.key as string
  const { animation, directional, duration, transitionOnMount = false, visible = true } = options

  return (
    <Transition
      animation={animation}
      directional={directional}
      duration={duration}
      key={key}
      onHide={onHide}
      reactKey={key}
      transitionOnMount={transitionOnMount}
      visible={visible}
    >
      {child}
    </Transition>
  )
}
