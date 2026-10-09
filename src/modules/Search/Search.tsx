import * as React from 'react'

import {
  cx,
  keyboardKey,
  ModernAutoControlledComponent as Component,
  eventStack,
  getComponentType,
  getUnhandledProps,
  htmlInputAttrs,
  isBrowser,
  partitionHTMLProps,
  shallowEqual,
  getKeyOnly,
  getValueAndKey,
} from '../../lib'
import Input from '../../elements/Input'
import SearchCategory from './SearchCategory'
import SearchCategoryLayout from './SearchCategoryLayout'
import SearchResult from './SearchResult'
import SearchResults from './SearchResults'
import { get, inRange, isEmpty, isPlainObject, map, partialRight, reduce } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandItem } from '../../generic'
import type { InputProps } from '../../elements/Input'
import type { SearchCategoryProps } from './SearchCategory'
import type { SearchResultProps } from './SearchResult'
import type { SearchCategoryLayoutProps } from './SearchCategoryLayout'

export interface SearchProps extends StrictSearchProps {
  [key: string]: any
}

export interface StrictSearchProps {
  /** An element type to render as (string or function). */
  as?: any

  // ------------------------------------
  // Behavior
  // ------------------------------------

  /** Initial value of open. */
  defaultOpen?: boolean

  /** Initial value. */
  defaultValue?: string

  /** Shorthand for Icon. */
  icon?: any

  /** Minimum characters to query for results. */
  minCharacters?: number

  /** Additional text for "No Results" message with less emphasis. */
  noResultsDescription?: React.ReactNode

  /** Message to display when there are no results. */
  noResultsMessage?: React.ReactNode

  /** Controls whether or not the results menu is displayed. */
  open?: boolean

  /**
   * One of:
   * - array of Search.Result props e.g. `{ title: '', description: '' }` or
   * - object of categories e.g. `{ name: '', results: [{ title: '', description: '' }]`
   */
  results?: any[] | Record<string, any>

  /** Whether the search should automatically select the first result after searching. */
  selectFirstResult?: boolean

  /** Whether a "no results" message should be shown if no results are found. */
  showNoResults?: boolean

  /** Current value of the search input. Creates a controlled component. */
  value?: string

  // ------------------------------------
  // Rendering
  // ------------------------------------
  /**
   * Renders the SearchCategory layout.
   *
   * @param {object} props - The SearchCategoryLayout props object.
   * @returns {*} - Renderable SearchCategory layout.
   */
  categoryLayoutRenderer?: (
    props: Pick<SearchCategoryLayoutProps, 'categoryContent' | 'resultsContent'>,
  ) => React.ReactElement<any>

  /**
   * Renders the SearchCategory contents.
   *
   * @param {object} props - The SearchCategory props object.
   * @returns {*} - Renderable SearchCategory contents.
   */
  categoryRenderer?: (props: SearchCategoryProps) => React.ReactElement<any>

  /**
   * Renders the SearchResult contents.
   *
   * @param {object} props - The SearchResult props object.
   * @returns {*} - Renderable SearchResult contents.
   */
  resultRenderer?: (props: SearchResultProps) => React.ReactElement<any>

  // ------------------------------------
  // Callbacks
  // ------------------------------------

  /**
   * Called on blur.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onBlur?: (event: React.MouseEvent<HTMLElement>, data: SearchProps) => void

  /**
   * Called on focus.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onFocus?: (event: React.MouseEvent<HTMLElement>, data: SearchProps) => void

  /**
   * Called on mousedown.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onMouseDown?: (event: React.MouseEvent<HTMLElement>, data: SearchProps) => void

  /**
   * Called when a result is selected.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onResultSelect?: (event: React.MouseEvent<HTMLDivElement>, data: SearchResultData) => void

  /**
   * Called on search input change.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props, includes current value of search input.
   */
  onSearchChange?: (event: React.MouseEvent<HTMLElement>, data: SearchProps) => void

  /**
   * Called when the active selection index is changed.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onSelectionChange?: (event: React.MouseEvent<HTMLElement>, data: SearchResultData) => void

  // ------------------------------------
  // Style
  // ------------------------------------

  /** A search can have its results aligned to its left or right container edge. */
  aligned?: string

  /** A search can display results from remote content ordered by categories. */
  category?: boolean

  /** Additional classes. */
  className?: string

  /** A search can have its results take up the width of its container. */
  fluid?: boolean

  /** Shorthand for input element. */
  input?: SemanticShorthandItem<InputProps>

  /** A search can show a loading indicator. */
  loading?: boolean

  /** A search can have different sizes. */
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive'

  /** A search can show placeholder text when empty. */
  placeholder?: string
}

export interface SearchResultData extends SearchProps {
  result: any
}

/** Handlers subscribed via `eventStack` receive DOM events, the rest receive React events. */
type SearchEvent = React.SyntheticEvent<HTMLElement> | Event

interface SearchState {
  focus?: boolean
  open?: boolean
  prevValue?: string
  searchClasses?: string
  selectedIndex: number
  value: string
}

const overrideSearchInputProps = (predefinedProps: InputProps) => {
  const { input } = predefinedProps

  if (input === undefined) {
    return { ...predefinedProps, input: { className: 'prompt' } }
  }
  if (isPlainObject(input)) {
    const inputProps = input as React.InputHTMLAttributes<HTMLInputElement>
    return {
      ...predefinedProps,
      input: { ...inputProps, className: cx(inputProps.className, 'prompt') },
    }
  }

  return predefinedProps
}

/**
 * A search module allows a user to query for results from a selection of data
 */
const Search = React.forwardRef<HTMLDivElement, SearchProps>((props, ref) => {
  const {
    icon = 'search',
    input = 'text',
    minCharacters = 1,
    noResultsMessage = 'No results found.',
    showNoResults = true,
    ...rest
  } = props

  return (
    <SearchInner
      icon={icon}
      input={input}
      minCharacters={minCharacters}
      noResultsMessage={noResultsMessage}
      showNoResults={showNoResults}
      {...rest}
      innerRef={ref}
    />
  )
}) as ForwardRefComponent<SearchProps, HTMLDivElement> & {
  Category: typeof SearchCategory
  Result: typeof SearchResult
  Results: typeof SearchResults
}

class SearchInner extends Component<SearchProps, SearchState> {
  declare isMouseDown: boolean

  static getAutoControlledStateFromProps(props: SearchProps, state: SearchState) {
    // We need to store a `prevValue` to compare as in `getDerivedStateFromProps` we don't have
    // prevState
    if (typeof state.prevValue !== 'undefined' && shallowEqual(state.prevValue, state.value)) {
      return { prevValue: state.value }
    }

    const selectedIndex = props.selectFirstResult ? 0 : -1

    return { prevValue: state.value, selectedIndex }
  }

  shouldComponentUpdate(nextProps: SearchProps, nextState: SearchState) {
    return !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state)
  }

  componentDidUpdate(prevProps: SearchProps, prevState: SearchState) {
    // focused / blurred
    if (!prevState.focus && this.state.focus) {
      if (!this.isMouseDown) {
        this.tryOpen()
      }
      if (this.state.open) {
        eventStack.sub('keydown', [this.moveSelectionOnKeyDown, this.selectItemOnEnter])
      }
    } else if (prevState.focus && !this.state.focus) {
      if (!this.isMouseDown) {
        this.close()
      }
      eventStack.unsub('keydown', [this.moveSelectionOnKeyDown, this.selectItemOnEnter])
    }

    // opened / closed
    if (!prevState.open && this.state.open) {
      this.open()
      eventStack.sub('click', this.closeOnDocumentClick)
      eventStack.sub('keydown', [
        this.closeOnEscape,
        this.moveSelectionOnKeyDown,
        this.selectItemOnEnter,
      ])
    } else if (prevState.open && !this.state.open) {
      this.close()
      eventStack.unsub('click', this.closeOnDocumentClick)
      eventStack.unsub('keydown', [
        this.closeOnEscape,
        this.moveSelectionOnKeyDown,
        this.selectItemOnEnter,
      ])
    }
  }

  componentWillUnmount() {
    eventStack.unsub('click', this.closeOnDocumentClick)
    eventStack.unsub('keydown', [
      this.closeOnEscape,
      this.moveSelectionOnKeyDown,
      this.selectItemOnEnter,
    ])
  }

  // ----------------------------------------
  // Document Event Handlers
  // ----------------------------------------

  // `selectItemOnEnter()` passes a DOM event (eventStack), the public type only knows mouse events
  handleResultSelect = (e: SearchEvent, result: any) => {
    this.props?.onResultSelect?.(e as React.MouseEvent<HTMLDivElement>, { ...this.props, result })
  }

  // `moveSelectionOnKeyDown()` passes a DOM event (eventStack), the public type only knows mouse events
  handleSelectionChange = (e: SearchEvent, selectedIndex: number) => {
    const result = this.getSelectedResult(selectedIndex)
    this.props?.onSelectionChange?.(e as React.MouseEvent<HTMLElement>, { ...this.props, result })
  }

  closeOnEscape = (e: KeyboardEvent) => {
    if (keyboardKey.getCode(e) !== keyboardKey.Escape) return
    e.preventDefault()
    this.close()
  }

  moveSelectionOnKeyDown = (e: KeyboardEvent) => {
    switch (keyboardKey.getCode(e)) {
      case keyboardKey.ArrowDown:
        e.preventDefault()
        this.moveSelectionBy(e, 1)
        break
      case keyboardKey.ArrowUp:
        e.preventDefault()
        this.moveSelectionBy(e, -1)
        break
      default:
        break
    }
  }

  selectItemOnEnter = (e: KeyboardEvent) => {
    if (keyboardKey.getCode(e) !== keyboardKey.Enter) return

    const result = this.getSelectedResult()

    // prevent selecting null if there was no selected item value
    if (!result) return

    e.preventDefault()

    // notify the onResultSelect prop that the user is trying to change value
    this.setValue(result.title)
    this.handleResultSelect(e, result)
    this.close()
  }

  closeOnDocumentClick = () => {
    this.close()
  }

  // ----------------------------------------
  // Component Event Handlers
  // ----------------------------------------

  handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    this.isMouseDown = true
    this.props?.onMouseDown?.(e, this.props)
    eventStack.sub('mouseup', this.handleDocumentMouseUp)
  }

  handleDocumentMouseUp = () => {
    this.isMouseDown = false
    eventStack.unsub('mouseup', this.handleDocumentMouseUp)
  }

  handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // prevent closeOnDocumentClick()
    e.nativeEvent.stopImmediatePropagation()

    this.tryOpen()
  }

  handleItemClick = (e: React.MouseEvent<HTMLDivElement>, { id }: SearchResultProps) => {
    // `id` is always set to the result index by `renderResult()`
    const result = this.getSelectedResult(id as number)

    // prevent closeOnDocumentClick()
    e.nativeEvent.stopImmediatePropagation()

    // notify the onResultSelect prop that the user is trying to change value
    this.setValue(result.title)
    this.handleResultSelect(e, result)
    this.close()
  }

  handleItemMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Heads up! We should prevent default to prevent blur events.
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/3298
    e.preventDefault()
  }

  handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    // the public type declares a mouse event
    this.props?.onFocus?.(e as any, this.props)
    this.setState({ focus: true })
  }

  handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    // the public type declares a mouse event
    this.props?.onBlur?.(e as any, this.props)
    this.setState({ focus: false })
  }

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // prevent propagating to this.props.onChange()
    e.stopPropagation()
    const { minCharacters } = this.props
    const { open } = this.state
    const newQuery = e.target.value

    // the public type declares a mouse event
    this.props?.onSearchChange?.(e as any, { ...this.props, value: newQuery })

    // open search dropdown on search query
    // `minCharacters` is defaulted by the `Search` wrapper
    if (newQuery.length < minCharacters!) {
      this.close()
    } else if (!open) {
      this.tryOpen(newQuery)
    }

    this.setValue(newQuery)
  }

  // ----------------------------------------
  // Getters
  // ----------------------------------------

  getFlattenedResults = (): any[] => {
    const { category, results } = this.props

    return !category
      ? (results as any[])
      : reduce(results, (memo: any[], categoryData: any) => memo.concat(categoryData.results), [])
  }

  getSelectedResult = (index: number = this.state.selectedIndex) => {
    const results = this.getFlattenedResults()
    return get(results, index)
  }

  // ----------------------------------------
  // Setters
  // ----------------------------------------

  setValue = (value: string) => {
    const { selectFirstResult } = this.props

    this.setState({ value, selectedIndex: selectFirstResult ? 0 : -1 })
  }

  moveSelectionBy = (e: SearchEvent, offset: number) => {
    const { selectedIndex } = this.state

    const results = this.getFlattenedResults()
    const lastIndex = results.length - 1

    // next is after last, wrap to beginning
    // next is before first, wrap to end
    let nextIndex = selectedIndex + offset
    if (nextIndex > lastIndex) nextIndex = 0
    else if (nextIndex < 0) nextIndex = lastIndex

    // Heads up!
    // State updates are batched (always since React 18), so the new index is passed explicitly and
    // the scroll happens once the active item is rendered.
    this.setState({ selectedIndex: nextIndex }, this.scrollSelectedItemIntoView)
    this.handleSelectionChange(e, nextIndex)
  }

  // ----------------------------------------
  // Behavior
  // ----------------------------------------

  scrollSelectedItemIntoView = () => {
    // Do not access document when server side rendering
    if (!isBrowser()) return
    const menu = document.querySelector('.ui.search.active.visible .results.visible')
    if (!menu) return
    const item = menu.querySelector<HTMLElement>('.result.active')
    if (!item) return
    const isOutOfUpperView = item.offsetTop < menu.scrollTop
    const isOutOfLowerView = item.offsetTop + item.clientHeight > menu.scrollTop + menu.clientHeight

    if (isOutOfUpperView) {
      menu.scrollTop = item.offsetTop
    } else if (isOutOfLowerView) {
      menu.scrollTop = item.offsetTop + item.clientHeight - menu.clientHeight
    }
  }

  // Open if the current value is greater than the minCharacters prop
  tryOpen = (currentValue = this.state.value) => {
    const { minCharacters } = this.props
    // `minCharacters` is defaulted by the `Search` wrapper
    if (currentValue.length < minCharacters!) return

    this.open()
  }

  open = () => {
    this.setState({ open: true })
  }

  close = () => {
    this.setState({ open: false })
  }

  // ----------------------------------------
  // Render
  // ----------------------------------------

  renderSearchInput = (rest: Record<string, any>) => {
    const { icon, input, placeholder } = this.props
    const { value } = this.state

    return Input.create(input, {
      autoGenerateKey: false,
      defaultProps: {
        ...rest,
        autoComplete: 'off',
        icon,
        onChange: this.handleSearchChange,
        onClick: this.handleInputClick,
        tabIndex: '0',
        value,
        placeholder,
      },
      // Nested shorthand props need special treatment to survive the shallow merge
      overrideProps: overrideSearchInputProps,
    })
  }

  renderNoResults = () => {
    const { noResultsDescription, noResultsMessage } = this.props

    return (
      <div className='message empty'>
        <div className='header'>{noResultsMessage}</div>
        {noResultsDescription && <div className='description'>{noResultsDescription}</div>}
      </div>
    )
  }

  /**
   * Offset is needed for determining the active item for results within a
   * category. Since the index is reset to 0 for each new category, an offset
   * must be passed in.
   */
  renderResult = ({ childKey, ...result }: any, index: number, _array?: unknown, offset = 0) => {
    const { resultRenderer } = this.props
    const { selectedIndex } = this.state
    const offsetIndex = index + offset

    return (
      <SearchResult
        key={childKey ?? (result.id || result.title)}
        active={selectedIndex === offsetIndex}
        onClick={this.handleItemClick}
        onMouseDown={this.handleItemMouseDown}
        renderer={resultRenderer}
        {...result}
        id={offsetIndex} // Used to lookup the result on item click
      />
    )
  }

  renderResults = () => {
    const { results } = this.props

    return map(results, this.renderResult)
  }

  renderCategories = () => {
    const { categoryLayoutRenderer, categoryRenderer, results: categories } = this.props
    const { selectedIndex } = this.state

    let count = 0

    return map(categories, ({ childKey, ...category }: any) => {
      const categoryProps = {
        key: childKey ?? category.name,
        active: inRange(selectedIndex, count, count + category.results.length),
        layoutRenderer: categoryLayoutRenderer,
        renderer: categoryRenderer,
        ...category,
      }
      const renderFn = partialRight(this.renderResult, count)

      count += category.results.length

      return <SearchCategory {...categoryProps}>{category.results.map(renderFn)}</SearchCategory>
    })
  }

  renderMenuContent = () => {
    const { category, showNoResults, results } = this.props

    if (isEmpty(results)) {
      return showNoResults ? this.renderNoResults() : null
    }

    return category ? this.renderCategories() : this.renderResults()
  }

  renderResultsMenu = () => {
    const { open } = this.state
    const resultsClasses = open ? 'visible' : ''
    const menuContent = this.renderMenuContent()

    if (!menuContent) return

    return <SearchResults className={resultsClasses}>{menuContent}</SearchResults>
  }

  render() {
    const { searchClasses, focus, open } = this.state
    const { aligned, category, className, innerRef, fluid, loading, size } = this.props

    // Classes
    const classes = cx(
      'ui',
      open && 'active visible',
      size,
      searchClasses,
      getKeyOnly(category, 'category'),
      getKeyOnly(focus, 'focus'),
      getKeyOnly(fluid, 'fluid'),
      getKeyOnly(loading, 'loading'),
      getValueAndKey(aligned, 'aligned'),
      'search',
      className,
    )
    const unhandled = getUnhandledProps(Search, this.props)
    const ElementType = getComponentType(this.props)
    const [htmlInputProps, rest] = partitionHTMLProps(unhandled, {
      htmlProps: htmlInputAttrs,
    })

    return (
      <ElementType
        {...rest}
        className={classes}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onMouseDown={this.handleMouseDown}
        ref={innerRef}
      >
        {this.renderSearchInput(htmlInputProps)}
        {this.renderResultsMenu()}
      </ElementType>
    )
  }
}

Search.displayName = 'Search'
Search.handledProps = [
  'aligned',
  'as',
  'category',
  'categoryLayoutRenderer',
  'categoryRenderer',
  'className',
  'defaultOpen',
  'defaultValue',
  'fluid',
  'icon',
  'input',
  'loading',
  'minCharacters',
  'noResultsDescription',
  'noResultsMessage',
  'onBlur',
  'onFocus',
  'onMouseDown',
  'onResultSelect',
  'onSearchChange',
  'onSelectionChange',
  'open',
  'placeholder',
  'resultRenderer',
  'results',
  'selectFirstResult',
  'showNoResults',
  'size',
  'value',
]

SearchInner.autoControlledProps = ['open', 'value']

Search.Category = SearchCategory
// CategoryLayout is not a part of the public typings
;(Search as any).CategoryLayout = SearchCategoryLayout
Search.Result = SearchResult
Search.Results = SearchResults

export default Search
