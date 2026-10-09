import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
} from '../../lib'
import Button from '../../elements/Button'
import { map } from '../../lib/utils'
import type { ButtonProps } from '../../elements/Button'
import type {
  ForwardRefComponent,
  SemanticShorthandCollection,
  SemanticShorthandContent,
  SemanticShorthandItem,
} from '../../generic'

export interface ModalActionsProps extends StrictModalActionsProps {
  [key: string]: any
}

export interface StrictModalActionsProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Array of shorthand buttons. */
  actions?: SemanticShorthandCollection<ButtonProps>

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /**
   * onClick handler for an action. Mutually exclusive with children.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All item props.
   */
  onActionClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: ButtonProps) => void
}

/**
 * A modal can contain a row of actions.
 */
const ModalActions = React.forwardRef<HTMLDivElement, ModalActionsProps>(function (props, ref) {
  const { actions, children, className, content } = props

  const classes = cx('actions', className)
  const rest = getUnhandledProps(ModalActions, props)
  const ElementType = getComponentType(props)

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} ref={ref}>
        {children}
      </ElementType>
    )
  }
  if (!childrenUtils.isNil(content)) {
    return (
      <ElementType {...rest} className={classes}>
        {content}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} className={classes} ref={ref}>
      {map(actions, (action: SemanticShorthandItem<ButtonProps>) =>
        Button.create(action, {
          overrideProps: (predefinedProps: ButtonProps) => ({
            // The public type of `onActionClick()` uses `HTMLAnchorElement`, Button renders a `button`
            onClick: (e: React.MouseEvent<any>, buttonProps: ButtonProps) => {
              predefinedProps?.onClick?.(e, buttonProps)
              props?.onActionClick?.(e, buttonProps)
            },
          }),
        }),
      )}
    </ElementType>
  )
}) as ForwardRefComponent<ModalActionsProps, HTMLDivElement>

ModalActions.displayName = 'ModalActions'
ModalActions.handledProps = ['actions', 'as', 'children', 'className', 'content', 'onActionClick']

ModalActions.create = createShorthandFactory(
  ModalActions,
  (actions: ModalActionsProps['actions']) => ({
    actions,
  }),
)

export default ModalActions
