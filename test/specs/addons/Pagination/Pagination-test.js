import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import Pagination from 'src/addons/Pagination/Pagination'
import PaginationItem from 'src/addons/Pagination/PaginationItem'
import * as common from 'test/specs/commonTests'

const requiredProps = {
  totalPages: 0,
}

// Heads up! Each PaginationItem renders as "a.item"
const renderItems = (element) => {
  const utils = render(element)
  const getItems = () => utils.container.querySelectorAll('.item')

  return { ...utils, getItems }
}

describe('Pagination', () => {
  common.isConformant(Pagination, { requiredProps })
  common.forwardsRef(Pagination, { requiredProps, tagName: 'div' })
  common.hasSubcomponents(Pagination, [PaginationItem])

  describe('disabled', () => {
    it('is passed to an each item', () => {
      const { getItems } = renderItems(<Pagination activePage={1} disabled totalPages={3} />)
      const items = getItems()

      expect(items).toHaveLength(7)
      items.forEach((item) => {
        expect(item).toHaveClass('disabled')
        expect(item).toHaveAttribute('aria-disabled', 'true')
      })
    })
  })

  describe('onPageChange', () => {
    it('is called with (e, data) when clicked on a pagination item', () => {
      const onPageChange = vi.fn()
      const onPageItemClick = vi.fn()

      const { getItems } = renderItems(
        <Pagination
          activePage={1}
          onPageChange={onPageChange}
          pageItem={{ onClick: onPageItemClick }}
          totalPages={3}
        />,
      )

      fireEvent.click(getItems()[4])

      expect(onPageChange).toHaveBeenCalledTimes(1)
      expect(onPageChange).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ activePage: 3 }),
      )
      expect(onPageItemClick).toHaveBeenCalledTimes(1)
      expect(onPageItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ value: 3 }),
      )
    })

    it('will be omitted if occurred for the same pagination item as the current', () => {
      const onPageChange = vi.fn()
      const { getItems } = renderItems(
        <Pagination
          activePage={1}
          firstItem={null}
          onPageChange={onPageChange}
          prevItem={null}
          totalPages={3}
        />,
      )

      fireEvent.click(getItems()[0])
      expect(onPageChange).not.toHaveBeenCalled()
    })

    it('will be omitted when item "type" is "ellipsisItem"', () => {
      const onPageChange = vi.fn()
      const { getItems } = renderItems(
        <Pagination
          activePage={5}
          firstItem={null}
          onPageChange={onPageChange}
          prevItem={null}
          totalPages={10}
        />,
      )
      const ellipsis = getItems()[1]

      expect(ellipsis).toHaveTextContent('...')

      fireEvent.click(ellipsis)
      expect(onPageChange).not.toHaveBeenCalled()
    })
  })

  describe('activePage', () => {
    it('defaults to "1"', () => {
      const onPageChange = vi.fn()
      const { getItems } = renderItems(<Pagination onPageChange={onPageChange} totalPages={3} />)

      expect(getItems()[2]).toHaveTextContent('1')
      expect(getItems()[2]).toHaveClass('active')

      // Heads up! An item's "value" is visible only in callbacks: "prevItem" points to page 1,
      // it is the current page and does not trigger "onPageChange"
      fireEvent.click(getItems()[1])
      expect(onPageChange).not.toHaveBeenCalled()

      // "nextItem" points to page 2
      fireEvent.click(getItems()[5])
      expect(onPageChange).toHaveBeenCalledTimes(1)
      expect(onPageChange).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ activePage: 2 }),
      )
    })

    it('can be set via "defaultActivePage"', () => {
      const { getItems } = renderItems(<Pagination defaultActivePage={2} totalPages={3} />)

      expect(getItems()[3]).toHaveTextContent('2')
      expect(getItems()[3]).toHaveClass('active')
      expect(getItems()[3]).toHaveAttribute('aria-current', 'true')
    })

    it('can be set via "activePage"', () => {
      const { getItems } = renderItems(<Pagination activePage={2} totalPages={3} />)

      expect(getItems()[3]).toHaveTextContent('2')
      expect(getItems()[3]).toHaveClass('active')
      expect(getItems()[3]).toHaveAttribute('aria-current', 'true')
    })
  })
})
