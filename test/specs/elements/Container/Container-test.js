import React from 'react'

import Container from 'src/elements/Container/Container'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('Container', () => {
  common.isConformant(Container)
  common.forwardsRef(Container)
  common.rendersChildren(Container)
  common.hasUIClassName(Container)

  common.propKeyOnlyToClassName(Container, 'text')
  common.propKeyOnlyToClassName(Container, 'fluid')

  common.implementsTextAlignProp(Container)

  it('renders a <div /> element', () => {
    expect(renderRoot(<Container />).tagName).toBe('DIV')
  })
})
