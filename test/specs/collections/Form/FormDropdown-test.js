import React from 'react'

import FormDropdown from 'src/collections/Form/FormDropdown'
import Dropdown from 'src/modules/Dropdown/Dropdown'
import * as common from 'test/specs/commonTests'
import { renderDetached } from 'test/utils/domMatching'
import { renderRoot } from 'test/utils'

describe('FormDropdown', () => {
  common.isConformant(FormDropdown, { ignoredTypingsProps: ['error'] })
  common.labelImplementsHtmlForProp(FormDropdown)
  common.forwardsRef(FormDropdown)

  it('renders a FormField with a Dropdown control', () => {
    const root = renderRoot(<FormDropdown />)

    expect(root).toHaveClass('field')
    expect(root.querySelector('.ui.dropdown')).toBeInTheDocument()
    expect(root.firstElementChild.isEqualNode(renderDetached(<Dropdown />))).toBe(true)
  })
})
