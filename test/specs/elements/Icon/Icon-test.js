import { createEvent, fireEvent } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import Icon from 'src/elements/Icon/Icon'
import IconGroup from 'src/elements/Icon/IconGroup'
import { SUI } from 'src/lib'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('Icon', () => {
  common.isConformant(Icon)
  common.forwardsRef(Icon, { isMemoized: true, tagName: 'i' })
  common.hasSubcomponents(Icon, [IconGroup])

  common.implementsCreateMethod(Icon)

  common.propKeyAndValueToClassName(Icon, 'flipped', ['horizontally', 'vertically'])
  common.propKeyAndValueToClassName(Icon, 'rotated', ['clockwise', 'counterclockwise'])

  common.propKeyOnlyToClassName(Icon, 'bordered')
  common.propKeyOnlyToClassName(Icon, 'circular')
  common.propKeyOnlyToClassName(Icon, 'disabled')
  common.propKeyOnlyToClassName(Icon, 'fitted')
  common.propKeyOnlyToClassName(Icon, 'inverted')
  common.propKeyOnlyToClassName(Icon, 'link')
  common.propKeyOnlyToClassName(Icon, 'loading')

  common.propKeyOrValueAndKeyToClassName(Icon, 'corner', [
    'top left',
    'top right',
    'bottom left',
    'bottom right',
  ])

  common.propValueOnlyToClassName(Icon, 'color', SUI.COLORS)
  common.propValueOnlyToClassName(Icon, 'name', ['money'])
  common.propValueOnlyToClassName(Icon, 'size', _.without(SUI.SIZES, 'medium'))

  it('renders as an <i> by default', () => {
    expect(renderRoot(<Icon />).tagName).toBe('I')
  })

  describe('aria-hidden', () => {
    it('should add aria-hidden by default', () => {
      expect(renderRoot(<Icon />)).toHaveAttribute('aria-hidden', 'true')
    })

    it('should pass aria-hidden', () => {
      expect(renderRoot(<Icon aria-hidden='true' />)).toHaveAttribute('aria-hidden', 'true')
      expect(renderRoot(<Icon aria-hidden='false' />)).toHaveAttribute('aria-hidden', 'false')
    })

    it('should passed aria-hidden with aria-label', () => {
      expect(renderRoot(<Icon aria-hidden='false' aria-label='icon' />)).toHaveAttribute(
        'aria-hidden',
        'false',
      )
    })
  })

  describe('aria-label', () => {
    it('should not applied by default', () => {
      expect(renderRoot(<Icon />)).not.toHaveAttribute('aria-label')
    })

    it('should pass value and omit aria-hidden when is set', () => {
      const root = renderRoot(<Icon aria-label='icon' />)

      expect(root).not.toHaveAttribute('aria-hidden')
      expect(root).toHaveAttribute('aria-label', 'icon')
    })
  })

  describe('onClick', () => {
    it('is called with (e, data) when clicked', () => {
      const onClick = vi.fn()

      fireEvent.click(renderRoot(<Icon onClick={onClick} />))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ onClick }),
      )
    })

    it('is not called when "disabled" is true', () => {
      const onClick = vi.fn()
      const root = renderRoot(<Icon disabled onClick={onClick} />)
      const event = createEvent.click(root)

      fireEvent(root, event)

      expect(onClick).not.toHaveBeenCalled()
      // the default action is prevented
      expect(event.defaultPrevented).toBe(true)
    })
  })
})
