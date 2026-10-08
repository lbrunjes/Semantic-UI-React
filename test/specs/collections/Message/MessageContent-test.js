import React from 'react'
import MessageContent from 'src/collections/Message/MessageContent'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('MessageContent', () => {
  common.isConformant(MessageContent)
  common.forwardsRef(MessageContent)
  common.rendersChildren(MessageContent)

  it('renders an div tag', () => {
    expect(renderRoot(<MessageContent />).tagName).toBe('DIV')
  })

  it('has className content', () => {
    expect(renderRoot(<MessageContent />)).toHaveClass('content')
  })
})
