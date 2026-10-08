import React from 'react'

import * as common from 'test/specs/commonTests'
import TableHeader from 'src/collections/Table/TableHeader'
import { renderRootIn } from 'test/utils'

describe('TableHeader', () => {
  common.isConformant(TableHeader)
  common.forwardsRef(TableHeader, { tagName: 'thead' })
  common.rendersChildren(TableHeader)

  common.propKeyOnlyToClassName(TableHeader, 'fullWidth', {
    className: 'full-width',
  })

  it('renders as a thead by default', () => {
    expect(renderRootIn(<TableHeader />, 'table').tagName).toBe('THEAD')
  })
})
