import { act, render } from '@testing-library/react'
import React from 'react'

import Sticky from 'src/modules/Sticky/Sticky'
import * as common from 'test/specs/commonTests'
import { domEvent } from 'test/utils'

let contextEl
let positions
let rendered

const mockContextEl = (values = {}) => (contextEl = { getBoundingClientRect: () => values })

// Sticky renders: <div (root)><div (trigger) /><div (sticky element) /></div>
const getRootEl = () => rendered.container.firstElementChild
const getTriggerEl = () => getRootEl().childNodes[0]
const getStickyEl = () => getRootEl().childNodes[1]

// Heads up! "vi.spyOn()" returns an existing spy if the method is already spied
const mockTriggerEl = (values = {}) => {
  vi.spyOn(getTriggerEl(), 'getBoundingClientRect').mockImplementation(() => values)
}

const mockStickyEl = (values = {}) => {
  vi.spyOn(getStickyEl(), 'getBoundingClientRect').mockImplementation(() => values)
}

const mockPositions = ({ bottomOffset = 5, offset = 5, height = 5 } = {}) =>
  (positions = {
    bottomOffset,
    height,
    offset,
  })

const renderSticky = (props = {}) => {
  let currentProps = props
  const utils = render(<Sticky {...currentProps} />)

  rendered = {
    ...utils,
    // Merges props like Enzyme's "setProps()"
    setProps: (nextProps) => {
      currentProps = { ...currentProps, ...nextProps }
      utils.rerender(<Sticky {...currentProps} />)
    },
  }

  return rendered
}

const setProps = (props) => rendered.setProps(props)

const scroll = (node) =>
  act(() => {
    domEvent.scroll(node)
  })

const expectClasses = (node, classNames) =>
  classNames.forEach((className) => expect(node).toHaveClass(className))

// Scroll to the top of the screen
const scrollToTop = () => {
  const { bottomOffset, height, offset } = positions

  setProps({
    context: { getBoundingClientRect: () => ({ bottom: height + offset + bottomOffset }) },
  })

  mockTriggerEl({ top: offset })
  mockStickyEl({ height, top: offset })

  scroll(window)
}

// Scroll until the trigger is not visible
const scrollAfterTrigger = () => {
  const { bottomOffset, height, offset } = positions

  setProps({
    context: { getBoundingClientRect: () => ({ bottom: window.innerHeight - bottomOffset + 1 }) },
  })

  mockTriggerEl({ top: offset - 1 })
  mockStickyEl({ height })

  scroll(window)
}

// Scroll until the context bottom is not visible
const scrollAfterContext = () => {
  const { height, offset } = positions

  setProps({ context: { getBoundingClientRect: () => ({ bottom: -1 }) } })

  mockTriggerEl({ top: offset - 1 })
  mockStickyEl({ height })

  scroll(window)
}

// Scroll to the last part of the context
const scrollToContextBottom = () => {
  const { height, offset } = positions

  setProps({ context: { getBoundingClientRect: () => ({ bottom: height + 1 }) } })

  mockTriggerEl({ top: offset - 1 })
  mockStickyEl({ height })

  scroll(window)
}

describe('Sticky', () => {
  common.isConformant(Sticky)
  common.forwardsRef(Sticky, { requiredProps: { active: false } })
  common.rendersChildren(Sticky, {
    rendersContent: false,
  })

  beforeEach(() => {
    // Heads up! Not "vi.spyOn()" as globals of the test environment are accessors
    vi.stubGlobal('requestAnimationFrame', (callback) => {
      callback()
      return 0
    })
    rendered = undefined
  })

  describe('children', () => {
    it('should create two divs', () => {
      renderSticky()
      const children = Array.from(getRootEl().children)

      expect(children).toHaveLength(2)
      children.forEach((child) => expect(child.tagName).toBe('DIV'))
    })
  })

  describe('active', () => {
    it('should handle update on mount when active', () => {
      const onTop = vi.fn()
      renderSticky({ context: mockContextEl(), onTop })

      expect(onTop).toHaveBeenCalledTimes(1)
    })

    it('should not handle update on mount when not active', () => {
      const onTop = vi.fn()
      renderSticky({ active: false, context: mockContextEl(), onTop })

      expect(onTop).not.toHaveBeenCalled()
    })

    it('fires event when changes to true', () => {
      const onTop = vi.fn()

      renderSticky({ active: false, context: mockContextEl(), onTop })
      expect(onTop).not.toHaveBeenCalled()

      setProps({ active: true })
      expect(onTop).toHaveBeenCalledTimes(1)
    })

    it('omits event and removes styles when changes to false', () => {
      const onStick = vi.fn()
      const onUnStick = vi.fn()

      mockContextEl()
      mockPositions({ bottomOffset: 10, height: 50 })

      renderSticky({ ...positions, context: contextEl, onStick, onUnstick: onUnStick })

      expectClasses(getStickyEl(), ['ui', 'sticky', 'fixed', 'top'])

      expect(onStick).toHaveBeenCalledTimes(1)
      expect(onStick).toHaveBeenCalledWith(undefined, expect.objectContaining(positions))

      setProps({ active: false })
      scrollToTop()
      expect(getStickyEl()).not.toHaveClass('fixed')
      expect(onUnStick).not.toHaveBeenCalled()
    })
  })

  describe('context', () => {
    it('should handle React refs', () => {
      const contextRef = { current: mockContextEl() }
      const onTop = vi.fn()
      renderSticky({ context: contextRef, onTop })

      expect(onTop).toHaveBeenCalledTimes(1)
    })
  })

  describe('behaviour', () => {
    it('should stick to top of screen', () => {
      mockContextEl()
      mockPositions({ bottomOffset: 12, height: 200, offset: 12 })

      renderSticky({ ...positions, context: contextEl })

      // Scroll after trigger
      scrollAfterTrigger()

      expectClasses(getStickyEl(), ['ui', 'sticky', 'fixed', 'top'])
      expect(getStickyEl()).toHaveStyle({ top: '12px' })
    })

    it('should stick to bottom of context', () => {
      mockContextEl()
      mockPositions({ bottomOffset: 10, height: 100, offset: 20 })
      renderSticky({ ...positions, context: contextEl })

      scrollAfterContext()
      expectClasses(getStickyEl(), ['ui', 'sticky', 'bound', 'bottom'])
      expect(getStickyEl()).toHaveStyle({ bottom: '0px' })
    })

    it('should preserve sticky element height', () => {
      mockContextEl()
      mockPositions({ bottomOffset: 0, height: 100, offset: 0 })
      renderSticky({ ...positions, context: contextEl })

      // Scroll after trigger
      scrollAfterTrigger()

      expect(getTriggerEl()).toHaveStyle({ height: '100px' })
    })
  })

  describe('onBottom', () => {
    it('is called with (e, data) when is on bottom', () => {
      const onBottom = vi.fn()
      mockContextEl()
      mockPositions()
      renderSticky({ ...positions, context: contextEl, onBottom })

      scrollAfterContext()
      expect(onBottom).toHaveBeenCalledTimes(1)
      expect(onBottom).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining(positions))
      onBottom.mockClear()

      scrollToTop()
      expect(onBottom).not.toHaveBeenCalled()
    })
  })

  describe('onStick', () => {
    it('is called with (e, data) when stick', () => {
      const onStick = vi.fn()
      mockContextEl()
      mockPositions({ bottomOffset: 10, height: 50 })
      renderSticky({ ...positions, context: contextEl, onStick })

      scrollAfterTrigger()
      expect(onStick).toHaveBeenCalledTimes(2)
      expect(onStick).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining(positions))
      onStick.mockClear()

      scrollToTop()
      expect(onStick).not.toHaveBeenCalled()
    })
  })

  describe('onTop', () => {
    it('is called with (e, data) when is on top', () => {
      const onTop = vi.fn()
      mockContextEl()
      mockPositions({ bottomOffset: 10, height: 50 })
      renderSticky({ ...positions, context: contextEl, onTop })

      scrollAfterContext()
      expect(onTop).not.toHaveBeenCalled()

      scrollToTop()
      expect(onTop).toHaveBeenCalledTimes(1)
      expect(onTop).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining(positions))
    })
  })

  describe('onUnstick', () => {
    it('is called with (e, data) when unstick', () => {
      const onUnstick = vi.fn()
      mockContextEl()
      mockPositions({ bottomOffset: 10, height: 50 })
      renderSticky({ ...positions, context: contextEl, onUnstick })

      scrollAfterTrigger()
      expect(onUnstick).not.toHaveBeenCalled()

      scrollToTop()
      expect(onUnstick).toHaveBeenCalledTimes(1)
      expect(onUnstick).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining(positions))
    })
  })

  describe('pushing', () => {
    it('should push component back', () => {
      mockContextEl()
      mockPositions({ bottomOffset: 30, height: 100, offset: 10 })
      renderSticky({ ...positions, context: contextEl, pushing: true })

      scrollAfterTrigger()

      // Scroll back: component should still stick to context bottom
      scrollToContextBottom()
      setProps({ context: mockContextEl({ bottom: 0 }) })
      scroll(window)

      expectClasses(getStickyEl(), ['ui', 'sticky', 'bound', 'bottom'])
      expect(getStickyEl()).toHaveStyle({ bottom: '0px' })

      // Scroll a bit before the top: component should stick to screen bottom
      scrollAfterTrigger()

      expect(getStickyEl()).toHaveStyle({ bottom: '30px' })
      expectClasses(getStickyEl(), ['ui', 'sticky', 'fixed', 'bottom'])
      expect(getStickyEl().style.top).toBe('')
    })

    it('should stop pushing when reaching top', () => {
      mockContextEl()
      mockPositions({ bottomOffset: 10, height: 100, offset: 10 })

      renderSticky({ ...positions, context: contextEl, pushing: true })

      scrollAfterTrigger()
      scrollToContextBottom()
      scrollToTop()
      scrollAfterTrigger()

      // Component should stick again to the top
      expectClasses(getStickyEl(), ['ui', 'sticky', 'fixed', 'top'])
      expect(getStickyEl()).toHaveStyle({ top: '10px' })
    })
  })

  describe('scrollContext', () => {
    it('should use window as default', () => {
      const onStick = vi.fn()

      renderSticky({ onStick })
      mockTriggerEl({ top: -1 })

      scroll(window)
      expect(onStick).toHaveBeenCalled()
    })

    it('should set a scroll context', () => {
      const div = document.createElement('div')
      const onStick = vi.fn()

      renderSticky({ scrollContext: div, onStick })
      mockTriggerEl({ top: -1 })

      scroll(window)
      expect(onStick).not.toHaveBeenCalled()

      scroll(div)
      expect(onStick).toHaveBeenCalled()
    })

    it('should set a scroll context via React refs', () => {
      const scrollContextRef = { current: document.createElement('div') }
      const onStick = vi.fn()

      renderSticky({ scrollContext: scrollContextRef, onStick })
      mockTriggerEl({ top: -1 })

      scroll(window)
      expect(onStick).not.toHaveBeenCalled()

      scroll(scrollContextRef.current)
      expect(onStick).toHaveBeenCalled()
    })

    it('should not call onStick when context is null', () => {
      const onStick = vi.fn()

      renderSticky({ scrollContext: null, onStick })
      mockTriggerEl({ top: -1 })

      scroll(document)
      expect(onStick).not.toHaveBeenCalled()
    })

    it('should call onStick when scrollContext changes', () => {
      const div = document.createElement('div')
      const onStick = vi.fn()
      renderSticky({ scrollContext: null, onStick })

      setProps({ scrollContext: div })
      mockTriggerEl({ top: -1 })

      scroll(div)
      expect(onStick).toHaveBeenCalled()
    })
  })

  describe('styleElement', () => {
    it('is passed to macthing element', () => {
      renderSticky({ styleElement: { zIndex: 10 } })

      expect(getStickyEl()).toHaveStyle({ zIndex: '10' })
    })
  })
})
