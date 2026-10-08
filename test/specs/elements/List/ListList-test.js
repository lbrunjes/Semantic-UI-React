import React from 'react'

import ListList from 'src/elements/List/ListList'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('ListList', () => {
  common.isConformant(ListList)
  common.forwardsRef(ListList)
  common.rendersChildren(ListList)

  describe('list', () => {
    it('omitted when rendered as `ol`', () => {
      expect(renderRoot(<ListList as='ol' />)).not.toHaveClass('list')
    })

    it('omitted when rendered as `ul`', () => {
      expect(renderRoot(<ListList as='ul' />)).not.toHaveClass('list')
    })
  })
})
