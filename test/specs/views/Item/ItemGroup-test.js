import { render } from '@testing-library/react'
import faker from 'test/utils/faker'
import React from 'react'

import ItemGroup from 'src/views/Item/ItemGroup'
import * as common from 'test/specs/commonTests'

describe('ItemGroup', () => {
  common.isConformant(ItemGroup)
  common.forwardsRef(ItemGroup)
  common.forwardsRef(ItemGroup, { requiredProps: { children: <span /> } })
  common.forwardsRef(ItemGroup, { requiredProps: { content: faker.lorem.word() } })
  common.hasUIClassName(ItemGroup)
  common.rendersChildren(ItemGroup)

  common.propKeyOnlyToClassName(ItemGroup, 'divided')
  common.propKeyOnlyToClassName(ItemGroup, 'link')
  common.propKeyOnlyToClassName(ItemGroup, 'unstackable')

  common.propKeyOrValueAndKeyToClassName(ItemGroup, 'relaxed', ['very'])

  describe('items prop', () => {
    it('renders children', () => {
      const firstText = faker.hacker.phrase()
      const secondText = faker.hacker.phrase()
      const items = [{ content: firstText }, { content: secondText }]

      const { container } = render(<ItemGroup items={items} />)
      const renderedItems = container.querySelectorAll('.items > .item')

      expect(renderedItems).toHaveLength(2)
      expect(renderedItems[0].querySelector('.content')).toHaveTextContent(firstText)
      expect(renderedItems[1].querySelector('.content')).toHaveTextContent(secondText)
    })
  })
})
