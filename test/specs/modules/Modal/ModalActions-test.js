import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import ModalActions from 'src/modules/Modal/ModalActions'
import * as common from 'test/specs/commonTests'

describe('ModalActions', () => {
  common.isConformant(ModalActions)
  common.forwardsRef(ModalActions)
  common.forwardsRef(ModalActions, { requiredProps: { children: <span /> } })
  common.rendersChildren(ModalActions)

  common.implementsCreateMethod(ModalActions)

  const actions = [
    { key: 'cancel', content: 'Cancel', 'data-foo': 'something' },
    { key: 'ok', content: 'OK', 'data-foo': 'something' },
  ]

  const getButtons = (container) => container.querySelectorAll('.ui.button')

  describe('actions', () => {
    it('renders children', () => {
      const { container } = render(<ModalActions actions={actions} />)
      const buttons = getButtons(container)

      expect(buttons).toHaveLength(2)
      expect(buttons[0]).toHaveTextContent(/^Cancel$/)
      expect(buttons[1]).toHaveTextContent(/^OK$/)
    })

    it('passes arbitrary props', () => {
      const { container } = render(<ModalActions actions={actions} />)

      getButtons(container).forEach((button) => {
        expect(button).toHaveAttribute('data-foo', 'something')
      })
    })
  })

  describe('onActionClick', () => {
    it('can be omitted', () => {
      const { container } = render(<ModalActions actions={actions} />)

      expect(() => fireEvent.click(getButtons(container)[0])).not.toThrow()
    })

    it('is called with (e, actionProps) when clicked', () => {
      const onActionClick = vi.fn()
      const onButtonClick = vi.fn()

      const action = { key: 'users', content: 'Disable', onClick: onButtonClick }
      const matchProps = { content: 'Disable' }

      const { container } = render(
        <ModalActions actions={[...actions, action]} onActionClick={onActionClick} />,
      )
      const button = getButtons(container)[2]
      fireEvent.click(button)

      expect(onActionClick).toHaveBeenCalledTimes(1)
      expect(onActionClick).toHaveBeenCalledWith(
        expect.objectContaining({ target: button }),
        expect.objectContaining(matchProps),
      )
      expect(onButtonClick).toHaveBeenCalledTimes(1)
      expect(onButtonClick).toHaveBeenCalledWith(
        expect.objectContaining({ target: button }),
        expect.objectContaining(matchProps),
      )
    })
  })
})
