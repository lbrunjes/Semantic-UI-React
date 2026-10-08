import { act, fireEvent, render } from '@testing-library/react'
import React from 'react'

import TransitionablePortal from 'src/addons/TransitionablePortal/TransitionablePortal'
import * as common from 'test/specs/commonTests'
import { domEvent } from 'test/utils'

const quickTransition = { duration: 0 }
const requiredProps = {
  children: <div id='children' />,
}

const getChildren = () => document.body.querySelector('#children')

describe('TransitionablePortal', () => {
  common.isConformant(TransitionablePortal, {
    rendersPortal: true,
    requiredProps,
    forwardsRef: false,
    // Unhandled props are passed to Portal, that does not render a DOM element, see below
    spreadsUserProps: false,
  })

  describe('unhandled props', () => {
    it('are passed to Portal', () => {
      // "trigger" is not handled by TransitionablePortal, Portal renders it
      const { container } = render(
        <TransitionablePortal {...requiredProps} trigger={<button data-trigger />} />,
      )

      expect(container.querySelector('[data-trigger]')).toBeInTheDocument()
    })
  })

  describe('children', () => {
    it('renders a Transition', () => {
      render(<TransitionablePortal {...requiredProps} open />)

      expect(document.body.querySelector('.transition')).toBeInTheDocument()
    })
  })

  describe('onClose', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('is called with (null, data) on a click outside', () => {
      const onClose = vi.fn()
      const { container } = render(
        <TransitionablePortal
          {...requiredProps}
          onClose={onClose}
          transition={quickTransition}
          trigger={<button />}
        />,
      )

      fireEvent.click(container.querySelector('button'))
      act(() => {
        domEvent.click(document.body)
      })
      act(() => {
        vi.runAllTimers()
      })

      expect(onClose).toHaveBeenCalledTimes(1)
      expect(onClose).toHaveBeenCalledWith(null, expect.objectContaining({ portalOpen: false }))
    })

    it('hides contents on a click outside', () => {
      const { container } = render(<TransitionablePortal {...requiredProps} trigger={<button />} />)

      fireEvent.click(container.querySelector('button'))
      expect(getChildren()).toHaveClass('in')

      act(() => {
        domEvent.click(document.body)
      })
      expect(getChildren()).toHaveClass('out')
    })
  })

  describe('onHide', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('is called with (null, data) when exiting transition finished', () => {
      const onHide = vi.fn()
      const { rerender } = render(
        <TransitionablePortal
          {...requiredProps}
          onHide={onHide}
          open
          transition={quickTransition}
          trigger={<button />}
        />,
      )

      rerender(
        <TransitionablePortal
          {...requiredProps}
          onHide={onHide}
          open={false}
          transition={quickTransition}
          trigger={<button />}
        />,
      )
      act(() => {
        vi.runAllTimers()
      })

      expect(onHide).toHaveBeenCalledTimes(1)
      expect(onHide).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          ...quickTransition,
          portalOpen: false,
          transitionVisible: false,
        }),
      )
    })
  })

  describe('onOpen', () => {
    it('is called with (null, data) when opens', () => {
      const onOpen = vi.fn()
      const { container } = render(
        <TransitionablePortal {...requiredProps} onOpen={onOpen} trigger={<button />} />,
      )

      fireEvent.click(container.querySelector('button'))
      expect(onOpen).toHaveBeenCalledTimes(1)
      expect(onOpen).toHaveBeenCalledWith(null, expect.objectContaining({ portalOpen: true }))
    })

    it('renders contents', () => {
      const { container } = render(<TransitionablePortal {...requiredProps} trigger={<button />} />)

      fireEvent.click(container.querySelector('button'))
      expect(getChildren()).toHaveClass('in')
    })
  })

  describe('open', () => {
    it('blocks update of state on a portal close', () => {
      render(<TransitionablePortal {...requiredProps} open />)
      expect(getChildren()).toHaveClass('in')

      act(() => {
        domEvent.click(document.body)
      })
      expect(getChildren()).toHaveClass('in')
    })

    it('passes `open` prop to Transition when defined', () => {
      const { rerender } = render(<TransitionablePortal {...requiredProps} />)

      rerender(<TransitionablePortal {...requiredProps} open />)
      expect(getChildren()).toHaveClass('in')

      rerender(<TransitionablePortal {...requiredProps} open={false} />)
      expect(getChildren()).toHaveClass('out')
    })

    it('does not pass `open` prop to Transition when not defined', () => {
      const { rerender } = render(<TransitionablePortal {...requiredProps} />)
      expect(getChildren()).not.toBeInTheDocument()

      rerender(<TransitionablePortal {...requiredProps} transition={{}} />)
      expect(getChildren()).not.toBeInTheDocument()
    })
  })
})
