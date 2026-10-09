import * as React from 'react'

import { getUnhandledProps } from '../../lib'
import Button from '../../elements/Button'
import Modal from '../../modules/Modal'
import { has } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandItem } from '../../generic'
import type { ButtonProps } from '../../elements/Button'
import type { StrictModalProps } from '../../modules/Modal'
import type { ModalContentProps } from '../../modules/Modal/ModalContent'
import type { ModalHeaderProps } from '../../modules/Modal/ModalHeader'

export interface ConfirmProps extends StrictConfirmProps {
  [key: string]: any
}

export interface StrictConfirmProps extends StrictModalProps {
  /** The cancel button text. */
  cancelButton?: SemanticShorthandItem<ButtonProps>

  /** The OK button text. */
  confirmButton?: SemanticShorthandItem<ButtonProps>

  /** The ModalContent text. */
  content?: SemanticShorthandItem<ModalContentProps>

  /** The ModalHeader text. */
  header?: SemanticShorthandItem<ModalHeaderProps>

  /**
   * Called when the Modal is closed without clicking confirm.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onCancel?: (event: React.MouseEvent<HTMLAnchorElement>, data: ConfirmProps) => void

  /**
   * Called when the OK button is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onConfirm?: (event: React.MouseEvent<HTMLAnchorElement>, data: ConfirmProps) => void

  /** Whether or not the modal is visible. */
  open?: boolean

  /** A Confirm can vary in size. */
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'
}

/**
 * A Confirm modal gives the user a choice to confirm or cancel an action.
 * @see Modal
 */
const Confirm = React.forwardRef<HTMLDivElement, ConfirmProps>(function (props, ref) {
  const {
    cancelButton = 'Cancel',
    confirmButton = 'OK',
    content = 'Are you sure?',
    header,
    open,
    size = 'small',
  } = props
  const rest = getUnhandledProps(Confirm, props)

  // Events come from the buttons (`HTMLButtonElement`) and the Modal, the public callback types differ
  const handleCancel = (e: React.MouseEvent<any>) => {
    props?.onCancel?.(e, props)
  }

  const handleCancelOverrides = (predefinedProps: ButtonProps) => ({
    onClick: (e: React.MouseEvent<HTMLButtonElement>, buttonProps: ButtonProps) => {
      predefinedProps?.onClick?.(e, buttonProps)
      handleCancel(e)
    },
  })

  const handleConfirmOverrides = (predefinedProps: ButtonProps) => ({
    onClick: (e: React.MouseEvent<HTMLButtonElement>, buttonProps: ButtonProps) => {
      predefinedProps?.onClick?.(e, buttonProps)
      props?.onConfirm?.(e, props)
    },
  })

  // `open` is auto controlled by the Modal
  // It cannot be present (even undefined) with `defaultOpen`
  // only apply it if the user provided an open prop
  const openProp: { open?: boolean } = {}
  if (has(props, 'open')) {
    openProp.open = open
  }

  return (
    <Modal {...rest} {...openProp} size={size} onClose={handleCancel} ref={ref}>
      {Modal.Header.create(header, { autoGenerateKey: false })}
      {Modal.Content.create(content, { autoGenerateKey: false })}
      <Modal.Actions>
        {Button.create(cancelButton, {
          autoGenerateKey: false,
          overrideProps: handleCancelOverrides,
        })}
        {Button.create(confirmButton, {
          autoGenerateKey: false,
          defaultProps: { primary: true },
          overrideProps: handleConfirmOverrides,
        })}
      </Modal.Actions>
    </Modal>
  )
}) as ForwardRefComponent<ConfirmProps, HTMLDivElement>

Confirm.displayName = 'Confirm'
Confirm.handledProps = [
  'cancelButton',
  'confirmButton',
  'content',
  'header',
  'onCancel',
  'onConfirm',
  'open',
  'size',
]

export default Confirm
