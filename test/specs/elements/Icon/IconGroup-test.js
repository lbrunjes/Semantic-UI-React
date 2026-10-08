import React from 'react'

import IconGroup from 'src/elements/Icon/IconGroup'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('IconGroup', () => {
  common.isConformant(IconGroup)
  common.rendersChildren(IconGroup)

  it('renders as an <i> by default', () => {
    expect(renderRoot(<IconGroup />).tagName).toBe('I')
  })
})
