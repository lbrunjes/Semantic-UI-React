import React from 'react'

import FormButton from 'src/collections/Form/FormButton'
import Button from 'src/elements/Button/Button'
import * as common from 'test/specs/commonTests'
import { renderDetached } from 'test/utils/domMatching'
import { renderRoot } from 'test/utils'

describe('FormButton', () => {
  common.isConformant(FormButton, {
    ignoredTypingsProps: ['label'],
  })
  common.labelImplementsHtmlForProp(FormButton)

  it('renders a FormField with a Button control', () => {
    const root = renderRoot(<FormButton />)

    expect(root).toHaveClass('field')
    expect(root.querySelector('button.ui.button')).toBeInTheDocument()
    expect(root.firstElementChild.isEqualNode(renderDetached(<Button />))).toBe(true)
  })

  common.forwardsRef(FormButton, { tagName: 'button' })
})
