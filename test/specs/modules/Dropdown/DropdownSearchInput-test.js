import { fireEvent } from '@testing-library/react'
import React from 'react'

import DropdownSearchInput from 'src/modules/Dropdown/DropdownSearchInput'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('DropdownSearchInput', () => {
  common.isConformant(DropdownSearchInput, { componentClassName: 'search' })
  common.forwardsRef(DropdownSearchInput, { tagName: 'input' })

  describe('aria', () => {
    it('should have aria-autocomplete', () => {
      expect(renderRoot(<DropdownSearchInput />)).toHaveAttribute('aria-autocomplete', 'list')
    })
  })

  describe('autoComplete', () => {
    it('should have autoComplete by default', () => {
      expect(renderRoot(<DropdownSearchInput />)).toHaveAttribute('autocomplete', 'off')
    })

    it('should pass a defined value', () => {
      expect(renderRoot(<DropdownSearchInput autoComplete='on' />)).toHaveAttribute(
        'autocomplete',
        'on',
      )
    })
  })

  describe('onChange', () => {
    it('is called with (e, data) on change', () => {
      const onChange = vi.fn()
      const input = renderRoot(<DropdownSearchInput onChange={onChange} />)

      fireEvent.change(input, { target: { value: 'value' } })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ target: input }),
        expect.objectContaining({ value: 'value' }),
      )
    })
  })

  describe('tabIndex', () => {
    it('is not set by default', () => {
      expect(renderRoot(<DropdownSearchInput />)).not.toHaveAttribute('tabindex')
    })

    it('can be set explicitly', () => {
      expect(renderRoot(<DropdownSearchInput tabIndex={123} />)).toHaveAttribute('tabindex', '123')
    })
  })

  describe('type', () => {
    it('should have text by default', () => {
      expect(renderRoot(<DropdownSearchInput />)).toHaveAttribute('type', 'text')
    })

    it('can be set explicitly', () => {
      const type = faker.random.word()

      expect(renderRoot(<DropdownSearchInput type={type} />)).toHaveAttribute('type', type)
    })
  })

  describe('value', () => {
    it('is not set by default', () => {
      // React renders an explicit `value={undefined}` as an empty value attribute
      expect(renderRoot(<DropdownSearchInput />).value).toBe('')
    })

    it('can be set explicitly', () => {
      const value = faker.random.word()

      expect(renderRoot(<DropdownSearchInput value={value} />)).toHaveValue(value)
    })
  })
})
