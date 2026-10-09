import * as React from 'react'

import { getComponentType, getUnhandledProps, useMergedRefs } from '../../lib'
import type { ForwardRefComponent } from '../../generic'

export interface TextAreaProps extends StrictTextAreaProps {
  [key: string]: any
}

export interface StrictTextAreaProps {
  /** An element type to render as (string or function). */
  as?: any

  /**
   * Called on change.
   *
   * @param {SyntheticEvent} event - The React SyntheticEvent object
   * @param {object} data - All props and the event value.
   */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>, data: TextAreaProps) => void

  /**
   * Called on input.
   *
   * @param {SyntheticEvent} event - The React SyntheticEvent object
   * @param {object} data - All props and the event value.
   */
  onInput?: (event: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => void

  /** Indicates row count for a TextArea. */
  rows?: number | string

  /** The value of the textarea. */
  value?: number | string
}

/**
 * A TextArea can be used to allow for extended user input.
 * @see Form
 */
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(function (props, ref) {
  const { rows = 3, value } = props
  const elementRef = useMergedRefs(ref, React.useRef(undefined))

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e?.target?.value

    props?.onChange?.(e, { ...props, value: newValue })
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const newValue = (e?.target as HTMLTextAreaElement)?.value

    props?.onInput?.(e, { ...props, value: newValue })
  }

  const rest = getUnhandledProps(TextArea, props)
  const ElementType = getComponentType(props, { defaultAs: 'textarea' })

  return (
    <ElementType
      {...rest}
      onChange={handleChange}
      onInput={handleInput}
      ref={elementRef}
      rows={rows}
      value={value}
    />
  )
}) as ForwardRefComponent<TextAreaProps, HTMLTextAreaElement>

TextArea.displayName = 'TextArea'
TextArea.handledProps = ['as', 'onChange', 'onInput', 'rows', 'value']

export default TextArea
