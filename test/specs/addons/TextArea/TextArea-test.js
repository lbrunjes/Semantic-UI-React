import { fireEvent } from '@testing-library/react'
import React from 'react'

import TextArea from 'src/addons/TextArea/TextArea'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

describe('TextArea', () => {
  common.isConformant(TextArea)
  common.forwardsRef(TextArea, { tagName: 'textarea' })

  describe('focus', () => {
    it('can be set via a ref', () => {
      const ref = React.createRef()

      const element = renderRoot(<TextArea ref={ref} />)

      ref.current.focus()
      expect(element).toHaveFocus()
    })
  })

  describe('onChange', () => {
    it('is called with (e, data) on change', () => {
      const onChange = vi.fn()
      const props = { 'data-foo': 'bar', onChange }

      fireEvent.change(renderRoot(<TextArea {...props} />), { target: { value: 'name' } })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ target: expect.objectContaining({ value: 'name' }) }),
        expect.objectContaining({ ...props, value: 'name' }),
      )
    })
  })

  describe('onInput', () => {
    it('is called with (e, data) on input', () => {
      const onInput = vi.fn()
      const props = { 'data-foo': 'bar', onInput }

      fireEvent.input(renderRoot(<TextArea {...props} />), { target: { value: 'name' } })

      expect(onInput).toHaveBeenCalledTimes(1)
      expect(onInput).toHaveBeenCalledWith(
        expect.objectContaining({ target: expect.objectContaining({ value: 'name' }) }),
        expect.objectContaining({ ...props, value: 'name' }),
      )
    })
  })

  describe('rows', () => {
    it('has default value', () => {
      expect(renderRoot(<TextArea />)).toHaveAttribute('rows', '3')
    })

    it('sets prop', () => {
      expect(renderRoot(<TextArea rows={1} />)).toHaveAttribute('rows', '1')
    })
  })
})
