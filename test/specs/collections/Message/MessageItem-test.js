import { render } from '@testing-library/react'
import React from 'react'
import MessageItem from 'src/collections/Message/MessageItem'
import * as common from 'test/specs/commonTests'

describe('MessageItem', () => {
  common.isConformant(MessageItem, { componentClassName: 'content' })
  common.forwardsRef(MessageItem, { tagName: 'li' })
  common.implementsCreateMethod(MessageItem)
  common.rendersChildren(MessageItem)

  it('renders an li tag', () => {
    const { container } = render(<MessageItem />, {
      container: document.body.appendChild(document.createElement('ul')),
    })

    expect(container.firstElementChild.tagName).toBe('LI')
  })
})
