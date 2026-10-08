import { fireEvent, render } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import { SUI } from 'src/lib'
import Rating from 'src/modules/Rating/Rating'
import * as common from 'test/specs/commonTests'

// Renders a Rating, returns its root node & a getter for its icons
const renderRating = (element) => {
  const utils = render(element)
  const root = utils.container.firstElementChild
  const getIcons = () => Array.from(root.querySelectorAll('i.icon'))

  return { ...utils, root, getIcons }
}

describe('Rating', () => {
  common.isConformant(Rating)
  common.forwardsRef(Rating)
  common.hasUIClassName(Rating)

  common.propKeyOnlyToClassName(Rating, 'disabled')

  common.propValueOnlyToClassName(Rating, 'icon', ['star', 'heart'])
  common.propValueOnlyToClassName(Rating, 'size', _.without(SUI.SIZES, 'medium', 'big'))

  describe('clicking on icons', () => {
    it('makes icons active up to and including the clicked icon', () => {
      const { getIcons } = renderRating(<Rating maxRating={3} />)

      fireEvent.click(getIcons()[1])

      const icons = getIcons()

      expect(icons[0]).toHaveClass('active')
      expect(icons[1]).toHaveClass('active')
      expect(icons[2]).not.toHaveClass('active')
    })

    it('if no rating selected no icon should have aria-checked', () => {
      const { getIcons } = renderRating(<Rating maxRating={3} />)
      const icons = getIcons()

      expect(icons[0]).toHaveAttribute('aria-checked', 'false')
      expect(icons[1]).toHaveAttribute('aria-checked', 'false')
      expect(icons[2]).toHaveAttribute('aria-checked', 'false')
    })

    it('makes the clicked icon aria-checked', () => {
      const { getIcons } = renderRating(<Rating maxRating={3} />)

      fireEvent.click(getIcons()[1])

      const icons = getIcons()

      expect(icons[0]).toHaveAttribute('aria-checked', 'false')
      expect(icons[1]).toHaveAttribute('aria-checked', 'true')
      expect(icons[2]).toHaveAttribute('aria-checked', 'false')
    })

    it('set aria-setsize on each rating icon', () => {
      const { getIcons } = renderRating(<Rating maxRating={3} />)

      fireEvent.click(getIcons()[1])

      const icons = getIcons()

      expect(icons[0]).toHaveAttribute('aria-setsize', '3')
      expect(icons[1]).toHaveAttribute('aria-setsize', '3')
      expect(icons[2]).toHaveAttribute('aria-setsize', '3')
    })

    it('sets aria-posinset on each rating icon', () => {
      const { getIcons } = renderRating(<Rating maxRating={3} />)

      fireEvent.click(getIcons()[1])

      const icons = getIcons()

      expect(icons[0]).toHaveAttribute('aria-posinset', '1')
      expect(icons[1]).toHaveAttribute('aria-posinset', '2')
      expect(icons[2]).toHaveAttribute('aria-posinset', '3')
    })

    it('removes the "selected" prop', () => {
      const { root, getIcons } = renderRating(<Rating maxRating={3} />)

      fireEvent.mouseEnter(_.last(getIcons()))
      fireEvent.click(_.last(getIcons()))

      expect(root).not.toHaveClass('selected')
      expect(root.querySelectorAll('.icon.selected')).toHaveLength(0)
    })
  })

  describe('hovering on icons', () => {
    it('adds the "selected" className to the Rating', () => {
      const { root, getIcons } = renderRating(<Rating maxRating={3} />)

      fireEvent.mouseEnter(getIcons()[0])
      expect(root).toHaveClass('selected')
    })

    it('selects icons up to and including the hovered icon', () => {
      const { getIcons } = renderRating(<Rating maxRating={3} />)

      fireEvent.mouseEnter(getIcons()[1])

      const icons = getIcons()

      expect(icons[0]).toHaveClass('selected')
      expect(icons[1]).toHaveClass('selected')
      expect(icons[2]).not.toHaveClass('selected')
    })

    it('unselects icons on mouse leave', () => {
      const { root, getIcons } = renderRating(<Rating maxRating={3} />)

      fireEvent.mouseEnter(_.last(getIcons()))
      expect(root.querySelectorAll('.icon.selected')).toHaveLength(3)

      fireEvent.mouseLeave(root)
      expect(root.querySelectorAll('.icon.selected')).toHaveLength(0)
    })
  })

  describe('clearable', () => {
    it('prevents clearing by default with multiple icons', () => {
      const { root, getIcons } = renderRating(<Rating defaultRating={5} maxRating={5} />)

      fireEvent.click(_.last(getIcons()))
      expect(root.querySelectorAll('.icon.active')).toHaveLength(5)
    })

    it('allows toggling when set to "auto" with a single icon', () => {
      const { getIcons } = renderRating(<Rating clearable='auto' maxRating={1} />)

      fireEvent.click(getIcons()[0])
      expect(getIcons()[0]).toHaveClass('active')

      fireEvent.click(getIcons()[0])
      expect(getIcons()[0]).not.toHaveClass('active')
    })

    it('allows clearing when true with a single icon', () => {
      const { getIcons } = renderRating(<Rating clearable defaultRating={1} maxRating={1} />)

      fireEvent.click(getIcons()[0])
      expect(getIcons()[0]).not.toHaveClass('active')
    })

    it('allows clearing when true with multiple icons', () => {
      const { root, getIcons } = renderRating(<Rating clearable defaultRating={4} maxRating={5} />)

      fireEvent.click(getIcons()[3])
      expect(root.querySelectorAll('.icon.active')).toHaveLength(0)
    })

    it('prevents clearing when false with a single icon', () => {
      const { getIcons } = renderRating(
        <Rating clearable={false} defaultRating={1} maxRating={1} />,
      )

      fireEvent.click(getIcons()[0])
      expect(getIcons()[0]).toHaveClass('active')
    })

    it('prevents clearing when false with multiple icons', () => {
      const { root, getIcons } = renderRating(
        <Rating clearable={false} defaultRating={5} maxRating={5} />,
      )

      fireEvent.click(_.last(getIcons()))
      expect(root.querySelectorAll('.icon.active')).toHaveLength(5)
    })
  })

  describe('disabled', () => {
    it('prevents the rating from being toggled', () => {
      const { getIcons, rerender } = renderRating(
        <Rating clearable='auto' disabled maxRating={1} rating={1} />,
      )

      fireEvent.click(getIcons()[0])
      expect(getIcons()[0]).toHaveClass('active')

      rerender(<Rating clearable='auto' disabled maxRating={1} rating={0} />)

      fireEvent.click(getIcons()[0])
      expect(getIcons()[0]).not.toHaveClass('active')
    })

    it('prevents the rating from being cleared', () => {
      const { root, getIcons } = renderRating(<Rating disabled maxRating={3} rating={3} />)

      fireEvent.click(_.last(getIcons()))
      expect(root.querySelectorAll('.icon.active')).toHaveLength(3)
    })

    it('prevents icons from becoming selected on mouse enter', () => {
      const { root, getIcons } = renderRating(<Rating disabled maxRating={3} />)

      fireEvent.mouseEnter(_.last(getIcons()))
      expect(root.querySelectorAll('.icon.selected')).toHaveLength(0)
    })

    it('prevents icons from becoming unselected on mouse leave', () => {
      const { root, getIcons, rerender } = renderRating(<Rating maxRating={3} />)

      fireEvent.mouseEnter(_.last(getIcons()))
      expect(root.querySelectorAll('.icon.selected')).toHaveLength(3)

      rerender(<Rating disabled maxRating={3} />)
      fireEvent.mouseLeave(root)
      expect(root.querySelectorAll('.icon.selected')).toHaveLength(3)
    })

    it('prevents icons from becoming active on click', () => {
      const { root, getIcons } = renderRating(<Rating disabled maxRating={3} />)

      fireEvent.click(_.last(getIcons()))
      expect(root.querySelectorAll('.icon.active')).toHaveLength(0)
    })
  })

  describe('maxRating', () => {
    it('controls how many icons are displayed', () => {
      _.times(10, (i) => {
        const maxRating = i + 1
        const { getIcons, unmount } = renderRating(<Rating maxRating={maxRating} />)

        expect(getIcons()).toHaveLength(maxRating)
        unmount()
      })
    })
  })

  describe('onRate', () => {
    it('is called with (event, { rating, maxRating } on icon click', () => {
      const spy = vi.fn()
      const { getIcons } = renderRating(<Rating maxRating={3} onRate={spy} />)

      fireEvent.click(_.last(getIcons()))

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ rating: 3, maxRating: 3 }),
      )
    })
  })

  describe('rating', () => {
    it('controls how many icons are active', () => {
      const { root, rerender } = renderRating(<Rating maxRating={10} />)

      _.times(10, (rating) => {
        rerender(<Rating maxRating={10} rating={rating} />)
        expect(root.querySelectorAll('.icon.active')).toHaveLength(rating)
      })
    })
  })

  describe('tabIndex', () => {
    it('sets icons tabIndex to -1 to prevent focus when element is disabled', () => {
      const { getIcons, rerender } = renderRating(<Rating maxRating={3} />)
      getIcons().forEach((node) => expect(node).toHaveAttribute('tabindex', '0'))

      rerender(<Rating disabled maxRating={3} />)
      getIcons().forEach((node) => expect(node).toHaveAttribute('tabindex', '-1'))
    })

    it('sets Rating element tabIndex to 0 to allow focusing the whole group when disabled', () => {
      const { root, rerender } = renderRating(<Rating maxRating={3} />)
      expect(root).toHaveAttribute('tabindex', '-1')

      rerender(<Rating disabled maxRating={3} />)
      expect(root).toHaveAttribute('tabindex', '0')
    })
  })
})
