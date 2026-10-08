import { render } from '@testing-library/react'
import faker from 'test/utils/faker'
import _ from 'lodash'
import React from 'react'

import Item from 'src/views/Item/Item'
import ItemContent from 'src/views/Item/ItemContent'
import ItemDescription from 'src/views/Item/ItemDescription'
import ItemExtra from 'src/views/Item/ItemExtra'
import ItemGroup from 'src/views/Item/ItemGroup'
import ItemHeader from 'src/views/Item/ItemHeader'
import ItemImage from 'src/views/Item/ItemImage'
import ItemMeta from 'src/views/Item/ItemMeta'
import * as common from 'test/specs/commonTests'

describe('Item', () => {
  common.isConformant(Item)
  common.forwardsRef(Item)
  common.forwardsRef(Item, { requiredProps: { children: <span /> } })
  common.forwardsRef(Item, { requiredProps: { content: faker.lorem.word() } })
  common.hasSubcomponents(Item, [
    ItemContent,
    ItemDescription,
    ItemExtra,
    ItemGroup,
    ItemHeader,
    ItemImage,
    ItemMeta,
  ])
  common.rendersChildren(Item, {
    rendersContent: false,
  })

  common.implementsShorthandProp(Item, {
    autoGenerateKey: false,
    propKey: 'image',
    ShorthandComponent: ItemImage,
    mapValueToProps: (val) => ({ src: val }),
  })

  _.forEach(['content', 'description', 'extra', 'header', 'meta'], (propKey) => {
    describe(`${propKey} prop`, () => {
      it('renders ItemContent component', () => {
        const value = faker.hacker.phrase()
        const { container } = render(<Item {...{ [propKey]: value }} />)
        const content = container.querySelector('.item > .content')

        expect(content).toBeInTheDocument()
        expect(content).toHaveTextContent(value)
      })
    })
  })

  describe('image prop', () => {
    it('renders ItemImage component', () => {
      const src = faker.image.imageUrl()
      const { container } = render(<Item image={src} />)

      expect(container.querySelector('.item > .image > img')).toHaveAttribute('src', src)
    })
  })
})
