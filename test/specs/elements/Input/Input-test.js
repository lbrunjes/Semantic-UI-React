import { act, fireEvent, render } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import Input from 'src/elements/Input/Input'
import { htmlInputAttrs, htmlInputEvents } from 'src/lib'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

// Returns the observable state of an <input>: attributes (except "tabindex" that is computed by
// Input) and the properties that React sets without an attribute (i.e. "checked", "selected")
const getInputState = (input) => ({
  attributes: _.fromPairs(
    Array.from(input.attributes)
      .filter(({ name }) => name !== 'tabindex')
      .map(({ name, value }) => [name, value]),
  ),
  checked: input.checked,
  defaultChecked: input.defaultChecked,
  defaultValue: input.defaultValue,
  focused: document.activeElement === input,
  selected: input.selected,
  value: input.value,
})

// Renders an element and returns the state of its <input>, it's computed directly after the render
// as "autoFocus" moves the focus
const renderInputState = (element) =>
  getInputState(render(element).container.querySelector('input'))

// Fires an event that triggers a React listener (i.e. "onKeyDown") on a node
const fireReactEvent = (node, listenerName) => {
  // React fires "onSelect" when the selection of a focused input changes
  if (listenerName === 'onSelect') {
    act(() => node.focus())
    fireEvent.keyUp(node)
    return
  }

  const eventName = _.camelCase(listenerName.replace('on', ''))
  let eventInit

  // React ignores "keypress" events without a char code
  if (listenerName === 'onKeyPress') eventInit = { charCode: 13 }
  // React fires "onChange" only when the value changes
  if (listenerName === 'onChange') eventInit = { target: { value: 'foo' } }

  fireEvent[eventName](node, eventInit)
}

describe('Input', () => {
  common.isConformant(Input, {
    eventTargets: {
      // keyboard
      onKeyDown: 'input',
      onKeyPress: 'input',
      onKeyUp: 'input',

      // focus
      onFocus: 'input',
      onBlur: 'input',

      // form
      onChange: 'input',
      onInput: 'input',

      // mouse
      onClick: 'input',
      onContextMenu: 'input',
      onDrag: 'input',
      onDragEnd: 'input',
      onDragEnter: 'input',
      onDragExit: 'input',
      onDragLeave: 'input',
      onDragOver: 'input',
      onDragStart: 'input',
      onDrop: 'input',
      onMouseDown: 'input',
      onMouseEnter: 'input',
      onMouseLeave: 'input',
      onMouseMove: 'input',
      onMouseOut: 'input',
      onMouseOver: 'input',
      onMouseUp: 'input',

      // selection
      onSelect: 'input',

      // touch
      onTouchCancel: 'input',
      onTouchEnd: 'input',
      onTouchMove: 'input',
      onTouchStart: 'input',
    },
  })
  common.forwardsRef(Input, { tagName: 'input' })
  common.hasUIClassName(Input)
  common.rendersChildren(Input, {
    rendersContent: false,
  })

  common.implementsButtonProp(Input, {
    autoGenerateKey: false,
    propKey: 'action',
  })
  common.implementsCreateMethod(Input)
  common.implementsIconProp(Input, { autoGenerateKey: false })
  common.implementsLabelProp(Input, {
    autoGenerateKey: false,
    shorthandDefaultProps: { className: 'label' },
  })
  common.implementsHTMLInputProp(Input, {
    alwaysPresent: true,
    assertExactMatch: false,
    autoGenerateKey: false,
    shorthandDefaultProps: { type: 'text' },
  })

  common.propKeyAndValueToClassName(Input, 'actionPosition', ['left'], { className: 'action' })
  common.propKeyAndValueToClassName(Input, 'iconPosition', ['left'], { className: 'icon' })
  common.propKeyAndValueToClassName(
    Input,
    'labelPosition',
    ['left', 'right', 'left corner', 'right corner'],
    {
      className: 'labeled',
    },
  )

  common.propKeyOnlyToClassName(Input, 'action')
  common.propKeyOnlyToClassName(Input, 'disabled')
  common.propKeyOnlyToClassName(Input, 'error')
  common.propKeyOnlyToClassName(Input, 'fluid')
  common.propKeyOnlyToClassName(Input, 'focus')
  common.propKeyOnlyToClassName(Input, 'inverted')
  common.propKeyOnlyToClassName(Input, 'label', { className: 'labeled' })
  common.propKeyOnlyToClassName(Input, 'loading')
  common.propKeyOnlyToClassName(Input, 'loading', { className: 'icon' })
  common.propKeyOnlyToClassName(Input, 'transparent')
  common.propKeyOnlyToClassName(Input, 'icon')

  common.propValueOnlyToClassName(Input, 'size', [
    'mini',
    'small',
    'large',
    'big',
    'huge',
    'massive',
  ])

  it('renders with conditional children', () => {
    const root = renderRoot(
      <Input>
        {/* eslint-disable no-constant-binary-expression */}
        {true && <span />}
        {false && <div />}
        {/* eslint-enable no-constant-binary-expression */}
      </Input>,
    )

    expect(root.querySelector('span')).toBeInTheDocument()
    expect(root.querySelector('div')).not.toBeInTheDocument()
  })

  it('renders a text <input> by default', () => {
    expect(renderRoot(<Input />).querySelector('input')).toHaveAttribute('type', 'text')
  })

  describe('input props', () => {
    htmlInputAttrs.forEach((propName) => {
      const props = { [propName]: 'foo' }
      // The same props on a plain <input>, "type" & "onChange" are always defined by Input
      const renderExpectedState = () =>
        renderInputState(<input type='text' {...props} onChange={_.noop} />)

      it(`passes \`${propName}\` to the <input>`, () => {
        const expected = renderExpectedState()

        expect(renderInputState(<Input {...props} />)).toEqual(expected)
      })

      it(`passes \`${propName}\` to the <input> when using children`, () => {
        const expected = renderExpectedState()

        expect(
          renderInputState(
            <Input {...props}>
              <input />
            </Input>,
          ),
        ).toEqual(expected)
      })
    })

    htmlInputEvents.forEach((propName) => {
      it(`passes \`${propName}\` to the <input>`, () => {
        const handler = vi.fn()
        const root = renderRoot(<Input {...{ [propName]: handler }} />)

        fireReactEvent(root.querySelector('input'), propName)
        expect(handler).toHaveBeenCalledTimes(1)
      })

      it(`passes \`${propName}\` to the <input> when using children`, () => {
        const handler = vi.fn()
        const root = renderRoot(
          <Input {...{ [propName]: handler }}>
            <input />
          </Input>,
        )

        fireReactEvent(root.querySelector('input'), propName)
        expect(handler).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('loading', () => {
    it("don't add icon if it's defined", () => {
      const root = renderRoot(<Input icon='user' loading />)

      expect(root.querySelectorAll('i.icon')).toHaveLength(1)
      expect(root.querySelector('i.icon')).toHaveClassName('user icon')
      expect(root.querySelector('i.icon')).not.toHaveClass('spinner')
    })

    it("adds icon if it's not defined", () => {
      const root = renderRoot(<Input loading />)

      expect(root.querySelectorAll('i.icon')).toHaveLength(1)
      expect(root.querySelector('i.icon')).toHaveClassName('spinner icon')
    })
  })

  describe('onChange', () => {
    it('is called with (e, data) on change', () => {
      const onChange = vi.fn()
      const props = { 'data-foo': 'bar', onChange }

      const root = renderRoot(<Input {...props} />)
      fireEvent.change(root.querySelector('input'), { target: { value: 'name' } })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'change', target: root.querySelector('input') }),
        expect.objectContaining({ ...props, value: 'name' }),
      )
    })

    it('is called with (e, data) on change when using children', () => {
      const onChange = vi.fn()
      const props = { 'data-foo': 'bar', onChange }

      const root = renderRoot(
        <Input {...props}>
          <input />
        </Input>,
      )
      fireEvent.change(root.querySelector('input'), { target: { value: 'name' } })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'change', target: root.querySelector('input') }),
        expect.objectContaining({ ...props, value: 'name' }),
      )
    })
  })

  describe('ref', () => {
    it('"focus" can be set via a ref', () => {
      const inputRef = React.createRef()
      const { container } = render(<Input ref={inputRef} />)

      act(() => inputRef.current.focus())

      expect(container.querySelector('.ui.input input')).toHaveFocus()
    })

    it('"select" can be set via a ref', () => {
      const inputRef = React.createRef()
      const value = 'expect this text to be selected'
      const { container } = render(<Input ref={inputRef} value={value} />)

      inputRef.current.select()

      const input = container.querySelector('.ui.input input')
      expect(input.selectionStart).toBe(0)
      expect(input.selectionEnd).toBe(value.length)
    })

    it('maintains ref on child node', () => {
      const elementRef = vi.fn()
      const inputRef = vi.fn()

      const { container } = render(
        <Input ref={inputRef}>
          <input ref={elementRef} />
        </Input>,
      )
      const input = container.querySelector('.ui.input input')

      expect(elementRef).toHaveBeenCalledTimes(1)
      expect(elementRef).toHaveBeenCalledWith(input)
      expect(inputRef).toHaveBeenCalledWith(input)
    })
  })

  describe('disabled', () => {
    it('is applied to the underlying html input element', () => {
      expect(renderRoot(<Input disabled />).querySelector('input')).toBeDisabled()
      expect(renderRoot(<Input disabled={false} />).querySelector('input')).not.toBeDisabled()
    })
  })

  describe('tabIndex', () => {
    it('is not set by default', () => {
      expect(renderRoot(<Input />).querySelector('input')).not.toHaveAttribute('tabindex')
    })

    it('defaults to -1 when disabled', () => {
      expect(renderRoot(<Input disabled />).querySelector('input')).toHaveAttribute(
        'tabindex',
        '-1',
      )
    })

    it('can be set explicitly', () => {
      expect(renderRoot(<Input tabIndex={123} />).querySelector('input')).toHaveAttribute(
        'tabindex',
        '123',
      )
    })

    it('can be set explicitly when disabled', () => {
      expect(renderRoot(<Input tabIndex={123} disabled />).querySelector('input')).toHaveAttribute(
        'tabindex',
        '123',
      )
    })
  })

  describe('icon', () => {
    // An Icon renders as <i class="search icon" />
    const expectIcon = (node) => {
      expect(node.tagName).toBe('I')
      expect(node).toHaveClassName('search icon')
    }

    it('is second child', () => {
      expectIcon(renderRoot(<Input icon='search' />).children[1])
    })

    it('is third child with action positioned left', () => {
      expectIcon(renderRoot(<Input icon='search' action='foo' actionPosition='left' />).children[2])
    })

    it('is third child with label', () => {
      expectIcon(renderRoot(<Input icon='search' label='foo' />).children[2])
    })

    it('is second child with action', () => {
      expectIcon(renderRoot(<Input icon='search' iconPosition='left' action='foo' />).children[1])
    })

    it('is second child with label positioned right', () => {
      expectIcon(
        renderRoot(<Input icon='search' iconPosition='left' label='foo' labelPosition='right' />)
          .children[1],
      )
    })
  })
})
