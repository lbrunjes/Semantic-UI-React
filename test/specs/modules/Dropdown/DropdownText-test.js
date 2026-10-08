import { render } from '@testing-library/react'
import React from 'react'

import DropdownText from 'src/modules/Dropdown/DropdownText'
import * as common from 'test/specs/commonTests'

describe('DropdownText', () => {
  common.isConformant(DropdownText, { componentClassName: 'divider' })
  common.forwardsRef(DropdownText)
  common.rendersChildren(DropdownText)

  it('aria attributes', () => {
    const root = render(<DropdownText />).container.firstElementChild

    expect(root).toHaveAttribute('aria-live', 'polite')
    expect(root).toHaveAttribute('aria-atomic', 'true')
    expect(root).toHaveAttribute('role', 'alert')
  })
})
