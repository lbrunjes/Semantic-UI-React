import PropTypes from 'prop-types'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { isBrowser, makeDebugger, useEventCallback } from '../../lib'
import usePortalElement from './usePortalElement'

export interface PortalInnerProps extends StrictPortalInnerProps {
  [key: string]: any
}

export interface StrictPortalInnerProps {
  /** Primary content. */
  children: React.ReactNode

  /** The node where the portal should mount. */
  mountNode?: any

  /**
   * Called when the PortalInner is mounted on the DOM.
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onMount?: (nothing: null, data: PortalInnerProps) => void

  /**
   * Called when the PortalInner is unmounted from the DOM.
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onUnmount?: (nothing: null, data: PortalInnerProps) => void
}

const debug = makeDebugger('PortalInner')

/**
 * An inner component that allows you to render children outside their parent.
 */
const PortalInner = React.forwardRef<any, PortalInnerProps>(function (props, ref) {
  const handleMount = useEventCallback(() => props?.onMount?.(null, props))
  const handleUnmount = useEventCallback(() => props?.onUnmount?.(null, props))

  const element = usePortalElement(props.children, ref)

  React.useEffect(() => {
    debug('componentDidMount()')
    handleMount()

    return () => {
      debug('componentWillUnmount()')
      handleUnmount()
    }
  }, [])

  if (!isBrowser()) {
    return null
  }

  return createPortal(element, props.mountNode || document.body)
}) as React.FC<PortalInnerProps>

PortalInner.displayName = 'PortalInner'
PortalInner.propTypes = {
  /** Primary content. */
  children: PropTypes.node.isRequired,

  /** The node where the portal should mount. */
  mountNode: PropTypes.any,

  /**
   * Called when the portal is mounted on the DOM
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onMount: PropTypes.func,

  /**
   * Called when the portal is unmounted from the DOM
   *
   * @param {null}
   * @param {object} data - All props.
   */
  onUnmount: PropTypes.func,
}

export default PortalInner
