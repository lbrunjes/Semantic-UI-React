import * as React from 'react'

import { isFragment } from '../../../lib/reactIs'

/**
 * Asserts that a passed element can be used cloned a props will be applied properly.
 */
export default function validateTrigger(element: React.ReactNode) {
  React.Children.only(element)

  if (isFragment(element)) {
    throw new Error('An "React.Fragment" cannot be used as a `trigger`.')
  }
}
