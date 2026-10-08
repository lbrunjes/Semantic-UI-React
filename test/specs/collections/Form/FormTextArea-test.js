import React from 'react'

import TextArea from 'src/addons/TextArea/TextArea'
import FormTextArea from 'src/collections/Form/FormTextArea'
import * as common from 'test/specs/commonTests'
import { renderDetached } from 'test/utils/domMatching'
import { renderRoot } from 'test/utils'

describe('FormTextArea', () => {
  common.isConformant(FormTextArea)
  common.forwardsRef(FormTextArea, { tagName: 'textarea' })
  common.labelImplementsHtmlForProp(FormTextArea)

  it('renders a FormField with a TextArea control', () => {
    const root = renderRoot(<FormTextArea />)

    expect(root).toHaveClass('field')
    expect(root.querySelector('textarea')).toBeInTheDocument()
    expect(root.firstElementChild.isEqualNode(renderDetached(<TextArea />))).toBe(true)
  })
})
