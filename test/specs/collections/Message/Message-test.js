import { fireEvent } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import Message from 'src/collections/Message/Message'
import MessageContent from 'src/collections/Message/MessageContent'
import MessageHeader from 'src/collections/Message/MessageHeader'
import MessageList from 'src/collections/Message/MessageList'
import { SUI } from 'src/lib'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('Message', () => {
  common.isConformant(Message)
  common.forwardsRef(Message)
  common.forwardsRef(Message, { requiredProps: { children: <span /> } })
  common.hasSubcomponents(Message, [MessageContent, MessageHeader, MessageList])
  common.hasUIClassName(Message)
  common.rendersChildren(Message, {
    rendersContent: false,
  })

  common.implementsIconProp(Message, { autoGenerateKey: false })
  common.implementsShorthandProp(Message, {
    autoGenerateKey: false,
    propKey: 'content',
    ShorthandComponent: 'p',
    mapValueToProps: (val) => ({ children: val }),
  })
  common.implementsShorthandProp(Message, {
    autoGenerateKey: false,
    propKey: 'header',
    ShorthandComponent: MessageHeader,
    mapValueToProps: (val) => ({ content: val }),
  })
  common.implementsShorthandProp(Message, {
    autoGenerateKey: false,
    propKey: 'list',
    ShorthandComponent: MessageList,
    mapValueToProps: (val) => ({ items: val }),
  })

  common.propKeyOnlyToClassName(Message, 'compact')
  common.propKeyOnlyToClassName(Message, 'error')
  common.propKeyOnlyToClassName(Message, 'floating')
  common.propKeyOnlyToClassName(Message, 'hidden')
  common.propKeyOnlyToClassName(Message, 'icon')
  common.propKeyOnlyToClassName(Message, 'info')
  common.propKeyOnlyToClassName(Message, 'negative')
  common.propKeyOnlyToClassName(Message, 'positive')
  common.propKeyOnlyToClassName(Message, 'success')
  common.propKeyOnlyToClassName(Message, 'visible')
  common.propKeyOnlyToClassName(Message, 'warning')

  common.propKeyOrValueAndKeyToClassName(Message, 'attached', ['bottom', 'top'])

  common.propValueOnlyToClassName(Message, 'color', SUI.COLORS)
  common.propValueOnlyToClassName(Message, 'size', _.without(SUI.SIZES, 'medium'))

  describe('header', () => {
    it('adds MessageContent when defined', () => {
      const root = renderRoot(<Message header='This is a message' />)

      expect(root.querySelector(':scope > .content > .header')).toHaveTextContent(
        'This is a message',
      )
    })
  })

  describe('icon', () => {
    it('does not have MessageContent by default', () => {
      expect(renderRoot(<Message />).querySelector('.content')).not.toBeInTheDocument()
    })
    it('renders children when "true"', () => {
      const text = 'child text'

      expect(renderRoot(<Message icon>{text}</Message>).textContent).toBe(text)

      const root = renderRoot(
        <Message icon>
          <div id='foo' />
        </Message>,
      )

      expect(root.querySelector(':scope > div#foo')).toBeInTheDocument()
    })
  })

  describe('list', () => {
    it('adds MessageContent when defined', () => {
      const root = renderRoot(<Message list={[]} />)

      expect(root.querySelector(':scope > .content > ul.list')).toBeInTheDocument()
    })
  })

  describe('onDismiss', () => {
    it('has no close icon by default', () => {
      expect(renderRoot(<Message />).querySelector('.close.icon')).not.toBeInTheDocument()
    })

    it('adds a close icon when defined', () => {
      const root = renderRoot(<Message onDismiss={() => undefined} />)

      expect(root.querySelector('.close.icon')).toBeInTheDocument()
    })

    it('is called with (event) on close icon click', () => {
      const props = { icon: true }

      const spy = vi.fn()
      const root = renderRoot(<Message {...props} onDismiss={spy} />)

      expect(root.querySelector('.close.icon')).toBeInTheDocument()
      fireEvent.click(root.querySelector('.close.icon'))

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining(props),
      )
    })
  })
})
