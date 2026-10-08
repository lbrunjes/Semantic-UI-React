import { render } from '@testing-library/react'
import React from 'react'

import TabPane from 'src/modules/Tab/TabPane'
import * as common from 'test/specs/commonTests'

describe('TabPane', () => {
  common.isConformant(TabPane, { componentClassName: 'tab' })
  common.forwardsRef(TabPane)

  common.implementsCreateMethod(TabPane)

  common.propKeyOnlyToClassName(TabPane, 'active', { defaultValue: 'left' })
  common.propKeyOnlyToClassName(TabPane, 'loading')

  it('renders a Segment by default', () => {
    const root = render(<TabPane />).container.firstElementChild

    expect(root.tagName).toBe('DIV')
    expect(root).toHaveClassName('ui bottom attached segment')
  })
})
