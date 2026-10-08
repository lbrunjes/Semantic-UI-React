import React from 'react'

import MessageHeader from 'src/collections/Message/MessageHeader'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('MessageHeader', () => {
  common.isConformant(MessageHeader)
  common.forwardsRef(MessageHeader)
  common.implementsCreateMethod(MessageHeader)
  common.rendersChildren(MessageHeader)

  it('renders an div tag', () => {
    expect(renderRoot(<MessageHeader />).tagName).toBe('DIV')
  })

  it('has className header', () => {
    expect(renderRoot(<MessageHeader />)).toHaveClass('header')
  })
})
