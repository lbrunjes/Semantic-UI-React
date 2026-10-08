import { render } from '@testing-library/react'
import React from 'react'

import Select from 'src/addons/Select/Select'
import Dropdown from 'src/modules/Dropdown/Dropdown'
import * as common from 'test/specs/commonTests'
import { renderDetached } from 'test/utils/domMatching'

const requiredProps = {
  options: [],
}

describe('Select', () => {
  common.isConformant(Select, { requiredProps })
  common.hasSubcomponents(Select, [Dropdown.Divider, Dropdown.Header, Dropdown.Item, Dropdown.Menu])
  common.forwardsRef(Select, { requiredProps })

  it('renders a selection Dropdown', () => {
    const root = render(<Select {...requiredProps} />).container.firstElementChild
    const expected = renderDetached(<Dropdown {...requiredProps} selection />)

    expect(root).toHaveClassName('ui selection dropdown')
    expect(root.isEqualNode(expected)).toBe(true)
  })
})
