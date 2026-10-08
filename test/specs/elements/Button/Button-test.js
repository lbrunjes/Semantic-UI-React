import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import Button from 'src/elements/Button/Button'
import ButtonContent from 'src/elements/Button/ButtonContent'
import ButtonGroup from 'src/elements/Button/ButtonGroup'
import ButtonOr from 'src/elements/Button/ButtonOr'
import { SUI } from 'src/lib'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('Button', () => {
  common.isConformant(Button)
  common.forwardsRef(Button, { tagName: 'button' })
  common.forwardsRef(Button, { requiredProps: { label: faker.lorem.word() }, tagName: 'button' })
  common.hasSubcomponents(Button, [ButtonContent, ButtonGroup, ButtonOr])
  common.hasUIClassName(Button)
  common.rendersChildren(Button)

  common.implementsCreateMethod(Button)
  common.implementsIconProp(Button, { autoGenerateKey: false })
  common.implementsLabelProp(Button, {
    autoGenerateKey: false,
    shorthandDefaultProps: {
      basic: true,
      pointing: 'left',
    },
  })

  common.propKeyAndValueToClassName(Button, 'floated', SUI.FLOATS)

  common.propKeyOnlyToClassName(Button, 'active')
  common.propKeyOnlyToClassName(Button, 'basic')
  common.propKeyOnlyToClassName(Button, 'circular')
  common.propKeyOnlyToClassName(Button, 'compact')
  common.propKeyOnlyToClassName(Button, 'disabled')
  common.propKeyOnlyToClassName(Button, 'fluid')
  common.propKeyOnlyToClassName(Button, 'inverted')
  common.propKeyOnlyToClassName(Button, 'loading')
  common.propKeyOnlyToClassName(Button, 'primary')
  common.propKeyOnlyToClassName(Button, 'negative')
  common.propKeyOnlyToClassName(Button, 'positive')
  common.propKeyOnlyToClassName(Button, 'secondary')

  common.propKeyOrValueAndKeyToClassName(Button, 'animated', ['fade', 'vertical'])
  common.propKeyOrValueAndKeyToClassName(Button, 'attached', ['left', 'right', 'top', 'bottom'])
  common.propKeyOrValueAndKeyToClassName(Button, 'labelPosition', ['right', 'left'], {
    className: 'labeled',
  })

  common.propValueOnlyToClassName(Button, 'color', [
    ...SUI.COLORS,
    'facebook',
    'twitter',
    'google plus',
    'vk',
    'linkedin',
    'instagram',
    'youtube',
  ])
  common.propValueOnlyToClassName(Button, 'size', SUI.SIZES)

  it('renders a button by default', () => {
    expect(renderRoot(<Button />).tagName).toBe('BUTTON')
  })

  describe('attached', () => {
    it('renders a div', () => {
      expect(renderRoot(<Button attached />).tagName).toBe('DIV')
    })
  })

  describe('disabled', () => {
    it('is not set by default', () => {
      expect(renderRoot(<Button />)).not.toHaveAttribute('disabled')
    })

    it('applied when defined', () => {
      expect(renderRoot(<Button disabled />)).toBeDisabled()
    })

    it("don't apply when the element's type isn't button", () => {
      expect(renderRoot(<Button as='div' disabled />)).not.toHaveAttribute('disabled')
    })

    it('is not set by default when has a label', () => {
      const { container } = render(<Button label='foo' />)

      expect(container.querySelector('button')).not.toHaveAttribute('disabled')
    })

    it('applied when defined and has a label', () => {
      const { container } = render(<Button disabled label='foo' />)

      expect(container.querySelector('button')).toBeDisabled()
    })
  })

  describe('toggle', () => {
    it('is not set by default', () => {
      expect(renderRoot(<Button />)).not.toHaveAttribute('toggle')
    })

    it('should have aria-pressed', () => {
      expect(renderRoot(<Button toggle />)).toHaveAttribute('aria-pressed')
    })

    it('aria-pressed should be true when active', () => {
      expect(renderRoot(<Button toggle active />)).toHaveAttribute('aria-pressed', 'true')
    })

    it('aria-pressed should be false when inactive', () => {
      expect(renderRoot(<Button toggle />)).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('icon', () => {
    it('adds className icon', () => {
      expect(renderRoot(<Button icon='user' />)).toHaveClass('icon')
    })

    it('adds className icon when true', () => {
      expect(renderRoot(<Button icon />)).toHaveClass('icon')
    })

    it('does not add className icon when there is content', () => {
      expect(renderRoot(<Button icon='user' content={0} />)).not.toHaveClass('icon')
      expect(renderRoot(<Button icon='user' content='Yo' />)).not.toHaveClass('icon')
    })

    it('adds className icon given labelPosition and content', () => {
      expect(
        renderRoot(<Button labelPosition='left' icon='user' content='My Account' />),
      ).toHaveClass('icon')
      expect(
        renderRoot(<Button labelPosition='right' icon='user' content='My Account' />),
      ).toHaveClass('icon')
    })
  })

  describe('label', () => {
    it('renders as a div', () => {
      expect(renderRoot(<Button label='http' />).tagName).toBe('DIV')
    })

    it('renders a div with a button and Label child', () => {
      const root = renderRoot(<Button label='hi' />)

      expect(root.tagName).toBe('DIV')
      expect(root.querySelectorAll('button')).toHaveLength(1)
      expect(root.querySelectorAll('.ui.label')).toHaveLength(1)
    })

    it('adds the labeled className to the root element', () => {
      expect(renderRoot(<Button label='hi' />)).toHaveClass('labeled')
    })

    it('contains children without disabled class when disabled attribute is set', () => {
      const root = renderRoot(<Button label='hi' disabled />)

      expect(root).toHaveClass('disabled')
      expect(root.querySelector('.ui.label')).not.toHaveClass('disabled')
      expect(root.querySelector('button')).not.toHaveClass('disabled')
    })

    it('contains children without floated class when floated attribute is set', () => {
      const root = renderRoot(<Button label='hi' floated='left' />)

      expect(root).toHaveClass('floated')
      expect(root.querySelector('.ui.label')).not.toHaveClass('floated')
      expect(root.querySelector('button')).not.toHaveClass('floated')
    })

    it('creates a basic pointing label', () => {
      const root = renderRoot(<Button label='foo' />)

      expect(root.querySelectorAll('.ui.basic.pointing.label')).toHaveLength(1)
    })

    it('is before the button and pointing="right" when labelPosition="left"', () => {
      const root = renderRoot(<Button labelPosition='left' label='foo' />)

      expect(root.querySelectorAll('.ui.right.pointing.label')).toHaveLength(1)

      expect(root.children[0]).toHaveClass('label')
      expect(root.children[1].tagName).toBe('BUTTON')
    })

    it('is after the button and pointing="left" when labelPosition="right"', () => {
      const root = renderRoot(<Button labelPosition='right' label='foo' />)

      expect(root.querySelectorAll('.ui.left.pointing.label')).toHaveLength(1)

      expect(root.children[0].tagName).toBe('BUTTON')
      expect(root.children[1]).toHaveClass('label')
    })

    it('is after the button and pointing="left" by default', () => {
      const root = renderRoot(<Button label='foo' />)

      expect(root.querySelectorAll('.ui.left.pointing.label')).toHaveLength(1)

      expect(root.children[0].tagName).toBe('BUTTON')
      expect(root.children[1]).toHaveClass('label')
    })
  })

  describe('labelPosition', () => {
    it('renders as a button when given an icon', () => {
      expect(renderRoot(<Button labelPosition='left' icon='user' />).tagName).toBe('BUTTON')
      expect(renderRoot(<Button labelPosition='right' icon='user' />).tagName).toBe('BUTTON')
    })
  })

  describe('onClick', () => {
    it('is called with (e, data) when clicked', () => {
      const onClick = vi.fn()

      fireEvent.click(renderRoot(<Button onClick={onClick} />))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }), {
        onClick,
      })
    })

    it('is not called when is disabled', () => {
      const onClick = vi.fn()

      fireEvent.click(renderRoot(<Button disabled onClick={onClick} />))

      expect(onClick).not.toHaveBeenCalled()
    })

    it('is not called when is disabled and not rendered as a button', () => {
      const onClick = vi.fn()

      fireEvent.click(renderRoot(<Button as='div' disabled onClick={onClick} />))

      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('role', () => {
    it('is not set by default', () => {
      expect(renderRoot(<Button />)).not.toHaveAttribute('role')
    })

    it('defaults to "button" when rendered as not "button" element', () => {
      expect(renderRoot(<Button as='label' />)).toHaveAttribute('role', 'button')
    })

    it('is configurable', () => {
      expect(renderRoot(<Button role='link' />)).toHaveAttribute('role', 'link')
      expect(renderRoot(<Button role='button' />)).toHaveAttribute('role', 'button')
    })
  })

  describe('type', () => {
    it('is not set by default', () => {
      expect(renderRoot(<Button />)).not.toHaveAttribute('type')
    })

    it('is passed to <button />', () => {
      expect(renderRoot(<Button type='submit' />)).toHaveAttribute('type', 'submit')
    })

    it('is passed to <button /> when "label" is defined', () => {
      const { container } = render(<Button label='Foo' type='submit' />)

      expect(container.querySelector('button')).toHaveAttribute('type', 'submit')
    })
  })

  describe('tabIndex', () => {
    it('is not set by default', () => {
      expect(renderRoot(<Button />)).not.toHaveAttribute('tabindex')
    })

    it('defaults to 0 as div', () => {
      expect(renderRoot(<Button as='div' />)).toHaveAttribute('tabindex', '0')
    })

    it('defaults to -1 when disabled', () => {
      expect(renderRoot(<Button disabled />)).toHaveAttribute('tabindex', '-1')
    })

    it('can be set explicitly', () => {
      expect(renderRoot(<Button tabIndex={123} />)).toHaveAttribute('tabindex', '123')
    })

    it('can be set explicitly when disabled', () => {
      expect(renderRoot(<Button tabIndex={123} disabled />)).toHaveAttribute('tabindex', '123')
    })
  })
})
