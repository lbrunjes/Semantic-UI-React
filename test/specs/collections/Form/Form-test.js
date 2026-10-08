import { fireEvent } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import Form from 'src/collections/Form/Form'
import FormButton from 'src/collections/Form/FormButton'
import FormCheckbox from 'src/collections/Form/FormCheckbox'
import FormDropdown from 'src/collections/Form/FormDropdown'
import FormField from 'src/collections/Form/FormField'
import FormGroup from 'src/collections/Form/FormGroup'
import FormInput from 'src/collections/Form/FormInput'
import FormRadio from 'src/collections/Form/FormRadio'
import FormSelect from 'src/collections/Form/FormSelect'
import FormTextArea from 'src/collections/Form/FormTextArea'
import { SUI } from 'src/lib'
import * as common from 'test/specs/commonTests'
import { consoleUtil, renderRoot } from 'test/utils'
import faker from 'test/utils/faker'

describe('Form', () => {
  common.isConformant(Form)
  common.hasSubcomponents(Form, [
    FormButton,
    FormCheckbox,
    FormDropdown,
    FormField,
    FormTextArea,
    FormGroup,
    FormInput,
    FormRadio,
    FormSelect,
  ])
  common.hasUIClassName(Form)
  common.rendersChildren(Form, {
    rendersContent: false,
  })

  common.forwardsRef(Form, {
    tagName: 'form',
    requiredProps: { children: <input /> },
  })
  common.implementsWidthProp(Form, [], {
    propKey: 'widths',
  })

  common.propKeyOnlyToClassName(Form, 'error')
  common.propKeyOnlyToClassName(Form, 'inverted')
  common.propKeyOnlyToClassName(Form, 'loading')
  common.propKeyOnlyToClassName(Form, 'reply')
  common.propKeyOnlyToClassName(Form, 'success')
  common.propKeyOnlyToClassName(Form, 'unstackable')
  common.propKeyOnlyToClassName(Form, 'warning')

  common.propValueOnlyToClassName(Form, 'size', _.without(SUI.SIZES, 'medium'))

  describe('action', () => {
    it('is not set by default', () => {
      expect(renderRoot(<Form />)).not.toHaveAttribute('action')
    })

    it('applied when defined', () => {
      const action = faker.internet.url()

      expect(renderRoot(<Form action={action} />)).toHaveAttribute('action', action)
    })
  })

  describe('onSubmit', () => {
    // "fireEvent" returns false when the event was cancelled, i.e. "preventDefault()" was called
    const isSubmitPrevented = (element) => !fireEvent.submit(renderRoot(element))

    it('prevents default on the event when there is no action', () => {
      // Heads up!
      // In this test we pass some invalid values to verify correct work.
      consoleUtil.disableOnce()

      expect(isSubmitPrevented(<Form />)).toBe(true)
      expect(isSubmitPrevented(<Form action={false} />)).toBe(true)
      expect(isSubmitPrevented(<Form action={null} />)).toBe(true)
    })

    it('does not prevent default on the event when there is an action', () => {
      expect(fireEvent.submit(renderRoot(<Form action='do not prevent default!' />))).toBe(true)
      expect(fireEvent.submit(renderRoot(<Form action='' />))).toBe(true)
    })

    it('is called with (e, props) on submit', () => {
      const onSubmit = vi.fn()
      const props = { 'data-bar': 'baz' }

      fireEvent.submit(renderRoot(<Form {...props} onSubmit={onSubmit} />))

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'submit' }),
        expect.objectContaining(props),
      )
    })

    it('passes all args to onSubmit', () => {
      const onSubmit = vi.fn()
      const props = { 'data-baz': 'baz' }
      const args = ['some', 'extra', 'args']

      // Third party libs can call "onSubmit" with extra args, a custom element type emulates that
      const FormWithArgs = ({ onSubmit: handleSubmit, ...rest }) => (
        <form {...rest} onSubmit={(e) => handleSubmit(e, ...args)} />
      )

      fireEvent.submit(renderRoot(<Form {...props} as={FormWithArgs} onSubmit={onSubmit} />))

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'submit' }),
        expect.objectContaining(props),
        ...args,
      )
    })
  })
})
