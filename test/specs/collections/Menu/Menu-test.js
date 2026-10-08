import { fireEvent } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import Menu from 'src/collections/Menu/Menu'
import MenuItem from 'src/collections/Menu/MenuItem'
import MenuHeader from 'src/collections/Menu/MenuHeader'
import MenuMenu from 'src/collections/Menu/MenuMenu'
import { SUI } from 'src/lib'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('Menu', () => {
  common.isConformant(Menu)
  common.hasSubcomponents(Menu, [MenuHeader, MenuItem, MenuMenu])
  common.hasUIClassName(Menu)
  common.rendersChildren(Menu, {
    rendersContent: false,
  })

  common.implementsWidthProp(Menu, SUI.WIDTHS, {
    canEqual: false,
    propKey: 'widths',
  })

  common.propKeyAndValueToClassName(Menu, 'fixed', ['left', 'right', 'bottom', 'top'])

  common.propKeyOnlyToClassName(Menu, 'borderless')
  common.propKeyOnlyToClassName(Menu, 'compact')
  common.propKeyOnlyToClassName(Menu, 'fluid')
  common.propKeyOnlyToClassName(Menu, 'inverted')
  common.propKeyOnlyToClassName(Menu, 'pagination')
  common.propKeyOnlyToClassName(Menu, 'pointing')
  common.propKeyOnlyToClassName(Menu, 'secondary')
  common.propKeyOnlyToClassName(Menu, 'stackable')
  common.propKeyOnlyToClassName(Menu, 'text')
  common.propKeyOnlyToClassName(Menu, 'vertical')

  common.propKeyOrValueAndKeyToClassName(Menu, 'attached', ['top', 'bottom'])
  common.propKeyOrValueAndKeyToClassName(Menu, 'floated', ['right'])
  common.propKeyOrValueAndKeyToClassName(Menu, 'icon', ['labeled'])
  common.propKeyOrValueAndKeyToClassName(Menu, 'tabular', ['right'])

  common.propValueOnlyToClassName(Menu, 'color', SUI.COLORS)
  common.propValueOnlyToClassName(Menu, 'size', _.without(SUI.SIZES, 'medium', 'big'))

  it('renders a `div` by default', () => {
    expect(renderRoot(<Menu />).tagName).toBe('DIV')
  })

  describe('activeIndex', () => {
    const items = [
      { key: 'home', name: 'home' },
      { key: 'users', name: 'users' },
    ]

    it('is null by default', () => {
      expect(renderRoot(<Menu items={items} />).querySelector('.active')).not.toBeInTheDocument()
    })

    it('is set when clicking an item', () => {
      const root = renderRoot(<Menu items={items} />)

      fireEvent.click(root.querySelectorAll('.item')[1])

      expect(root.querySelectorAll('.item')[1]).toHaveClass('active')
      expect(root.querySelectorAll('.active')).toHaveLength(1)
    })

    it('works as a string', () => {
      const root = renderRoot(<Menu items={items} activeIndex={1} />)

      expect(root.querySelectorAll('.item')[1]).toHaveClass('active')
    })
  })

  describe('items', () => {
    const renderItems = () => {
      const spy = vi.fn()
      const items = [
        { key: 'home', name: 'home', onClick: spy, 'data-foo': 'something' },
        { key: 'users', name: 'users', active: true, 'data-foo': 'something' },
      ]
      const children = renderRoot(<Menu items={items} />).querySelectorAll('.item')

      return { children, spy }
    }

    it('renders children', () => {
      const { children } = renderItems()

      expect(children).toHaveLength(2)
      expect(children[0]).toHaveTextContent('Home')
      expect(children[1]).toHaveTextContent('Users')
    })

    it('onClick can omitted', () => {
      const { children } = renderItems()
      const click = () => fireEvent.click(children[1])

      expect(click).not.toThrow()
    })

    it('passes onClick handler', () => {
      const { children, spy } = renderItems()
      const props = { name: 'home', index: 0 }

      fireEvent.click(children[0])

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining(props),
      )
    })

    it('passes arbitrary props', () => {
      const { children } = renderItems()

      children.forEach((item) => expect(item).toHaveAttribute('data-foo', 'something'))
    })
  })

  describe('onItemClick', () => {
    it('is called with (e, { name, index }) when clicked', () => {
      const onClick = vi.fn()
      const onItemClick = vi.fn()

      const items = [
        { key: 'home', name: 'home' },
        { key: 'users', name: 'users', onClick },
      ]
      const matchProps = { index: 1, name: 'users' }

      const root = renderRoot(<Menu items={items} onItemClick={onItemClick} />)

      fireEvent.click(root.querySelectorAll('.item')[1])

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining(matchProps),
      )
      expect(onItemClick).toHaveBeenCalledTimes(1)
      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining(matchProps),
      )
    })
  })
})
