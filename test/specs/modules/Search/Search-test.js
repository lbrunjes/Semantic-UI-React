import { fireEvent, render } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import { htmlInputAttrs } from 'src/lib'
import Search from 'src/modules/Search'
import SearchCategory from 'src/modules/Search/SearchCategory'
import SearchResult from 'src/modules/Search/SearchResult'
import SearchResults from 'src/modules/Search/SearchResults'
import * as common from 'test/specs/commonTests'
import { consoleUtil, domEvent } from 'test/utils'
import faker from 'test/utils/faker'

let options
let root
let rerenderSearch

// ----------------------------------------
// Render
// ----------------------------------------
// RTL unmounts after every test, so all event listeners are cleaned up
const renderSearch = (element) => {
  const { container, rerender } = render(element)

  root = container.firstElementChild
  rerenderSearch = rerender

  return root
}

// ----------------------------------------
// Options
// ----------------------------------------
const getOptions = (count = 5) =>
  _.times(count, (i) => ({
    title: [i, ..._.times(3, faker.hacker.noun)].join(' '),
    description: [i, ..._.times(3, faker.hacker.noun)].join(' '),
    image: '/images/wireframe/image.png',
    price: [i, faker.finance.amount(0, 100, 2, '$')].join(' '),
  }))

// ----------------------------------------
// Queries
// ----------------------------------------
const getMenu = () => root.querySelector('.results.transition')
const getResults = () => root.querySelectorAll('.result')
const getCategories = () => root.querySelectorAll('.category')
const getInput = () => root.querySelector('input')

// -------------------------------
// Common Assertions
// -------------------------------
const searchResultsIsClosed = () => {
  expect(root).not.toHaveClass('visible')

  const menu = getMenu()
  if (menu) expect(menu).not.toHaveClass('visible')
}

const searchResultsIsOpen = () => {
  expect(root).toHaveClass('active')
  expect(root).toHaveClass('visible')
  expect(getMenu()).toHaveClass('visible')
}

// ----------------------------------------
// Helpers
// ----------------------------------------
const openSearchResults = () => {
  fireEvent.focus(root)
}

describe('Search', () => {
  beforeEach(() => {
    root = undefined
    rerenderSearch = undefined
    options = getOptions()
  })

  common.isConformant(Search)
  common.forwardsRef(Search)
  common.hasSubcomponents(Search, [SearchCategory, SearchResult, SearchResults])
  common.hasUIClassName(Search)

  common.propKeyOnlyToClassName(Search, 'category')
  common.propKeyOnlyToClassName(Search, 'fluid')
  common.propKeyOnlyToClassName(Search, 'loading')

  it('closes on blur', () => {
    renderSearch(<Search results={options} minCharacters={0} />)

    openSearchResults()

    searchResultsIsOpen()
    fireEvent.blur(root)
    searchResultsIsClosed()
  })

  it('opens on focus', () => {
    renderSearch(<Search results={options} minCharacters={0} />)

    searchResultsIsClosed()
    fireEvent.focus(root)
    searchResultsIsOpen()
  })

  describe('isMouseDown', () => {
    it('tracks when the mouse is down', () => {
      // To understand this test please check componentDidUpdate() on Search component
      renderSearch(<Search minCharacters={0} />)
      searchResultsIsClosed()

      // When ".isMouseDown === false" a focus event will not open Search results
      fireEvent.mouseDown(root)
      fireEvent.focus(root)
      searchResultsIsClosed()

      // Reset to default component state
      fireEvent.blur(root)
      domEvent.mouseUp(document.body)

      // When ".isMouseDown === true" a focus event will open Search results
      fireEvent.focus(root)
      searchResultsIsOpen()
    })
  })

  describe('icon', () => {
    it('defaults to a search icon', () => {
      expect(renderSearch(<Search />).querySelector('.search.icon')).toBeInTheDocument()
    })
  })

  describe('active item', () => {
    it('defaults to no result active', () => {
      expect(
        renderSearch(<Search results={options} minCharacters={0} />).querySelector(
          '.result.active',
        ),
      ).not.toBeInTheDocument()
    })
    it('defaults to the first item with selectFirstResult', () => {
      renderSearch(<Search results={options} minCharacters={0} selectFirstResult />)

      expect(getResults()[0]).toHaveClass('active')
    })
    it('moves down on arrow down when open', () => {
      renderSearch(<Search results={options} minCharacters={0} selectFirstResult />)

      // open
      openSearchResults()
      searchResultsIsOpen()

      // arrow to second
      domEvent.keyDown(document, { key: 'ArrowDown' })

      // selection moved to second item
      expect(getResults()[0]).not.toHaveClass('active')
      expect(getResults()[1]).toHaveClass('active')
    })
    it('moves up on arrow up when open', () => {
      renderSearch(<Search results={options} minCharacters={0} />)

      // open
      openSearchResults()
      searchResultsIsOpen()

      // arrow up
      domEvent.keyDown(document, { key: 'ArrowUp' })

      // selection moved to last item
      expect(getResults()[0]).not.toHaveClass('active')
      expect(getResults()[options.length - 1]).toHaveClass('active')
    })
    it('scrolls the selected item into view', () => {
      // get enough options to make the menu scrollable
      const opts = getOptions(20)
      const itemHeight = 50
      const menuHeight = 100

      // jsdom has no layout: every result is "itemHeight" high, the menu is "menuHeight" high
      vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function () {
        if (!this.classList.contains('result')) return 0
        return Array.from(this.parentNode.children).indexOf(this) * itemHeight
      })
      vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(function () {
        if (this.classList.contains('result')) return itemHeight
        if (this.classList.contains('results')) return menuHeight
        return 0
      })

      renderSearch(<Search results={opts} minCharacters={0} selectFirstResult />)

      openSearchResults()
      searchResultsIsOpen()
      const menu = document.querySelector('.ui.search .results.visible')
      const scrollHeight = opts.length * itemHeight
      let scrollTop = 0

      // a scrollable menu
      Object.defineProperty(menu, 'scrollHeight', { configurable: true, value: scrollHeight })
      Object.defineProperty(menu, 'scrollTop', {
        configurable: true,
        get: () => scrollTop,
        set: (value) => {
          scrollTop = value
        },
      })

      //
      // Scrolls to bottom
      //

      // make sure first item is selected
      expect(root.querySelector('.result.active')).toHaveTextContent(opts[0].title)

      // wrap selection to last item
      domEvent.keyDown(document, { key: 'ArrowUp' })

      // make sure last item is selected
      expect(root.querySelector('.result.active')).toHaveTextContent(_.last(opts).title)

      // menu should be completely scrolled to the bottom
      // When the last item in the list was selected, SearchResults should scroll to bottom.
      expect(menu.scrollTop + menu.clientHeight).toBe(menu.scrollHeight)

      //
      // Scrolls back to top
      //

      // wrap selection to first item
      domEvent.keyDown(document, { key: 'ArrowDown' })

      // make sure first item is selected
      expect(root.querySelector('.result.active')).toHaveTextContent(opts[0].title)

      // When the first item in the list was selected, SearchResults should scroll to top.
      const selectedItem = document.querySelector('.ui.search .results.visible .result.active')
      expect(menu.scrollTop).toBe(selectedItem.offsetTop)
      expect(menu.scrollTop).toBe(0)
    })
    it('closes the menu', () => {
      renderSearch(<Search results={options} minCharacters={0} selectFirstResult />)

      openSearchResults()
      searchResultsIsOpen()

      // choose an item closes
      domEvent.keyDown(document, { key: 'Enter' })
      searchResultsIsClosed()
    })
    it('uses custom renderer', () => {
      const resultSpy = vi.fn(() => <div className='custom-result' />)
      renderSearch(<Search results={options} minCharacters={0} resultRenderer={resultSpy} />)

      expect(resultSpy).toHaveBeenCalledTimes(options.length)

      expect(root.querySelector('.result .custom-result')).toBeInTheDocument()
    })
  })

  describe('category', () => {
    const categoryLength = 3
    const categoryResultsLength = 5
    const categoryOptions = _.range(0, categoryLength).reduce((memo, index) => {
      const category = `${faker.hacker.noun()}-${index}`

      memo[category] = {
        name: category,
        results: getOptions(categoryResultsLength),
      }

      return memo
    }, {})

    it('defaults to the first item with selectFirstResult', () => {
      renderSearch(
        <Search results={categoryOptions} category minCharacters={0} selectFirstResult />,
      )

      expect(getCategories()[0]).toHaveClass('active')
      expect(getResults()[0]).toHaveClass('active')
    })
    it('moves down on arrow down when open', () => {
      renderSearch(
        <Search results={categoryOptions} category minCharacters={0} selectFirstResult />,
      )

      // open
      openSearchResults()
      searchResultsIsOpen()

      // arrow to new category
      _.times(categoryResultsLength, () => domEvent.keyDown(document, { key: 'ArrowDown' }))

      // selection moved to second item
      expect(getCategories()[0]).not.toHaveClass('active')
      expect(getResults()[0]).not.toHaveClass('active')
      expect(getCategories()[1]).toHaveClass('active')
      expect(getResults()[categoryResultsLength]).toHaveClass('active')
    })
    it('moves up on arrow up when open', () => {
      renderSearch(<Search results={categoryOptions} category minCharacters={0} />)

      // open
      openSearchResults()
      searchResultsIsOpen()

      // arrow up
      domEvent.keyDown(document, { key: 'ArrowUp' })

      // selection moved to last item
      expect(getCategories()[0]).not.toHaveClass('active')
      expect(getResults()[0]).not.toHaveClass('active')
      expect(getCategories()[categoryLength - 1]).toHaveClass('active')
      expect(getResults()[categoryLength * categoryResultsLength - 1]).toHaveClass('active')
    })
    it('uses custom renderer', () => {
      const categorySpy = vi.fn(() => <div className='custom-category' />)
      const resultSpy = vi.fn(() => <div className='custom-result' />)
      renderSearch(
        <Search
          results={categoryOptions}
          category
          minCharacters={0}
          categoryRenderer={categorySpy}
          resultRenderer={resultSpy}
        />,
      )

      // Heads up! The Enzyme renderer called it once more, there is one call per category
      expect(categorySpy).toHaveBeenCalledTimes(categoryLength)
      expect(resultSpy).toHaveBeenCalledTimes(categoryLength * categoryResultsLength)

      expect(root.querySelector('.category .name .custom-category')).toBeInTheDocument()
      expect(root.querySelector('.result .custom-result')).toBeInTheDocument()
    })
    it('uses default noResultsMessage', () => {
      renderSearch(<Search results={[]} category minCharacters={0} />)

      expect(root.querySelector('.message.empty').textContent).toBe('No results found.')
    })
    it('closes the menu', () => {
      renderSearch(
        <Search results={categoryOptions} category minCharacters={0} selectFirstResult />,
      )

      openSearchResults()
      searchResultsIsOpen()

      // choose an item closes
      domEvent.keyDown(document, { key: 'Enter' })
      searchResultsIsClosed()
    })
  })

  describe('value', () => {
    it('updates text when value changed', () => {
      const initialValue = faker.hacker.noun()
      const nextValue = faker.hacker.noun()

      renderSearch(<Search results={options} minCharacters={0} value={initialValue} />)
      expect(root.querySelector('.prompt')).toHaveValue(initialValue)

      rerenderSearch(<Search results={options} minCharacters={0} value={nextValue} />)
      expect(root.querySelector('.prompt')).toHaveValue(nextValue)
    })
  })

  describe('results menu', () => {
    it('opens after min characters', () => {
      const title = options[0].title
      renderSearch(<Search results={options} minCharacters={2} />)
      fireEvent.focus(root)

      searchResultsIsClosed()

      fireEvent.change(root.querySelector('input.prompt'), {
        target: { value: title.slice(0, 1) },
      })
      searchResultsIsClosed()

      fireEvent.change(root.querySelector('input.prompt'), {
        target: { value: title.slice(0, 2) },
      })
      searchResultsIsOpen()
    })

    it('opens (and remains open) when clicking the input', () => {
      renderSearch(<Search results={options} minCharacters={0} />)

      const prompt = root.querySelector('input.prompt')

      fireEvent.click(prompt)
      searchResultsIsOpen()

      // Stays open after multiple clicks on the input
      fireEvent.click(prompt)
      searchResultsIsOpen()
    })

    it('closes on menu item click', () => {
      renderSearch(<Search results={options} minCharacters={0} />)
      const item = getResults()[_.random(options.length - 1)]

      // open
      openSearchResults()
      searchResultsIsOpen()

      // select item
      fireEvent.click(item)
      searchResultsIsClosed()
    })

    it('blurs after menu item click (mousedown)', () => {
      renderSearch(<Search results={options} minCharacters={0} />)
      const item = getResults()[_.random(options.length - 1)]

      // open
      openSearchResults()
      searchResultsIsOpen()

      // select item
      fireEvent.mouseDown(item)
      searchResultsIsOpen()
      fireEvent.click(item)
      searchResultsIsClosed()
    })

    it('closes on click outside', () => {
      renderSearch(<Search results={options} minCharacters={0} />)

      // open
      openSearchResults()
      searchResultsIsOpen()

      // click outside
      domEvent.click(document.body)
      searchResultsIsClosed()
    })

    it('closes on esc key', () => {
      renderSearch(<Search results={options} minCharacters={0} />)

      // open
      openSearchResults()
      searchResultsIsOpen()

      // esc
      domEvent.keyDown(document, { key: 'Escape' })
      searchResultsIsClosed()
    })
  })

  describe('open', () => {
    it('defaultOpen opens the menu when true', () => {
      renderSearch(<Search results={options} minCharacters={0} defaultOpen />)
      searchResultsIsOpen()
    })
    it('defaultOpen stays open on focus', () => {
      renderSearch(<Search results={options} minCharacters={0} defaultOpen />)
      fireEvent.focus(root)
      searchResultsIsOpen()
    })
    it('defaultOpen closes the menu when false', () => {
      renderSearch(<Search results={options} minCharacters={0} defaultOpen={false} />)
      searchResultsIsClosed()
    })
    it('opens the menu when true', () => {
      renderSearch(<Search results={options} minCharacters={0} open />)
      searchResultsIsOpen()
    })
    it('closes the menu when false', () => {
      renderSearch(<Search results={options} minCharacters={0} open={false} />)
      searchResultsIsClosed()
    })
    it('closes the menu when toggled from true to false', () => {
      renderSearch(<Search results={options} minCharacters={0} open />)
      rerenderSearch(<Search results={options} minCharacters={0} open={false} />)
      searchResultsIsClosed()
    })
    it('opens the menu when toggled from false to true', () => {
      renderSearch(<Search results={options} minCharacters={0} open={false} />)
      rerenderSearch(<Search results={options} minCharacters={0} open />)
      searchResultsIsOpen()
    })
  })

  describe('onBlur', () => {
    it('is called with (event, data) on search input blur', () => {
      const onBlur = vi.fn()
      renderSearch(<Search results={options} onBlur={onBlur} />)
      fireEvent.blur(root)

      expect(onBlur).toHaveBeenCalledTimes(1)
      expect(onBlur).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'blur' }),
        expect.objectContaining({ onBlur, results: options }),
      )
    })

    it('is not called on an item click', () => {
      const onBlur = vi.fn()
      renderSearch(<Search results={options} onBlur={onBlur} />)

      openSearchResults()
      fireEvent.click(getResults()[0])
      expect(onBlur).not.toHaveBeenCalled()
    })
  })

  describe('onFocus', () => {
    it('is called with (event, data) on search input focus', () => {
      const onFocus = vi.fn()
      renderSearch(<Search results={options} onFocus={onFocus} />)
      fireEvent.focus(root)

      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(onFocus).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'focus' }),
        expect.objectContaining({ onFocus, results: options }),
      )
    })
  })

  describe('onResultSelect', () => {
    let spy
    beforeEach(() => {
      spy = vi.fn()
    })

    it('is called with event and value on item click', () => {
      const randomIndex = _.random(options.length - 1)
      const randomResult = options[randomIndex]
      renderSearch(<Search results={options} minCharacters={0} onResultSelect={spy} />)

      // open
      openSearchResults()
      searchResultsIsOpen()

      fireEvent.click(getResults()[randomIndex])

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          minCharacters: 0,
          result: randomResult,
          results: options,
        }),
      )
    })
    it('is called with event and value when pressing enter on a selected item', () => {
      const firstResult = options[0]
      renderSearch(
        <Search results={options} minCharacters={0} onResultSelect={spy} selectFirstResult />,
      )

      // open
      openSearchResults()
      searchResultsIsOpen()

      domEvent.keyDown(document, { key: 'Enter' })

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ result: firstResult }),
      )
    })
    it('is not called when updating the value prop', () => {
      const value = _.sample(options).title
      const next = _.sample(_.without(options, value)).title

      renderSearch(
        <Search results={options} minCharacters={0} value={value} onResultSelect={spy} />,
      )
      rerenderSearch(
        <Search results={options} minCharacters={0} value={next} onResultSelect={spy} />,
      )

      expect(spy).not.toHaveBeenCalled()
    })
    it('does not call onResultSelect on query change', () => {
      const onResultSelectSpy = vi.fn()
      renderSearch(
        <Search results={options} minCharacters={0} onResultSelect={onResultSelectSpy} />,
      )

      // simulate search
      fireEvent.change(root.querySelector('input.prompt'), {
        target: { value: faker.hacker.noun() },
      })

      expect(onResultSelectSpy).not.toHaveBeenCalled()
    })
  })

  describe('onSearchChange', () => {
    it('is called with (event, value) on search input change', () => {
      const spy = vi.fn()
      renderSearch(<Search results={options} minCharacters={0} onSearchChange={spy} />)
      fireEvent.change(root.querySelector('input.prompt'), { target: { value: 'a' } })

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ target: expect.objectContaining({ value: 'a' }) }),
        expect.objectContaining({
          minCharacters: 0,
          results: options,
          value: 'a',
        }),
      )
    })
  })

  describe('onSelectionChange', () => {
    it('is called with (event, data) when the active selection index is changed', () => {
      const onSelectionChange = vi.fn()

      renderSearch(
        <Search
          minCharacters={0}
          onSelectionChange={onSelectionChange}
          results={options}
          selectFirstResult
        />,
      )
      openSearchResults()
      domEvent.keyDown(document, { key: 'ArrowDown' })

      expect(onSelectionChange).toHaveBeenCalledTimes(1)
      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          minCharacters: 0,
          result: options[1],
          results: options,
        }),
      )
    })
  })

  describe('results prop', () => {
    it('adds the onClick handler to all items', () => {
      const onResultSelect = vi.fn()
      renderSearch(<Search results={options} minCharacters={0} onResultSelect={onResultSelect} />)

      getResults().forEach((item, index) => {
        fireEvent.click(item)

        expect(onResultSelect).toHaveBeenCalledTimes(index + 1)
        expect(onResultSelect).toHaveBeenLastCalledWith(
          expect.any(Object),
          expect.objectContaining({ result: options[index] }),
        )
      })
    })

    it('renders new options when options change', () => {
      const customOptions = [
        { title: 'abra', description: 'abra' },
        { title: 'cadabra', description: 'cadabra' },
        { title: 'bang', description: 'bang' },
      ]
      renderSearch(<Search results={customOptions} />)

      expect(getResults()).toHaveLength(3)

      rerenderSearch(<Search results={[...customOptions, { title: 'bar', description: 'bar' }]} />)

      expect(getResults()).toHaveLength(4)

      const newItem = _.last(getResults())

      expect(newItem.querySelector('.title')).toHaveTextContent('bar')
      expect(newItem.querySelector('.description')).toHaveTextContent('bar')
    })

    it('passes options as props', () => {
      const customOptions = [
        { title: 'abra', description: 'abra', 'data-foo': 'someValue' },
        { title: 'cadabra', description: 'cadabra', 'data-foo': 'someValue' },
        { title: 'bang', description: 'bang', 'data-foo': 'someValue' },
      ]
      renderSearch(<Search results={customOptions} />)

      expect(getResults()).toHaveLength(3)
      getResults().forEach((item) => expect(item).toHaveAttribute('data-foo', 'someValue'))
    })
    it('ignores search value', () => {
      renderSearch(<Search results={options} minCharacters={0} selectFirstResult />)

      openSearchResults()
      searchResultsIsOpen()

      // search for something we know will not exist
      fireEvent.change(root.querySelector('input.prompt'), {
        target: { value: '_________________' },
      })

      expect(getResults()).toHaveLength(options.length)
    })
  })

  describe('no results message', () => {
    it('is shown when there are no results', () => {
      renderSearch(<Search results={options} minCharacters={0} />)

      expect(root.querySelector('.message.empty')).not.toBeInTheDocument()

      rerenderSearch(<Search results={[]} minCharacters={0} />)

      expect(root.querySelector('.message.empty')).toBeInTheDocument()
    })
    it('uses default noResultsMessage', () => {
      renderSearch(<Search results={[]} minCharacters={0} />)

      expect(root.querySelector('.message.empty .header').textContent).toBe('No results found.')
    })
    it('uses custom string for noResultsMessage', () => {
      renderSearch(<Search results={[]} minCharacters={0} noResultsMessage='Something custom' />)

      expect(root.querySelector('.message.empty .header').textContent).toBe('Something custom')
    })
    it('uses custom component for noResultsMessage', () => {
      renderSearch(<Search results={[]} minCharacters={0} noResultsMessage={<span>Test</span>} />)

      expect(root.querySelector('.message.empty .header span')).toBeInTheDocument()
    })
    it('uses custom noResultsDescription if present', () => {
      renderSearch(
        <Search results={[]} minCharacters={0} noResultsDescription='Something custom' />,
      )

      expect(root.querySelector('.message.empty .header').textContent).toBe('No results found.')
      expect(root.querySelector('.message.empty .description').textContent).toBe('Something custom')
    })
    it('uses no noResultsMessage', () => {
      renderSearch(<Search results={[]} minCharacters={0} noResultsMessage='' />)

      expect(root.querySelector('.message.empty .header').textContent).toBe('')
    })
    it('shows no message with showNoResults=false', () => {
      renderSearch(<Search results={[]} minCharacters={0} showNoResults={false} />)

      expect(root.querySelector('.message.empty')).not.toBeInTheDocument()
    })
  })

  describe('input', () => {
    it(`merges nested shorthand props for the <input>`, () => {
      renderSearch(<Search input={{ input: { className: 'foo', tabIndex: '-1' } }} />)
      const input = getInput()

      expect(input).toHaveAttribute('tabindex', '-1')
      expect(input).toHaveClass('foo')
      expect(input).toHaveClass('prompt')
    })

    it(`will not merge for a function`, () => {
      // TODO: V4 remove this test and simplify the implementation
      consoleUtil.disableOnce()

      renderSearch(<Search input={{ input: (Component, props) => <Component {...props} /> }} />)
      const input = getInput()

      expect(input).toHaveAttribute('autocomplete', 'off')
      expect(input).not.toHaveClass('prompt')
    })

    it(`"placeholder" in passed to an "input"`, () => {
      renderSearch(<Search placeholder='foo' />)

      expect(getInput()).toHaveAttribute('placeholder', 'foo')
    })
  })

  describe('input props', () => {
    // Search handles some of html props
    const props = _.without(htmlInputAttrs, 'defaultValue', 'type')
    const booleanProps = ['disabled']

    // Props that React sets as DOM properties (not attributes) or that have a side effect
    const propertyAssertions = {
      autoFocus: (input) => expect(input).toHaveFocus(),
      checked: (input) => expect(input.checked).toBe(true),
      defaultChecked: (input) => expect(input.defaultChecked).toBe(true),
      // <input> has no native "selected": React <= 18 sets it as a DOM property, React 19 as an attribute
      selected: (input, propValue) =>
        expect(input.selected ?? input.getAttribute('selected')).toBe(propValue),
      value: (input, propValue) => expect(input).toHaveValue(propValue),
    }
    // Boolean HTML attributes are rendered without a value
    const booleanAttributes = ['disabled', 'multiple', 'readOnly', 'required']

    props.forEach((propName) => {
      it(`passes "${propName}" to the <input>`, () => {
        const propValue = _.includes(booleanProps, propName) ? true : 'off'

        renderSearch(<Search {...{ [propName]: propValue }} />)
        const input = getInput()

        if (propertyAssertions[propName]) {
          propertyAssertions[propName](input, propValue)
        } else if (_.includes(booleanAttributes, propName)) {
          expect(input).toHaveAttribute(propName.toLowerCase())
        } else {
          expect(input).toHaveAttribute(propName.toLowerCase(), propValue)
        }

        // the prop is passed to the <input>, not to the root element
        expect(root).not.toHaveAttribute(propName.toLowerCase())
      })
    })
  })
})
