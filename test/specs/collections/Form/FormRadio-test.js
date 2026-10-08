import React from 'react'

import Radio from 'src/addons/Radio/Radio'
import FormRadio from 'src/collections/Form/FormRadio'
import * as common from 'test/specs/commonTests'
import { renderDetached } from 'test/utils/domMatching'
import { renderRoot } from 'test/utils'

describe('FormRadio', () => {
  common.isConformant(FormRadio, {
    ignoredTypingsProps: ['type'],
  })
  common.forwardsRef(FormRadio, { tagName: 'input' })

  it('renders a FormField with a Radio control', () => {
    const root = renderRoot(<FormRadio />)

    expect(root).toHaveClass('field')
    expect(root.querySelector('.ui.radio.checkbox input[type="radio"]')).toBeInTheDocument()
    expect(root.firstElementChild.isEqualNode(renderDetached(<Radio />))).toBe(true)
  })
})
