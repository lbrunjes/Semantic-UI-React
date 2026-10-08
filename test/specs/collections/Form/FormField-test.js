import React from 'react'

import Radio from 'src/addons/Radio/Radio'
import FormField from 'src/collections/Form/FormField'
import { SUI } from 'src/lib'
import Button from 'src/elements/Button/Button'
import Checkbox from 'src/modules/Checkbox/Checkbox'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('FormField', () => {
  common.isConformant(FormField)
  common.rendersChildren(FormField)

  // No Control
  common.forwardsRef(FormField)
  common.forwardsRef(FormField, {
    tagName: 'div',
    requiredProps: {
      children: <input />,
    },
  })

  // HTML Checkbox/Radio Control
  common.forwardsRef(FormField, {
    tagName: 'input',
    requiredProps: { control: 'input', type: 'radio' },
  })
  common.forwardsRef(FormField, {
    tagName: 'input',
    requiredProps: { control: 'input', type: 'checkbox' },
  })

  // Checkbox/Radio Control
  common.forwardsRef(FormField, {
    tagName: 'input',
    requiredProps: { control: Checkbox },
  })
  common.forwardsRef(FormField, {
    tagName: 'input',
    requiredProps: { control: Radio },
  })

  // Other Control
  common.forwardsRef(FormField, {
    tagName: 'input',
    requiredProps: { control: 'input' },
  })

  common.implementsHTMLLabelProp(FormField, { autoGenerateKey: false })
  common.implementsWidthProp(FormField, SUI.WIDTHS, {
    canEqual: false,
    propKey: 'width',
  })

  common.propKeyOnlyToClassName(FormField, 'disabled')
  common.propKeyOnlyToClassName(FormField, 'error')
  common.propKeyOnlyToClassName(FormField, 'inline')
  common.propKeyOnlyToClassName(FormField, 'required', {
    requiredProps: { label: '' },
  })

  describe('control', () => {
    it('adds an HTML element child of the same type', () => {
      const controls = ['button', 'input', 'select', 'textarea']

      controls.forEach((control) => {
        const root = renderRoot(<FormField control={control} />)

        expect(root.querySelectorAll(control)).toHaveLength(1)
      })
    })
  })

  describe('error', () => {
    common.implementsLabelProp(FormField, {
      autoGenerateKey: false,
      propKey: 'error',
      requiredProps: { label: faker.lorem.word() },
      shorthandDefaultProps: {
        prompt: true,
        pointing: 'above',
        role: 'alert',
        'aria-atomic': true,
      },
    })
    common.implementsLabelProp(FormField, {
      autoGenerateKey: false,
      propKey: 'error',
      requiredProps: { control: 'radio' },
      shorthandDefaultProps: {
        prompt: true,
        pointing: 'above',
        role: 'alert',
        'aria-atomic': true,
      },
    })
    common.implementsLabelProp(FormField, {
      autoGenerateKey: false,
      propKey: 'error',
      requiredProps: { control: Checkbox },
      shorthandDefaultProps: {
        prompt: true,
        pointing: 'above',
        role: 'alert',
        'aria-atomic': true,
      },
    })
    common.implementsLabelProp(FormField, {
      autoGenerateKey: false,
      propKey: 'error',
      requiredProps: { control: 'input' },
      shorthandDefaultProps: {
        prompt: true,
        pointing: 'above',
        role: 'alert',
        'aria-atomic': true,
      },
    })

    it('positioned in DOM according to passed "pointing" prop', () => {
      ;[
        { pointing: 'below', inDom: 'before' },
        { pointing: 'right', inDom: 'before' },
        { pointing: 'left', inDom: 'after' },
        { pointing: 'above', inDom: 'after' },
      ].forEach(({ pointing, inDom }) => {
        const root = renderRoot(
          <FormField
            control='input'
            error={{ content: faker.lorem.word(), pointing }}
            type='text'
          />,
        )

        expect(root.children).toHaveLength(2)
        expect(root.children[inDom === 'before' ? 0 : 1]).toHaveClass('ui', 'label')
        expect(root.children[inDom === 'before' ? 1 : 0].tagName).toBe('INPUT')
      })
    })
  })

  describe('label', () => {
    it('wraps html checkbox inputs', () => {
      const text = faker.hacker.phrase()
      const root = renderRoot(<FormField control='input' label={text} type='checkbox' />)
      const label = root.querySelector('label')

      expect(label.firstElementChild.tagName).toBe('INPUT')
      expect(label.firstElementChild).toHaveAttribute('type', 'checkbox')
      expect(label).toHaveTextContent(text)
    })

    it('wraps html radio inputs', () => {
      const text = faker.hacker.phrase()
      const root = renderRoot(<FormField control='input' label={text} type='radio' />)
      const label = root.querySelector('label')

      expect(label.firstElementChild.tagName).toBe('INPUT')
      expect(label.firstElementChild).toHaveAttribute('type', 'radio')
      expect(label).toHaveTextContent(text)
    })

    it('is passed to Checkbox controls', () => {
      const text = faker.hacker.phrase()
      const root = renderRoot(<FormField control={Checkbox} label={text} />)

      expect(root.querySelector('.ui.checkbox > label')).toHaveTextContent(text)
    })

    it('is passed to Radio controls', () => {
      const text = faker.hacker.phrase()
      const root = renderRoot(<FormField control={Radio} label={text} />)

      expect(root.querySelector('.ui.radio.checkbox > label')).toHaveTextContent(text)
    })

    it('is sibling to text inputs', () => {
      const text = faker.hacker.phrase()
      const root = renderRoot(<FormField control='input' label={text} type='text' />)

      expect(root.children[0].tagName).toBe('LABEL')
      expect(root.children[0]).toHaveTextContent(text)
      expect(root.children[1].tagName).toBe('INPUT')
    })
  })

  describe('disabled', () => {
    it('is not set by default', () => {
      const root = renderRoot(<FormField control='input' />)

      expect(root.querySelectorAll('input')).toHaveLength(1)
      expect(root.querySelector('input')).not.toHaveAttribute('disabled')
    })
    it('is passed to the control', () => {
      const root = renderRoot(<FormField control='input' disabled />)

      expect(root.querySelectorAll('input')).toHaveLength(1)
      expect(root.querySelector('input')).toBeDisabled()
    })
  })

  describe('required', () => {
    it('is not set by default', () => {
      const root = renderRoot(<FormField control='input' />)

      expect(root.querySelectorAll('input')).toHaveLength(1)
      expect(root.querySelector('input')).not.toHaveAttribute('required')
    })
    it('is passed to the control', () => {
      const root = renderRoot(<FormField control='input' required />)

      expect(root.querySelectorAll('input')).toHaveLength(1)
      expect(root.querySelector('input')).toBeRequired()
    })
  })

  describe('content', () => {
    it('is not set by default', () => {
      const root = renderRoot(<FormField control={Button} />)

      expect(root.querySelectorAll('button.ui.button')).toHaveLength(1)
      expect(root.querySelector('button.ui.button')).toBeEmptyDOMElement()
    })
    it('is passed to the control', () => {
      const root = renderRoot(<FormField control={Button} content='Click Me' />)

      expect(root.querySelectorAll('button.ui.button')).toHaveLength(1)
      expect(root.querySelector('button.ui.button')).toHaveTextContent('Click Me')
    })
  })

  describe('id', () => {
    it('is set when content is provided', () => {
      const root = renderRoot(<FormField content='content' id='testId' />)

      expect(root).toHaveAttribute('id', 'testId')
    })
    it('is set when have child elements', () => {
      const root = renderRoot(
        <FormField id='testId'>
          <input />
        </FormField>,
      )

      expect(root).toHaveAttribute('id', 'testId')
    })
  })

  describe('aria-invalid', () => {
    it('is not set by default', () => {
      const root = renderRoot(<FormField control='input' />)

      expect(root.querySelector('input')).not.toHaveAttribute('aria-invalid')
    })
    it('is not set when error is false', () => {
      const root = renderRoot(<FormField control='input' error={false} />)

      expect(root.querySelector('input')).not.toHaveAttribute('aria-invalid')
    })
    it('is set when error is true', () => {
      const root = renderRoot(<FormField control='input' error />)

      expect(root.querySelector('input')).toHaveAttribute('aria-invalid', 'true')
    })
    it('is is set when error object is provided', () => {
      const root = renderRoot(
        <FormField
          control='input'
          error={{
            content: 'Error message',
            pointing: 'left',
          }}
        />,
      )

      expect(root.querySelector('input')).toHaveAttribute('aria-invalid', 'true')
    })
  })
})
