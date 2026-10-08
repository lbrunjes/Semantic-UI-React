import { render } from '@testing-library/react'
import React from 'react'

import Dimmer from 'src/modules/Dimmer/Dimmer'
import DimmerDimmable from 'src/modules/Dimmer/DimmerDimmable'
import DimmerInner from 'src/modules/Dimmer/DimmerInner'
import * as common from 'test/specs/commonTests'

describe('Dimmer', () => {
  common.isConformant(Dimmer)
  common.forwardsRef(Dimmer)
  common.hasSubcomponents(Dimmer, [DimmerDimmable, DimmerInner])

  common.implementsCreateMethod(Dimmer)

  describe('children', () => {
    it('renders a DimmerInner', () => {
      const { container } = render(<Dimmer />)
      const root = container.firstElementChild

      // DimmerInner renders "div.ui.dimmer" in place (not in a Portal)
      expect(container.children).toHaveLength(1)
      expect(root.tagName).toBe('DIV')
      expect(root).toHaveClass('ui', 'dimmer')
      expect(root).not.toHaveClass('page')
    })
  })

  describe('page', () => {
    it('renders a Portal', () => {
      const { baseElement, container } = render(<Dimmer page active />)

      // Portal renders its content outside of the container
      expect(container).toBeEmptyDOMElement()
      expect(baseElement.querySelector('.ui.page.dimmer')).toBeInTheDocument()
      expect(container.contains(baseElement.querySelector('.ui.page.dimmer'))).toBe(false)
    })

    describe('active', () => {
      beforeEach(() => {
        document.body.classList.remove('dimmable', 'dimmed')
      })

      it('when true, Portal is opened dimmer classes are present on body', () => {
        render(<Dimmer page active />)
        const classes = document.body.classList

        expect(document.body.querySelector('.ui.page.dimmer')).toBeInTheDocument()

        expect(classes.contains('dimmable')).toBe(true)
        expect(classes.contains('dimmed')).toBe(true)
      })

      it('when false, Portal is closed dimmer classes are absent on body', () => {
        render(<Dimmer page active={false} />)
        const classes = document.body.classList

        expect(document.body.querySelector('.ui.dimmer')).not.toBeInTheDocument()

        expect(classes.contains('dimmable')).toBe(false)
        expect(classes.contains('dimmed')).toBe(false)
      })

      it('when changed to false, dimmer classes are removed from body', () => {
        const { rerender } = render(<Dimmer page active />)
        const classes = document.body.classList

        rerender(<Dimmer page active={false} />)

        expect(classes.contains('dimmable')).toBe(false)
        expect(classes.contains('dimmed')).toBe(false)
      })
    })
  })
})
