import { act, fireEvent, render } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import Dropdown from 'src/modules/Dropdown/Dropdown'
import DropdownDivider from 'src/modules/Dropdown/DropdownDivider'
import DropdownHeader from 'src/modules/Dropdown/DropdownHeader'
import DropdownItem from 'src/modules/Dropdown/DropdownItem'
import DropdownMenu from 'src/modules/Dropdown/DropdownMenu'
import DropdownSearchInput from 'src/modules/Dropdown/DropdownSearchInput'
import DropdownText from 'src/modules/Dropdown/DropdownText'
import * as common from 'test/specs/commonTests'
import { consoleUtil } from 'test/utils'
import faker from 'test/utils/faker'

let container
let options

// ----------------------------------------
// Render & query helpers
// ----------------------------------------
// RTL unmounts after every test, so all event listeners (document listeners included) are cleaned up
const renderDropdown = (element) => {
  const result = render(element)

  container = result.container
  return result
}

const getDropdown = () => container.firstElementChild
const getMenu = () => getDropdown().querySelector('.menu')
const getItems = () => getDropdown().querySelectorAll('.menu .item')
const getItem = (index) => getItems()[index]
const getLastItem = () => _.last(getItems())
const getLabels = () => getDropdown().querySelectorAll('.ui.label')
const getSearchInput = () => getDropdown().querySelector('input.search')
const getText = () => getDropdown().querySelector('div.text')

// ----------------------------------------
// Event helpers
// ----------------------------------------
const clickDropdown = () => fireEvent.click(getDropdown())
const focusDropdown = () => fireEvent.focus(getDropdown())
const blurDropdown = () => fireEvent.blur(getDropdown())
const mouseDownDropdown = () => fireEvent.mouseDown(getDropdown())
const keyDown = (key, node = getDropdown()) => fireEvent.keyDown(node, { key })
// A real click starts with a mousedown, it prevents the focus caused by the selection from
// reopening the menu
const pressItem = (item) => {
  fireEvent.mouseDown(item)
  fireEvent.click(item)
}
const searchFor = (value) => fireEvent.change(getSearchInput(), { target: { value } })

// ----------------------------------------
// Options
// ----------------------------------------
const getOptions = (count = 5) =>
  _.times(count, (i) => {
    const text = [i, ..._.times(3, faker.hacker.noun)].join(' ')
    const value = _.snakeCase(text)
    return { text, value }
  })

// -------------------------------
// Common Assertions
// -------------------------------
const dropdownMenuIsClosed = () => {
  expect(getDropdown()).not.toHaveClass('visible')
  expect(getMenu()).not.toHaveClass('visible')
}

const dropdownMenuIsOpen = () => {
  expect(getDropdown()).toHaveClass('active')
  expect(getDropdown()).toHaveClass('visible')
  expect(getMenu()).toHaveClass('visible')
}

const bodyIsFocused = () => {
  expect(document.body).toHaveFocus()
}

const dropdownIsFocused = () => {
  expect(document.querySelector('div.dropdown')).toHaveFocus()
}

const dropdownInputIsFocused = () => {
  expect(document.querySelector('input.search')).toHaveFocus()
}

describe('Dropdown', () => {
  beforeEach(() => {
    container = undefined
    options = getOptions()
  })

  common.isConformant(Dropdown)
  common.forwardsRef(Dropdown)
  common.hasUIClassName(Dropdown)
  common.hasSubcomponents(Dropdown, [
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    DropdownMenu,
    DropdownSearchInput,
    DropdownText,
  ])

  common.implementsIconProp(Dropdown, {
    defaultValue: 'search',
    assertExactMatch: false,
    autoGenerateKey: false,
  })
  common.implementsShorthandProp(Dropdown, {
    autoGenerateKey: false,
    propKey: 'header',
    ShorthandComponent: DropdownHeader,
    mapValueToProps: (val) => ({ content: val }),
  })

  common.propKeyOnlyToClassName(Dropdown, 'disabled')
  common.propKeyOnlyToClassName(Dropdown, 'error')
  common.propKeyOnlyToClassName(Dropdown, 'loading')
  common.propKeyOnlyToClassName(Dropdown, 'basic')
  common.propKeyOnlyToClassName(Dropdown, 'button')
  common.propKeyOnlyToClassName(Dropdown, 'compact')
  common.propKeyOnlyToClassName(Dropdown, 'fluid')
  common.propKeyOnlyToClassName(Dropdown, 'floating')
  common.propKeyOnlyToClassName(Dropdown, 'inline')
  // TODO: See Dropdown cx notes
  // common.propKeyOnlyToClassName(Dropdown, 'icon')
  common.propKeyOnlyToClassName(Dropdown, 'labeled')
  common.propKeyOnlyToClassName(Dropdown, 'item')
  common.propKeyOnlyToClassName(Dropdown, 'multiple')
  common.propKeyOnlyToClassName(Dropdown, 'search')
  common.propKeyOnlyToClassName(Dropdown, 'selection')
  common.propKeyOnlyToClassName(Dropdown, 'simple')
  common.propKeyOnlyToClassName(Dropdown, 'scrolling')
  common.propKeyOnlyToClassName(Dropdown, 'upward')

  common.propKeyOrValueAndKeyToClassName(Dropdown, 'pointing', [
    'left',
    'right',
    'top',
    'top left',
    'top right',
    'bottom',
    'bottom left',
    'bottom right',
  ])

  describe('defaultSearchQuery', () => {
    it('changes default value of searchQuery', () => {
      renderDropdown(<Dropdown defaultSearchQuery='foo' search />)
      expect(getSearchInput()).toHaveValue('foo')
    })
  })

  it('closes on blur', () => {
    renderDropdown(<Dropdown options={options} />)
    clickDropdown()

    dropdownMenuIsOpen()
    blurDropdown()
    dropdownMenuIsClosed()
  })

  it('does not close on blur with closeOnBlur set to false', () => {
    renderDropdown(<Dropdown options={options} closeOnBlur={false} />)
    clickDropdown()

    dropdownMenuIsOpen()
    blurDropdown()
    dropdownMenuIsOpen()
  })

  it('blurs the Dropdown node on close', () => {
    renderDropdown(<Dropdown options={options} selection defaultOpen />)
    const blur = vi.spyOn(getDropdown(), 'blur')

    dropdownMenuIsOpen()
    clickDropdown()
    dropdownMenuIsClosed()

    expect(blur).toHaveBeenCalledTimes(1)
  })

  it('blurs the Dropdown node on close by clicking outside component', () => {
    renderDropdown(<Dropdown options={options} selection defaultOpen />)
    const blur = vi.spyOn(getDropdown(), 'blur')

    dropdownMenuIsOpen()
    fireEvent.click(document.body)
    dropdownMenuIsClosed()

    expect(blur).toHaveBeenCalledTimes(1)
  })

  it('does not close on click when search is true and options are empty', () => {
    renderDropdown(<Dropdown options={[]} search selection defaultOpen />)

    dropdownMenuIsOpen()
    clickDropdown()
    dropdownMenuIsOpen()
  })

  it('opens on focus', () => {
    renderDropdown(<Dropdown options={options} />)

    dropdownMenuIsClosed()
    focusDropdown()
    dropdownMenuIsOpen()
  })

  describe('disabled', () => {
    it('does not open on click', () => {
      renderDropdown(<Dropdown options={options} disabled />)

      dropdownMenuIsClosed()
      clickDropdown()
      dropdownMenuIsClosed()
    })

    it('does not open on click with pointer events enabled', () => {
      renderDropdown(<Dropdown options={options} disabled style={{ pointerEvents: 'all' }} />)

      dropdownMenuIsClosed()
      clickDropdown()
      dropdownMenuIsClosed()
    })

    it('does not open on focus', () => {
      renderDropdown(<Dropdown options={options} disabled />)

      dropdownMenuIsClosed()
      focusDropdown()
      dropdownMenuIsClosed()
    })
  })

  describe('tabIndex', () => {
    it('defaults to 0', () => {
      renderDropdown(<Dropdown options={options} />)

      expect(getDropdown()).toHaveAttribute('tabindex', '0')
    })

    it('defaults to -1 when disabled', () => {
      renderDropdown(<Dropdown disabled options={options} />)

      expect(getDropdown()).toHaveAttribute('tabindex', '-1')
    })

    it('applies when defined', () => {
      renderDropdown(<Dropdown options={options} tabIndex={1} />)

      expect(getDropdown()).toHaveAttribute('tabindex', '1')
    })

    describe('search', () => {
      it('defaults the search input to 0', () => {
        renderDropdown(<Dropdown options={options} selection search />)

        expect(getSearchInput()).toHaveAttribute('tabindex', '0')
      })

      it('defaults the disabled search input to -1', () => {
        renderDropdown(<Dropdown disabled options={options} selection search />)

        expect(getSearchInput()).toHaveAttribute('tabindex', '-1')
      })

      it('allows explicitly setting the search input value', () => {
        renderDropdown(<Dropdown options={options} selection search tabIndex={123} />)

        expect(getSearchInput()).toHaveAttribute('tabindex', '123')
      })

      it('allows explicitly setting the search input value when disabled', () => {
        renderDropdown(<Dropdown disabled options={options} selection search tabIndex={123} />)

        expect(getSearchInput()).toHaveAttribute('tabindex', '123')
      })

      it('is not present on the root when is search', () => {
        renderDropdown(<Dropdown options={options} selection search />)

        expect(getDropdown()).not.toHaveAttribute('tabindex')
      })

      it('is not present on the root when is search and defined', () => {
        renderDropdown(<Dropdown options={options} selection search tabIndex={1} />)

        expect(getDropdown()).not.toHaveAttribute('tabindex')
      })
    })
  })

  describe('aria', () => {
    it('should label normal dropdown as a listbox', () => {
      renderDropdown(<Dropdown />)
      expect(getDropdown()).toHaveAttribute('role', 'listbox')
    })
    it('should label search dropdown as a combobox', () => {
      renderDropdown(<Dropdown search />)
      expect(getDropdown()).toHaveAttribute('role', 'combobox')
    })
    it('should label search dropdownMenu as a listbox', () => {
      renderDropdown(<Dropdown search />)
      expect(getMenu()).toHaveAttribute('role', 'listbox')
    })
    it('should label search multiple dropdownMenu as aria-multiselectable', () => {
      renderDropdown(<Dropdown search multiple />)
      expect(getMenu()).toHaveAttribute('aria-multiselectable', 'true')
    })
    it('should not label normal dropdownMenu with a role', () => {
      renderDropdown(<Dropdown />)
      expect(getMenu()).not.toHaveAttribute('role')
    })
    it('should label disabled dropdown as aria-disabled', () => {
      renderDropdown(<Dropdown disabled />)
      expect(getDropdown()).toHaveAttribute('aria-disabled', 'true')
    })
    it('should label normal dropdown without aria-disabled', () => {
      renderDropdown(<Dropdown />)
      expect(getDropdown()).not.toHaveAttribute('aria-disabled')
    })
    it('should label multiple dropdown as aria-multiselectable', () => {
      renderDropdown(<Dropdown multiple />)
      expect(getDropdown()).toHaveAttribute('aria-multiselectable', 'true')
    })
    it('should not label multiple search dropdown as aria-multiselectable', () => {
      renderDropdown(<Dropdown search multiple />)
      expect(getDropdown()).not.toHaveAttribute('aria-multiselectable')
    })
    it('should label normal dropdown without aria-multiselectable', () => {
      renderDropdown(<Dropdown />)
      expect(getDropdown()).not.toHaveAttribute('aria-multiselectable')
    })
    it('should label loading dropdown as aria-busy', () => {
      renderDropdown(<Dropdown loading />)
      expect(getDropdown()).toHaveAttribute('aria-busy', 'true')
    })
    it('should label normal dropdown without aria-busy', () => {
      renderDropdown(<Dropdown />)
      expect(getDropdown()).not.toHaveAttribute('aria-busy')
    })
    it('should label search dropdown input aria-autocomplete=list', () => {
      renderDropdown(<Dropdown search />)
      expect(getDropdown().querySelector('input')).toHaveAttribute('aria-autocomplete', 'list')
    })
    it('should label search dropdown input type=text', () => {
      renderDropdown(<Dropdown search />)
      expect(getDropdown().querySelector('input')).toHaveAttribute('type', 'text')
    })
  })

  describe('clearable', () => {
    it('does not clear when value is empty', () => {
      const onChange = vi.fn()
      renderDropdown(<Dropdown clearable onChange={onChange} />)

      fireEvent.click(getDropdown().querySelector('i.icon'))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not clear when is multiple and value is empty', () => {
      const onChange = vi.fn()
      renderDropdown(<Dropdown clearable multiple onChange={onChange} />)

      fireEvent.click(getDropdown().querySelector('i.icon'))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('clears when value is not empty', () => {
      const defaultValue = options[1].value
      const onChange = vi.fn()

      renderDropdown(
        <Dropdown defaultValue={defaultValue} clearable onChange={onChange} options={options} />,
      )
      fireEvent.click(getDropdown().querySelector('i.clear'))

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ value: '' }),
      )
      expect(getDropdown().querySelectorAll('.selected.item')).toHaveLength(1)
      expect(getItem(0)).toHaveClass('selected')
    })

    it('clears when value is multiple and is not empty', () => {
      const defaultValue = _.map(options, 'value')
      const onChange = vi.fn()

      renderDropdown(
        <Dropdown
          defaultValue={defaultValue}
          clearable
          multiple
          onChange={onChange}
          options={options}
        />,
      )
      fireEvent.click(getDropdown().querySelector('i.clear'))

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ value: [] }),
      )
      expect(getDropdown().querySelectorAll('.selected.item')).toHaveLength(1)
      expect(getItem(0)).toHaveClass('selected')
    })
  })

  describe('handleBlur', () => {
    it('passes the event to the onBlur prop', () => {
      const onBlur = vi.fn()

      renderDropdown(<Dropdown onBlur={onBlur} />)
      blurDropdown()

      expect(onBlur).toHaveBeenCalledTimes(1)
      expect(onBlur).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'blur', target: getDropdown() }),
        expect.anything(),
      )
    })

    it('calls onChange with the selected option on blur', () => {
      const onChange = vi.fn()
      renderDropdown(<Dropdown onChange={onChange} selectOnBlur options={options} />)

      clickDropdown()
      dropdownMenuIsOpen()

      blurDropdown()

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'blur' }),
        expect.objectContaining({ value: options[0].value }),
      )
    })

    it('does not call handleChange if the value has not changed', () => {
      const onChange = vi.fn()

      renderDropdown(<Dropdown onChange={onChange} options={options} selectOnBlur />)

      // focus, open and select an item
      clickDropdown()
      focusDropdown()
      dropdownMenuIsOpen()

      fireEvent.click(getItem(2))
      dropdownMenuIsClosed()
      expect(onChange).toHaveBeenCalledTimes(1)

      clickDropdown()
      fireEvent.click(getItem(2))
      dropdownMenuIsClosed()
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('sets searchQuery state to empty', () => {
      renderDropdown(<Dropdown defaultSearchQuery='foo' search />)

      blurDropdown()
      expect(getSearchInput()).toHaveValue('')
    })

    it('does not call onBlur when the mouse is down', () => {
      const onBlur = vi.fn()

      renderDropdown(<Dropdown onBlur={onBlur} selectOnBlur />)

      mouseDownDropdown()
      blurDropdown()

      expect(onBlur).not.toHaveBeenCalled()
    })

    it('does not select an item when the mouse is down', () => {
      const onChange = vi.fn()

      renderDropdown(<Dropdown onChange={onChange} options={options} selectOnBlur />)
      clickDropdown()
      dropdownMenuIsOpen()

      mouseDownDropdown()
      blurDropdown()

      expect(onChange).not.toHaveBeenCalled()
      dropdownMenuIsOpen()
    })
  })

  describe('handleClose', () => {
    it('prevents Space from opening a search Dropdown after selecting an item', () => {
      // Prevent a bug where pressing space in another control opens the Dropdown
      // https://github.com/Semantic-Org/Semantic-UI-React/issues/692
      renderDropdown(<Dropdown options={options} search selection />)

      // open, click an item, assert it is active and in the value
      clickDropdown()
      dropdownMenuIsOpen()

      fireEvent.click(getItem(0))
      expect(getItem(0)).toHaveClass('active')
      dropdownMenuIsClosed()

      // The dropdown will be still focused after an item will be selected, we should remove
      // focus from it before
      act(() => {
        document.activeElement.blur()
      })

      // doesn't open on space
      keyDown('Spacebar')
      dropdownMenuIsClosed()
    })
  })

  describe('closeOnChange', () => {
    it('will close when defined and dropdown is multiple', () => {
      renderDropdown(<Dropdown selection multiple search closeOnChange options={options} />)
      clickDropdown()

      dropdownMenuIsOpen()

      fireEvent.click(getItem(0))

      dropdownMenuIsClosed()
    })

    it('will remain open when undefined and dropdown is multiple', () => {
      renderDropdown(<Dropdown selection multiple search options={options} />)
      clickDropdown()

      dropdownMenuIsOpen()

      fireEvent.click(getItem(0))

      dropdownMenuIsOpen()
    })
  })

  describe('closeOnEscape', () => {
    it('closes the dropdown when Escape key is pressed by default', () => {
      renderDropdown(<Dropdown defaultOpen />)

      dropdownMenuIsOpen()

      keyDown('Escape', document)
      dropdownMenuIsClosed()
    })

    it('closes the dropdown when is "true" and Escape key is pressed', () => {
      renderDropdown(<Dropdown defaultOpen closeOnEscape />)

      dropdownMenuIsOpen()

      keyDown('Escape', document)
      dropdownMenuIsClosed()
    })

    it('does not close the dropdown when false and Escape key is pressed', () => {
      renderDropdown(<Dropdown defaultOpen closeOnEscape={false} />)

      dropdownMenuIsOpen()

      keyDown('Escape', document)
      dropdownMenuIsOpen()
    })
  })

  describe('setSelectedIndex', () => {
    it('will call setSelectedIndex if options change', () => {
      const { rerender } = renderDropdown(<Dropdown options={options} />)

      clickDropdown()
      keyDown('ArrowDown')
      expect(getDropdown().querySelectorAll('.selected.item')).toHaveLength(1)
      expect(getItem(1)).toHaveClass('selected')

      rerender(<Dropdown options={[]} />)
      expect(getDropdown().querySelector('.selected.item')).not.toBeInTheDocument()
    })

    it('will not call setSelectedIndex if options have not changed', () => {
      const { rerender } = renderDropdown(<Dropdown options={options} />)

      clickDropdown()
      keyDown('ArrowDown')
      expect(getItem(1)).toHaveClass('selected')

      rerender(<Dropdown options={options} />)
      expect(getItem(1)).toHaveClass('selected')
    })
  })

  describe('selectedIndex', () => {
    it('sets "selectedIndex" when an item was selected', () => {
      const option = _.last(options)

      renderDropdown(<Dropdown options={options} search selection />)

      // open, simulate search and select option
      clickDropdown()
      keyDown('ArrowDown')
      expect(getItem(1)).toHaveClass('selected')

      searchFor(option.text)
      keyDown('Enter')
      expect(getItem(4)).toHaveClass('selected')

      // open again
      clickDropdown()
      expect(getItem(4)).toHaveClass('selected')
    })

    it('keeps "selectedIndex" when the same item was selected', () => {
      const option = _.last(options)

      renderDropdown(<Dropdown options={options} search selection />)

      // simulate search and select option
      searchFor(option.text)
      keyDown('Enter')
      expect(getItem(4)).toHaveClass('selected')

      // select the same option again
      searchFor(option.text)
      keyDown('Enter')
      expect(getItem(4)).toHaveClass('selected')
    })
  })

  describe('isMouseDown', () => {
    it('tracks when the mouse is down', () => {
      // To understand this test please check componentDidUpdate() on Dropdown component
      renderDropdown(<Dropdown />)
      dropdownMenuIsClosed()

      // When ".isMouseDown === false" a focus event will not open Dropdown
      mouseDownDropdown()
      focusDropdown()
      dropdownMenuIsClosed()

      // Reset to default component state
      fireEvent.mouseUp(document.body)
      blurDropdown()

      // When ".isMouseDown === true" a focus event will open Dropdown
      focusDropdown()
      dropdownMenuIsOpen()
    })
  })

  describe('icon', () => {
    it('defaults to a dropdown icon', () => {
      renderDropdown(<Dropdown />)

      expect(getDropdown().querySelector('.dropdown.icon')).toBeInTheDocument()
    })

    it('always opens a dropdown on click', () => {
      renderDropdown(<Dropdown options={options} selection search />)
      fireEvent.click(getDropdown().querySelector('i.icon'))

      dropdownMenuIsOpen()
    })

    it('always opens a dropdown on click', () => {
      renderDropdown(<Dropdown options={options} selection search />)
      fireEvent.click(getDropdown().querySelector('i.icon'))

      dropdownMenuIsOpen()
    })

    it('passes onClick handler', () => {
      const onClick = vi.fn()
      const props = { name: 'user', onClick }

      renderDropdown(<Dropdown icon={props} options={options} />)
      const icon = getDropdown().querySelector('i.icon')
      fireEvent.click(icon)

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ target: icon }),
        expect.objectContaining(props),
      )
    })
  })

  describe('searchQuery', () => {
    it('defaults to empty string', () => {
      renderDropdown(<Dropdown search />)
      expect(getSearchInput()).toHaveValue('')
    })

    it('passes value to state', () => {
      renderDropdown(<Dropdown search searchQuery='foo' />)
      expect(getSearchInput()).toHaveValue('foo')
    })
  })

  describe('selected item', () => {
    it('defaults to the first item', () => {
      renderDropdown(<Dropdown options={options} selection />)

      expect(getItem(0)).toHaveClass('selected')
    })
    it('defaults to the first non-disabled item', () => {
      options[0].disabled = true
      renderDropdown(<Dropdown options={options} selection />)

      // selection moved to second item
      expect(getItem(0)).not.toHaveClass('selected')
      expect(getItem(1)).toHaveClass('selected')
    })
    it('defaults to selected item when options are initially empty', () => {
      const randomIndex = 1 + _.random(options.length - 2)
      const value = options[randomIndex].value

      const { rerender } = renderDropdown(<Dropdown options={[]} selection value={value} />)

      rerender(<Dropdown options={options} selection value={value} />)

      expect(getItem(randomIndex)).toHaveClass('selected')
    })
    it('is null when all options disabled', () => {
      const disabledOptions = options.map((o) => ({ ...o, disabled: true }))

      renderDropdown(<Dropdown options={disabledOptions} selection />)

      expect(getDropdown().querySelector('.selected')).not.toBeInTheDocument()
    })
    it('is set when clicking an item', () => {
      // random item, skip the first as it's selected by default
      const randomIndex = 1 + _.random(options.length - 2)
      renderDropdown(<Dropdown options={options} selection />)

      fireEvent.click(getItem(randomIndex))
      expect(getItem(randomIndex)).toHaveClass('selected')
    })
    it('is ignored when clicking a disabled item', () => {
      // random item, skip the first as it's selected by default
      const randomIndex = 1 + _.random(options.length - 2)

      options[randomIndex].disabled = true

      renderDropdown(<Dropdown options={options} selection />)
      clickDropdown()
      fireEvent.click(getItem(randomIndex))

      expect(getItem(randomIndex)).not.toHaveClass('selected')
      dropdownMenuIsOpen()
    })
    it('moves down on arrow down when open', () => {
      renderDropdown(<Dropdown options={options} selection />)

      // open
      clickDropdown()
      dropdownMenuIsOpen()

      // arrow down
      keyDown('ArrowDown')

      // selection moved to second item
      expect(getItem(0)).not.toHaveClass('selected')
      expect(getItem(1)).toHaveClass('selected')
    })
    it('moves up on arrow up when open', () => {
      renderDropdown(<Dropdown options={options} selection />)

      // open
      clickDropdown()
      expect(getItem(0)).toHaveClass('selected')

      // arrow down
      keyDown('ArrowUp')

      // selection moved to last item
      expect(getItem(0)).not.toHaveClass('selected')
      expect(getItem(options.length - 1)).toHaveClass('selected')
    })
    it('skips over items filtered by search', () => {
      const opts = [
        { text: 'a1', value: 'a1' },
        { text: 'skip this one', value: 'skip this one' },
        { text: 'a2', value: 'a2' },
      ]
      // search for 'a'
      renderDropdown(<Dropdown options={opts} search selection />)
      clickDropdown()
      searchFor('a')

      expect(getDropdown().querySelector('.selected')).toHaveTextContent('a1')

      // move selection down
      keyDown('ArrowDown')

      expect(getDropdown().querySelector('.selected')).toHaveTextContent('a2')
    })
    it('filters diacritics on options when using deburr prop', () => {
      const inputText = 'floresti'
      const textToFind = 'FLOREŞTI'

      const opts = [
        { text: textToFind, value: '1' },
        { text: `ŞANŢU ${textToFind}`, value: '2' },
        { text: `${textToFind} Alba`, value: '3' },
      ]

      // search for 'floresti'
      renderDropdown(<Dropdown options={opts} search deburr selection />)
      clickDropdown()
      searchFor(inputText)

      expect(getDropdown().querySelector('.selected')).toHaveTextContent(textToFind)
    })
    it('filters diacritics on input when using deburr prop', () => {
      const inputText = 'FLORÉŞTI'
      const textToFind = 'FLORESTI'

      const opts = [
        { text: textToFind, value: '1' },
        { text: `SANTU ${textToFind}`, value: '2' },
        { text: `${textToFind} Alba`, value: '3' },
      ]

      // search for 'floresti'
      renderDropdown(<Dropdown options={opts} search deburr selection />)
      clickDropdown()
      searchFor(inputText)

      expect(getDropdown().querySelector('.selected')).toHaveTextContent(textToFind)
    })
    it('should not filter diacritics when deburr is not set', () => {
      const inputText = 'FLORÉŞTI'
      const textToFind = 'FLORESTI'

      // Add this in case the default 'no results text' changes.
      const noResultsText = 'NoResultsFound'

      const opts = [
        { text: textToFind, value: '1' },
        { text: `SANTU ${textToFind}`, value: '2' },
        { text: `${textToFind} Alba`, value: '3' },
      ]

      // search for 'floresti'
      renderDropdown(<Dropdown options={opts} search selection noResultsMessage={noResultsText} />)
      clickDropdown()
      searchFor(inputText)

      expect(getDropdown().querySelector('.message')).toHaveTextContent(noResultsText)
    })
    it('still works after encountering "no results"', () => {
      const opts = [
        { text: 'a1', value: 'a1' },
        { text: 'a2', value: 'a2' },
        { text: 'a3', value: 'a3' },
      ]
      renderDropdown(<Dropdown options={opts} search selection />)

      // search for 'a4'
      // no results appears
      clickDropdown()
      searchFor('a4')

      expect(getDropdown().querySelectorAll('.message')).toHaveLength(1)

      // search for 'a' (simulated backspace)
      // no results is removed
      // first item is selected
      // down arrow moves selection
      searchFor('a')

      expect(getDropdown().querySelector('.message')).not.toBeInTheDocument()

      expect(getDropdown().querySelectorAll('.selected')).toHaveLength(1)
      expect(getDropdown().querySelector('.selected')).toHaveTextContent('a1')

      // move selection down
      keyDown('ArrowDown')

      expect(getDropdown().querySelectorAll('.selected')).toHaveLength(1)
      expect(getDropdown().querySelector('.selected')).toHaveTextContent('a2')
    })
    it('skips over disabled items', () => {
      const opts = [
        { text: 'a1', value: 'a1' },
        { text: 'skip this one', value: 'skip this one', disabled: true },
        { text: 'a2', value: 'a2' },
      ]

      renderDropdown(<Dropdown options={opts} search selection />)
      clickDropdown()

      expect(getDropdown().querySelector('.selected')).toHaveTextContent('a1')

      // move selection down
      keyDown('ArrowDown')
      expect(getDropdown().querySelector('.selected')).toHaveTextContent('a2')
    })
    it('does not enter an infinite loop when all items are disabled', () => {
      const onChange = vi.fn()
      const opts = [
        { text: '1', value: '1', disabled: true },
        { text: '2', value: '2', disabled: true },
      ]
      renderDropdown(<Dropdown onChange={onChange} options={opts} search selection />)

      clickDropdown()
      // move selection down
      keyDown('ArrowDown')

      expect(onChange).not.toHaveBeenCalled()
    })
    it('scrolls the selected item into view', () => {
      // get enough options to make the menu scrollable
      const opts = getOptions(20)

      renderDropdown(<Dropdown options={opts} selection />)
      clickDropdown()

      dropdownMenuIsOpen()
      const menu = document.querySelector('.ui.dropdown .menu.visible')

      // Limit the menu's height and set an overflow so it's scrollable
      menu.style.height = '100px'
      menu.style.overflow = 'auto'

      //
      // Scrolls to bottom
      //

      // make sure first item is selected
      expect(getDropdown().querySelector('.selected')).toHaveTextContent(opts[0].text)

      // wrap selection to last item
      keyDown('ArrowUp')

      // make sure last item is selected
      expect(getDropdown().querySelector('.selected')).toHaveTextContent(_.last(opts).text)

      // menu should be completely scrolled to the bottom
      // When the last item in the list was selected, DropdownMenu should scroll to bottom.
      expect(menu.scrollTop + menu.clientHeight).toBe(menu.scrollHeight)

      //
      // Scrolls back to top
      //

      // wrap selection to last item
      keyDown('ArrowDown')

      // make sure first item is selected
      expect(getDropdown().querySelector('.selected')).toHaveTextContent(opts[0].text)

      // Note: For some reason the first item's offsetTop is not 0 so we need
      // to find the item's offsetTop and ensure it's at the top.
      // When the first item in the list was selected, DropdownMenu should scroll to top.
      const selectedItem = document.querySelector('.ui.dropdown .menu.visible .item.selected')
      expect(menu.scrollTop).toBe(selectedItem.offsetTop)
    })
    it('becomes active on enter when open', () => {
      renderDropdown(<Dropdown options={options} selection />)
      clickDropdown()

      // initial item props
      expect(getItem(1)).not.toHaveClass('selected')
      expect(getItem(1)).not.toHaveClass('active')

      // select and make active
      keyDown('ArrowDown')
      keyDown('Enter')

      expect(getItem(1)).toHaveClass('selected')
      expect(getItem(1)).toHaveClass('active')
    })
    it('becomes active on spacebar when open', () => {
      renderDropdown(<Dropdown options={options} selection />)
      clickDropdown()

      // initial item props
      expect(getItem(1)).not.toHaveClass('selected')
      expect(getItem(1)).not.toHaveClass('active')

      // select and make active
      keyDown('ArrowDown')
      keyDown('Spacebar')

      expect(getItem(1)).toHaveClass('selected')
      expect(getItem(1)).toHaveClass('active')
    })
    it('closes the menu on ENTER key', () => {
      renderDropdown(<Dropdown options={options} selection />)
      clickDropdown()

      dropdownMenuIsOpen()

      // choose an item closes
      keyDown('Enter')
      dropdownMenuIsClosed()
    })
    it('closes the menu on SPACE key', () => {
      renderDropdown(<Dropdown options={options} selection />)
      clickDropdown()

      dropdownMenuIsOpen()

      // choose an item closes
      keyDown('Spacebar')
      dropdownMenuIsClosed()
    })
    it('closes the Search menu on ENTER key', () => {
      renderDropdown(<Dropdown options={options} selection search />)
      clickDropdown()

      dropdownMenuIsOpen()

      // choose an item closes
      keyDown('Enter')
      dropdownMenuIsClosed()
    })
    it('does not close the Search menu on SPACE key', () => {
      renderDropdown(<Dropdown options={options} selection search />)
      clickDropdown()

      dropdownMenuIsOpen()

      // choose an item closes
      keyDown('Spacebar')
      dropdownMenuIsOpen()
    })
    it('keeps value of the searchQuery when selection is changed', () => {
      renderDropdown(<Dropdown options={options} selection search />)

      searchFor('foo')
      clickDropdown()
      keyDown('ArrowDown')

      expect(getSearchInput()).toHaveValue('foo')
    })
  })

  describe('value', () => {
    it('sets the corresponding item to active', () => {
      const index = _.random(options.length - 1)
      const { value } = options[index]

      renderDropdown(<Dropdown options={options} selection value={value} />)

      expect(getItem(index)).toHaveClass('active')
      expect(getDropdown().querySelectorAll('.active.item')).toHaveLength(1)
    })

    it('sets the corresponding item text', () => {
      const index = _.random(options.length - 1)
      const { text, value } = options[index]

      renderDropdown(<Dropdown value={value} options={options} selection />)

      expect(getItem(index)).toHaveTextContent(text)
      expect(getItem(index)).toHaveClass('active')
    })

    it('updates active item when changed', () => {
      const index = _.random(options.length - 1)
      let nextIndex
      while (nextIndex === undefined || nextIndex === index)
        nextIndex = _.random(options.length - 1)

      const { rerender } = renderDropdown(
        <Dropdown value={options[index].value} options={options} selection />,
      )

      // initial active item
      expect(getItem(index)).toHaveClass('active')

      // change value
      rerender(<Dropdown value={options[nextIndex].value} options={options} selection />)

      // next active item
      expect(getItem(nextIndex)).toHaveClass('active')
    })

    it('updates text when value changed', () => {
      const initialItem = _.sample(options)
      const nextItem = _.sample(_.without(options, initialItem))

      const { rerender } = renderDropdown(
        <Dropdown options={options} selection value={initialItem.value} />,
      )
      expect(getText()).toHaveTextContent(initialItem.text)

      rerender(<Dropdown options={options} selection value={nextItem.value} />)
      expect(getText()).toHaveTextContent(nextItem.text)
    })

    it('updates value on down arrow', () => {
      renderDropdown(<Dropdown options={options} selection />)

      clickDropdown()
      keyDown('ArrowDown')
      expect(getItem(1)).toHaveClass('active')
    })

    it('updates value on up arrow', () => {
      renderDropdown(<Dropdown options={options} selection />)

      clickDropdown()
      keyDown('ArrowUp')
      expect(getItem(4)).toHaveClass('active')
    })
  })

  describe('text', () => {
    it('defaults to "placeholder"', () => {
      const placeholder = faker.hacker.phrase()

      renderDropdown(<Dropdown options={options} placeholder={placeholder} />)

      expect(getText()).toHaveTextContent(placeholder)
    })
    it('sets the display text', () => {
      const text = faker.hacker.phrase()

      renderDropdown(<Dropdown options={options} selection text={text} />)

      expect(getText()).toHaveTextContent(text)
    })
    it('prevents updates on item click if defined', () => {
      const text = faker.hacker.phrase()

      renderDropdown(<Dropdown options={options} selection text={text} />)
      clickDropdown()
      fireEvent.click(getItem(_.random(options.length - 1)))

      expect(getText()).toHaveTextContent(text)
    })
    it('is updated on item click if not already defined', () => {
      renderDropdown(<Dropdown options={options} selection />)

      // open
      clickDropdown()

      // click item
      const item = getItem(_.random(options.length - 1))
      fireEvent.click(item)

      // text updated
      expect(getText()).toHaveTextContent(item.textContent)
    })
    it('is updated on item enter if multiple search results present', () => {
      const searchOptions = [
        { value: 0, text: 'foo' },
        { value: 1, text: 'foe' },
      ]
      renderDropdown(<Dropdown options={searchOptions} search selection />)

      // open and simulate search
      clickDropdown()
      searchFor('fo')

      // arrow down
      keyDown('ArrowDown')
      keyDown('Enter')

      // text updated
      expect(getText()).toHaveTextContent('foe')
    })
    it('displays if value is 0', () => {
      const text = faker.hacker.noun()

      renderDropdown(<Dropdown options={[{ value: 0, text }]} selection />)

      // open
      clickDropdown()

      // click item
      const item = getItem(0)
      pressItem(item)

      // text updated
      dropdownMenuIsClosed()
      expect(getText()).toHaveTextContent(item.textContent)
    })
    it("does not display if value is ''", () => {
      const text = faker.hacker.noun()

      renderDropdown(<Dropdown options={[{ value: '', text }]} selection />)
      clickDropdown()
      pressItem(getItem(0))

      // nothing is displayed: there is no placeholder, so no text element is rendered
      expect(getText()).not.toBeInTheDocument()
    })
    it('does not display if value is null', () => {
      const text = faker.hacker.noun()

      renderDropdown(<Dropdown options={[{ value: null, text }]} selection />)
      clickDropdown()
      pressItem(getItem(0))

      // nothing is displayed: there is no placeholder, so no text element is rendered
      expect(getText()).not.toBeInTheDocument()
    })
    it('does not display if value is undefined', () => {
      const text = faker.hacker.noun()

      renderDropdown(<Dropdown options={[{ key: text, value: undefined, text }]} selection />)
      clickDropdown()
      pressItem(getItem(0))

      // nothing is displayed: there is no placeholder, so no text element is rendered
      expect(getText()).not.toBeInTheDocument()
    })
  })

  describe('trigger', () => {
    it('displays the trigger', () => {
      const text = 'Hey there'
      const trigger = <div className='trigger'>{text}</div>

      renderDropdown(<Dropdown options={options} trigger={trigger} />)

      expect(getDropdown().querySelector('.trigger')).toHaveTextContent(text)
    })
  })

  describe('menu', () => {
    it('opens on dropdown click', () => {
      renderDropdown(<Dropdown options={options} selection />)

      dropdownMenuIsClosed()
      clickDropdown()
      dropdownMenuIsOpen()
    })

    it('opens on arrow down when focused', () => {
      renderDropdown(<Dropdown options={options} selection />)

      // Note: This mousedown is necessary to get the Dropdown focused
      // without it being open.
      mouseDownDropdown()
      focusDropdown()
      dropdownMenuIsClosed()

      keyDown('ArrowDown')
      dropdownMenuIsOpen()
    })

    it('opens on space when focused', () => {
      renderDropdown(<Dropdown options={options} selection />)

      // Note: This mousedown is necessary to get the Dropdown focused
      // without it being open.
      mouseDownDropdown()
      focusDropdown()
      dropdownMenuIsClosed()

      // fireEvent returns "false" when the default action was prevented
      const notPrevented = keyDown('Spacebar')
      dropdownMenuIsOpen()
      expect(notPrevented).toBe(false)
    })

    it('opens on space in search input when focused', () => {
      renderDropdown(<Dropdown options={options} selection search />)

      // Note: This mousedown is necessary to get the Dropdown focused
      // without it being open.
      mouseDownDropdown()
      focusDropdown()
      dropdownMenuIsClosed()

      // fireEvent returns "true" when the default action was not prevented
      const notPrevented = keyDown('Spacebar', getSearchInput())
      dropdownMenuIsOpen()
      expect(notPrevented).toBe(true)
    })

    it('does not open on arrow down when not focused', () => {
      renderDropdown(<Dropdown options={options} selection />)
      dropdownMenuIsClosed()

      keyDown('ArrowDown')
      dropdownMenuIsClosed()
    })

    it('does not open on space when not focused', () => {
      renderDropdown(<Dropdown options={options} selection />)
      dropdownMenuIsClosed()

      keyDown('Spacebar')
      dropdownMenuIsClosed()
    })

    it('closes on dropdown click', () => {
      renderDropdown(<Dropdown options={options} selection defaultOpen />)

      dropdownMenuIsOpen()
      clickDropdown()
      dropdownMenuIsClosed()
    })

    it('closes on menu item click', () => {
      renderDropdown(<Dropdown options={options} selection />)
      const item = getItem(_.random(options.length - 1))

      // open
      clickDropdown()
      dropdownMenuIsOpen()

      // select item
      fireEvent.mouseDown(item)
      fireEvent.click(item)
      dropdownMenuIsClosed()
    })

    it('blurs after menu item click (mousedown)', () => {
      renderDropdown(<Dropdown options={options} selection />)
      const item = getItem(_.random(options.length - 1))

      // open
      clickDropdown()
      dropdownMenuIsOpen()

      // select item
      fireEvent.mouseDown(item)
      dropdownMenuIsOpen()
      fireEvent.click(item)
      dropdownMenuIsClosed()
    })

    it('closes on click outside', () => {
      renderDropdown(<Dropdown options={options} selection />)

      // open
      clickDropdown()
      dropdownMenuIsOpen()

      // click outside
      fireEvent.click(document.body)
      dropdownMenuIsClosed()
    })

    it('handles focus correctly', () => {
      renderDropdown(<Dropdown options={options} selection />)
      bodyIsFocused()

      // focus
      act(() => {
        getDropdown().focus()
      })
      dropdownIsFocused()

      // click outside
      fireEvent.click(document.body)
      bodyIsFocused()
    })

    it('closes on esc key', () => {
      renderDropdown(<Dropdown options={options} selection />)

      // open
      clickDropdown()
      dropdownMenuIsOpen()

      // esc
      keyDown('Escape', document)
      dropdownMenuIsClosed()
    })
  })

  describe('onOpen', () => {
    it('called when dropdown would open', () => {
      const onOpen = vi.fn()
      renderDropdown(<Dropdown options={options} selection onOpen={onOpen} />)

      clickDropdown()
      expect(onOpen).toHaveBeenCalledTimes(1)
    })

    it('not called when dropdown would not open', () => {
      const onOpen = vi.fn()
      renderDropdown(<Dropdown options={options} selection onOpen={onOpen} />)

      keyDown('ArrowDown')
      expect(onOpen).not.toHaveBeenCalled()
    })

    it('is called once when the icon is clicked with a search prop', () => {
      // https://github.com/Semantic-Org/Semantic-UI-React/issues/2600
      const onOpen = vi.fn()
      renderDropdown(<Dropdown options={options} selection search onOpen={onOpen} />)

      fireEvent.click(getDropdown().querySelector('i.icon'))
      expect(onOpen).toHaveBeenCalledTimes(1)
    })
  })

  describe('onClose', () => {
    it('called when dropdown would close', () => {
      const onClose = vi.fn()
      renderDropdown(<Dropdown defaultOpen onClose={onClose} options={options} selection />)

      clickDropdown()
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('called once even when blurred', () => {
      // Heads up!
      // Special test for: https://github.com/Semantic-Org/Semantic-UI-React/issues/2953
      const onClose = vi.fn()
      renderDropdown(<Dropdown defaultOpen onClose={onClose} options={options} selection />)

      clickDropdown()
      blurDropdown()
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('open', () => {
    it('defaultOpen opens the menu when true', () => {
      renderDropdown(<Dropdown options={options} selection defaultOpen />)
      dropdownMenuIsOpen()
    })
    it('defaultOpen opens the menu on search dropdowns', () => {
      renderDropdown(<Dropdown search options={options} selection defaultOpen />)
      dropdownMenuIsOpen()
    })
    it('defaultOpen closes the menu when false', () => {
      renderDropdown(<Dropdown options={options} selection defaultOpen={false} />)
      dropdownMenuIsClosed()
    })
    it('opens the menu when true', () => {
      renderDropdown(<Dropdown options={options} selection open />)
      dropdownMenuIsOpen()
    })
    it('closes the menu when false', () => {
      renderDropdown(<Dropdown options={options} selection open={false} />)
      dropdownMenuIsClosed()
    })
    it('closes the menu when toggled from true to false', () => {
      const { rerender } = renderDropdown(<Dropdown options={options} selection open />)
      rerender(<Dropdown options={options} selection open={false} />)
      dropdownMenuIsClosed()
    })
    it('opens the menu when toggled from false to true', () => {
      const { rerender } = renderDropdown(<Dropdown options={options} selection open={false} />)
      rerender(<Dropdown options={options} selection open />)
      dropdownMenuIsOpen()
    })
  })

  describe('multiple', () => {
    it('does not close the menu on item selection with enter', () => {
      renderDropdown(<Dropdown options={options} selection multiple />)
      clickDropdown()

      dropdownMenuIsOpen()

      // choose an item keeps menu open
      keyDown('Enter')
      dropdownMenuIsOpen()
    })
    it('does not close the menu on clicking on an item', () => {
      renderDropdown(<Dropdown options={options} selection multiple />)
      clickDropdown()
      fireEvent.click(getItem(_.random(options.length - 1)))

      dropdownMenuIsOpen()
    })
    it('filters active options out of the list', () => {
      // make all the items active, expect to see none in the list
      const value = _.map(options, 'value')

      renderDropdown(<Dropdown options={options} selection value={value} multiple />)
      expect(getItems()).toHaveLength(0)
    })
    it('displays a label for active items', () => {
      // select a random item, expect a label with the item's text
      const testOptions = [
        { value: 'foo', text: 'foo' },
        { value: 'bar', text: 'bar', image: 'bar.jpg' },
        { value: 'baz', text: <span className='baz'>baz</span> },
        {
          value: 'qux',
          text: () => (
            <span className='qux' key='qux'>
              qux
            </span>
          ),
        },
      ]

      consoleUtil.disableOnce()
      renderDropdown(
        <Dropdown
          multiple
          options={testOptions}
          selection
          value={testOptions.map((option) => option.value)}
        />,
      )

      const labels = getLabels()

      expect(labels[0]).toHaveTextContent('foo')

      expect(labels[1]).toHaveTextContent('bar')
      expect(labels[1].querySelector('img')).toHaveAttribute('src', 'bar.jpg')

      expect(getDropdown().querySelector('span.baz')).toHaveTextContent('baz')
      expect(getDropdown().querySelector('span.qux')).toHaveTextContent('qux')
    })
    it('keeps the selection within the range of remaining options', () => {
      // items are removed as they are made active
      // the selection should move if the last item is made active
      renderDropdown(<Dropdown options={options} selection multiple />)

      // open
      clickDropdown()
      dropdownMenuIsOpen()

      // activate the last item, removing it from the list
      keyDown('ArrowUp')

      expect(getItems()).toHaveLength(options.length)
      expect(getLastItem()).toHaveClass('selected')

      keyDown('Enter')

      // one item should be gone, and the _new_ last item should be selected
      expect(getItems()).toHaveLength(options.length - 1)
      expect(getLastItem()).toHaveClass('selected')
    })
    it('keeps the selection on the same index', () => {
      renderDropdown(<Dropdown options={options} selection multiple />)

      clickDropdown()
      dropdownMenuIsOpen()

      keyDown('ArrowDown')
      expect(getItem(1)).toHaveClass('selected')

      keyDown('Enter')
      expect(getItem(1)).toHaveClass('selected')
    })
    it('skips disabled items in selection', () => {
      const testOptions = [
        { value: 'foo', key: 'foo', text: 'foo' },
        { value: 'bar', key: 'bar', text: 'bar' },
        { value: 'baz', key: 'baz', text: 'baz', disabled: true },
        { value: 'qux', key: 'qux', text: 'qux' },
      ]

      renderDropdown(<Dropdown options={testOptions} selection multiple />)

      clickDropdown()
      dropdownMenuIsOpen()

      keyDown('ArrowDown')
      expect(getItem(1)).toHaveClass('selected')

      keyDown('Enter')
      expect(getItem(2)).toHaveClass('selected')
    })
    it('has labels with delete icons', () => {
      // add a value so we have a label
      const value = [_.head(options).value]
      renderDropdown(<Dropdown options={options} selection value={value} multiple />)

      expect(getDropdown().querySelector('.label')).toBeInTheDocument()
      expect(getDropdown().querySelector('.label .delete.icon')).toBeInTheDocument()
    })
    it('enables custom rendering', () => {
      const value = [_.head(options).value]
      const renderLabel = () => ({ content: 'My custom text!', as: 'div' })

      renderDropdown(
        <Dropdown options={options} selection value={value} multiple renderLabel={renderLabel} />,
      )

      const label = getDropdown().querySelector('.label')

      expect(label).toBeInTheDocument()
      expect(label.textContent).toBe('My custom text!')
      expect(label.tagName).toBe('DIV')
    })

    describe('selecting items', () => {
      let spy
      beforeEach(() => {
        spy = vi.fn()
      })

      it('does not close the menu on clicking on a label', () => {
        const value = _.map(options, 'value')
        const randomIndex = _.random(options.length - 1)

        renderDropdown(<Dropdown options={options} selection multiple value={value} />)
        clickDropdown()
        fireEvent.click(getLabels()[randomIndex])

        dropdownMenuIsOpen()
      })

      it('sets label to active', () => {
        const value = _.map(options, 'value')
        const randomIndex = _.random(options.length - 1)

        renderDropdown(<Dropdown options={options} selection multiple value={value} />)
        clickDropdown()
        fireEvent.click(getLabels()[randomIndex])

        expect(getLabels()[randomIndex]).toHaveClass('active')
      })

      it('calls onLabelClick', () => {
        const value = _.map(options, 'value')
        const randomIndex = _.random(options.length - 1)
        const randomValue = value[randomIndex]

        renderDropdown(
          <Dropdown options={options} selection multiple value={value} onLabelClick={spy} />,
        )
        clickDropdown()
        fireEvent.click(getLabels()[randomIndex])

        expect(spy).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({ value: randomValue }),
        )
      })

      it('refocuses search on select', () => {
        const randomIndex = _.random(options.length - 1)

        renderDropdown(<Dropdown options={options} search selection multiple />)
        clickDropdown()
        fireEvent.click(getItem(randomIndex))

        expect(document.querySelector('input.search')).toHaveFocus()
      })
    })
    describe('removing items', () => {
      it('calls onChange without the clicked value', () => {
        const value = _.map(options, 'value')
        const randomIndex = _.random(options.length - 1)
        const randomValue = value[randomIndex]
        const expected = _.without(value, randomValue)
        const spy = vi.fn()
        renderDropdown(
          <Dropdown options={options} selection value={value} multiple onChange={spy} />,
        )

        fireEvent.click(getDropdown().querySelectorAll('.delete.icon')[randomIndex])

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({ value: expected }),
        )
      })
    })
  })

  describe('removing items on backspace', () => {
    let spy
    beforeEach(() => {
      spy = vi.fn()
    })

    it('does nothing without selected items', () => {
      renderDropdown(<Dropdown options={options} selection multiple search onChange={spy} />)

      // open
      clickDropdown()

      keyDown('Backspace', document)

      expect(spy).not.toHaveBeenCalled()
    })
    it('removes the last item when there is no search query', () => {
      const value = _.map(options, 'value')
      const expected = _.dropRight(value)
      renderDropdown(
        <Dropdown options={options} selection value={value} multiple search onChange={spy} />,
      )

      // open
      clickDropdown()

      keyDown('Backspace', document)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ value: expected }),
      )
    })

    it('removes the last item when there is no search query when uncontrolled', () => {
      const value = _.map(options, 'value')
      const expected = _.dropRight(value)
      renderDropdown(
        <Dropdown
          options={options}
          selection
          defaultValue={value}
          multiple
          search
          onChange={spy}
        />,
      )

      // open
      clickDropdown()
      keyDown('Backspace', document)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ value: expected }),
      )
    })

    it('does not remove the last item when there is a search query', () => {
      // search for random item
      const searchQuery = _.sample(options).text
      const value = _.map(options, 'value')
      renderDropdown(
        <Dropdown options={options} selection value={value} multiple search onChange={spy} />,
      )

      // open and simulate search
      clickDropdown()
      searchFor(searchQuery)

      keyDown('Backspace', document)

      expect(spy).not.toHaveBeenCalled()
    })
    it('does not remove items for multiple dropdowns without search', () => {
      const value = _.map(options, 'value')
      renderDropdown(<Dropdown options={options} selection value={value} multiple onChange={spy} />)

      // open
      clickDropdown()

      keyDown('Backspace', document)

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('onChange', () => {
    let spy
    beforeEach(() => {
      spy = vi.fn()
    })

    it('is called with event and value on item click', () => {
      const randomIndex = _.random(options.length - 1)
      const randomValue = options[randomIndex].value
      renderDropdown(<Dropdown options={options} selection onChange={spy} />)
      clickDropdown()
      fireEvent.click(getItem(randomIndex))

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ value: randomValue }),
      )
    })
    it('is not called when value is not changed on item click', () => {
      renderDropdown(<Dropdown options={options} selection onChange={spy} />)

      clickDropdown()
      pressItem(getItem(0))
      expect(spy).toHaveBeenCalledTimes(1)
      dropdownMenuIsClosed()

      clickDropdown()
      pressItem(getItem(0))
      expect(spy).toHaveBeenCalledTimes(1)
      dropdownMenuIsClosed()
    })
    it('is called with event and value when pressing enter on a selected item', () => {
      const firstValue = options[0].value
      renderDropdown(<Dropdown options={options} selection onChange={spy} />)
      clickDropdown()

      keyDown('Enter')

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ value: firstValue }),
      )
    })
    it('is called with event and value when blurring', () => {
      const firstValue = options[0].value
      renderDropdown(<Dropdown options={options} selection onChange={spy} />)

      focusDropdown() // open, highlights first item
      blurDropdown() // blur should activate selected item

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ value: firstValue }),
      )
    })
    it('is not called on blur when closed', () => {
      renderDropdown(<Dropdown options={options} selection open={false} onChange={spy} />)

      focusDropdown()
      blurDropdown()

      expect(spy).not.toHaveBeenCalled()
    })
    it('is not called on blur when selectOnBlur is false', () => {
      renderDropdown(<Dropdown options={options} selection onChange={spy} selectOnBlur={false} />)

      focusDropdown()
      clickDropdown()
      blurDropdown()

      expect(spy).not.toHaveBeenCalled()
    })
    it('is not called on blur with multiple select', () => {
      renderDropdown(<Dropdown options={options} selection onChange={spy} multiple />)

      focusDropdown()
      clickDropdown()
      blurDropdown()

      expect(spy).not.toHaveBeenCalled()
    })
    it('is not called when updating the value prop', () => {
      const value = _.sample(options).value
      const next = _.sample(_.without(options, value)).value

      const { rerender } = renderDropdown(
        <Dropdown options={options} selection value={value} onChange={spy} />,
      )
      rerender(<Dropdown options={options} selection value={next} onChange={spy} />)

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('onClick', () => {
    it('is called with (event, props)', () => {
      const onClick = vi.fn()
      renderDropdown(<Dropdown onClick={onClick} options={options} />)
      clickDropdown()

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ options }),
      )
    })

    it("toggles the dropdown when it's not searchable", () => {
      renderDropdown(<Dropdown options={options} />)

      clickDropdown()
      dropdownMenuIsOpen()

      clickDropdown()
      dropdownMenuIsClosed()
    })

    it("opens the dropdown when it's searchable, but don't close", () => {
      renderDropdown(<Dropdown options={options} search />)

      clickDropdown()
      dropdownMenuIsOpen()

      clickDropdown()
      dropdownMenuIsOpen()
    })

    it("don't open the dropdown when it's searchable and minCharacters is more that default value", () => {
      renderDropdown(<Dropdown minCharacters={3} options={options} search />)

      clickDropdown()
      dropdownMenuIsClosed()
    })
  })

  describe('onFocus', () => {
    it('is called with (event, props)', () => {
      const onFocus = vi.fn()
      renderDropdown(<Dropdown onFocus={onFocus} options={options} />)
      focusDropdown()

      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(onFocus).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'focus' }),
        expect.objectContaining({ options }),
      )
    })

    it("opens the dropdown when it's not searchable", () => {
      renderDropdown(<Dropdown options={options} />)

      focusDropdown()
      dropdownMenuIsOpen()
    })

    it("opens the dropdown when it's searchable", () => {
      renderDropdown(<Dropdown options={options} search />)

      focusDropdown()
      dropdownMenuIsOpen()
    })

    it("don't open the dropdown when it's searchable and minCharacters is more that default value", () => {
      renderDropdown(<Dropdown minCharacters={3} options={options} search />)

      focusDropdown()
      dropdownMenuIsClosed()
    })
  })

  describe('onSearchChange', () => {
    it('is called with (event, value) on search input change', () => {
      const spy = vi.fn()
      renderDropdown(<Dropdown options={options} search selection onSearchChange={spy} />)
      searchFor('a')

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ target: getSearchInput() }),
        expect.objectContaining({
          search: true,
          searchQuery: 'a',
        }),
      )
      expect(getSearchInput()).toHaveValue('a')
    })

    it("don't open the menu on change if query's length is less than minCharacters", () => {
      renderDropdown(<Dropdown minCharacters={3} options={options} selection search />)

      dropdownMenuIsClosed()

      // simulate search with query's length is less than minCharacters
      searchFor('a')

      dropdownMenuIsClosed()
    })

    it("closes the opened menu on change if query's length is less than minCharacters", () => {
      renderDropdown(<Dropdown minCharacters={3} options={options} selection search />)

      searchFor('abc')
      dropdownMenuIsOpen()

      searchFor('a')
      dropdownMenuIsClosed()
    })
  })

  describe('options', () => {
    it('adds the onClick handler to all items', () => {
      const onChange = vi.fn()
      renderDropdown(<Dropdown options={options} selection onChange={onChange} />)

      // every item reacts to a click by becoming the active one
      _.forEach(options, ({ value }, index) => {
        fireEvent.click(getItem(index))

        expect(getItem(index)).toHaveClass('active')
        expect(onChange).toHaveBeenLastCalledWith(
          expect.any(Object),
          expect.objectContaining({ value }),
        )
      })
      expect(onChange).toHaveBeenCalledTimes(options.length)
    })

    it('calls onChange when an item is clicked', () => {
      const onChange = vi.fn()
      renderDropdown(<Dropdown options={options} selection onChange={onChange} />)

      // open
      clickDropdown()
      dropdownMenuIsOpen()

      expect(onChange).not.toHaveBeenCalled()

      // click random item, skip the first as it's active by default
      fireEvent.click(getItem(_.random(1, options.length - 1)))

      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('renders new options when options change', () => {
      const onChange = vi.fn()
      const customOptions = [
        { text: 'abra', value: 'abra' },
        { text: 'cadabra', value: 'cadabra' },
        { text: 'bang', value: 'bang' },
      ]
      const { rerender } = renderDropdown(<Dropdown options={customOptions} onChange={onChange} />)

      expect(getItems()).toHaveLength(3)

      rerender(
        <Dropdown
          options={[...customOptions, { text: 'bar', value: 'bar' }]}
          onChange={onChange}
        />,
      )

      expect(getItems()).toHaveLength(4)

      const newItem = getLastItem()

      expect(newItem).toHaveTextContent('bar')

      // the value of the new item is used on selection
      fireEvent.click(newItem)
      expect(onChange).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ value: 'bar' }),
      )
    })

    it('passes options as props', () => {
      const customOptions = [
        { text: 'abra', value: 'abra', 'data-foo': 'someValue' },
        { text: 'cadabra', value: 'cadabra', 'data-foo': 'someValue' },
        { text: 'bang', value: 'bang', 'data-foo': 'someValue' },
      ]
      renderDropdown(<Dropdown options={customOptions} selection />)

      expect(getItems()).toHaveLength(3)
      getItems().forEach((item) => {
        expect(item).toHaveAttribute('data-foo', 'someValue')
      })
    })

    it('handles keys correctly', () => {
      // React keys are not visible in the DOM. Items without a key fall back to their value as a
      // key, otherwise React would warn about missing keys (console calls throw in tests).
      const customOptions = [
        { key: 0, text: 'foo', value: 'foo' },
        { key: null, text: 'bar', value: 'bar' },
        { key: undefined, text: 'baz', value: 'baz' },
      ]
      renderDropdown(<Dropdown options={customOptions} selection />)
      const items = getItems()

      expect(items).toHaveLength(3)
      expect(items[0]).toHaveTextContent('foo')
      expect(items[1]).toHaveTextContent('bar')
      expect(items[2]).toHaveTextContent('baz')
    })

    it('invokes "onClick" on item and handles', () => {
      const onItemClick = vi.fn()
      const customOptions = [
        { key: 'foo', text: 'foo', value: 'foo' },
        { key: 'bar', text: 'bar', value: 'bar', onClick: onItemClick },
      ]

      renderDropdown(<Dropdown options={customOptions} />)
      dropdownMenuIsClosed()

      clickDropdown()
      focusDropdown()
      dropdownMenuIsOpen()

      fireEvent.click(getItem(1))
      dropdownMenuIsClosed()
      expect(getItem(1)).toHaveClass('selected')

      expect(onItemClick).toHaveBeenCalledTimes(1)
      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ value: 'bar' }),
      )
    })
  })

  describe('search', () => {
    it('does not add a search input when not defined', () => {
      renderDropdown(<Dropdown options={options} selection />)

      expect(getSearchInput()).not.toBeInTheDocument()
    })

    it('adds a search input when present', () => {
      renderDropdown(<Dropdown options={options} selection search />)

      expect(getDropdown().querySelectorAll('input.search')).toHaveLength(1)
    })

    it('sets focus to the search input on open', () => {
      renderDropdown(<Dropdown options={options} selection search />)
      clickDropdown()

      dropdownInputIsFocused()
    })

    it('sets focus to the search input on click on the placeholder', () => {
      renderDropdown(
        <Dropdown minCharacters={3} options={options} placeholder='foo' selection search />,
      )

      fireEvent.click(getText())

      dropdownInputIsFocused()
    })

    it('sets focus to the search input on click Dropdown when is opened', () => {
      renderDropdown(<Dropdown open options={options} multiple selection search />)
      clickDropdown()

      dropdownInputIsFocused()
    })

    it('clears the search query when an item is selected', () => {
      // search for random item
      const searchQuery = _.sample(options).text

      renderDropdown(<Dropdown options={options} selection search />)

      // open and simulate search
      clickDropdown()
      searchFor(searchQuery)

      // click first item (we searched for exact text)
      fireEvent.click(getItem(0))

      // bye bye search query
      expect(getSearchInput()).toHaveValue('')
    })

    it('opens the menu on change if there is a query and not already open', () => {
      renderDropdown(<Dropdown options={options} selection search />)

      dropdownMenuIsClosed()

      // simulate search
      searchFor(faker.hacker.noun())

      dropdownMenuIsOpen()
    })

    it('does not call onChange on query change', () => {
      const onChange = vi.fn()
      renderDropdown(<Dropdown options={options} selection search onChange={onChange} />)

      // simulate search
      searchFor(faker.hacker.noun())

      expect(onChange).not.toHaveBeenCalled()
    })

    it('filters the items based on display text', () => {
      renderDropdown(<Dropdown options={options} selection search />)

      // search for value yields 0 results
      searchFor(_.sample(options).value)

      // Searching for an item's value did not yield 0 results.
      expect(getItems()).toHaveLength(0)

      // search for text yields 1 result
      searchFor(_.sample(options).text)

      // Searching for an item's text did not yield any results.
      expect(getItems()).toHaveLength(1)
    })

    it('filters the items based on custom search function', () => {
      const searchFunction = vi.fn().mockReturnValue(options.slice(0, 2))
      renderDropdown(<Dropdown options={options} selection search={searchFunction} />)
      const searchQuery = '__nonExistingSearchQuery__'

      // search for value yields 2 results as per our custom search function
      searchFor(searchQuery)

      expect(searchFunction).toHaveBeenCalledWith(options, searchQuery)
      // Searching with custom search function did not yield 2 results.
      expect(getItems()).toHaveLength(2)
    })

    it('sets the selected item to the first search result', () => {
      const testOptions = [
        { value: 'foo', key: 'foo', text: 'foo' },
        { value: 'bar', key: 'bar', text: 'bar' },
        { value: 'baz', key: 'baz', text: 'baz' },
        { value: 'qux', key: 'qux', text: 'qux' },
      ]

      renderDropdown(<Dropdown options={testOptions} selection search />)

      // the first item is selected by default
      // avoid it to prevent false positives
      clickDropdown()
      keyDown('ArrowUp')
      expect(getItem(3)).toHaveClass('selected')

      searchFor('baz')
      expect(getItem(0)).toHaveClass('selected')
    })

    it('still allows moving selection after blur/focus', () => {
      // open, first item is selected
      renderDropdown(<Dropdown options={options} selection search />)

      clickDropdown()
      dropdownMenuIsOpen()

      expect(getItem(0)).toHaveClass('selected')

      // blur, focus, open, move item selection down
      blurDropdown()
      focusDropdown()
      keyDown('ArrowDown')

      expect(getItem(0)).not.toHaveClass('selected')
      expect(getItem(1)).toHaveClass('selected')

      // blur, focus, open, move item selection up
      blurDropdown()
      focusDropdown()
      keyDown('ArrowUp')

      expect(getItem(0)).toHaveClass('selected')
      expect(getItem(1)).not.toHaveClass('selected')
    })

    it('does not close the menu when options are empty', () => {
      renderDropdown(<Dropdown options={options} search selection />)
      clickDropdown()

      searchFor('foo')
      keyDown('Enter')

      dropdownMenuIsOpen()
    })

    it('sets focus to the search input after selection', () => {
      // random item, skip the first as it's selected by default
      const randomIndex = 1 + _.random(options.length - 2)

      renderDropdown(<Dropdown options={options} selection search />)
      clickDropdown()
      fireEvent.click(getItem(randomIndex))

      dropdownMenuIsClosed()
      dropdownInputIsFocused()
    })

    it('sets focus to the dropdown after selection', () => {
      const randomIndex = _.random(options.length - 1)

      renderDropdown(<Dropdown options={options} selection />)
      clickDropdown()
      pressItem(getItem(randomIndex))

      dropdownMenuIsClosed()
      dropdownIsFocused()
    })

    it('does not selected "disabled" item after blur', () => {
      const customOptions = [
        { key: 'foo', text: 'foo', value: 'foo' },
        { key: 'bar', text: 'bar', value: 'bar', disabled: true },
      ]

      renderDropdown(<Dropdown options={customOptions} selection search />)

      focusDropdown()
      dropdownMenuIsOpen()

      searchFor('bar')
      act(() => {
        getSearchInput().blur()
      })
      blurDropdown()

      dropdownMenuIsClosed()
      expect(getDropdown().querySelector('.item.disabled')).not.toHaveClass('selected')
    })
  })

  describe('searchInput', () => {
    it('overrides onChange handler', () => {
      const onInputChange = vi.fn()
      const onSearchChange = vi.fn()

      renderDropdown(
        <Dropdown
          onSearchChange={onSearchChange}
          options={options}
          search
          searchInput={{ onChange: onInputChange }}
        />,
      )

      searchFor(faker.hacker.noun())

      expect(onInputChange).toHaveBeenCalledTimes(1)
      expect(onSearchChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('no results message', () => {
    it('is shown when a search yields no results', () => {
      renderDropdown(<Dropdown options={options} selection search />)

      expect(getDropdown().querySelector('.message')).not.toBeInTheDocument()

      // search for something we know will not exist
      searchFor('_________________')

      expect(getDropdown().querySelector('.message')).toBeInTheDocument()
    })

    it('is not shown on multiple dropdowns with no remaining items', () => {
      // make all the items active so there are no remaining options
      const value = _.map(options, 'value')
      renderDropdown(<Dropdown options={options} selection value={value} multiple />)

      // open the menu
      clickDropdown()
      dropdownMenuIsOpen()

      // confirm there are no items
      expect(getItems()).toHaveLength(0)

      // expect no message
      expect(getDropdown().querySelector('.message')).not.toBeInTheDocument()
    })

    it('uses default noResultsMessage', () => {
      renderDropdown(<Dropdown options={options} selection search />)

      // search for something we know will not exist
      searchFor('_________________')

      expect(getDropdown().querySelector('.message').textContent).toBe('No results found.')
    })

    it('uses custom string for noResultsMessage', () => {
      renderDropdown(
        <Dropdown options={options} selection search noResultsMessage='Something custom' />,
      )

      // search for something we know will not exist
      searchFor('_________________')

      expect(getDropdown().querySelector('.message').textContent).toBe('Something custom')
    })

    it('uses custom component for noResultsMessage', () => {
      renderDropdown(
        <Dropdown
          options={options}
          selection
          search
          noResultsMessage={<span>Something custom</span>}
        />,
      )

      // search for something we know will not exist
      searchFor('_________________')

      expect(getDropdown().querySelector('.message span')).toBeInTheDocument()
    })

    it('uses no noResultsMessage', () => {
      renderDropdown(<Dropdown options={options} selection search noResultsMessage='' />)

      // search for something we know will not exist
      searchFor('_________________')

      expect(getDropdown().querySelector('.message').textContent).toBe('')
    })
    it('is not shown when set to `null`', () => {
      renderDropdown(<Dropdown options={options} selection search noResultsMessage={null} />)

      // search for something we know will not exist
      searchFor('_________________')

      expect(getDropdown().querySelector('.message')).not.toBeInTheDocument()
    })
  })

  describe('placeholder', () => {
    it('is present when defined', () => {
      renderDropdown(<Dropdown options={options} selection placeholder='hi' />)

      expect(getDropdown().querySelector('.default.text')).toBeInTheDocument()
    })
    it('is not present when not defined', () => {
      renderDropdown(<Dropdown options={options} selection />)

      expect(getDropdown().querySelector('.default.text')).not.toBeInTheDocument()
    })
    it('is not present when there is a value', () => {
      renderDropdown(<Dropdown options={options} selection value='hi' placeholder='hi' />)

      expect(getDropdown().querySelector('.default.text')).not.toBeInTheDocument()
    })
    it('is present on a multiple dropdown with an empty value array', () => {
      renderDropdown(<Dropdown options={options} selection multiple placeholder='hi' />)

      expect(getDropdown().querySelector('.default.text')).toBeInTheDocument()
    })
    it('has a filtered className when there is a search query', () => {
      renderDropdown(<Dropdown options={options} selection search placeholder='hi' />)

      searchFor('a')
      expect(getDropdown().querySelector('.default.text.filtered')).toBeInTheDocument()
    })
  })

  describe('render', () => {
    it('renders the text', () => {
      const { rerender } = renderDropdown(<Dropdown options={options} selection />)

      expect(getText()).not.toBeInTheDocument()

      rerender(<Dropdown options={options} selection text='foo' />)

      expect(getText().textContent).toBe('foo')
    })
  })

  describe('lazyLoad', () => {
    it('does not render options when closed', () => {
      renderDropdown(<Dropdown options={options} lazyLoad />)

      expect(getItems()).toHaveLength(0)
    })

    it('renders options when open', () => {
      renderDropdown(<Dropdown options={options} lazyLoad open />)

      expect(getItems()).toHaveLength(options.length)
    })
  })

  describe('Dropdown.Menu child', () => {
    it('renders child passed', () => {
      renderDropdown(
        <Dropdown text='required prop'>
          <Dropdown.Menu data-find-me />
        </Dropdown>,
      )

      expect(getMenu()).toBeInTheDocument()
      expect(getMenu()).toHaveAttribute('data-find-me', 'true')
    })

    it('opens on click', () => {
      renderDropdown(
        <Dropdown text='required prop'>
          <Dropdown.Menu />
        </Dropdown>,
      )

      dropdownMenuIsClosed()
      clickDropdown()
      dropdownMenuIsOpen()
    })

    it('spreads extra menu props', () => {
      renderDropdown(
        <Dropdown text='required prop'>
          <Dropdown.Menu data-foo-bar />
        </Dropdown>,
      )

      expect(getMenu()).toBeInTheDocument()
      expect(getMenu()).toHaveAttribute('data-foo-bar', 'true')
    })

    it("merges the user's menu className", () => {
      renderDropdown(
        <Dropdown text='required prop'>
          <Dropdown.Menu className='foo-bar' />
        </Dropdown>,
      )

      const menu = getMenu()

      expect(menu).toBeInTheDocument()
      expect(menu).toHaveClass('menu')
      expect(menu).toHaveClass('foo-bar')
    })
  })

  describe('allowAdditions', () => {
    const customOptions = [
      { text: 'abra', value: 'abra' },
      { text: 'cadabra', value: 'cadabra' },
      { text: 'bang', value: 'bang' },
    ]

    // An addition item renders "<additionLabel><b>{searchQuery}</b>" and uses the query as value
    const expectAdditionItem = (item, query) => {
      expect(item).toHaveClass('addition')
      expect(item).toHaveAttribute('data-additional', 'true')
      expect(item.querySelector('b').textContent).toBe(query)
    }

    it('adds an option for arbitrary search value', () => {
      const onChange = vi.fn()
      renderDropdown(
        <Dropdown options={customOptions} selection search allowAdditions onChange={onChange} />,
      )

      expect(getItems()).toHaveLength(3)

      searchFor('boo')

      expect(getItems()).toHaveLength(1)
      expectAdditionItem(getItem(0), 'boo')

      fireEvent.click(getItem(0))
      expect(onChange).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ value: 'boo' }),
      )
    })

    it('adds an option for prefix search value', () => {
      const onChange = vi.fn()
      renderDropdown(
        <Dropdown options={customOptions} selection search allowAdditions onChange={onChange} />,
      )

      expect(getItems()).toHaveLength(3)

      searchFor('a')

      expect(getItems()).toHaveLength(4)
      expectAdditionItem(getItem(0), 'a')

      fireEvent.click(getItem(0))
      expect(onChange).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ value: 'a' }),
      )
    })

    it('uses default additionLabel', () => {
      renderDropdown(<Dropdown options={customOptions} selection search allowAdditions />)

      searchFor('boo')

      expect(getItems()).toHaveLength(1)
      expect(getLastItem()).toHaveClass('addition')

      const text = getItem(0).querySelector('.text')

      expect(text.textContent).toBe('Add boo')
      expect(text.childNodes[0].nodeValue).toBe('Add ')
      expect(text.childNodes[1].tagName).toBe('B')
      expect(text.childNodes[1].textContent).toBe('boo')
    })

    it('uses custom additionLabel string', () => {
      renderDropdown(
        <Dropdown options={customOptions} selection search allowAdditions additionLabel='New: ' />,
      )

      searchFor('boo')

      expect(getItems()).toHaveLength(1)
      expect(getLastItem()).toHaveClass('addition')

      const text = getItem(0).querySelector('.text')

      expect(text.childNodes[0].nodeValue).toBe('New: ')
      expect(text.childNodes[1].tagName).toBe('B')
      expect(text.childNodes[1].textContent).toBe('boo')
    })

    it('uses custom additionLabel element', () => {
      renderDropdown(
        <Dropdown
          options={customOptions}
          selection
          search
          allowAdditions
          additionLabel={<i>New: </i>}
        />,
      )

      searchFor('boo')

      expect(getItems()).toHaveLength(1)
      expect(getLastItem()).toHaveClass('addition')

      const text = getItem(0).querySelector('.text')

      expect(text.childNodes[0].tagName).toBe('I')
      expect(text.childNodes[0].textContent).toBe('New: ')

      expect(text.childNodes[1].tagName).toBe('B')
      expect(text.childNodes[1].textContent).toBe('boo')
    })

    it('uses no additionLabel', () => {
      renderDropdown(
        <Dropdown options={customOptions} selection search allowAdditions additionLabel='' />,
      )

      searchFor('boo')

      expect(getItems()).toHaveLength(1)
      expect(getLastItem()).toHaveClass('addition')

      const text = getItem(0).querySelector('.text')

      // the empty label renders nothing besides the query
      expect(text.textContent).toBe('boo')
      expect(text.children).toHaveLength(1)
      expect(text.children[0].tagName).toBe('B')
      expect(text.children[0].textContent).toBe('boo')
    })

    it('keeps custom value option (bottom) when options change', () => {
      const { rerender } = renderDropdown(
        <Dropdown
          options={customOptions}
          selection
          search
          allowAdditions
          additionPosition='bottom'
        />,
      )

      searchFor('a')

      expect(getItems()).toHaveLength(4)
      expectAdditionItem(getLastItem(), 'a')

      rerender(
        <Dropdown
          options={[...customOptions, { text: 'bar', value: 'bar' }]}
          selection
          search
          allowAdditions
          additionPosition='bottom'
        />,
      )

      expect(getItems()).toHaveLength(5)
      expectAdditionItem(getLastItem(), 'a')
    })

    it('keeps custom value option (top) when options change', () => {
      const { rerender } = renderDropdown(
        <Dropdown options={customOptions} selection search allowAdditions />,
      )

      searchFor('a')

      expect(getItems()).toHaveLength(4)
      expectAdditionItem(getItem(0), 'a')

      rerender(
        <Dropdown
          options={[...customOptions, { text: 'bar', value: 'bar' }]}
          selection
          search
          allowAdditions
        />,
      )

      expect(getItems()).toHaveLength(5)
      expectAdditionItem(getItem(0), 'a')
    })

    it('calls onAddItem prop when clicking new value', () => {
      const onAddItem = vi.fn()
      const onChange = vi.fn()
      renderDropdown(
        <Dropdown
          allowAdditions
          onAddItem={onAddItem}
          onChange={onChange}
          options={customOptions}
          search
          selection
        />,
      )

      searchFor('boo')

      fireEvent.click(getItem(0))

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onAddItem).toHaveBeenCalledTimes(1)
      expect(onAddItem).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ value: 'boo' }),
      )
      // onAddItem is called immediately after onChange
      expect(onAddItem.mock.invocationCallOrder[0]).toBe(onChange.mock.invocationCallOrder[0] + 1)
    })

    it('calls onAddItem prop when pressing enter on new value', () => {
      const onAddItem = vi.fn()
      const onChange = vi.fn()

      renderDropdown(
        <Dropdown
          allowAdditions
          onAddItem={onAddItem}
          onChange={onChange}
          options={customOptions}
          search
          selection
        />,
      )

      searchFor('boo')
      keyDown('Enter', getSearchInput())

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onAddItem).toHaveBeenCalledTimes(1)
      expect(onAddItem).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ value: 'boo' }),
      )
      // onAddItem is called immediately after onChange
      expect(onAddItem.mock.invocationCallOrder[0]).toBe(onChange.mock.invocationCallOrder[0] + 1)
    })

    it('clears value of the searchQuery when selection is only option', () => {
      renderDropdown(<Dropdown options={customOptions} selection search allowAdditions />)

      searchFor('boo')
      keyDown('Enter', getSearchInput())

      expect(getSearchInput()).toHaveValue('')
    })
  })

  describe('header', () => {
    it('renders a header when present', () => {
      const text = faker.hacker.phrase()

      renderDropdown(<Dropdown options={options} header={text} />)

      expect(getDropdown().querySelector('.menu .header')).toHaveTextContent(text)
    })
    it('does not render a header when not present', () => {
      renderDropdown(<Dropdown options={options} />)

      expect(getDropdown().querySelector('.menu .header')).not.toBeInTheDocument()
    })
  })

  describe('value validations', () => {
    it('logs an error if dropdown is not multiple and value is array', () => {
      consoleUtil.disableOnce()
      const spy = vi.spyOn(console, 'error')

      const originalValue = _.pick(options, 'value')[0]
      const nextValue = _.castArray(_.pick(options, 'value')[1])

      const { rerender } = renderDropdown(
        <Dropdown options={options} value={originalValue} selection />,
      )
      rerender(<Dropdown options={options} value={nextValue} selection />)

      const errorMessage =
        'Dropdown `value` must not be an array when `multiple` is not set.' +
        ' Either set `multiple={true}` or use a string or number value.'

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(errorMessage)
    })

    it('logs an error if dropdown is multiple and value not array', () => {
      consoleUtil.disableOnce()
      const spy = vi.spyOn(console, 'error')

      const originalValue = _.castArray(_.pick(options, 'value')[0])
      const nextValue = _.pick(options, 'value')[1]

      const { rerender } = renderDropdown(
        <Dropdown options={options} value={originalValue} selection multiple />,
      )
      rerender(<Dropdown options={options} value={nextValue} selection multiple />)

      const errorMessage =
        'Dropdown `value` must be an array when `multiple` is set.' +
        ` Received type: \`${Object.prototype.toString.call(nextValue)}\`.`

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(errorMessage)
    })
  })

  describe('selectOnNavigation', () => {
    it('is on by default', () => {
      const onChange = vi.fn()

      renderDropdown(
        <Dropdown options={options} defaultValue={options[0].value} onChange={onChange} />,
      )

      // open
      clickDropdown()
      keyDown('ArrowDown')

      expect(onChange).toHaveBeenCalled()
      expect(getItem(1)).toHaveClass('active')
    })

    it('does not change value when set to false', () => {
      const onChange = vi.fn()
      const value = options[0].value

      renderDropdown(
        <Dropdown
          options={options}
          defaultValue={value}
          selectOnNavigation={false}
          onChange={onChange}
        />,
      )

      // open
      clickDropdown()
      keyDown('ArrowDown')

      expect(onChange).not.toHaveBeenCalled()
      expect(getItem(0)).toHaveClass('active')
    })
  })

  describe('wrapSelection', () => {
    it("does not move up on arrow up when first item is selected when open and 'wrapSelection' is false", () => {
      renderDropdown(<Dropdown options={options} selection wrapSelection={false} />)

      // open
      clickDropdown()
      expect(getItem(0)).toHaveClass('selected')

      // arrow up
      keyDown('ArrowUp')

      // selection should not move to last item
      // should keep on first instead
      expect(getItem(0)).toHaveClass('selected')
      expect(getItem(options.length - 1)).not.toHaveClass('selected')
    })
    it("does not move down on arrow down when last item is selected when open and 'wrapSelection' is false", () => {
      renderDropdown(<Dropdown options={options} selection wrapSelection={false} />)

      // open and make last item selected
      clickDropdown()
      keyDown('ArrowDown')
      keyDown('ArrowDown')
      keyDown('ArrowDown')
      keyDown('ArrowDown')

      expect(getItem(options.length - 1)).toHaveClass('selected')

      // selection should not move to first item, should keep on last instead
      keyDown('ArrowDown')
      expect(getItem(0)).not.toHaveClass('selected')
      expect(getItem(options.length - 1)).toHaveClass('selected')
    })
  })

  describe('upward', () => {
    it('is false when there is enough space below', () => {
      renderDropdown(<Dropdown options={options} />)
      clickDropdown()

      expect(getDropdown()).not.toHaveClass('upward')
    })

    it('is true when there is not enough space below', () => {
      // A 600px high viewport with a dropdown at 500px, its 200px high menu does not fit below
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
        return this.classList.contains('dropdown') ? { top: 500, height: 30 } : {}
      })
      vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(function () {
        if (this === document.documentElement) return 600
        return this.classList.contains('menu') ? 200 : 0
      })

      renderDropdown(<Dropdown options={options} />)
      clickDropdown()

      expect(getDropdown()).toHaveClass('upward')
    })
  })
})
