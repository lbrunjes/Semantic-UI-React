import _ from 'lodash'
import React from 'react'

import Header from 'src/elements/Header/Header'
import HeaderContent from 'src/elements/Header/HeaderContent'
import HeaderSubheader from 'src/elements/Header/HeaderSubheader'
import { SUI } from 'src/lib'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('Header', () => {
  common.hasUIClassName(Header)
  common.forwardsRef(Header, { requiredProps: { children: <span /> } })
  common.forwardsRef(Header, { requiredProps: { icon: 'book' } })
  common.hasSubcomponents(Header, [HeaderContent, HeaderSubheader])
  common.rendersChildren(Header)

  common.implementsIconProp(Header, { autoGenerateKey: false })
  common.implementsImageProp(Header, { autoGenerateKey: false })
  common.implementsShorthandProp(Header, {
    autoGenerateKey: false,
    propKey: 'subheader',
    ShorthandComponent: HeaderSubheader,
    mapValueToProps: (val) => ({ content: val }),
  })
  common.implementsTextAlignProp(Header)

  common.propKeyAndValueToClassName(Header, 'floated', SUI.FLOATS)

  common.propKeyOnlyToClassName(Header, 'block')
  common.propKeyOnlyToClassName(Header, 'disabled')
  common.propKeyOnlyToClassName(Header, 'dividing')
  common.propKeyOnlyToClassName(Header, 'inverted')
  common.propKeyOnlyToClassName(Header, 'sub')

  common.propKeyOrValueAndKeyToClassName(Header, 'attached', ['top', 'bottom'])

  common.propValueOnlyToClassName(Header, 'color', SUI.COLORS)
  common.propValueOnlyToClassName(Header, 'size', _.without(SUI.SIZES, 'big', 'massive', 'mini'))

  describe('icon', () => {
    it('adds an icon class when true', () => {
      expect(renderRoot(<Header icon />)).toHaveClass('icon')
    })
    it('does not add an icon class given a name', () => {
      expect(renderRoot(<Header icon='user' />)).not.toHaveClass('icon')
    })
  })

  describe('image', () => {
    it('adds an image class when true', () => {
      expect(renderRoot(<Header image />)).toHaveClass('image')
    })
    it('does not add an Image when true', () => {
      const root = renderRoot(<Header image />)

      expect(root.querySelector('img')).not.toBeInTheDocument()
      expect(root.querySelector('.image')).not.toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('is wrapped in HeaderContent when there is an image src', () => {
      const root = renderRoot(<Header image='/images/wireframe/image.png' content='Bar' />)

      expect(root.querySelector('img')).toBeInTheDocument()
      expect(root.querySelector('.content')).toHaveTextContent('Bar')
    })
    it('is wrapped in HeaderContent when there is an icon name', () => {
      const root = renderRoot(<Header icon='users' content='Friends' />)

      expect(root.querySelector('i.users.icon')).toBeInTheDocument()
      expect(root.querySelector('.content')).toHaveTextContent('Friends')
    })
    it('is not wrapped in HeaderContent when icon is true', () => {
      const root = renderRoot(<Header icon content='Friends' />)

      expect(root).toHaveTextContent('Friends')
      expect(root.querySelector('.content')).not.toBeInTheDocument()
    })
  })

  describe('subheader', () => {
    it('adds HeaderSubheader as child when there is an icon', () => {
      const text = faker.hacker.phrase()
      const root = renderRoot(<Header icon='user' subheader={text} />)

      expect(root.querySelector('.content > .sub.header')).toHaveTextContent(text)
    })
    it('adds HeaderSubheader as child when there is an image', () => {
      const text = faker.hacker.phrase()
      const root = renderRoot(<Header image='/images/wireframe/image.png' subheader={text} />)

      expect(root.querySelector('.content > .sub.header')).toHaveTextContent(text)
    })
  })
})
