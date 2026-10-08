import { act, fireEvent, render, waitFor } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import { SUI } from 'src/lib'
import Popup from 'src/modules/Popup/Popup'
import { placementMapping, positionsMapping } from 'src/modules/Popup/lib/positions'
import PopupHeader from 'src/modules/Popup/PopupHeader'
import PopupContent from 'src/modules/Popup/PopupContent'
import * as common from 'test/specs/commonTests'
import { domEvent } from 'test/utils'

const assertIn = (node, selector, isPresent = true) => {
  if (isPresent) {
    expect(node.querySelector(selector)).not.toBeNull()
  } else {
    expect(node.querySelector(selector)).toBeNull()
  }
}
const assertInBody = (...args) => assertIn(document.body, ...args)

const getPopup = () => document.body.querySelector('.ui.popup')
// A wrapping element that is positioned by Popper.js
const getPopperElement = () => getPopup().parentElement

// ----------------------------------------
// Layout
// ----------------------------------------
// jsdom has no layout, Popper.js computes positions from these values
const VIEWPORT_SIZE = 1000
const POPPER_SIZE = { width: 100, height: 50 }
const TRIGGER_SIZE = { width: 100, height: 20 }

const isPopperElement = (node) => !!node.firstElementChild?.classList.contains('popup')
const isTrigger = (node) => node.id === 'trigger'

const createRect = ({ top, left, width, height }) => ({
  top,
  left,
  width,
  height,
  x: left,
  y: top,
  right: left + width,
  bottom: top + height,
  toJSON: _.noop,
})

/**
 * Mocks the layout: a viewport of 1000x1000, a trigger (an element with id="trigger") at the
 * passed position and a popper element of 100x50.
 */
const mockLayout = (triggerPosition) => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
    if (isTrigger(this)) return createRect({ ...triggerPosition, ...TRIGGER_SIZE })
    if (isPopperElement(this)) return createRect({ top: 0, left: 0, ...POPPER_SIZE })

    return createRect({ top: 0, left: 0, width: 0, height: 0 })
  })
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
    if (isTrigger(this)) return TRIGGER_SIZE.width
    if (isPopperElement(this)) return POPPER_SIZE.width
    return 0
  })
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
    if (isTrigger(this)) return TRIGGER_SIZE.height
    if (isPopperElement(this)) return POPPER_SIZE.height
    return 0
  })
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function () {
    return this === document.documentElement ? VIEWPORT_SIZE : 0
  })
  vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(function () {
    return this === document.documentElement ? VIEWPORT_SIZE : 0
  })
}

// Popper.js computes positions asynchronously (in microtasks), a "transform" is applied once it is
// done. Heads up! Its state updates should happen inside "act()", "waitFor()" would leave them out.
const waitForPositioning = async () => {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 0)
    })
  })

  expect(getPopperElement().style.transform).not.toBe('')
}

// Returns [x, y] from "transform: translate(Xpx, Ypx)" of the popper element
const getTranslate = () => {
  const [, x, y] = getPopperElement().style.transform.match(
    /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/,
  )

  return [Number(x), Number(y)]
}

const trigger = <button id='trigger'>foo</button>

describe('Popup', () => {
  // Heads up!
  // "react-popper" applies positions computed by Popper.js asynchronously (in a promise) after every
  // render, these updates happen outside "act()" and React (>= 18) warns about them. "act()" and
  // "fireEvent()" from RTL still enable the act environment while they run, so updates caused by
  // tests are checked.
  let isActEnvironment

  beforeEach(() => {
    isActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT
    globalThis.IS_REACT_ACT_ENVIRONMENT = false
  })

  afterEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = isActEnvironment
  })

  common.isConformant(Popup, { rendersChildren: false, rendersPortal: true, forwardsRef: false })
  common.hasSubcomponents(Popup, [PopupHeader, PopupContent])

  // Heads up!
  //
  // Our commonTests do not currently handle wrapped components.
  // Nor do they handle components rendered to the body with Portal.
  // The Popup is wrapped in a Portal, so we manually test a few things here.

  describe('children', () => {
    it('renders a Portal', () => {
      const { container } = render(<Popup open />)

      // rendered outside of the container, directly in the document body
      expect(container.querySelector('.ui.popup')).toBeNull()
      expect(getPopup()).toBeInTheDocument()
      expect(container.contains(getPopup())).toBe(false)
    })

    it('renders to the document body', () => {
      render(<Popup open />)
      assertInBody('.ui.popup.visible')
    })

    it('renders child text', () => {
      render(<Popup open>child text</Popup>)

      expect(document.querySelector('.ui.popup.visible').textContent).toBe('child text')
    })

    it('renders child components', () => {
      const child = <div data-child />
      render(<Popup open>{child}</Popup>)

      expect(
        document.querySelector('.ui.popup.visible').querySelector('[data-child]'),
      ).not.toBeNull()
    })
  })

  describe('className', () => {
    it('should add className to the wrapping node', () => {
      render(<Popup className='some-class' open />)
      assertInBody('.ui.popup.visible.some-class')
    })
  })

  describe('basic', () => {
    it('adds basic to the popup className', () => {
      render(<Popup basic open />)
      assertInBody('.ui.basic.popup.visible')
    })
  })

  describe('disabled', () => {
    it('is not disabled by default', () => {
      const { getByText } = render(<Popup content='bar' on='click' trigger={trigger} />)

      fireEvent.click(getByText('foo'))
      assertInBody('.ui.popup.visible')
    })

    it('does not render Portal if disabled', () => {
      const { getByText } = render(<Popup content='bar' disabled on='click' trigger={trigger} />)

      // only the trigger is rendered
      fireEvent.click(getByText('foo'))
      assertInBody('.ui.popup', false)
    })

    it('does not render Portal even with open prop', () => {
      const { getByText } = render(<Popup open disabled trigger={trigger} />)

      expect(getByText('foo')).toBeInTheDocument()
      assertInBody('.ui.popup', false)
    })
  })

  describe('eventsEnabled ', () => {
    const getPopperListeners = (addEventListener) =>
      addEventListener.mock.calls.filter(
        ([type, , options]) => (type === 'scroll' || type === 'resize') && options?.passive,
      )

    it(`is "true" by default`, () => {
      const addEventListener = vi.spyOn(window, 'addEventListener')
      render(<Popup open />)

      const types = getPopperListeners(addEventListener).map(([type]) => type)

      expect(types).toContain('scroll')
      expect(types).toContain('resize')
    })

    it(`can be set to "false"`, () => {
      const addEventListener = vi.spyOn(window, 'addEventListener')
      render(<Popup eventsEnabled={false} open />)

      expect(getPopperListeners(addEventListener)).toHaveLength(0)
    })
  })

  describe('flowing', () => {
    it('adds flowing to the popup className', () => {
      render(<Popup flowing open />)
      assertInBody('.ui.flowing.popup.visible')
    })
  })

  describe('hideOnScroll', () => {
    it('hides on window scroll', () => {
      const { getByText } = render(
        <Popup content='foo' hideOnScroll trigger={<button>foo</button>} />,
      )

      fireEvent.click(getByText('foo'))
      assertInBody('.ui.popup.visible')

      act(() => {
        domEvent.scroll(window)
      })
      assertInBody('.ui.popup.visible', false)
    })

    it('is called with (e, props) when scroll', () => {
      const onClose = vi.fn()

      const { container } = render(
        <Popup content='foo' hideOnScroll onClose={onClose} trigger={trigger} />,
      )

      fireEvent.click(container.querySelector('button'))
      act(() => {
        domEvent.scroll(window)
      })

      expect(onClose).toHaveBeenCalledTimes(1)
      expect(onClose).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ content: 'foo', onClose, trigger }),
      )
    })

    it('not hide on scroll from inside a popup', () => {
      const onClose = vi.fn()
      const child = <div data-child />

      const { container } = render(
        <Popup hideOnScroll onClose={onClose} trigger={trigger}>
          {child}
        </Popup>,
      )
      fireEvent.click(container.querySelector('button'))

      act(() => {
        domEvent.scroll(document.querySelector('[data-child]'))
      })
      expect(onClose).not.toHaveBeenCalled()

      act(() => {
        domEvent.scroll(window)
      })
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('hoverable', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('can be set to stay visible while hovering the popup', () => {
      const onClose = vi.fn()
      render(<Popup hoverable onClose={onClose} open />)

      // "closeOnPortalMouseLeave": leaving the popup closes it after a delay
      // the portal node, a wrapper of the popper element
      fireEvent.mouseLeave(getPopperElement().parentElement)
      expect(onClose).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(300)
      })
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('is not closed on leaving the popup by default', () => {
      const onClose = vi.fn()
      render(<Popup onClose={onClose} open />)

      fireEvent.mouseLeave(getPopperElement().parentElement)
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('inverted', () => {
    it('adds inverted to the popup className', () => {
      render(<Popup inverted open />)
      assertInBody('.ui.inverted.popup.visible')
    })
  })

  describe('offset', () => {
    it('passes values to Popper', async () => {
      mockLayout({ top: 100, left: 400 })
      const { unmount } = render(
        <Popup content='foo' open position='bottom right' trigger={trigger} />,
      )
      await waitForPositioning()
      const [x, y] = getTranslate()
      unmount()

      render(
        <Popup content='foo' open offset={[50, 100]} position='bottom right' trigger={trigger} />,
      )
      await waitForPositioning()

      // [skidding, distance]: moved by 50px along the trigger and by 100px away from it
      expect(getTranslate()).toEqual([x + 50, y + 100])
    })
  })

  describe('onClose', () => {
    it('is not called on click inside of the popup', () => {
      const onClose = vi.fn()
      render(<Popup defaultOpen onClose={onClose} />)

      domEvent.click('.ui.popup')
      expect(onClose).not.toHaveBeenCalled()
    })

    it('is called on body click', () => {
      const onClose = vi.fn()
      render(<Popup defaultOpen onClose={onClose} />)

      act(() => {
        domEvent.click('body')
      })
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('is called when pressing escape', () => {
      const onClose = vi.fn()
      render(<Popup defaultOpen onClose={onClose} />)

      act(() => {
        domEvent.keyDown(document, { key: 'Escape' })
      })
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('is not called when the open prop changes to false', () => {
      const onClose = vi.fn()
      const { rerender } = render(<Popup defaultOpen onClose={onClose} />)

      rerender(<Popup defaultOpen onClose={onClose} open={false} />)
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('onOpen', () => {
    it('is called on trigger click', () => {
      const onOpen = vi.fn()
      const { container } = render(
        <Popup onOpen={onOpen} trigger={<div id='trigger' />}>
          <p />
        </Popup>,
      )

      fireEvent.click(container.querySelector('#trigger'))
      expect(onOpen).toHaveBeenCalledTimes(1)
      expect(onOpen).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ open: true }),
      )
    })
  })

  describe('onClose', () => {
    it('is called on body click', () => {
      const onClose = vi.fn()
      render(
        <Popup defaultOpen onClose={onClose} trigger={<div />}>
          <p />
        </Popup>,
      )

      act(() => {
        domEvent.click(document.body)
      })
      expect(onClose).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ open: false }),
      )
    })
  })

  describe('open', () => {
    it('is not open by default', () => {
      render(<Popup />)
      assertInBody('.ui.popup.visible', false)
    })

    it('is passed to Portal open', () => {
      const { unmount } = render(<Popup open />)
      assertInBody('.ui.popup.visible')
      unmount()

      render(<Popup open={false} />)
      assertInBody('.ui.popup', false)
    })

    it('does not show the popup when false', () => {
      render(<Popup open={false} />)
      assertInBody('.ui.popup.visible', false)
    })

    it('shows the popup on changing from false to true', () => {
      const { rerender } = render(<Popup open={false} />)
      assertInBody('.ui.popup.visible', false)

      rerender(<Popup open />)
      assertInBody('.ui.popup.visible')
    })

    it('hides the popup on changing from true to false', () => {
      const { rerender } = render(<Popup open />)
      assertInBody('.ui.popup.visible')

      rerender(<Popup open={false} />)
      assertInBody('.ui.popup.visible', false)
    })
  })

  describe('pinned', () => {
    // The trigger is close to the top of the viewport: there is no space for the popup above it
    const triggerPosition = { top: 10, left: 400 }

    it(`is "false" by default, so the popup flips`, async () => {
      mockLayout(triggerPosition)
      render(<Popup content='foo' open trigger={trigger} />)
      await waitForPositioning()

      expect(getPopup()).toHaveClassName('bottom left')
    })

    it(`disables "flip" modifier in PopperJS when is "true"`, async () => {
      mockLayout(triggerPosition)
      render(<Popup content='foo' open pinned trigger={trigger} />)
      await waitForPositioning()

      expect(getPopup()).toHaveClassName('top left')
    })

    it(`enables "flip" modifier in PopperJS when is "false"`, async () => {
      mockLayout(triggerPosition)
      render(<Popup content='foo' open pinned={false} trigger={trigger} />)
      await waitForPositioning()

      expect(getPopup()).toHaveClassName('bottom left')
    })
  })

  describe('position', () => {
    _.forEach(positionsMapping, (placement, position) => {
      it(`passes the "${position}" as "${placement}" to Popper`, async () => {
        // The trigger is in the middle of the viewport, there is enough space everywhere
        mockLayout({ top: 400, left: 400 })
        render(<Popup content='foo' open position={position} trigger={trigger} />)
        await waitForPositioning()

        // the class name is based on the placement computed by Popper
        expect(getPopup()).toHaveClassName(placementMapping[placement])
      })
    })
  })

  describe('positionFixed', () => {
    it(`is not defiend by default`, async () => {
      render(<Popup open />)
      await waitForPositioning()

      expect(getPopup()).not.toHaveAttribute('positionFixed')
      expect(getPopperElement()).toHaveStyle({ position: 'absolute' })
    })

    it(`can be set to "true"`, async () => {
      render(<Popup positionFixed open />)
      await waitForPositioning()

      expect(getPopperElement()).toHaveStyle({ position: 'fixed' })
    })
  })

  describe('popper', () => {
    it('passes a zIndex value from .popup', async () => {
      render(<Popup open style={{ zIndex: 5000 }} />)
      const popperNode = getPopperElement()

      // zIndex transfer is done in a Popper modifier which will be executed in next frame
      await waitFor(() => {
        expect(popperNode.style.zIndex).toBe('5000')
      })
    })

    it('zIndex passed to a shorthand wins', async () => {
      render(<Popup open popper={{ style: { zIndex: 100 } }} style={{ zIndex: 5000 }} />)
      const popperNode = getPopperElement()

      // zIndex transfer is done in a Popper modifier which will be executed in next frame
      await waitForPositioning()
      expect(popperNode.style.zIndex).toBe('100')
    })

    it('additional props can be passed via shorthand', () => {
      render(<Popup open popper={{ className: 'foo', id: 'bar' }} />)
      const popperElement = getPopperElement()

      expect(popperElement).toHaveClass('foo')
      expect(popperElement).toHaveAttribute('id', 'bar')
    })

    it('"style" prop is merged', () => {
      render(<Popup open popper={{ style: { color: 'red', display: 'block' } }} />)
      const popperElement = getPopperElement()

      expect(popperElement.style.color).toBe('red')
      expect(popperElement).toHaveStyle({ display: 'flex' })
    })
  })

  describe('popperModifiers', () => {
    it('are passed to Popper', async () => {
      const fn = vi.fn()
      const modifierCustom = {
        name: 'custom',
        enabled: true,
        phase: 'main',
        options: { foo: 'bar' },
        fn,
      }
      const modifierOffset = { name: 'offset', enabled: true, options: { offset: [0, 10] } }

      mockLayout({ top: 400, left: 400 })
      const { unmount } = render(<Popup content='foo' open trigger={trigger} />)
      await waitForPositioning()
      const [x, y] = getTranslate()
      unmount()

      render(
        <Popup
          content='foo'
          popperModifiers={[modifierCustom, modifierOffset]}
          open
          trigger={trigger}
        />,
      )
      await waitForPositioning()

      expect(fn).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'custom', options: { foo: 'bar' } }),
      )
      // "top-start": the popup is moved away from the trigger (upwards) by 10px
      expect(getTranslate()).toEqual([x, y - 10])
    })
  })

  describe('popperDependencies', () => {
    it.todo('will call "scheduleUpdate" if dependencies changed')
    it.todo('will skip "scheduleUpdate" if dependencies are same')
  })

  describe('size', () => {
    const sizes = _.without(SUI.SIZES, 'medium', 'big', 'massive')

    sizes.forEach((size) => {
      it(`adds the ${size} to the popup className`, () => {
        render(<Popup size={size} open />)
        assertInBody(`.ui.${size}.popup`)
      })
    })
  })

  describe('trigger', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it('opens Popup on click', () => {
      const { container } = render(<Popup on='click' content='foo' trigger={<button />} />)

      fireEvent.click(container.querySelector('button'))
      assertInBody('.ui.popup.visible')
    })

    it('opens Popup on hover', () => {
      vi.useFakeTimers()
      const { container } = render(<Popup content='foo' mouseEnterDelay={0} trigger={<button />} />)

      fireEvent.mouseEnter(container.querySelector('button'))
      act(() => {
        vi.advanceTimersByTime(1)
      })
      assertInBody('.ui.popup.visible')
    })

    it('opens Popup on focus', () => {
      const { container } = render(<Popup on='focus' content='foo' trigger={<input />} />)

      fireEvent.focus(container.querySelector('input'))
      assertInBody('.ui.popup.visible')
    })

    it('opens Popup on multiple', () => {
      vi.useFakeTimers()
      const { container } = render(
        <Popup on={['click', 'hover']} content='foo' trigger={<button />} />,
      )
      const button = container.querySelector('button')

      fireEvent.click(button)
      assertInBody('.ui.popup.visible')

      act(() => {
        domEvent.click('body')
      })
      assertInBody('.ui.popup.visible', false)

      fireEvent.mouseEnter(button)
      act(() => {
        vi.advanceTimersByTime(51)
      })
      assertInBody('.ui.popup.visible')
    })
  })

  describe('wide', () => {
    it('adds to the popup className', () => {
      render(<Popup wide open />)
      assertInBody('.ui.wide.popup.visible')
    })

    it('adds "very" to the popup className', () => {
      render(<Popup wide='very' open />)
      assertInBody('.ui.very.wide.popup.visible')
    })
  })
})
