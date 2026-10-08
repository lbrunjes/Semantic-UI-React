import { render } from '@testing-library/react'
import * as React from 'react'

import { isForwardRef } from 'src/lib/reactIs'
import { consoleUtil } from 'test/utils'

/**
 * Assert a Component correctly implements a shorthand create method.
 * @param {React.ElementType} Component The component to test
 * @param {{ isMemoized?: Boolean, requiredProps?: Object, tagName?: string }} options
 */
export default function forwardsRef(Component, options = {}) {
  describe('forwardsRef', () => {
    const { isMemoized = false, requiredProps = {}, tagName = 'div' } = options
    const RootComponent = isMemoized ? Component.type : Component

    it('is produced by React.forwardRef() call', () => {
      expect(isForwardRef(<RootComponent {...requiredProps} />)).toBe(true)
    })

    it('a render function is anonymous', () => {
      // Heads up! React copies "displayName" of a forwardRef() component to its render function
      // only if the function is anonymous (React 19 also sets its "name")
      expect(RootComponent.render.displayName).toBe(RootComponent.displayName)
    })

    it(`forwards ref to "${tagName}"`, () => {
      const ref = vi.fn()

      // rendering can produce "validateNesting" error from React when elements like "td" are mounted
      consoleUtil.disableOnce()
      render(<Component {...requiredProps} ref={ref} />)

      expect(ref).toHaveBeenCalledTimes(1)
      expect(ref.mock.calls[0][0]).toHaveProperty('tagName', tagName.toUpperCase())
    })
  })
}
