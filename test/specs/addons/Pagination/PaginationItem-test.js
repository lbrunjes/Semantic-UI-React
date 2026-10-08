import { fireEvent } from '@testing-library/react'
import React from 'react'

import PaginationItem from 'src/addons/Pagination/PaginationItem'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('PaginationItem', () => {
  common.isConformant(PaginationItem)
  common.forwardsRef(PaginationItem, { tagName: 'a' })
  common.implementsCreateMethod(PaginationItem)

  describe('active', () => {
    it('is "undefined" by default', () => {
      const root = renderRoot(<PaginationItem />)

      expect(root).not.toHaveClass('active')
      expect(root).not.toHaveAttribute('aria-current')
    })

    it('can pass its value', () => {
      expect(renderRoot(<PaginationItem active />)).toHaveClass('active')
    })
  })

  describe('aria-current', () => {
    it('matches the values of "active" prop by default', () => {
      expect(renderRoot(<PaginationItem active />)).toHaveAttribute('aria-current', 'true')
    })

    it('can be overridden', () => {
      expect(renderRoot(<PaginationItem active aria-current={false} />)).toHaveAttribute(
        'aria-current',
        'false',
      )
    })
  })

  describe('disabled', () => {
    it('is "false" by default', () => {
      const root = renderRoot(<PaginationItem />)

      expect(root).not.toHaveClass('disabled')
      expect(root).toHaveAttribute('aria-disabled', 'false')
    })

    it('is "true" when "type" is "ellipsisItem"', () => {
      const root = renderRoot(<PaginationItem type='ellipsisItem' />)

      expect(root).toHaveClass('disabled')
      expect(root).toHaveAttribute('aria-disabled', 'true')
    })

    it('can be overridden', () => {
      const root = renderRoot(<PaginationItem disabled />)

      expect(root).toHaveClass('disabled')
      expect(root).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('onClick', () => {
    it('is called with (e, props) when clicked', () => {
      const onClick = vi.fn()

      fireEvent.click(renderRoot(<PaginationItem onClick={onClick} />))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ onClick }),
      )
    })

    it('is called with (e, props) when "Enter" is pressed', () => {
      const onClick = vi.fn()

      fireEvent.keyDown(renderRoot(<PaginationItem onClick={onClick} />), { key: 'Enter' })

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'Enter' }),
        expect.objectContaining({ onClick }),
      )
    })
  })

  describe('onKeyDown', () => {
    it('is called with (e, props) when clicked', () => {
      const onKeyDown = vi.fn()

      fireEvent.keyDown(renderRoot(<PaginationItem onKeyDown={onKeyDown} />), { key: 'Enter' })

      expect(onKeyDown).toHaveBeenCalledTimes(1)
      expect(onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'Enter' }),
        expect.objectContaining({ onKeyDown }),
      )
    })
  })

  describe('tabIndex', () => {
    it('is "0" by default', () => {
      expect(renderRoot(<PaginationItem />)).toHaveAttribute('tabindex', '0')
    })

    it('is "-1" when "type" is "ellipsisItem"', () => {
      expect(renderRoot(<PaginationItem type='ellipsisItem' />)).toHaveAttribute('tabindex', '-1')
    })

    it('can be overridden', () => {
      expect(renderRoot(<PaginationItem tabIndex={5} />)).toHaveAttribute('tabindex', '5')
    })
  })
})
