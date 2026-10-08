import React from 'react'

import Select from 'src/addons/Select/Select'
import FormSelect from 'src/collections/Form/FormSelect'
import * as common from 'test/specs/commonTests'
import { renderDetached } from 'test/utils/domMatching'
import { renderRoot } from 'test/utils'

const requiredProps = {
  options: [],
}

describe('FormSelect', () => {
  common.isConformant(FormSelect, { requiredProps, ignoredTypingsProps: ['error'] })
  common.labelImplementsHtmlForProp(FormSelect, { requiredProps })
  common.forwardsRef(FormSelect, { requiredProps })

  it('renders a FormField with a Select control', () => {
    const root = renderRoot(<FormSelect {...requiredProps} />)

    expect(root).toHaveClass('field')
    expect(root.querySelector('.ui.selection.dropdown')).toBeInTheDocument()
    expect(root.firstElementChild.isEqualNode(renderDetached(<Select {...requiredProps} />))).toBe(
      true,
    )
  })
})
