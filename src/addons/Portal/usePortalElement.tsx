import * as React from 'react'

import { getElementRef, isForwardRef, useMergedRefs } from '../../lib'

/**
 * Assigns merged ref to an existing element is possible or wraps it with an additional "div".
 *
 * @param {React.ReactNode} node
 * @param {React.Ref} userRef
 */
export default function usePortalElement(node: React.ReactNode, userRef: React.Ref<any>) {
  const ref = useMergedRefs(getElementRef(node), userRef)

  if (React.isValidElement(node)) {
    if (isForwardRef(node)) {
      return React.cloneElement(node as React.ReactElement<any>, { ref })
    }

    if (typeof node.type === 'string') {
      return React.cloneElement(node as React.ReactElement<any>, { ref })
    }
  }

  return (
    <div data-suir-portal='true' ref={ref}>
      {node}
    </div>
  )
}
