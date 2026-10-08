import React from 'react'
import MessageList from 'src/collections/Message/MessageList'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('MessageList', () => {
  common.isConformant(MessageList)
  common.forwardsRef(MessageList, { tagName: 'ul' })
  common.implementsCreateMethod(MessageList)
  common.rendersChildren(MessageList, {
    rendersContent: false,
  })

  it('renders an ul tag', () => {
    expect(renderRoot(<MessageList />).tagName).toBe('UL')
  })

  it('has className list', () => {
    expect(renderRoot(<MessageList />)).toHaveClass('list')
  })

  describe('items', () => {
    it('creates MessageItem children', () => {
      const items = ['foo', 'bar', 'baz']
      const root = renderRoot(<MessageList items={items} />)

      expect(root.querySelectorAll(':scope > li.content')).toHaveLength(3)

      expect(root.children[0].textContent).toBe(items[0])
      expect(root.children[1].textContent).toBe(items[1])
      expect(root.children[2].textContent).toBe(items[2])
    })
  })
})
