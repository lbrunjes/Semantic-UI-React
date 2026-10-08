import { fireEvent } from '@testing-library/react'
import React from 'react'

import List from 'src/elements/List/List'
import ListContent from 'src/elements/List/ListContent'
import ListDescription from 'src/elements/List/ListDescription'
import ListHeader from 'src/elements/List/ListHeader'
import ListIcon from 'src/elements/List/ListIcon'
import ListItem from 'src/elements/List/ListItem'
import ListList from 'src/elements/List/ListList'
import { SUI } from 'src/lib'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('List', () => {
  common.isConformant(List)
  common.forwardsRef(List)
  common.forwardsRef(List, { requiredProps: { children: <span /> } })
  common.forwardsRef(List, { requiredProps: { content: faker.lorem.word() } })
  common.hasSubcomponents(List, [
    ListContent,
    ListDescription,
    ListHeader,
    ListIcon,
    ListItem,
    ListList,
  ])
  common.hasUIClassName(List)
  common.rendersChildren(List)

  common.implementsVerticalAlignProp(List)

  common.propKeyAndValueToClassName(List, 'floated', SUI.FLOATS)

  common.propKeyOnlyToClassName(List, 'animated')
  common.propKeyOnlyToClassName(List, 'bulleted')
  common.propKeyOnlyToClassName(List, 'celled')
  common.propKeyOnlyToClassName(List, 'divided')
  common.propKeyOnlyToClassName(List, 'horizontal')
  common.propKeyOnlyToClassName(List, 'inverted')
  common.propKeyOnlyToClassName(List, 'link')
  common.propKeyOnlyToClassName(List, 'ordered')
  common.propKeyOnlyToClassName(List, 'selection')

  common.propKeyOrValueAndKeyToClassName(List, 'relaxed', ['very'])

  common.propValueOnlyToClassName(List, 'size', SUI.SIZES)

  const items = ['Name', 'Status', 'Notes']

  describe('onItemClick', () => {
    it('is called with (e, itemProps) when clicked', () => {
      const onClick = vi.fn()
      const onItemClick = vi.fn()

      const callbackData = { content: 'Notes', 'data-foo': 'bar' }
      const itemProps = { key: 'notes', content: 'Notes', 'data-foo': 'bar', onClick }

      const root = renderRoot(<List items={[itemProps]} onItemClick={onItemClick} />)
      fireEvent.click(root.querySelector('.item'))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining(callbackData),
      )

      expect(onItemClick).toHaveBeenCalledTimes(1)
      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining(callbackData),
      )
    })
  })

  describe('role', () => {
    it('is accessibile with no items', () => {
      expect(renderRoot(<List />)).toHaveAttribute('role', 'list')
    })

    it('is accessibile with items', () => {
      expect(renderRoot(<List items={items} />)).toHaveAttribute('role', 'list')
    })

    it('allows overriding with no items', () => {
      expect(renderRoot(<List role='listbox' />)).toHaveAttribute('role', 'listbox')
    })

    it('allows overriding with items', () => {
      expect(renderRoot(<List role='listbox' items={items} />)).toHaveAttribute('role', 'listbox')
    })

    it('allows overriding with children', () => {
      const root = renderRoot(
        <List role='listbox'>
          <ListItem />
        </List>,
      )

      expect(root).toHaveAttribute('role', 'listbox')
    })
  })

  describe('shorthand', () => {
    it('renders empty tr with no shorthand', () => {
      expect(renderRoot(<List />).querySelectorAll('.item')).toHaveLength(0)
    })

    it('renders the items', () => {
      const root = renderRoot(<List items={items} />)
      const itemNodes = root.querySelectorAll('.item')

      expect(itemNodes).toHaveLength(items.length)
      items.forEach((item, index) => expect(itemNodes[index]).toHaveTextContent(item))
    })
  })
})
