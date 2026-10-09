import PropTypes from 'prop-types'
import * as React from 'react'

import { customPropTypes, getUnhandledProps } from '../../lib'
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

  const handleCancel = (e) => {
    props?.onCancel?.(e, props)
  }

  const handleCancelOverrides = (predefinedProps) => ({
    onClick: (e, buttonProps) => {
      predefinedProps?.onClick?.(e, buttonProps)
      handleCancel(e)
    },
  })

  const handleConfirmOverrides = (predefinedProps) => ({
    onClick: (e, buttonProps) => {
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
Confirm.propTypes = {
  /** The cancel button text. */
  cancelButton: customPropTypes.itemShorthand,

  /** The OK button text. */
  confirmButton: customPropTypes.itemShorthand,

  /** The ModalContent text. */
  content: customPropTypes.itemShorthand,

  /** The ModalHeader text. */
  header: customPropTypes.itemShorthand,

  /**
   * Called when the Modal is closed without clicking confirm.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onCancel: PropTypes.func,

  /**
   * Called when the OK button is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onConfirm: PropTypes.func,

  /** Whether or not the modal is visible. */
  open: PropTypes.bool,

  /** A Confirm can vary in size */
  size: PropTypes.oneOf(['mini', 'tiny', 'small', 'large', 'fullscreen']),
}

export default Confirm
