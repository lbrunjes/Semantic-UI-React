import { fireEvent, render } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import { htmlInputAttrs } from 'src/lib'
import Checkbox from 'src/modules/Checkbox/Checkbox'
import * as common from 'test/specs/commonTests'
import { domEvent, renderRoot } from 'test/utils'

// Simulates a mouse click on a node: "mouseup" & "click" events, as a browser does
const mouseClick = (node) => {
  fireEvent.mouseUp(node)
  fireEvent.click(node)
}

describe('Checkbox', () => {
  common.isConformant(Checkbox)
  common.forwardsRef(Checkbox, { tagName: 'input' })
  common.hasUIClassName(Checkbox)

  common.propKeyOnlyToClassName(Checkbox, 'checked')
  common.propKeyOnlyToClassName(Checkbox, 'disabled')
  common.propKeyOnlyToClassName(Checkbox, 'readOnly', {
    className: 'read-only',
  })
  common.propKeyOnlyToClassName(Checkbox, 'slider')
  common.propKeyOnlyToClassName(Checkbox, 'toggle')

  common.implementsHTMLLabelProp(Checkbox, {
    alwaysPresent: true,
    autoGenerateKey: false,
  })

  describe('aria', () => {
    ;['aria-label', 'role'].forEach((propName) => {
      it(`passes "${propName}" to the <input>`, () => {
        const { container } = render(<Checkbox {...{ [propName]: 'foo' }} />)

        expect(container.querySelector('input')).toHaveAttribute(propName, 'foo')
      })
    })
  })

  describe('checking', () => {
    it('can be checked and unchecked', () => {
      const { container } = render(<Checkbox />)
      const input = container.querySelector('input')
      const label = container.querySelector('label')

      expect(input).not.toBeChecked()

      mouseClick(label)
      expect(input).toBeChecked()

      mouseClick(label)
      expect(input).not.toBeChecked()
    })

    it('can be checked but not unchecked when radio', () => {
      const { container } = render(<Checkbox radio />)
      const input = container.querySelector('input')
      const label = container.querySelector('label')

      expect(input).not.toBeChecked()

      mouseClick(label)
      expect(input).toBeChecked()

      mouseClick(label)
      expect(input).toBeChecked()
    })
  })

  describe('defaultChecked', () => {
    it('sets the initial checked state', () => {
      const { container } = render(<Checkbox defaultChecked />)

      expect(container.querySelector('input')).toBeChecked()
    })
  })

  describe('indeterminate', () => {
    it('can be indeterminate', () => {
      const { container } = render(<Checkbox indeterminate />)
      const input = container.querySelector('.ui.checkbox input')

      expect(input.indeterminate).toBe(true)

      fireEvent.click(input)
      expect(input.indeterminate).toBe(true)
    })

    it('can not be indeterminate', () => {
      const { container } = render(<Checkbox indeterminate={false} />)
      const input = container.querySelector('.ui.checkbox input')

      expect(input.indeterminate).toBe(false)

      fireEvent.click(input)
      expect(input.indeterminate).toBe(false)
    })
  })

  describe('defaultIndeterminate', () => {
    it('sets the initial indeterminate state', () => {
      const { container } = render(<Checkbox defaultIndeterminate />)
      const input = container.querySelector('.ui.checkbox input')

      expect(input.indeterminate).toBe(true)
    })

    it('unsets indeterminate state on any click', () => {
      const { container } = render(<Checkbox defaultIndeterminate />)
      const input = container.querySelector('.ui.checkbox input')

      expect(input.indeterminate).toBe(true)

      fireEvent.click(input)
      expect(input.indeterminate).toBe(false)

      fireEvent.click(input)
      expect(input.indeterminate).toBe(false)
    })
  })

  describe('disabled', () => {
    it('cannot be checked', () => {
      const { container } = render(<Checkbox disabled />)

      mouseClick(container.querySelector('label'))
      expect(container.querySelector('input')).not.toBeChecked()
    })

    it('cannot be unchecked', () => {
      const { container } = render(<Checkbox defaultChecked disabled />)

      mouseClick(container.querySelector('label'))
      expect(container.querySelector('input')).toBeChecked()
    })

    it('is applied to the underlying html input element', () => {
      const { container, rerender } = render(<Checkbox disabled />)
      expect(container.querySelector('input')).toBeDisabled()

      rerender(<Checkbox disabled={false} />)
      expect(container.querySelector('input')).not.toBeDisabled()
    })
  })

  describe('id', () => {
    it('passes value to the input', () => {
      const { container } = render(<Checkbox id='foo' />)

      expect(container.querySelector('input')).toHaveAttribute('id', 'foo')
    })

    it('adds htmlFor prop to the label', () => {
      const { container } = render(<Checkbox id='foo' />)

      expect(container.querySelector('label')).toHaveAttribute('for', 'foo')
    })

    it('adds htmlFor prop to the label when it is empty', () => {
      const { container } = render(<Checkbox id='foo' label={null} />)

      expect(container.querySelector('label')).toHaveAttribute('for', 'foo')
    })
  })

  describe('input', () => {
    // Heads up! Input handles some of html props
    const props = _.without(htmlInputAttrs, 'defaultChecked', 'disabled')

    // Some props are not reflected as attributes with the same name, we check their DOM effect
    const assertions = {
      autoFocus: (input) => expect(input).toHaveFocus(),
      checked: (input) => expect(input).toBeChecked(),
      defaultValue: (input) => expect(input).toHaveAttribute('value', 'radio'),
      // React <= 18 sets it as a DOM property, React 19 as an attribute
      selected: (input) => expect(input.selected ?? input.getAttribute('selected')).toBe('radio'),
    }

    _.forEach(props, (propName) => {
      it(`passes "${propName}" to the input`, () => {
        const { container } = render(<Checkbox {...{ [propName]: 'radio' }} />)
        const input = container.querySelector('input')

        if (assertions[propName]) {
          assertions[propName](input)
          return
        }

        expect(input).toHaveAttribute(propName.toLowerCase())
      })
    })
  })

  describe('label', () => {
    it('adds the "fitted" class when not present', () => {
      expect(renderRoot(<Checkbox name='firstName' />)).toHaveClass('fitted')
    })

    it('adds the "fitted" class when is null', () => {
      expect(renderRoot(<Checkbox name='firstName' label={null} />)).toHaveClass('fitted')
    })

    it('does not add the "fitted" class when is not nil', () => {
      expect(renderRoot(<Checkbox name='firstName' label='' />)).not.toHaveClass('fitted')
      expect(renderRoot(<Checkbox name='firstName' label={0} />)).not.toHaveClass('fitted')
    })
  })

  describe('onChange', () => {
    it('is called with (e, data) on mouse up', () => {
      const onChange = vi.fn()
      const props = { name: 'foo', value: 'bar', checked: false, indeterminate: true }

      const { container } = render(<Checkbox onChange={onChange} {...props} />)
      mouseClick(container.querySelector('label'))

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          ...props,
          checked: true,
          indeterminate: false,
        }),
      )
    })

    it('is not called on a label click when "id" is passed', () => {
      const onChange = vi.fn()
      const { container } = render(<Checkbox id='foo' onChange={onChange} />)
      const input = container.querySelector('input')

      mouseClick(container.querySelector('label'))

      // Heads up! The label click itself does not call "onChange", a browser forwards the click to
      // the input (jsdom does it too) and only that click calls "onChange"
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange.mock.calls[0][0].target).toBe(input)
    })

    it('is called when click is done on nested element', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Checkbox label={{ children: <span>Foo</span> }} onChange={onChange} />,
      )

      mouseClick(container.querySelector('span'))

      expect(onChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('onClick', () => {
    it('is called with (event, data) on click', () => {
      const onClick = vi.fn()
      const props = { name: 'foo', value: 'bar', checked: false, indeterminate: true }

      fireEvent.click(renderRoot(<Checkbox onClick={onClick} {...props} />))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          ...props,
          checked: true,
        }),
      )
    })

    it('is not called on a label click when "id" is passed', () => {
      const onClick = vi.fn()
      const { container } = render(<Checkbox id='foo' onClick={onClick} />)
      const input = container.querySelector('input')

      mouseClick(container.querySelector('label'))

      // Heads up! The label click itself does not call "onClick", a browser forwards the click to
      // the input (jsdom does it too) and only that click calls "onClick"
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick.mock.calls[0][0].target).toBe(input)
    })
  })

  describe('onMouseDown', () => {
    it('is called with (event, data) on mouse down', () => {
      const onMousedDown = vi.fn()
      const props = { name: 'foo', value: 'bar', checked: false, indeterminate: true }

      fireEvent.mouseDown(renderRoot(<Checkbox onMouseDown={onMousedDown} {...props} />))

      expect(onMousedDown).toHaveBeenCalledTimes(1)
      expect(onMousedDown).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining(props))
    })

    it('sets focus to container', () => {
      const { container } = render(<Checkbox />)
      const input = container.querySelector('.ui.checkbox input')

      domEvent.fire(input, 'mousedown')
      expect(input).toHaveFocus()
    })

    it('will not set focus to container, if default is prevented', () => {
      const { container } = render(<Checkbox onMouseDown={(e) => e.preventDefault()} />)

      domEvent.fire(container.querySelector('.ui.checkbox input'), 'mousedown')
      expect(document.activeElement).toBe(document.body)
    })
  })

  describe('onMouseUp', () => {
    it('is called with (event, data) on mouse up', () => {
      const onMouseUp = vi.fn()
      const props = { name: 'foo', value: 'bar', checked: false, indeterminate: true }

      fireEvent.mouseUp(renderRoot(<Checkbox onMouseUp={onMouseUp} {...props} />))

      expect(onMouseUp).toHaveBeenCalledTimes(1)
      expect(onMouseUp).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining(props))
    })

    it('is called with (event, data) on mouse up with right button', () => {
      const onMouseUp = vi.fn()

      fireEvent.mouseUp(renderRoot(<Checkbox id='foo' onMouseUp={onMouseUp} />), { button: 2 })

      expect(onMouseUp).toHaveBeenCalledTimes(1)
    })
  })

  describe('readOnly', () => {
    it('cannot be checked', () => {
      const { container } = render(<Checkbox readOnly />)

      mouseClick(container.querySelector('label'))
      expect(container.querySelector('input')).not.toBeChecked()
    })

    it('cannot be unchecked', () => {
      const { container } = render(<Checkbox defaultChecked readOnly />)

      mouseClick(container.querySelector('label'))
      expect(container.querySelector('input')).toBeChecked()
    })
  })

  describe('tabIndex', () => {
    it('defaults to 0', () => {
      const { container } = render(<Checkbox />)

      expect(container.querySelector('input')).toHaveAttribute('tabindex', '0')
    })

    it('defaults to -1 when disabled', () => {
      const { container } = render(<Checkbox disabled />)

      expect(container.querySelector('input')).toHaveAttribute('tabindex', '-1')
    })

    it('can be set explicitly', () => {
      const { container } = render(<Checkbox tabIndex={123} />)

      expect(container.querySelector('input')).toHaveAttribute('tabindex', '123')
    })

    it('can be set explicitly when disabled', () => {
      const { container } = render(<Checkbox tabIndex={123} disabled />)

      expect(container.querySelector('input')).toHaveAttribute('tabindex', '123')
    })
  })

  describe('type', () => {
    it('renders an input of type checkbox when not set', () => {
      const { container } = render(<Checkbox />)

      expect(container.querySelector('input')).toHaveAttribute('type', 'checkbox')
    })

    it('sets the input type ', () => {
      const { container, rerender } = render(<Checkbox type='checkbox' />)
      expect(container.querySelector('input')).toHaveAttribute('type', 'checkbox')

      rerender(<Checkbox type='radio' />)
      expect(container.querySelector('input')).toHaveAttribute('type', 'radio')
    })
  })

  describe('comparisons with native DOM', () => {
    const assertMatrix = [
      {
        description: 'click on label: fires on mouse click',
        events: {
          label: ['mouseup', 'click'],
        },
      },
      {
        description: 'click on input: fires on mouse click',
        events: {
          input: ['click'],
        },
      },
      {
        description: 'key on input: fires on space key',
        events: {
          input: ['click'],
        },
      },
      {
        description: 'click on label with "id": fires on mouse click',
        events: {
          label: ['mouseup', 'click'],
        },
        id: 'foo',
      },
      {
        description: 'click on input with "id": fires on mouse click',
        events: {
          input: ['click'],
        },
        id: 'foo',
      },
      {
        description: 'key on input with "id": fires on space key',
        events: {
          input: ['click'],
        },
        id: 'foo',
      },
      {
        description: 'click on root: fires on mouse click',
        events: {
          '': ['mouseup', 'click'],
        },
      },
      {
        description: 'click on root with "id": fires on mouse click',
        events: {
          '': ['mouseup', 'click'],
        },
        id: 'foo',
      },
    ]

    assertMatrix.forEach(({ description, events, ...props }) => {
      it(description, () => {
        const dataId = _.uniqueId('checkbox')

        const onClick = vi.fn()
        const onChange = vi.fn()
        const onParentClick = vi.fn()

        render(
          <div onClick={onParentClick} role='presentation'>
            <Checkbox {...props} data-id={dataId} onClick={onClick} onChange={onChange} />
          </div>,
        )

        _.forEach(events, (targetEvents, target) => {
          _.forEach(targetEvents, (targetEvent) => {
            domEvent.fire(`[data-id=${dataId}] ${target}`, targetEvent)
          })
        })

        expect(onClick).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onParentClick).toHaveBeenCalledTimes(1)

        expect(onChange.mock.invocationCallOrder[0]).toBeGreaterThan(
          onClick.mock.invocationCallOrder[0],
        )
      })
    })
  })

  describe('Controlled component', () => {
    const getControlledCheckbox = (isOnClick) =>
      class ControlledCheckbox extends React.Component {
        state = { checked: false }
        toggle = () => this.setState((prevState) => ({ checked: !prevState.checked }))

        render() {
          const handler = isOnClick ? { onClick: this.toggle } : { onChange: this.toggle }

          return (
            <Checkbox
              data-checked={this.state.checked}
              label='Check this box'
              checked={this.state.checked}
              {...handler}
            />
          )
        }
      }

    it('toggles state on "change" with "setState" as function', () => {
      const TestComponent = getControlledCheckbox(false)
      const { container } = render(<TestComponent />)

      fireEvent.click(container.querySelector('input'))
      expect(container.firstElementChild).toHaveAttribute('data-checked', 'true')
      expect(container.querySelector('input')).toBeChecked()
    })

    it('toggles state on "click" with "setState" as function', () => {
      const TestComponent = getControlledCheckbox(true)
      const { container } = render(<TestComponent />)

      fireEvent.click(container.querySelector('input'))
      expect(container.firstElementChild).toHaveAttribute('data-checked', 'true')
      expect(container.querySelector('input')).toBeChecked()
    })
  })
})
