import * as React from 'react'
import { createPortal } from 'react-dom'

import { isBrowser, useEventCallback } from '../../lib'
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

/**
 * An inner component that allows you to render children outside their parent.
 */
const PortalInner = React.forwardRef<any, PortalInnerProps>(function (props, ref) {
  const handleMount = useEventCallback(() => props?.onMount?.(null, props))
  const handleUnmount = useEventCallback(() => props?.onUnmount?.(null, props))

  const element = usePortalElement(props.children, ref)

  React.useEffect(() => {
    handleMount()

    return () => {
      handleUnmount()
    }
  }, [])

  if (!isBrowser()) {
    return null
  }

  return createPortal(element, props.mountNode || document.body)
}) as React.FC<PortalInnerProps>

PortalInner.displayName = 'PortalInner'
PortalInner.handledProps = ['children', 'mountNode', 'onMount', 'onUnmount']

export default PortalInner
