import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import DimmerInner from 'src/modules/Dimmer/DimmerInner'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'

describe('DimmerInner', () => {
  common.isConformant(DimmerInner, { componentClassName: 'dimmer' })
  common.forwardsRef(DimmerInner)
  common.hasUIClassName(DimmerInner)
  common.rendersChildren(DimmerInner)

  common.implementsVerticalAlignProp(DimmerInner, ['bottom', 'top'])

  common.propKeyOnlyToClassName(DimmerInner, 'active', {
    className: 'active transition visible',
  })
  common.propKeyOnlyToClassName(DimmerInner, 'disabled')
  common.propKeyOnlyToClassName(DimmerInner, 'inverted')
  common.propKeyOnlyToClassName(DimmerInner, 'simple')

  describe('active', () => {
    it('adds "display: flex" after set to "true"', () => {
      const { container, rerender } = render(<DimmerInner />)
      const root = container.firstElementChild

      expect(root.style.display).toBe('')

      rerender(<DimmerInner active />)
      expect(root).toHaveStyle({ display: 'flex' })
    })
  })

  describe('onClickOutside', () => {
    it('called when Dimmer has not children', () => {
      const onClickOutside = vi.fn()
      const { container } = render(<DimmerInner onClickOutside={onClickOutside} />)

      fireEvent.click(container.firstElementChild)
      expect(onClickOutside).toHaveBeenCalledTimes(1)
    })

    it('omitted when click on children', () => {
      const onClickOutside = vi.fn()
      const { container } = render(
        <DimmerInner onClickOutside={onClickOutside}>
          <div>{faker.hacker.phrase()}</div>
        </DimmerInner>,
      )

      fireEvent.click(container.querySelector('div.content').firstElementChild)
      expect(onClickOutside).not.toHaveBeenCalled()
    })

    it('called when click on Dimmer', () => {
      const onClickOutside = vi.fn()
      const { container } = render(
        <DimmerInner onClickOutside={onClickOutside}>{faker.hacker.phrase()}</DimmerInner>,
      )

      fireEvent.click(container.firstElementChild)
      expect(onClickOutside).toHaveBeenCalledTimes(1)
    })

    it('called when click on center', () => {
      const onClickOutside = vi.fn()
      const { container } = render(
        <DimmerInner onClickOutside={onClickOutside}>{faker.hacker.phrase()}</DimmerInner>,
      )

      fireEvent.click(container.querySelector('div.content'))
      expect(onClickOutside).toHaveBeenCalledTimes(1)
    })
  })
})
