import _ from 'lodash'
import React from 'react'

import Image from 'src/elements/Image/Image'
import ImageGroup from 'src/elements/Image/ImageGroup'
import { htmlImageProps, SUI } from 'src/lib'
import Dimmer from 'src/modules/Dimmer/Dimmer'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('Image', () => {
  common.isConformant(Image)

  common.forwardsRef(Image, { tagName: 'img' })
  common.forwardsRef(Image, {
    requiredProps: { as: 'div', children: <span /> },
    tagName: 'div',
  })
  common.forwardsRef(Image, {
    requiredProps: { as: 'div', content: <span /> },
    tagName: 'div',
  })
  common.forwardsRef(Image, {
    requiredProps: { label: faker.lorem.word() },
    tagName: 'img',
  })

  common.hasSubcomponents(Image, [ImageGroup])
  common.hasUIClassName(Image)
  common.rendersChildren(Image)

  common.implementsCreateMethod(Image)
  common.implementsLabelProp(Image, { autoGenerateKey: false })
  common.implementsShorthandProp(Image, {
    autoGenerateKey: false,
    propKey: 'dimmer',
    ShorthandComponent: Dimmer,
    mapValueToProps: (val) => ({ content: val }),
  })
  common.implementsVerticalAlignProp(Image)

  common.propKeyAndValueToClassName(Image, 'floated', SUI.FLOATS)

  common.propKeyOnlyToClassName(Image, 'avatar')
  common.propKeyOnlyToClassName(Image, 'bordered')
  common.propKeyOnlyToClassName(Image, 'centered')
  common.propKeyOnlyToClassName(Image, 'circular')
  common.propKeyOnlyToClassName(Image, 'disabled')
  common.propKeyOnlyToClassName(Image, 'fluid')
  common.propKeyOnlyToClassName(Image, 'hidden')
  common.propKeyOnlyToClassName(Image, 'inline')
  common.propKeyOnlyToClassName(Image, 'rounded')

  common.propKeyOrValueAndKeyToClassName(Image, 'spaced', ['left', 'right'])

  common.propValueOnlyToClassName(Image, 'size', SUI.SIZES)

  describe('as', () => {
    it('renders "i" by default', () => {
      expect(renderRoot(<Image />).tagName).toBe('IMG')
    })
  })

  describe('content', () => {
    it('renders a div', () => {
      const root = renderRoot(<Image content='foo' />)

      expect(root.tagName).toBe('DIV')
      expect(root).toHaveTextContent('foo')
    })
  })

  describe('href', () => {
    it('renders an a tag', () => {
      expect(renderRoot(<Image href='http://example.com' />).tagName).toBe('A')
    })
  })

  describe('image props', () => {
    _.forEach(htmlImageProps, (propName) => {
      // i.e. "srcSet" => "srcset"
      const attributeName = propName.toLowerCase()

      it(`keeps "${propName}" on root element by default`, () => {
        const root = renderRoot(<Image {...{ [propName]: 'foo' }} />)

        expect(root.tagName).toBe('IMG')
        expect(root).toHaveAttribute(attributeName, 'foo')
      })

      it(`passes "${propName}" to the img tag when wrapped`, () => {
        const root = renderRoot(<Image wrapped {...{ [propName]: 'foo' }} />)

        expect(root).not.toHaveAttribute(attributeName)
        expect(root.querySelector('img')).toHaveAttribute(attributeName, 'foo')
      })
    })
  })

  describe('ui', () => {
    it('is true by default', () => {
      expect(renderRoot(<Image />)).toHaveClass('ui')
    })
    it('adds the "ui" className when true', () => {
      expect(renderRoot(<Image ui />)).toHaveClass('ui')
    })
    it('removes the "ui" className when false', () => {
      expect(renderRoot(<Image ui={false} />)).not.toHaveClass('ui')
    })
  })

  describe('wrapped', () => {
    it('renders an div tag when true', () => {
      expect(renderRoot(<Image wrapped />).tagName).toBe('DIV')
    })
  })
})
