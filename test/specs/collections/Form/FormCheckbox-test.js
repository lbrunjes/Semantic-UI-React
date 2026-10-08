import React from 'react'

import FormCheckbox from 'src/collections/Form/FormCheckbox'
import Checkbox from 'src/modules/Checkbox/Checkbox'
import * as common from 'test/specs/commonTests'
import { renderDetached } from 'test/utils/domMatching'
import { renderRoot } from 'test/utils'

describe('FormCheckbox', () => {
  common.isConformant(FormCheckbox, {
    ignoredTypingsProps: ['type'],
  })

  it('renders a FormField with a Checkbox control', () => {
    const root = renderRoot(<FormCheckbox />)

    expect(root).toHaveClass('field')
    expect(root.querySelector('.ui.checkbox input[type="checkbox"]')).toBeInTheDocument()
    expect(root.firstElementChild.isEqualNode(renderDetached(<Checkbox />))).toBe(true)
  })

  common.forwardsRef(FormCheckbox, { tagName: 'input' })
})
