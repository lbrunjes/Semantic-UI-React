import React from 'react'

import * as common from 'test/specs/commonTests'
import TableBody from 'src/collections/Table/TableBody'
import { renderRootIn } from 'test/utils'

describe('TableBody', () => {
  common.isConformant(TableBody)
  common.forwardsRef(TableBody, { tagName: 'tbody' })
  common.rendersChildren(TableBody, {
    rendersContent: false,
  })

  it('renders as a tbody by default', () => {
    expect(renderRootIn(<TableBody />, 'table').tagName).toBe('TBODY')
  })
})
