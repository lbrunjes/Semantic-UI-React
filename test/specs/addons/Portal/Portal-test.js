import { act, fireEvent, render } from '@testing-library/react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import * as common from 'test/specs/commonTests'
import { domEvent } from 'test/utils'
import Portal from 'src/addons/Portal/Portal'
import PortalInner from 'src/addons/Portal/PortalInner'

const createHandlingComponent = (eventName) =>
  class HandlingComponent extends React.Component {
    handleEvent = (e) => this.props.handler(e, this.props)

    render() {
      const buttonProps = { [eventName]: this.handleEvent }

      return <button {...buttonProps} />
    }
  }

// Portal content, it is rendered to "document.body" when the portal is open
const content = () => <p data-testid='content' id='inner' />
const getContent = () => document.body.querySelector('[data-testid="content"]')
const expectOpen = () => expect(getContent()).toBeInTheDocument()
const expectClosed = () => expect(getContent()).not.toBeInTheDocument()

const getButton = (container) => container.querySelector('button')

describe('Portal', () => {
  common.hasSubcomponents(Portal, [PortalInner])
  common.hasValidTypings(Portal, { forwardsRef: false })

  it('propTypes.children should be required', () => {
    expect(Portal.propTypes.children).toBe(PropTypes.node.isRequired)
  })

  it('does not update state if portal is unmounted', () => {
    // Any state update on an unmounted component produces a React warning, warnings throw
    const { unmount } = render(<Portal open>{content()}</Portal>)
    unmount()

    act(() => {
      domEvent.click(document.body)
      domEvent.keyDown(document, { key: 'Escape' })
    })
    expectClosed()
  })

  describe('open', () => {
    it('opens the portal when toggled from false to true', () => {
      const { rerender } = render(<Portal open={false}>{content()}</Portal>)
      expectClosed()

      rerender(<Portal open>{content()}</Portal>)
      expectOpen()
    })

    it('closes the portal when toggled from true to false ', () => {
      const { rerender } = render(<Portal open>{content()}</Portal>)
      expectOpen()

      rerender(<Portal open={false}>{content()}</Portal>)
      expectClosed()
    })
  })

  describe('onMount', () => {
    it('called when portal opens', () => {
      const onMount = vi.fn()
      const { rerender } = render(
        <Portal onMount={onMount} open={false}>
          {content()}
        </Portal>,
      )

      rerender(
        <Portal onMount={onMount} open>
          {content()}
        </Portal>,
      )
      expect(onMount).toHaveBeenCalledTimes(1)
    })

    it('is not called when portal receives props', () => {
      const onMount = vi.fn()
      const { rerender } = render(
        <Portal onMount={onMount} open={false}>
          {content()}
        </Portal>,
      )

      rerender(
        <Portal className='old' onMount={onMount} open>
          {content()}
        </Portal>,
      )
      expect(onMount).toHaveBeenCalledTimes(1)

      rerender(
        <Portal className='new' onMount={onMount} open>
          {content()}
        </Portal>,
      )
      expect(onMount).toHaveBeenCalledTimes(1)
    })
  })

  describe('onUnmount', () => {
    it('is called when portal closes', () => {
      const onUnmount = vi.fn()
      const { rerender } = render(
        <Portal onUnmount={onUnmount} open>
          {content()}
        </Portal>,
      )

      rerender(
        <Portal onUnmount={onUnmount} open={false}>
          {content()}
        </Portal>,
      )
      expect(onUnmount).toHaveBeenCalledTimes(1)
    })

    it('is not called when portal receives props', () => {
      const onUnmount = vi.fn()
      const { rerender } = render(
        <Portal onUnmount={onUnmount} open>
          {content()}
        </Portal>,
      )

      rerender(
        <Portal className='old' onUnmount={onUnmount} open={false}>
          {content()}
        </Portal>,
      )
      expect(onUnmount).toHaveBeenCalledTimes(1)

      rerender(
        <Portal className='new' onUnmount={onUnmount} open={false}>
          {content()}
        </Portal>,
      )
      expect(onUnmount).toHaveBeenCalledTimes(1)
    })

    it('is called only once when portal closes and then is unmounted', () => {
      const onUnmount = vi.fn()
      const { rerender, unmount } = render(
        <Portal onUnmount={onUnmount} open>
          {content()}
        </Portal>,
      )

      rerender(
        <Portal onUnmount={onUnmount} open={false}>
          {content()}
        </Portal>,
      )
      unmount()
      expect(onUnmount).toHaveBeenCalledTimes(1)
    })

    it('is called only once when directly unmounting', () => {
      const onUnmount = vi.fn()
      const { unmount } = render(
        <Portal onUnmount={onUnmount} open>
          {content()}
        </Portal>,
      )

      unmount()
      expect(onUnmount).toHaveBeenCalledTimes(1)
    })
  })

  describe('onOpen', () => {
    it('is called on trigger click', () => {
      const onOpen = vi.fn()
      const { container } = render(
        <Portal onOpen={onOpen} trigger={<div id='trigger' />}>
          {content()}
        </Portal>,
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
        <Portal defaultOpen onClose={onClose} trigger={<div />}>
          {content()}
        </Portal>,
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

  describe('trigger', () => {
    it('renders null when not set', () => {
      const { container } = render(<Portal>{content()}</Portal>)

      expect(container).toBeEmptyDOMElement()
    })

    it('renders the trigger when set', () => {
      const text = 'open by click on me'
      const trigger = <button>{text}</button>
      const { container } = render(<Portal trigger={trigger}>{content()}</Portal>)

      expect(container.textContent).toBe(text)
    })

    _.forEach(['onBlur', 'onClick', 'onFocus', 'onMouseLeave', 'onMouseEnter'], (handlerName) => {
      it(`handles ${handlerName} on trigger and passes all arguments`, () => {
        const handler = vi.fn()
        const Trigger = createHandlingComponent(handlerName)
        const trigger = <Trigger color='blue' handler={handler} />

        const { container } = render(<Portal trigger={trigger}>{content()}</Portal>)
        const eventName = _.camelCase(handlerName.substring(2))
        const button = getButton(container)

        fireEvent[eventName](button)

        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenCalledWith(
          expect.objectContaining({ target: button }),
          expect.objectContaining({ handler, color: 'blue' }),
        )
      })
    })
  })

  describe('triggerRef', () => {
    it('calls itself and an original ref', () => {
      const elementRef = React.createRef()
      const triggerRef = React.createRef()

      const { container } = render(
        <Portal trigger={<div id='trigger' ref={elementRef} />} triggerRef={triggerRef}>
          {content()}
        </Portal>,
      )
      const element = container.firstElementChild

      expect(element.tagName).toBe('DIV')

      expect(elementRef.current).toBe(element)
      expect(triggerRef.current).toBe(element)
    })
  })

  describe('mountNode', () => {
    it('renders the portal into mountNode', () => {
      const mountNode = document.createElement('div')
      document.body.appendChild(mountNode)

      render(
        <Portal mountNode={mountNode} open>
          {content()}
        </Portal>,
      )

      expect(mountNode.querySelector('[data-testid="content"]')).toBeInTheDocument()
      expect(getContent().parentNode).toBe(mountNode)

      document.body.removeChild(mountNode)
    })
  })

  describe('openOnTriggerClick', () => {
    it('defaults to true', () => {
      const onTriggerClick = vi.fn()
      const trigger = <button onClick={onTriggerClick}>button</button>

      const { container } = render(<Portal trigger={trigger}>{content()}</Portal>)
      expectClosed()

      fireEvent.click(getButton(container))
      expectOpen()
      expect(onTriggerClick).toHaveBeenCalledTimes(1)
    })

    it('does not open the portal on trigger click when false', () => {
      const spy = vi.fn()
      const trigger = <button onClick={spy}>button</button>

      const { container } = render(
        <Portal trigger={trigger} openOnTriggerClick={false}>
          {content()}
        </Portal>,
      )
      expectClosed()

      fireEvent.click(getButton(container))
      expectClosed()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('opens the portal on trigger click when true', () => {
      const spy = vi.fn()
      const trigger = <button onClick={spy}>button</button>

      const { container } = render(
        <Portal trigger={trigger} openOnTriggerClick>
          {content()}
        </Portal>,
      )
      expectClosed()

      fireEvent.click(getButton(container))
      expectOpen()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('closeOnTriggerClick', () => {
    it('does not close the portal on click', () => {
      const { container } = render(
        <Portal trigger={<button />} defaultOpen>
          {content()}
        </Portal>,
      )
      expectOpen()

      fireEvent.click(getButton(container))
      expectOpen()
    })

    it('closes the portal on click when set', () => {
      const { container } = render(
        <Portal trigger={<button />} defaultOpen closeOnTriggerClick>
          {content()}
        </Portal>,
      )
      expectOpen()

      fireEvent.click(getButton(container))
      expectClosed()
    })
  })

  describe('timers', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    describe('openOnTriggerMouseEnter', () => {
      it('does not open the portal on mouseenter when not set', () => {
        const { container } = render(<Portal trigger={<button />}>{content()}</Portal>)
        expectClosed()

        fireEvent.mouseEnter(getButton(container))
        act(() => {
          vi.advanceTimersByTime(1)
        })
        expectClosed()
      })

      it('opens the portal on mouseenter when set', () => {
        const { container } = render(
          <Portal trigger={<button />} openOnTriggerMouseEnter mouseEnterDelay={0}>
            {content()}
          </Portal>,
        )
        expectClosed()

        fireEvent.mouseEnter(getButton(container))
        act(() => {
          vi.advanceTimersByTime(1)
        })
        expectOpen()
      })

      /**
       * e--l--d--v
       * ^: mouseenter
       *    ^: BEFORE_DELAY: mouseleave
       *       ^: expected DELAY
       *          ^: final validation
       */
      it('does not open the portal when leave before delay', () => {
        const DELAY = 20
        const BEFORE_DELAY = 10

        const { container } = render(
          <Portal trigger={<button />} openOnTriggerMouseEnter mouseEnterDelay={DELAY}>
            {content()}
          </Portal>,
        )

        expectClosed()
        fireEvent.mouseEnter(getButton(container))

        act(() => {
          vi.advanceTimersByTime(BEFORE_DELAY)
        })

        expectClosed()
        fireEvent.mouseLeave(getButton(container))

        act(() => {
          vi.advanceTimersByTime(DELAY)
        })

        expectClosed()
      })
    })

    describe('closeOnTriggerMouseLeave', () => {
      it('does not close the portal on mouseleave when not set', () => {
        const { container } = render(
          <Portal trigger={<button />} defaultOpen mouseLeaveDelay={0}>
            {content()}
          </Portal>,
        )
        expectOpen()

        fireEvent.mouseLeave(getButton(container))
        act(() => {
          vi.advanceTimersByTime(1)
        })
        expectOpen()
      })

      it('closes the portal on mouseleave when set', () => {
        const { container } = render(
          <Portal trigger={<button />} defaultOpen closeOnTriggerMouseLeave mouseLeaveDelay={0}>
            {content()}
          </Portal>,
        )
        expectOpen()

        fireEvent.mouseLeave(getButton(container))
        act(() => {
          vi.advanceTimersByTime(1)
        })
        expectClosed()
      })

      /**
       * e--l--e--d--v
       * ^: mouseenter
       *    ^: mouseleave
       *       ^: BEFORE_DELAY: reenter
       *          ^: expected DELAY
       *             ^: final validation
       */
      it('does not close the portal when reenter before delay', () => {
        const DELAY = 20
        const BEFORE_DELAY = 10

        const { container } = render(
          <Portal
            trigger={<button />}
            openOnTriggerMouseEnter
            closeOnTriggerMouseLeave
            mouseLeaveDelay={DELAY}
          >
            {content()}
          </Portal>,
        )

        expectClosed()
        fireEvent.mouseEnter(getButton(container))

        act(() => {
          vi.advanceTimersByTime(BEFORE_DELAY)
        })

        expectOpen()
        fireEvent.mouseLeave(getButton(container))

        act(() => {
          vi.advanceTimersByTime(BEFORE_DELAY)
        })

        expectOpen()
        fireEvent.mouseEnter(getButton(container))

        act(() => {
          vi.advanceTimersByTime(DELAY)
        })

        expectOpen()
      })
    })

    describe('closeOnPortalMouseLeave', () => {
      it('does not close the portal on mouseleave of portal when not set', () => {
        render(
          <Portal trigger={<button />} defaultOpen mouseLeaveDelay={0}>
            {content()}
          </Portal>,
        )
        expectOpen()

        act(() => {
          domEvent.mouseLeave('#inner')
          vi.advanceTimersByTime(1)
        })
        expectOpen()
      })

      it('closes the portal on mouseleave of portal when set', () => {
        render(
          <Portal closeOnPortalMouseLeave defaultOpen mouseLeaveDelay={0} trigger={<button />}>
            {content()}
          </Portal>,
        )
        expectOpen()

        act(() => {
          domEvent.mouseLeave('#inner')
          vi.advanceTimersByTime(1)
        })
        expectClosed()
      })

      it("does not close the portal on mouseleave triggered by the portal's children", () => {
        render(
          <Portal closeOnPortalMouseLeave defaultOpen mouseLeaveDelay={0} trigger={<button />}>
            <div data-testid='content'>
              <p id='child' />
            </div>
          </Portal>,
        )
        expectOpen()

        act(() => {
          domEvent.mouseLeave('#child')
          vi.advanceTimersByTime(1)
        })
        expectOpen()
      })
    })

    describe('closeOnTriggerMouseLeave + closeOnPortalMouseLeave', () => {
      it('closes the portal on trigger mouseleave even when portal receives mouseenter within limit', () => {
        const delay = 10
        const { container } = render(
          <Portal trigger={<button />} defaultOpen closeOnTriggerMouseLeave mouseLeaveDelay={delay}>
            {content()}
          </Portal>,
        )
        expectOpen()

        fireEvent.mouseLeave(getButton(container))

        // Fire a mouseEnter on the portal within the time limit
        act(() => {
          vi.advanceTimersByTime(delay - 1)
        })
        act(() => {
          domEvent.mouseEnter('#inner')
        })

        // The portal should close because closeOnPortalMouseLeave not set
        act(() => {
          vi.advanceTimersByTime(2)
        })
        expectClosed()
      })

      it('does not close the portal on trigger mouseleave when portal receives mouseenter within limit', () => {
        const delay = 10
        const { container } = render(
          <Portal
            trigger={<button />}
            defaultOpen
            closeOnTriggerMouseLeave
            closeOnPortalMouseLeave
            mouseLeaveDelay={delay}
          >
            {content()}
          </Portal>,
        )
        expectOpen()

        fireEvent.mouseLeave(getButton(container))

        // Fire a mouseEnter on the portal within the time limit
        act(() => {
          vi.advanceTimersByTime(delay - 1)
        })
        act(() => {
          domEvent.mouseEnter('#inner')
        })

        // The portal should not have closed
        act(() => {
          vi.advanceTimersByTime(2)
        })
        expectOpen()
      })
    })
  })

  describe('openOnTriggerFocus', () => {
    it('does not open the portal on focus when not set', () => {
      const { container } = render(<Portal trigger={<button />}>{content()}</Portal>)
      expectClosed()

      fireEvent.focus(getButton(container))
      expectClosed()
    })

    it('opens the portal on focus when set', () => {
      const { container } = render(
        <Portal trigger={<button />} openOnTriggerFocus>
          {content()}
        </Portal>,
      )
      expectClosed()

      fireEvent.focus(getButton(container))
      expectOpen()
    })
  })

  describe('closeOnTriggerBlur', () => {
    it('does not close the portal on blur when not set', () => {
      const { container } = render(
        <Portal trigger={<button />} defaultOpen>
          {content()}
        </Portal>,
      )
      expectOpen()

      fireEvent.blur(getButton(container))
      expectOpen()
    })

    it('closes the portal on blur when set', () => {
      const { container } = render(
        <Portal trigger={<button />} defaultOpen closeOnTriggerBlur>
          {content()}
        </Portal>,
      )
      expectOpen()

      fireEvent.blur(getButton(container))
      expectClosed()
    })
  })

  describe('closeOnEscape', () => {
    it('closes the portal on escape', () => {
      render(
        <Portal closeOnEscape defaultOpen>
          {content()}
        </Portal>,
      )
      expectOpen()

      act(() => {
        domEvent.keyDown(document, { key: 'Escape' })
      })
      expectClosed()
    })

    it('does not close the portal on escape when false', () => {
      render(
        <Portal closeOnEscape={false} defaultOpen>
          {content()}
        </Portal>,
      )
      expectOpen()

      act(() => {
        domEvent.keyDown(document, { key: 'Escape' })
      })
      expectOpen()
    })
  })

  describe('closeOnDocumentClick', () => {
    it('closes the portal on document click', () => {
      render(
        <Portal closeOnDocumentClick defaultOpen>
          {content()}
        </Portal>,
      )
      expectOpen()

      act(() => {
        domEvent.click(document)
      })
      expectClosed()
    })

    it('does not close on click inside', () => {
      render(
        <Portal closeOnDocumentClick defaultOpen>
          {content()}
        </Portal>,
      )
      expectOpen()

      act(() => {
        domEvent.click('#inner')
      })
      expectOpen()
    })

    it('does not close on mousedown inside and mouseup outside', () => {
      render(
        <Portal closeOnDocumentClick defaultOpen>
          {content()}
        </Portal>,
      )
      expectOpen()

      act(() => {
        domEvent.mouseDown('#inner')
        domEvent.click(document)
      })
      expectOpen()
    })
  })

  // Heads Up!
  // Portals used to take focus on mount and restore focus to the original activeElement on unMount.
  // One by one, these auto set/remove focus features were removed and the assertions negated.
  // Leave these tests here to ensure we aren't ever stealing focus.
  describe('focus', () => {
    let input

    beforeEach(() => {
      vi.useFakeTimers()

      input = document.createElement('input')
      document.body.appendChild(input)
    })

    afterEach(() => {
      vi.useRealTimers()

      document.body.removeChild(input)
    })

    it('does not take focus onMount', () => {
      render(<Portal defaultOpen>{content()}</Portal>)

      act(() => {
        vi.runAllTimers()
      })
      expect(getContent()).not.toHaveFocus()
    })

    it('does not take focus on unMount', () => {
      input.focus()
      expect(input).toHaveFocus()

      const { rerender, unmount } = render(<Portal open>{content()}</Portal>)
      expect(input).toHaveFocus()

      act(() => {
        vi.runAllTimers()
      })
      expect(input).toHaveFocus()

      rerender(<Portal open={false}>{content()}</Portal>)
      unmount()

      expect(input).toHaveFocus()
    })

    it('does not take focus on re-render', () => {
      input.focus()
      expect(input).toHaveFocus()

      const { rerender } = render(<Portal defaultOpen>{content()}</Portal>)
      expect(input).toHaveFocus()

      act(() => {
        vi.runAllTimers()
      })
      expect(input).toHaveFocus()

      rerender(<Portal defaultOpen>{content()}</Portal>)
      expect(input).toHaveFocus()
    })
  })
})
