import { act, fireEvent, render } from '@testing-library/react'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import Modal from 'src/modules/Modal/Modal'
import ModalHeader from 'src/modules/Modal/ModalHeader'
import ModalContent from 'src/modules/Modal/ModalContent'
import ModalActions from 'src/modules/Modal/ModalActions'
import ModalDescription from 'src/modules/Modal/ModalDescription'
import ModalDimmer from 'src/modules/Modal/ModalDimmer'

import { domEvent } from 'test/utils'
import * as common from 'test/specs/commonTests'
import isBrowser from 'src/lib/isBrowser'

const getModal = () => document.body.querySelector('.ui.modal')
const getDimmer = () => document.body.querySelector('.ui.dimmer')

describe('Modal', () => {
  common.isConformant(Modal, { rendersPortal: true })
  common.hasSubcomponents(Modal, [
    ModalHeader,
    ModalContent,
    ModalActions,
    ModalDescription,
    ModalDimmer,
  ])
  common.hasValidTypings(Modal)

  common.implementsShorthandProp(Modal, {
    autoGenerateKey: false,
    propKey: 'header',
    ShorthandComponent: ModalHeader,
    mapValueToProps: (content) => ({ content }),
    rendersPortal: true,
    requiredProps: { open: true },
  })
  common.implementsShorthandProp(Modal, {
    autoGenerateKey: false,
    propKey: 'content',
    ShorthandComponent: ModalContent,
    mapValueToProps: (content) => ({ content }),
    rendersPortal: true,
    requiredProps: { open: true },
  })

  // Heads up!
  //
  // Our commonTests do not currently handle wrapped components.
  // Nor do they handle components rendered to the body with Portal.
  // The Modal is wrapped in a Portal, so we manually test a few things here.

  it('renders a Portal', () => {
    const { container } = render(<Modal open />)

    // Nothing is rendered in place, the content is rendered by the Portal to the body
    expect(container).toBeEmptyDOMElement()
    expect(getModal()).toBeInTheDocument()
  })

  it('renders to the document body', () => {
    render(<Modal open />)
    expect(document.body.querySelector('body > .ui.dimmer > .ui.modal')).toBeInTheDocument()
  })

  it('renders child text', () => {
    render(<Modal open>child text</Modal>)

    expect(getModal().textContent).toBe('child text')
  })

  it('renders child components', () => {
    const child = <div data-child />
    render(<Modal open>{child}</Modal>)

    expect(getModal().querySelector('[data-child]')).toBeInTheDocument()
  })

  it("spreads the user's style prop on the Modal", () => {
    const style = { marginTop: '1em', top: 0 }

    render(<Modal open style={style} />)
    const element = getModal()

    expect(element.style.marginTop).toBe('1em')
    expect(element.style.top).toBe('0px')
  })

  describe('actions', () => {
    it('closes the modal on action click', () => {
      render(<Modal actions={['OK']} defaultOpen />)

      expect(getModal()).toBeInTheDocument()
      act(() => {
        domEvent.click('.ui.modal .actions .button')
      })
      expect(getModal()).not.toBeInTheDocument()
    })

    it('calls shorthand onActionClick callback', () => {
      const onActionClick = vi.fn()
      const modalActions = { onActionClick, actions: [{ key: 'ok', content: 'OK' }] }
      render(<Modal actions={modalActions} defaultOpen />)

      expect(onActionClick).not.toHaveBeenCalled()
      act(() => {
        domEvent.click('.ui.modal .actions .button')
      })
      expect(onActionClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('onActionClick', () => {
    it('is called when an action is clicked', () => {
      const onActionClick = vi.fn()
      const props = { actions: ['OK'], defaultOpen: true, onActionClick }

      render(<Modal {...props} />)
      act(() => {
        domEvent.click('.ui.modal .actions .button')
      })

      expect(onActionClick).toHaveBeenCalledTimes(1)
      expect(onActionClick).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining(props))
    })
  })

  describe('open', () => {
    it('is not open by default', () => {
      render(<Modal />)
      expect(document.body.querySelector('.ui.modal.open')).not.toBeInTheDocument()
      expect(getModal()).not.toBeInTheDocument()
    })

    it('is passed to Portal open', () => {
      const { rerender } = render(<Modal open />)
      expect(getModal()).toBeInTheDocument()

      rerender(<Modal open={false} />)
      expect(getModal()).not.toBeInTheDocument()
    })

    it('is not passed to Modal', () => {
      render(<Modal open />)

      expect(getDimmer()).not.toHaveAttribute('open')
      expect(getModal()).not.toHaveAttribute('open')
    })

    it('does not show the modal when false', () => {
      render(<Modal open={false} />)
      expect(getModal()).not.toBeInTheDocument()
    })

    it('does not show the dimmer when false', () => {
      render(<Modal open={false} />)
      expect(getDimmer()).not.toBeInTheDocument()
    })

    it('shows the dimmer when true', () => {
      render(<Modal open dimmer />)
      expect(getDimmer()).toBeInTheDocument()
    })

    it('shows the modal when true', () => {
      render(<Modal open />)
      expect(getModal()).toBeInTheDocument()
    })

    it('shows the modal and dimmer on changing from false to true', () => {
      const { rerender } = render(<Modal open={false} />)
      expect(getModal()).not.toBeInTheDocument()
      expect(getDimmer()).not.toBeInTheDocument()

      rerender(<Modal open />)

      expect(getModal()).toBeInTheDocument()
      expect(getDimmer()).toBeInTheDocument()
    })

    it('hides the modal and dimmer on changing from true to false', () => {
      const { rerender } = render(<Modal open />)
      expect(getModal()).toBeInTheDocument()
      expect(getDimmer()).toBeInTheDocument()

      rerender(<Modal open={false} />)

      expect(getModal()).not.toBeInTheDocument()
      expect(getDimmer()).not.toBeInTheDocument()
    })
  })

  describe('basic', () => {
    it('adds basic to the modal className', () => {
      render(<Modal basic open />)
      expect(document.body.querySelector('.ui.basic.modal')).toBeInTheDocument()
    })
  })

  describe('size', () => {
    const sizes = ['mini', 'tiny', 'small', 'large', 'fullscreen']

    sizes.forEach((size) => {
      it(`adds the "${size}" to the modal className`, () => {
        render(<Modal size={size} open />)
        expect(document.body.querySelector(`.ui.${size}.modal`)).toBeInTheDocument()
      })
    })
  })

  describe('dimmer', () => {
    it('renders ModalDimmer by default', () => {
      render(<Modal open />)
      expect(document.body.querySelector('.ui.page.modals.dimmer')).toBeInTheDocument()
    })

    it('renders ModalDimmer when is "true"', () => {
      render(<Modal open dimmer />)
      expect(document.body.querySelector('.ui.page.modals.dimmer')).toBeInTheDocument()
    })

    it('passes "blurring" to ModalDimmer', () => {
      expect(document.body).not.toHaveClass('blurring')

      render(<Modal open dimmer='blurring' />)
      expect(document.body).toHaveClass('dimmable dimmed blurring')
    })

    it('passes "inverted" to ModalDimmer', () => {
      render(<Modal open dimmer='inverted' />)
      expect(getDimmer()).toHaveClass('inverted')
    })

    describe('object', () => {
      it('passes props to a dimmer element', () => {
        render(<Modal open dimmer={{ className: 'bar', id: 'dimmer', inverted: true }} />)

        expect(getDimmer()).toHaveClass('inverted')
        expect(getDimmer()).toHaveClass('bar')
        expect(getDimmer()).toHaveAttribute('id', 'dimmer')
      })
    })
  })

  describe('onOpen', () => {
    it('is called on trigger click', () => {
      const onOpen = vi.fn()
      const { container } = render(<Modal onOpen={onOpen} trigger={<div id='trigger' />} />)

      fireEvent.click(container.querySelector('#trigger'))
      expect(onOpen).toHaveBeenCalledTimes(1)
      expect(onOpen).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ open: true }),
      )
    })

    it('is not called on body click', () => {
      const onOpen = vi.fn()
      render(<Modal onOpen={onOpen} />)

      act(() => {
        domEvent.click(document.body)
      })
      expect(onOpen).not.toHaveBeenCalled()
    })
  })

  describe('onClose', () => {
    it('is called on dimmer click', () => {
      const onClose = vi.fn()
      render(<Modal onClose={onClose} defaultOpen />)

      act(() => {
        domEvent.click('.ui.dimmer')
      })
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(onClose).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ open: false }),
      )
    })

    it('is called on click outside of the modal', () => {
      const onClose = vi.fn()
      render(<Modal onClose={onClose} defaultOpen />)

      act(() => {
        domEvent.click(getModal().parentNode)
      })
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('is not called on mousedown inside and mouseup outside of the modal', () => {
      const onClose = vi.fn()
      render(<Modal onClose={onClose} defaultOpen />)

      act(() => {
        domEvent.mouseDown(getModal())
        domEvent.click(getModal().parentNode)
      })
      expect(onClose).not.toHaveBeenCalled()
    })

    it('is not called on click inside of the modal', () => {
      const onClose = vi.fn()
      render(<Modal onClose={onClose} defaultOpen />)

      act(() => {
        domEvent.click(getModal())
      })
      expect(onClose).not.toHaveBeenCalled()
    })

    it('is not called on body click', () => {
      const onClose = vi.fn()
      render(<Modal onClose={onClose} defaultOpen />)

      act(() => {
        domEvent.click(document.body)
      })
      expect(onClose).not.toHaveBeenCalled()
    })

    it('is called when pressing escape', () => {
      const onClose = vi.fn()
      render(<Modal onClose={onClose} defaultOpen />)

      act(() => {
        domEvent.keyDown(document, { key: 'Escape' })
      })
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('is not called when the open prop changes to false', () => {
      const onClose = vi.fn()
      const { rerender } = render(<Modal onClose={onClose} defaultOpen />)

      rerender(<Modal onClose={onClose} defaultOpen open={false} />)
      expect(onClose).not.toHaveBeenCalled()
    })

    it('is not called when open changes to false programmatically', () => {
      const onClose = vi.fn()
      const { rerender } = render(<Modal onClose={onClose} open />)

      rerender(<Modal onClose={onClose} open={false} />)
      expect(getModal()).not.toBeInTheDocument()
      expect(onClose).not.toHaveBeenCalled()
    })

    it('is not called on dimmer click when closeOnDimmerClick is false', () => {
      const onClose = vi.fn()
      render(<Modal onClose={onClose} defaultOpen closeOnDimmerClick={false} />)

      act(() => {
        domEvent.click('.ui.dimmer')
      })
      expect(onClose).not.toHaveBeenCalled()
    })

    it('is not called on body click when closeOnDocumentClick is false', () => {
      const onClose = vi.fn()
      render(<Modal onClose={onClose} defaultOpen closeOnDocumentClick={false} />)

      act(() => {
        domEvent.click(document.body)
      })
      expect(onClose).not.toHaveBeenCalled()
    })

    it('handles unmount without errors', () => {
      function ControlledExample() {
        const [open, setState] = React.useState(true)

        return (
          <>
            {open && <Modal open onClose={() => setState(false)} />}
            <button id='close-button' />
          </>
        )
      }

      render(<ControlledExample />)
      expect(getModal()).toBeInTheDocument()

      act(() => {
        domEvent.keyDown(document, { key: 'Escape' })
      })
      expect(getModal()).not.toBeInTheDocument()
    })
  })

  describe('closeOnEscape', () => {
    it('closes the modal when Escape is pressed by default', () => {
      render(<Modal defaultOpen />)

      expect(getDimmer()).toBeInTheDocument()
      act(() => {
        domEvent.keyDown(document, { key: 'Escape' })
      })
      expect(getDimmer()).not.toBeInTheDocument()
    })

    it('closes the modal when true and Escape is pressed', () => {
      render(<Modal defaultOpen closeOnEscape />)

      expect(getDimmer()).toBeInTheDocument()
      act(() => {
        domEvent.keyDown(document, { key: 'Escape' })
      })
      expect(getDimmer()).not.toBeInTheDocument()
    })

    it('does not close the modal when false and Escape is pressed', () => {
      render(<Modal defaultOpen closeOnEscape={false} />)

      expect(getDimmer()).toBeInTheDocument()
      act(() => {
        domEvent.keyDown(document, { key: 'Escape' })
      })
      expect(getDimmer()).toBeInTheDocument()
    })
  })

  describe('closeOnDocumentClick', () => {
    it('is false by default', () => {
      render(<Modal defaultOpen />)

      expect(getDimmer()).toBeInTheDocument()
      act(() => {
        domEvent.click(document.body)
      })
      expect(getDimmer()).toBeInTheDocument()
    })
    it('closes the modal on document click when true', () => {
      render(<Modal defaultOpen closeOnDocumentClick />)

      expect(getDimmer()).toBeInTheDocument()
      act(() => {
        domEvent.click(document.body)
      })
      expect(getDimmer()).not.toBeInTheDocument()
    })
    it('does not close the modal on document click when false', () => {
      render(<Modal defaultOpen closeOnDocumentClick={false} />)

      expect(getDimmer()).toBeInTheDocument()
      act(() => {
        domEvent.click(document.body)
      })
      expect(getDimmer()).toBeInTheDocument()
    })
  })

  describe('mountNode', () => {
    it('render modal within mountNode', () => {
      const mountNode = document.createElement('div')
      document.body.appendChild(mountNode)

      const { unmount } = render(
        <Modal mountNode={mountNode} open>
          foo
        </Modal>,
      )
      expect(mountNode.querySelector('.ui.modal')).toBeInTheDocument()

      unmount()
      document.body.removeChild(mountNode)
    })
  })

  describe('closeIcon', () => {
    it('is not present by default', () => {
      render(<Modal open>foo</Modal>)
      expect(document.body.querySelector('.ui.modal .icon')).not.toBeInTheDocument()
    })

    it('defaults to `close` when boolean', () => {
      render(
        <Modal open closeIcon>
          foo
        </Modal>,
      )
      expect(document.body.querySelector('.ui.modal .icon.close')).toBeInTheDocument()
    })

    it('is present when passed', () => {
      render(
        <Modal open closeIcon='bullseye'>
          foo
        </Modal>,
      )
      expect(document.body.querySelector('.ui.modal .icon.bullseye')).toBeInTheDocument()
    })

    it('triggers onClose when clicked', () => {
      const spy = vi.fn()

      render(
        <Modal onClose={spy} open closeIcon='bullseye'>
          foo
        </Modal>,
      )
      fireEvent.click(document.body.querySelector('.ui.modal .icon.bullseye'))
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('scrolling', () => {
    const innerHeight = window.innerHeight
    let frames

    // Runs pending animation frames, Modal recomputes "scrolling" on each frame
    const runAnimationFrame = () => {
      act(() => {
        frames.splice(0).forEach((cb) => cb())
      })
    }
    // "scrolling" of ModalDimmer is applied to its mountNode (the body) & to the modal
    const expectScrolling = (scrolling) => {
      if (scrolling) {
        expect(document.body).toHaveClass('scrolling')
        expect(getModal()).toHaveClass('scrolling')
      } else {
        expect(document.body).not.toHaveClass('scrolling')
        expect(getModal()).not.toHaveClass('scrolling')
      }
    }

    beforeEach(() => {
      frames = []
      vi.stubGlobal('requestAnimationFrame', (cb) => frames.push(cb))
      vi.stubGlobal('cancelAnimationFrame', () => {})
    })

    afterEach(() => {
      document.body.classList.remove('scrolling')
      window.innerHeight = innerHeight
    })

    it('does not pass "scrolling" by default', () => {
      render(<Modal open />)
      expectScrolling(false)
    })

    it('does not pass "scrolling" when equal to the window height', () => {
      /* 101 is `padding * 2 + 1, see Modal/utils */
      const height = window.innerHeight - 101
      // jsdom has no layout
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ height, width: 0 })

      render(
        <Modal open style={{ height }}>
          foo
        </Modal>,
      )

      runAnimationFrame()
      expectScrolling(false)
    })

    it('passes "scrolling" when taller than the window', () => {
      window.innerHeight = 10
      render(<Modal open>foo</Modal>)

      runAnimationFrame()
      expectScrolling(true)
    })

    it('passes "scrolling" when the window grows/shrinks', () => {
      render(
        <Modal open>
          <span />
        </Modal>,
      )
      expectScrolling(false)

      window.innerHeight = 10
      runAnimationFrame()
      expectScrolling(true)

      window.innerHeight = 10000
      runAnimationFrame()
      expectScrolling(false)
    })
  })

  describe('server-side', () => {
    beforeAll(() => {
      isBrowser.override = false
    })

    afterAll(() => {
      isBrowser.override = null
    })

    it('renders empty content when trigger is not a valid component', () => {
      const markup = ReactDOMServer.renderToStaticMarkup(<Modal />)
      expect(markup).toBe('')
    })

    it('renders a valid trigger component', () => {
      const markup = ReactDOMServer.renderToStaticMarkup(<Modal trigger={<div id='trigger' />} />)
      expect(markup).toBe('<div id="trigger"></div>')
    })
  })
})
