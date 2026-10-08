import React from 'react'

import ListIcon from 'src/elements/List/ListIcon'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('ListIcon', () => {
  common.isConformant(ListIcon)
  common.implementsVerticalAlignProp(ListIcon)

  it('returns Icon component', () => {
    const root = renderRoot(<ListIcon name='user' />)

    // An Icon renders as <i class="user icon" aria-hidden="true" />
    expect(root.tagName).toBe('I')
    expect(root).toHaveClassName('user icon')
    expect(root).toHaveAttribute('aria-hidden', 'true')
  })
})
