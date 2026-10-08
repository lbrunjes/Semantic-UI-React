import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import Tab from 'src/modules/Tab/Tab'
import TabPane from 'src/modules/Tab/TabPane'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

// Heads up! A Menu renders as "div.ui.menu", a TabPane as "div.ui.segment.tab", GridColumn as "div.column"
const isMenu = (node) => node.matches('div.ui.menu')
const isPane = (node) => node.matches('div.ui.segment.tab')
const isGridColumn = (node) => node.matches('div.column')

describe('Tab', () => {
  common.isConformant(Tab)
  common.forwardsRef(Tab)
  common.forwardsRef(Tab, { requiredProps: { menu: { vertical: true } } })
  common.hasSubcomponents(Tab, [TabPane])

  const panes = [
    { menuItem: 'Tab 1', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
    { menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
    { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ]

  // Checks the "Grid > [GridColumn > Menu, GridColumn > Pane]" structure
  const assertVerticalLayout = (root, position) => {
    const grid = root.firstElementChild
    const [first, second] = grid.children
    const [menuColumn, paneColumn] = position === 'left' ? [first, second] : [second, first]

    expect(grid).toHaveClassName('ui grid')
    expect(grid.children).toHaveLength(2)

    expect(isGridColumn(menuColumn)).toBe(true)
    expect(isMenu(menuColumn.firstElementChild)).toBe(true)

    expect(isGridColumn(paneColumn)).toBe(true)
    expect(isPane(paneColumn.firstElementChild)).toBe(true)
  }

  describe('menu', () => {
    it('passes the props to the Menu', () => {
      const { container } = render(<Tab menu={{ 'data-foo': 'bar' }} />)

      expect(container.querySelector('.ui.menu')).toHaveAttribute('data-foo', 'bar')
    })

    it('has an item for every menuItem in panes', () => {
      const { container } = render(<Tab panes={panes} />)
      const items = container.querySelectorAll('.ui.menu .item')

      expect(items).toHaveLength(3)
      expect(items[0]).toHaveTextContent('Tab 1')
      expect(items[1]).toHaveTextContent('Tab 2')
      expect(items[2]).toHaveTextContent('Tab 3')
    })

    it('renders above the pane by default', () => {
      const root = renderRoot(<Tab panes={panes} />)

      expect(isMenu(root.children[0])).toBe(true)
      expect(isPane(root.children[1])).toBe(true)
    })

    it("renders below the pane when attached='bottom'", () => {
      const root = renderRoot(<Tab menu={{ attached: 'bottom' }} panes={panes} />)

      expect(isPane(root.children[0])).toBe(true)
      expect(isMenu(root.children[1])).toBe(true)
    })

    it("infers tabular's value from tab's menuPosition if tabular is set to true", () => {
      const menu = { fluid: true, vertical: true, tabular: true }
      const root = renderRoot(<Tab menu={menu} menuPosition='right' panes={panes} />)

      assertVerticalLayout(root, 'right')
      expect(root.querySelector('.ui.menu')).toHaveClassName('right tabular')
    })

    it("does not infer tabular's value from tab's menuPosition if tabular is explicitly set", () => {
      const menu = { fluid: true, vertical: true, tabular: 'right' }
      const root = renderRoot(<Tab menu={menu} menuPosition='left' panes={panes} />)

      assertVerticalLayout(root, 'left')
      expect(root.querySelector('.ui.menu')).toHaveClassName('right tabular')
    })

    it('renders right when tabular is set to right', () => {
      const menu = { fluid: true, vertical: true, tabular: 'right' }
      const root = renderRoot(<Tab menu={menu} panes={panes} />)

      assertVerticalLayout(root, 'right')
    })
  })

  describe('menuPosition', () => {
    it('renders left of the pane when set left', () => {
      const menu = { fluid: true, vertical: true }
      const root = renderRoot(<Tab menu={menu} menuPosition='left' panes={panes} />)

      assertVerticalLayout(root, 'left')
    })

    it("renders left of the pane when set 'left', even if tabular is right", () => {
      const menu = { fluid: true, vertical: true, tabular: 'right' }
      const root = renderRoot(<Tab menu={menu} menuPosition='left' panes={panes} />)

      assertVerticalLayout(root, 'left')
    })

    it("renders right of the pane when set 'right'", () => {
      const menu = { fluid: true, vertical: true }
      const root = renderRoot(<Tab menu={menu} menuPosition='right' panes={panes} />)

      assertVerticalLayout(root, 'right')
    })
  })

  describe('activeIndex', () => {
    it('is passed to the Menu', () => {
      const { container } = render(<Tab panes={panes} activeIndex={1} />)
      const items = container.querySelectorAll('.ui.menu .item')

      expect(items[0]).not.toHaveClass('active')
      expect(items[1]).toHaveClass('active')
      expect(items[2]).not.toHaveClass('active')
    })

    it('is set when clicking an item', () => {
      const { container } = render(<Tab panes={panes} />)

      expect(container.querySelector('.ui.segment.tab')).toHaveTextContent('Tab 1')

      fireEvent.click(container.querySelectorAll('.ui.menu .item')[1])
      expect(container.querySelector('.ui.segment.tab')).toHaveTextContent('Tab 2 Content')
    })

    it('can be set via props', () => {
      const { container, rerender } = render(<Tab panes={panes} activeIndex={1} />)

      expect(container.querySelector('.ui.segment.tab')).toHaveTextContent('Tab 2 Content')

      rerender(<Tab panes={panes} activeIndex={2} />)
      expect(container.querySelector('.ui.segment.tab')).toHaveTextContent('Tab 3 Content')
    })

    it('determines which pane render method is called', () => {
      const activeIndex = 1
      const props = { activeIndex, panes }
      const renderSpy = vi.spyOn(panes[activeIndex], 'render')

      render(<Tab {...props} />)

      expect(renderSpy).toHaveBeenCalledTimes(1)
      expect(renderSpy).toHaveBeenCalledWith(expect.objectContaining(props))
    })
  })

  describe('onTabChange', () => {
    it('is called with (e, { ...props, activeIndex }) a menu item is clicked', () => {
      const activeIndex = 1
      const spy = vi.fn()
      const props = { onTabChange: spy, panes }

      const { container } = render(<Tab {...props} />)
      fireEvent.click(container.querySelectorAll('.ui.menu .item')[activeIndex])

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ activeIndex: 1, onTabChange: spy, panes }),
      )
    })

    it('is called with the new proposed activeIndex, not the current', () => {
      const spy = vi.fn()

      const { container } = render(<Tab activeIndex={-1} onTabChange={spy} panes={panes} />)
      const items = container.querySelectorAll('.ui.menu .item')

      expect(spy).toHaveBeenCalledTimes(0)

      fireEvent.click(items[0])
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        expect.objectContaining({ activeIndex: 0 }),
      )

      fireEvent.click(items[1])
      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        expect.objectContaining({ activeIndex: 1 }),
      )

      fireEvent.click(items[2])
      expect(spy).toHaveBeenCalledTimes(3)
      expect(spy).toHaveBeenLastCalledWith(
        expect.any(Object),
        expect.objectContaining({ activeIndex: 2 }),
      )
    })
  })

  describe('renderActiveOnly', () => {
    it('renders all tabs when false', () => {
      const textPanes = [{ pane: 'Tab 1' }, { pane: 'Tab 2' }, { pane: 'Tab 3' }]
      const { container } = render(<Tab panes={textPanes} renderActiveOnly={false} />)
      const items = container.querySelectorAll('.ui.segment.tab')

      expect(items).toHaveLength(3)
      expect(items[0]).toHaveTextContent('Tab 1')
      expect(items[1]).toHaveTextContent('Tab 2')
      expect(items[2]).toHaveTextContent('Tab 3')
    })
  })
})
