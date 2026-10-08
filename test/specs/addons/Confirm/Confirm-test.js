import { act, fireEvent, render } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import keyboardKey from 'src/lib/keyboardKey'
import Confirm from 'src/addons/Confirm/Confirm'
import Modal from 'src/modules/Modal/Modal'
import { domEvent } from 'test/utils'
import * as common from 'test/specs/commonTests'

const getModal = () => document.body.querySelector('.ui.modal')
const getButtons = () => document.body.querySelectorAll('.ui.modal .actions .ui.button')
const getCancelButton = () => getButtons()[0]
const getConfirmButton = () => document.body.querySelector('.ui.modal .actions .ui.primary.button')

describe('Confirm', () => {
  common.isConformant(Confirm, { rendersPortal: true })

  common.implementsShorthandProp(Confirm, {
    autoGenerateKey: false,
    propKey: 'header',
    ShorthandComponent: Modal.Header,
    rendersPortal: true,
    mapValueToProps: (content) => ({ content }),
    requiredProps: { open: true },
  })
  common.implementsShorthandProp(Confirm, {
    defaultValue: 'OK',
    autoGenerateKey: false,
    propKey: 'content',
    ShorthandComponent: Modal.Content,
    rendersPortal: true,
    mapValueToProps: (content) => ({ content }),
    requiredProps: { open: true },
  })

  describe('children', () => {
    it('renders a Modal', () => {
      render(<Confirm open />)

      expect(document.body.querySelector('.ui.page.modals.dimmer > .ui.modal')).toBeInTheDocument()
    })
  })

  describe('size', () => {
    it('has "small" size by default', () => {
      render(<Confirm open />)

      expect(getModal()).toHaveClass('small')
    })

    _.forEach(['mini', 'tiny', 'small', 'large', 'fullscreen'], (size) => {
      it(`applies ${size} size`, () => {
        render(<Confirm open size={size} />)

        expect(getModal()).toHaveClass(size)
      })
    })
  })

  describe('cancelButton', () => {
    it('is "Cancel" by default', () => {
      render(<Confirm open />)

      expect(getCancelButton()).toHaveTextContent(/^Cancel$/)
    })
    it('sets the cancel button text', () => {
      render(<Confirm cancelButton='foo' open />)

      expect(getCancelButton()).toHaveTextContent(/^foo$/)
    })
  })

  describe('confirmButton', () => {
    it('is "OK" by default', () => {
      render(<Confirm open />)

      expect(getConfirmButton()).toHaveTextContent(/^OK$/)
    })
    it('sets the confirm button text', () => {
      render(<Confirm confirmButton='foo' open />)

      expect(getConfirmButton()).toHaveTextContent(/^foo$/)
    })
  })

  describe('onCancel', () => {
    it('omitted when not defined', () => {
      render(<Confirm open />)

      expect(() => fireEvent.click(getCancelButton())).not.toThrow()
    })

    it('is called on Cancel button click', () => {
      const onCancel = vi.fn()
      render(<Confirm onCancel={onCancel} open />)

      fireEvent.click(getCancelButton())
      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('is called on Modal close with (e, props)', () => {
      // "onCancel" is passed to the Modal "onClose" prop, i.e. Escape closes the Modal
      const onCancel = vi.fn()
      render(<Confirm defaultOpen onCancel={onCancel} />)

      act(() => {
        domEvent.keyDown(document, { key: 'Escape' })
      })
      expect(onCancel).toHaveBeenCalledTimes(1)
      expect(onCancel).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'Escape' }),
        expect.objectContaining({ onCancel, defaultOpen: true }),
      )
    })

    it('is called on dimmer click', () => {
      const onCancel = vi.fn()
      render(<Confirm onCancel={onCancel} defaultOpen />)

      act(() => {
        domEvent.click('.ui.dimmer')
      })
      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('is called on click outside of the modal', () => {
      const onCancel = vi.fn()
      render(<Confirm onCancel={onCancel} defaultOpen />)

      act(() => {
        domEvent.click(getModal().parentNode)
      })
      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('is not called on click inside of the modal', () => {
      const onCancel = vi.fn()
      render(<Confirm onCancel={onCancel} defaultOpen />)

      act(() => {
        domEvent.click(getModal())
      })
      expect(onCancel).not.toHaveBeenCalled()
    })

    it('is not called on body click', () => {
      const onCancel = vi.fn()
      render(<Confirm onCancel={onCancel} defaultOpen />)

      act(() => {
        domEvent.click('body')
      })
      expect(onCancel).not.toHaveBeenCalled()
    })

    it('is called when pressing escape', () => {
      const onCancel = vi.fn()
      render(<Confirm onCancel={onCancel} defaultOpen />)

      act(() => {
        domEvent.keyDown(document, { key: 'Escape' })
      })
      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('is not called when pressing a key other than "Escape"', () => {
      const onCancel = vi.fn()
      render(<Confirm onCancel={onCancel} defaultOpen />)

      _.each(keyboardKey, (val, key) => {
        // skip Escape key
        if (val === keyboardKey.Escape) return

        act(() => {
          domEvent.keyDown(document, { key })
        })
        expect(onCancel, `onClose was called when pressing "${key}"`).not.toHaveBeenCalled()
      })
    })

    it('is not called when the open prop changes to false', () => {
      const onCancel = vi.fn()
      const { rerender } = render(<Confirm onCancel={onCancel} defaultOpen />)

      rerender(<Confirm onCancel={onCancel} defaultOpen open={false} />)
      expect(onCancel).not.toHaveBeenCalled()
    })
  })

  describe('onConfirm', () => {
    it('omitted when not defined', () => {
      render(<Confirm open />)

      expect(() => fireEvent.click(getConfirmButton())).not.toThrow()
    })

    it('is called on OK button click', () => {
      const onConfirm = vi.fn()
      render(<Confirm onConfirm={onConfirm} open />)

      fireEvent.click(getConfirmButton())
      expect(onConfirm).toHaveBeenCalledTimes(1)
    })
  })

  describe('open', () => {
    it('is not open by default', () => {
      render(<Confirm />)
      expect(document.body.querySelector('.ui.modal.open')).not.toBeInTheDocument()
      expect(getModal()).not.toBeInTheDocument()
    })

    it('does not show the modal when false', () => {
      render(<Confirm open={false} />)
      expect(getModal()).not.toBeInTheDocument()
    })

    it('shows the modal when true', () => {
      render(<Confirm open />)
      expect(getModal()).toBeInTheDocument()
    })

    it('shows the modal on changing from false to true', () => {
      const { rerender } = render(<Confirm open={false} />)
      expect(getModal()).not.toBeInTheDocument()

      rerender(<Confirm open />)
      expect(getModal()).toBeInTheDocument()
    })

    it('hides the modal on changing from true to false', () => {
      const { rerender } = render(<Confirm open />)
      expect(getModal()).toBeInTheDocument()

      rerender(<Confirm open={false} />)
      expect(getModal()).not.toBeInTheDocument()
    })
  })
})
