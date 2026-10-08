import { act, render } from '@testing-library/react'
import React from 'react'

import { SUI } from 'src/lib'
import Transition from 'src/modules/Transition/Transition'
import TransitionGroup from 'src/modules/Transition/TransitionGroup'
import {
  TRANSITION_STATUS_ENTERED,
  TRANSITION_STATUS_ENTERING,
  TRANSITION_STATUS_EXITED,
  TRANSITION_STATUS_EXITING,
} from 'src/modules/Transition/utils/computeStatuses'
import * as common from 'test/specs/commonTests'

/**
 * Renders a Transition with a single child (`<p />` by default) and returns helpers.
 * `setProps()` merges props like Enzyme's `setProps()` did and rerenders.
 */
const renderTransition = (initialProps = {}, child = <p />) => {
  let props = initialProps
  const utils = render(<Transition {...props}>{child}</Transition>)

  return {
    ...utils,
    getChild: () => utils.container.querySelector('p'),
    setProps: (nextProps) => {
      props = { ...props, ...nextProps }
      utils.rerender(<Transition {...props}>{child}</Transition>)
    },
  }
}

const advanceTimers = (ms) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

describe('Transition', () => {
  common.hasSubcomponents(Transition, [TransitionGroup])
  common.hasValidTypings(Transition, { forwardsRef: false })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('animation', () => {
    SUI.DIRECTIONAL_TRANSITIONS.forEach((animation) => {
      it(`directional ${animation}`, () => {
        const { getChild, setProps } = renderTransition({ animation, transitionOnMount: true })

        expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
        animation.split(' ').forEach((className) => expect(getChild()).toHaveClass(className))
        expect(getChild()).toHaveClass('in')

        setProps({ visible: false })
        expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
        animation.split(' ').forEach((className) => expect(getChild()).toHaveClass(className))
        expect(getChild()).toHaveClass('out')
      })
    })

    SUI.STATIC_TRANSITIONS.forEach((animation) => {
      it(`static ${animation}`, () => {
        const { getChild, setProps } = renderTransition({ animation, transitionOnMount: true })

        expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
        expect(getChild()).toHaveClass(animation)
        expect(getChild()).not.toHaveClass('in')

        setProps({ visible: false })
        expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
        expect(getChild()).toHaveClass(animation)
        expect(getChild()).not.toHaveClass('out')
      })
    })

    it('supports custom animations', () => {
      const { getChild, setProps } = renderTransition({
        animation: 'jump',
        transitionOnMount: true,
      })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).toHaveClass('jump')

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveClass('jump')
    })
  })

  describe('className', () => {
    it("passes element's className", () => {
      const { getChild } = renderTransition({}, <p className='foo bar' />)

      expect(getChild()).toHaveClass('foo')
      expect(getChild()).toHaveClass('bar')
    })

    it('adds classes when ENTERED', () => {
      const { getChild } = renderTransition({ transitionOnMount: false })

      expect(getChild()).toHaveClass('visible')
      expect(getChild()).toHaveClass('transition')
    })

    it('adds classes when ENTERING', () => {
      const { getChild } = renderTransition({ transitionOnMount: true })

      expect(getChild()).toHaveClass('animating')
      expect(getChild()).toHaveClass('visible')
      expect(getChild()).toHaveClass('transition')
    })

    it('adds classes when EXITED', () => {
      const { getChild } = renderTransition({
        visible: false,
        mountOnShow: false,
        unmountOnHide: false,
      })

      expect(getChild()).toHaveClass('hidden')
      expect(getChild()).toHaveClass('transition')
    })

    it('adds classes when EXITING', () => {
      const { getChild, setProps } = renderTransition({ transitionOnMount: false })
      setProps({ visible: false })

      expect(getChild()).toHaveClass('animating')
      expect(getChild()).toHaveClass('visible')
      expect(getChild()).toHaveClass('transition')
    })
  })

  describe('directional', () => {
    it('adds classes when is "true"', () => {
      const { getChild, setProps } = renderTransition({
        directional: true,
        transitionOnMount: true,
      })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).toHaveClass('in')

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveClass('out')
    })

    it('do not add classes when is "false"', () => {
      const { getChild, setProps } = renderTransition({
        directional: false,
        transitionOnMount: true,
      })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).not.toHaveClass('in')

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).not.toHaveClass('out')
    })
  })

  describe('children', () => {
    it('clones element', () => {
      const { container } = renderTransition({}, <p className='foo' />)

      expect(container.querySelector('p.foo')).toBeInTheDocument()
    })

    it('returns null when UNMOUNTED', () => {
      // Heads up! The original (shallow) test used `mountOnShow={false}` & `unmountOnHide={false}`
      // that lead to EXITED status (the child is rendered), `mountOnShow` must be enabled to get
      // the UNMOUNTED status.
      const { container } = renderTransition(
        { mountOnShow: true, unmountOnHide: false, visible: false },
        <p className='foo bar' />,
      )

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('constructor', () => {
    it('has default statuses', () => {
      const { getChild } = renderTransition()

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERED)
      expect(getChild()).not.toHaveAttribute('data-test-next-status')
    })

    it('sets statuses when `visible` is false', () => {
      const { getChild } = renderTransition({ visible: false })

      expect(getChild()).not.toBeInTheDocument()
    })

    it('sets statuses when mount is disabled', () => {
      const { getChild } = renderTransition({
        visible: false,
        mountOnShow: false,
        unmountOnHide: false,
      })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITED)
      expect(getChild()).not.toHaveAttribute('data-test-next-status')
    })
  })

  describe('duration', () => {
    it('does not apply to style when ENTERED', () => {
      const { getChild } = renderTransition({ transitionOnMount: false })

      expect(getChild().style.animationDuration).toBe('')
    })

    it('applies default value to style when ENTERING', () => {
      const { getChild } = renderTransition({ transitionOnMount: true })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).toHaveStyle({ animationDuration: '500ms' })
    })

    it('applies numeric value to style when ENTERING', () => {
      const { getChild } = renderTransition({ duration: 1000, transitionOnMount: true })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).toHaveStyle({ animationDuration: '1000ms' })
    })

    it('applies object value to style when ENTERING', () => {
      const { getChild } = renderTransition({
        duration: { hide: 1000, show: 2000 },
        transitionOnMount: true,
      })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).toHaveStyle({ animationDuration: '2000ms' })
    })

    it('does not apply to style when EXITED', () => {
      const { getChild } = renderTransition({
        visible: false,
        mountOnShow: false,
        unmountOnHide: false,
      })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITED)
      expect(getChild().style.animationDuration).toBe('')
    })

    it('applies default value to style when EXITING', () => {
      const { getChild, setProps } = renderTransition()

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveStyle({ animationDuration: '500ms' })
    })

    it('applies numeric value to style when EXITING', () => {
      const { getChild, setProps } = renderTransition({ duration: 1000 })

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveStyle({ animationDuration: '1000ms' })
    })

    it('applies object value to style when EXITING', () => {
      const { getChild, setProps } = renderTransition({ duration: { hide: 1000, show: 2000 } })

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveStyle({ animationDuration: '1000ms' })
    })
  })

  describe('visible', () => {
    it('updates status when set to false while ENTERING', () => {
      const { getChild, setProps } = renderTransition({ transitionOnMount: true })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_EXITED)
    })

    it('updates status when set to false while ENTERED', () => {
      const { getChild, setProps } = renderTransition({ transitionOnMount: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERED)

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_EXITED)
    })

    it('updates status when set to true while UNMOUNTED', () => {
      const { getChild, setProps } = renderTransition({ visible: false })
      expect(getChild()).not.toBeInTheDocument()

      setProps({ visible: true })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_ENTERED)
    })

    it('updates next status when set to true while performs an ENTERING transition', () => {
      const onHide = vi.fn()
      const { getChild, setProps } = renderTransition({
        duration: 10,
        transitionOnMount: true,
        onHide,
      })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_EXITED)

      advanceTimers(10)
      expect(onHide).toHaveBeenCalledTimes(1)
    })

    it('updates next status when set to true while performs an EXITING transition', () => {
      const onShow = vi.fn()
      const { getChild, setProps } = renderTransition({ duration: 10, onShow, visible: true })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERED)

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_EXITED)

      setProps({ visible: true })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_ENTERED)

      advanceTimers(10)
      expect(onShow).toHaveBeenCalledTimes(1)
    })
  })

  describe('onComplete', () => {
    it('is called with (null, props) when transition completed', () => {
      const onComplete = vi.fn()
      renderTransition({ duration: 0, onComplete, transitionOnMount: true })

      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(onComplete).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ duration: 0, status: TRANSITION_STATUS_ENTERED }),
      )
    })

    it('is called after a render with visibility changes', () => {
      // This test ensures that a setTimeout will not be cleared on a simple rerender
      // https://github.com/Semantic-Org/Semantic-UI-React/issues/4059
      const onComplete = vi.fn()
      const { setProps } = renderTransition({
        duration: 200,
        onComplete,
        transitionOnMount: true,
      })

      advanceTimers(100)
      setProps({})
      advanceTimers(150)

      expect(onComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('onHide', () => {
    it('is called with (null, props) when hidden', () => {
      const onHide = vi.fn()
      const { setProps } = renderTransition({
        duration: 0,
        onHide,
        transitionOnMount: false,
      })
      setProps({ visible: false })

      expect(onHide).toHaveBeenCalledTimes(1)
      expect(onHide).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ duration: 0, status: TRANSITION_STATUS_EXITED }),
      )
    })

    it('depends on the specified duration', () => {
      const onHide = vi.fn()
      const { getChild, setProps } = renderTransition({
        duration: { hide: 200 },
        onHide,
        transitionOnMount: false,
      })

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)

      advanceTimers(100)
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(onHide).not.toHaveBeenCalled()

      advanceTimers(100)
      expect(onHide).toHaveBeenCalledTimes(1)
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITED)
    })

    it('will be called once even during rerender', () => {
      const onStart = vi.fn()
      const { getChild, setProps } = renderTransition({ duration: 200, onStart })

      setProps({ visible: false })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_EXITED)

      setProps({})

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_EXITED)

      expect(onStart).toHaveBeenCalledTimes(1)
    })
  })

  describe('onShow', () => {
    it('is called with (null, props) when shown', () => {
      const onShow = vi.fn()
      renderTransition({ duration: 0, onShow, transitionOnMount: true })

      expect(onShow).toHaveBeenCalledTimes(1)
      expect(onShow).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ duration: 0, status: TRANSITION_STATUS_ENTERED }),
      )
    })

    it('depends on the specified duration', () => {
      const onShow = vi.fn()
      const { getChild } = renderTransition({
        duration: { show: 200 },
        onShow,
        transitionOnMount: true,
      })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)

      advanceTimers(100)
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(onShow).not.toHaveBeenCalled()

      advanceTimers(100)
      expect(onShow).toHaveBeenCalledTimes(1)
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERED)
    })
  })

  describe('onStart', () => {
    it('is called with (null, props) when transition started', () => {
      const onStart = vi.fn()
      renderTransition({ duration: 0, onStart, transitionOnMount: true })

      expect(onStart).toHaveBeenCalledTimes(1)
      expect(onStart).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ duration: 0, status: TRANSITION_STATUS_ENTERING }),
      )
    })

    it('will be called once even during rerender', () => {
      const onStart = vi.fn()
      const { getChild, setProps } = renderTransition({
        duration: 200,
        onStart,
        transitionOnMount: true,
      })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_ENTERED)

      setProps({})

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_ENTERED)

      expect(onStart).toHaveBeenCalledTimes(1)
    })
  })

  describe('style', () => {
    it("passes element's style", () => {
      const { getChild } = renderTransition({}, <p style={{ bottom: 5, top: 10 }} />)

      expect(getChild()).toHaveStyle({ bottom: '5px', top: '10px' })
    })
  })

  describe('transitionOnMount', () => {
    it('sets statuses when is true', () => {
      const { getChild } = renderTransition({ transitionOnMount: true })

      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(getChild()).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_ENTERED)
    })
  })

  describe('unmountOnHide', () => {
    it('unmounts child when true', () => {
      const { getChild, setProps } = renderTransition({
        duration: 0,
        transitionOnMount: false,
        unmountOnHide: true,
      })

      setProps({ visible: false })
      expect(getChild()).not.toBeInTheDocument()
    })

    it('lefts mounted when false', () => {
      const { getChild, setProps } = renderTransition({
        duration: 0,
        transitionOnMount: false,
        unmountOnHide: false,
      })

      setProps({ visible: false })
      expect(getChild()).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITED)
    })
  })
})
