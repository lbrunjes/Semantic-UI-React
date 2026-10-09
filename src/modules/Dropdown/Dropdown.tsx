import React, { Children, cloneElement, createRef } from 'react'

import {
  cx,
  EventStack,
  keyboardKey,
  ModernAutoControlledComponent as Component,
  childrenUtils,
  doesNodeContainClick,
  getComponentType,
  getUnhandledProps,
  setRef,
  getKeyOnly,
  getKeyOrValueAndKey,
  shallowEqual,
} from '../../lib'
import Icon from '../../elements/Icon'
import Label from '../../elements/Label'
import Flag from '../../elements/Flag'
import Image from '../../elements/Image'
import DropdownDivider from './DropdownDivider'
import DropdownItem from './DropdownItem'
import DropdownHeader from './DropdownHeader'
import DropdownMenu from './DropdownMenu'
import DropdownSearchInput from './DropdownSearchInput'
import DropdownText from './DropdownText'
import getMenuOptions from './utils/getMenuOptions'
import getSelectedIndex from './utils/getSelectedIndex'
import {
  compact,
  difference,
  dropRight,
  every,
  find,
  get,
  has,
  includes,
  isEmpty,
  isEqual,
  map,
  noop,
  pick,
  size,
  union,
  without,
} from '../../lib/utils'
import type { IconProps } from '../../elements/Icon'
import type { LabelProps } from '../../elements/Label'
import type { DropdownItemProps } from './DropdownItem'
import type { DropdownSearchInputProps } from './DropdownSearchInput'
import type { ForwardRefComponent } from '../../generic'

export interface DropdownProps extends StrictDropdownProps {
  [key: string]: any
}

export interface StrictDropdownProps {
  /** An element type to render as (string or function). */
  as?: any

  /** Label prefixed to an option added by a user. */
  additionLabel?: number | string | React.ReactNode

  /** Position of the `Add: ...` option in the dropdown list ('top' or 'bottom'). */
  additionPosition?: 'top' | 'bottom'

  /**
   * Allow user additions to the list of options (boolean).
   * Requires the use of `selection`, `options` and `search`.
   */
  allowAdditions?: boolean

  /** A Dropdown can reduce its complexity. */
  basic?: boolean

  /** Format the Dropdown to appear as a button. */
  button?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** Additional classes. */
  className?: string

  /** Using the clearable setting will let users remove their selection from a dropdown. */
  clearable?: boolean

  /** Whether or not the menu should close when the dropdown is blurred. */
  closeOnBlur?: boolean

  /** Whether or not the dropdown should close when the escape key is pressed. */
  closeOnEscape?: boolean

  /**
   * Whether or not the menu should close when a value is selected from the dropdown.
   * By default, multiple selection dropdowns will remain open on change, while single
   * selection dropdowns will close on change.
   */
  closeOnChange?: boolean

  /** A compact dropdown has no minimum width. */
  compact?: boolean

  /** Whether or not the dropdown should strip diacritics in options and input search */
  deburr?: boolean

  /** Initial value of open. */
  defaultOpen?: boolean

  /** Initial value of searchQuery. */
  defaultSearchQuery?: string

  /** Currently selected label in multi-select. */
  defaultSelectedLabel?: number | string

  /** Initial value of upward. */
  defaultUpward?: boolean

  /** Initial value or value array if multiple. */
  defaultValue?: string | number | boolean | (number | string | boolean)[]

  /** A dropdown menu can open to the left or to the right. */
  direction?: 'left' | 'right'

  /** A disabled dropdown menu or item does not allow user interaction. */
  disabled?: boolean

  /** An errored dropdown can alert a user to a problem. */
  error?: boolean

  /** A dropdown menu can contain floated content. */
  floating?: boolean

  /** A dropdown can take the full width of its parent */
  fluid?: boolean

  /** A dropdown menu can contain a header. */
  header?: React.ReactNode

  /** Shorthand for Icon. */
  icon?: any

  /** A dropdown can be formatted to appear inline in other content. */
  inline?: boolean

  /** A dropdown can be formatted as a Menu item. */
  item?: boolean

  /** A dropdown can be labeled. */
  labeled?: boolean

  /** A dropdown can defer rendering its options until it is open. */
  lazyLoad?: boolean

  /** A dropdown can show that it is currently loading data. */
  loading?: boolean

  /** The minimum characters for a search to begin showing results. */
  minCharacters?: number

  /** A selection dropdown can allow multiple selections. */
  multiple?: boolean

  /** Message to display when there are no results. */
  noResultsMessage?: React.ReactNode

  /**
   * Called when a user adds a new item. Use this to update the options list.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and the new item's value.
   */
  onAddItem?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void

  /**
   * Called on blur.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onBlur?: (event: React.FocusEvent<HTMLElement>, data: DropdownProps) => void

  /**
   * Called when the user attempts to change the value.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   */
  onChange?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>, data: DropdownProps) => void

  /**
   * Called when a close event happens.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClose?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void

  /**
   * Called on focus.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onFocus?: (event: React.FocusEvent<HTMLElement>, data: DropdownProps) => void

  /**
   * Called when a multi-select label is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All label props.
   */
  onLabelClick?: (event: React.MouseEvent<HTMLElement>, data: LabelProps) => void

  /**
   * Called on mousedown.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onMouseDown?: (event: React.MouseEvent<HTMLElement>, data: DropdownProps) => void

  /**
   * Called when an open event happens.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onOpen?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void

  /**
   * Called on search input change.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props, includes current value of searchQuery.
   */
  onSearchChange?: (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownOnSearchChangeData,
  ) => void

  /** Controls whether or not the dropdown menu is displayed. */
  open?: boolean

  /** Whether or not the menu should open when the dropdown is focused. */
  openOnFocus?: boolean

  /** Array of Dropdown.Item props e.g. `{ text: '', value: '' }` */
  options?: DropdownItemProps[]

  /** Placeholder text. */
  placeholder?: string

  /** A dropdown can be formatted so that its menu is pointing. */
  pointing?:
    | boolean
    | 'left'
    | 'right'
    | 'top'
    | 'top left'
    | 'top right'
    | 'bottom'
    | 'bottom left'
    | 'bottom right'

  /**
   * Mapped over the active items and returns shorthand for the active item Labels.
   * Only applies to `multiple` Dropdowns.
   *
   * @param {object} item - A currently active dropdown item.
   * @param {number} index - The current index.
   * @param {object} defaultLabelProps - The default props for an active item Label.
   * @returns {*} Shorthand for a Label.
   */
  renderLabel?: (item: DropdownItemProps, index: number, defaultLabelProps: LabelProps) => any

  /** A dropdown can have its menu scroll. */
  scrolling?: boolean

  /**
   * A selection dropdown can allow a user to search through a large list of choices.
   * Pass a function here to replace the default search.
   */
  search?: boolean | ((options: DropdownItemProps[], value: string) => DropdownItemProps[])

  /** A shorthand for a search input. */
  searchInput?: any

  /** Current value of searchQuery. Creates a controlled component. */
  searchQuery?: string

  /** Define whether the highlighted item should be selected on blur. */
  selectOnBlur?: boolean

  /** Whether dropdown should select new option when using keyboard shortcuts. Setting to false will require enter or left click to confirm a choice. */
  selectOnNavigation?: boolean

  /** Currently selected label in multi-select. */
  selectedLabel?: number | string

  /** A dropdown can be used to select between choices in a form. */
  selection?: any

  /** A simple dropdown can open without Javascript. */
  simple?: boolean

  /** A dropdown can receive focus. */
  tabIndex?: number | string

  /** The text displayed in the dropdown, usually for the active item. */
  text?: string

  /** Custom element to trigger the menu to become visible. Takes place of 'text'. */
  trigger?: React.ReactNode

  /** Current value or value array if multiple. Creates a controlled component. */
  value?: boolean | number | string | (boolean | number | string)[]

  /** Controls whether the dropdown will open upward. */
  upward?: boolean

  /**
   * A dropdown will go to the last element when ArrowUp is pressed on the first,
   * or go to the first when ArrowDown is pressed on the last( aka infinite selection )
   */
  wrapSelection?: boolean
}

/* TODO: replace with DropdownProps when #1829 will be fixed:
 * https://github.com/Semantic-Org/Semantic-UI-React/issues/1829
 */
export interface DropdownOnSearchChangeData extends DropdownProps {
  searchQuery: string
}

type DropdownValue = StrictDropdownProps['value']

/** Handlers subscribed via `EventStack` receive DOM events, the rest receive React events. */
type DropdownEvent = React.SyntheticEvent<HTMLElement> | Event

interface DropdownState {
  focus: boolean
  open?: boolean
  searchQuery: string
  selectedIndex?: number
  selectedLabel?: number | string
  upward?: boolean
  value: DropdownValue

  // stored only for a comparison in getAutoControlledStateFromProps()
  __options?: DropdownItemProps[]
  __value?: DropdownValue
}

const getKeyOrValue = <K, V>(key: K, value: V) => (key == null ? value : key)
const getKeyAndValues = (options: DropdownItemProps[] | undefined) =>
  options ? options.map((option) => pick(option, ['key', 'value'])) : options

function renderItemContent(item: DropdownItemProps) {
  const { flag, image, text } = item

  // TODO: remove this in v3
  // This maintains compatibility with Shorthand API in v1 as this might be called in "Label.create()"
  if (typeof text === 'function') {
    return text
  }

  return {
    content: (
      <>
        {Flag.create(flag)}
        {Image.create(image)}

        {text}
      </>
    ),
  }
}

/**
 * A dropdown allows a user to select a value from a series of options.
 * @see Form
 * @see Select
 * @see Menu
 */
const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>((props, ref) => {
  const {
    additionLabel = 'Add ',
    additionPosition = 'top',
    closeOnBlur = true,
    closeOnEscape = true,
    deburr = false,
    icon = 'dropdown',
    minCharacters = 1,
    noResultsMessage = 'No results found.',
    openOnFocus = true,
    renderLabel = renderItemContent,
    searchInput = 'text',
    selectOnBlur = true,
    selectOnNavigation = true,
    wrapSelection = true,
    ...rest
  } = props

  return (
    <DropdownInner
      additionLabel={additionLabel}
      additionPosition={additionPosition}
      closeOnBlur={closeOnBlur}
      closeOnEscape={closeOnEscape}
      deburr={deburr}
      icon={icon}
      minCharacters={minCharacters}
      noResultsMessage={noResultsMessage}
      openOnFocus={openOnFocus}
      renderLabel={renderLabel}
      searchInput={searchInput}
      selectOnBlur={selectOnBlur}
      selectOnNavigation={selectOnNavigation}
      wrapSelection={wrapSelection}
      {...rest}
      innerRef={ref}
    />
  )
}) as ForwardRefComponent<DropdownProps, HTMLDivElement> & {
  Divider: typeof DropdownDivider
  Header: typeof DropdownHeader
  Item: typeof DropdownItem
  Menu: typeof DropdownMenu
  SearchInput: typeof DropdownSearchInput
}

class DropdownInner extends Component<DropdownProps, DropdownState> {
  declare isMouseDown: boolean

  searchRef = createRef<HTMLInputElement>()
  sizerRef = createRef<HTMLSpanElement>()
  ref = createRef<HTMLDivElement>()

  handleRef = (el: HTMLDivElement | null) => {
    this.ref.current = el
    setRef(this.props.innerRef, el)
  }

  getInitialAutoControlledState() {
    return { focus: false, searchQuery: '' }
  }

  static getAutoControlledStateFromProps(
    nextProps: DropdownProps,
    computedState: DropdownState,
    prevState: DropdownState,
  ) {
    // These values are stored only for a comparison on next getAutoControlledStateFromProps()
    const derivedState: Partial<DropdownState> = {
      __options: nextProps.options,
      __value: computedState.value,
    }

    // The selected index is only dependent:
    const shouldComputeSelectedIndex =
      // On value change
      !shallowEqual(prevState.__value, computedState.value) ||
      // On option keys/values, we only check those properties to avoid recursive performance impacts.
      // https://github.com/Semantic-Org/Semantic-UI-React/issues/3000
      !isEqual(getKeyAndValues(nextProps.options), getKeyAndValues(prevState.__options))

    if (shouldComputeSelectedIndex) {
      derivedState.selectedIndex = getSelectedIndex({
        additionLabel: nextProps.additionLabel,
        additionPosition: nextProps.additionPosition,
        allowAdditions: nextProps.allowAdditions,
        deburr: nextProps.deburr,
        multiple: nextProps.multiple,
        search: nextProps.search,
        selectedIndex: computedState.selectedIndex,

        value: computedState.value,
        options: nextProps.options,
        searchQuery: computedState.searchQuery,
      })
    }

    return derivedState
  }

  componentDidMount() {
    const { open } = this.state

    if (open) {
      this.open(null, false)
    }
  }

  shouldComponentUpdate(nextProps: DropdownProps, nextState: DropdownState) {
    return !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state)
  }

  componentDidUpdate(prevProps: DropdownProps, prevState: DropdownState) {
    const { closeOnBlur, minCharacters, openOnFocus, search } = this.props

    /* eslint-disable no-console */
    if (process.env.NODE_ENV !== 'production') {
      // in development, validate value type matches dropdown type
      const isNextValueArray = Array.isArray(this.props.value)
      const hasValue = has(this.props, 'value')

      if (hasValue && this.props.multiple && !isNextValueArray) {
        console.error(
          'Dropdown `value` must be an array when `multiple` is set.' +
            ` Received type: \`${Object.prototype.toString.call(this.props.value)}\`.`,
        )
      } else if (hasValue && !this.props.multiple && isNextValueArray) {
        console.error(
          'Dropdown `value` must not be an array when `multiple` is not set.' +
            ' Either set `multiple={true}` or use a string or number value.',
        )
      }
    }
    /* eslint-enable no-console */

    // focused / blurred
    if (!prevState.focus && this.state.focus) {
      if (!this.isMouseDown) {
        const openable = !search || (search && minCharacters === 1 && !this.state.open)

        if (openOnFocus && openable) this.open()
      }
    } else if (prevState.focus && !this.state.focus) {
      if (!this.isMouseDown && closeOnBlur) {
        this.close()
      }
    }

    // opened / closed
    if (!prevState.open && this.state.open) {
      this.setOpenDirection()
      this.scrollSelectedItemIntoView()
    }

    if (prevState.selectedIndex !== this.state.selectedIndex) {
      this.scrollSelectedItemIntoView()
    }
  }

  // ----------------------------------------
  // Document Event Handlers
  // ----------------------------------------

  // onChange needs to receive a value
  // can't rely on props.value if we are controlled
  handleChange = (e: DropdownEvent, value: DropdownValue) => {
    // `removeItemOnBackspace()` passes a DOM event (EventStack), the public type only knows React events
    this.props?.onChange?.(e as React.SyntheticEvent<HTMLElement>, { ...this.props, value })
  }

  closeOnChange = (e: React.SyntheticEvent<HTMLElement>) => {
    const { closeOnChange, multiple } = this.props
    const shouldClose = closeOnChange === undefined ? !multiple : closeOnChange

    if (shouldClose) {
      this.close(e, noop)
    }
  }

  closeOnEscape = (e: KeyboardEvent) => {
    if (!this.props.closeOnEscape) return
    if (keyboardKey.getCode(e) !== keyboardKey.Escape) return
    e.preventDefault()

    this.close(e)
  }

  moveSelectionOnKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const { multiple, selectOnNavigation } = this.props
    const { open } = this.state

    if (!open) {
      return
    }

    const moves: Record<number, number> = {
      [keyboardKey.ArrowDown]: 1,
      [keyboardKey.ArrowUp]: -1,
    }
    const move = moves[keyboardKey.getCode(e) as number]

    if (move === undefined) {
      return
    }

    e.preventDefault()
    const nextIndex = this.getSelectedIndexAfterMove(move)

    if (!multiple && selectOnNavigation) {
      this.makeSelectedItemActive(e, nextIndex)
    }

    this.setState({ selectedIndex: nextIndex })
  }

  openOnSpace = (e: React.KeyboardEvent<HTMLElement>) => {
    const shouldHandleEvent =
      this.state.focus && !this.state.open && keyboardKey.getCode(e) === keyboardKey.Spacebar
    const shouldPreventDefault =
      (e.target as HTMLElement)?.tagName !== 'INPUT' &&
      (e.target as HTMLElement)?.tagName !== 'TEXTAREA' &&
      (e.target as HTMLElement)?.isContentEditable !== true

    if (shouldHandleEvent) {
      if (shouldPreventDefault) {
        e.preventDefault()
      }

      this.open(e)
    }
  }

  openOnArrow = (e: React.KeyboardEvent<HTMLElement>) => {
    const { focus, open } = this.state

    if (focus && !open) {
      const code = keyboardKey.getCode(e)

      if (code === keyboardKey.ArrowDown || code === keyboardKey.ArrowUp) {
        e.preventDefault()
        this.open(e)
      }
    }
  }

  makeSelectedItemActive = (
    e: React.SyntheticEvent<HTMLElement>,
    selectedIndex: number | undefined,
  ) => {
    const { open, value } = this.state
    const { multiple } = this.props

    const item = this.getSelectedItem(selectedIndex)
    const selectedValue = item?.value
    const disabled = item?.disabled

    // prevent selecting null if there was no selected item value
    // prevent selecting duplicate items when the dropdown is closed
    // prevent selecting disabled items
    if (selectedValue == null || !open || disabled) {
      return value
    }

    // state value may be undefined
    const newValue = multiple ? union(value, [selectedValue]) : selectedValue
    const valueHasChanged = multiple ? !!difference(newValue, value).length : newValue !== value

    if (valueHasChanged) {
      // notify the onChange prop that the user is trying to change value
      this.setState({ value: newValue })
      this.handleChange(e, newValue)

      // Heads up! This event handler should be called after `onChange`
      // Notify the onAddItem prop if this is a new value
      // `item` is defined here: `selectedValue` is not null
      if (item!['data-additional']) {
        this.props?.onAddItem?.(e, { ...this.props, value: selectedValue })
      }
    }

    return value
  }

  selectItemOnEnter = (e: React.KeyboardEvent<HTMLElement>) => {
    const { search } = this.props
    const { open, selectedIndex } = this.state

    if (!open) {
      return
    }

    const shouldSelect =
      keyboardKey.getCode(e) === keyboardKey.Enter ||
      // https://github.com/Semantic-Org/Semantic-UI-React/pull/3766
      (!search && keyboardKey.getCode(e) === keyboardKey.Spacebar)

    if (!shouldSelect) {
      return
    }

    e.preventDefault()

    const optionSize = size(
      getMenuOptions({
        value: this.state.value,
        options: this.props.options,
        searchQuery: this.state.searchQuery,

        additionLabel: this.props.additionLabel,
        additionPosition: this.props.additionPosition,
        allowAdditions: this.props.allowAdditions,
        deburr: this.props.deburr,
        multiple: this.props.multiple,
        search: this.props.search,
      }),
    )

    if (search && optionSize === 0) {
      return
    }

    const nextValue = this.makeSelectedItemActive(e, selectedIndex)

    // This is required as selected value may be the same
    this.setState({
      selectedIndex: getSelectedIndex({
        additionLabel: this.props.additionLabel,
        additionPosition: this.props.additionPosition,
        allowAdditions: this.props.allowAdditions,
        deburr: this.props.deburr,
        multiple: this.props.multiple,
        search: this.props.search,
        selectedIndex,

        value: nextValue,
        options: this.props.options,
        searchQuery: '',
      }),
    })

    this.closeOnChange(e)
    this.clearSearchQuery()

    if (search) {
      this.searchRef.current?.focus?.()
    }
  }

  removeItemOnBackspace = (e: KeyboardEvent) => {
    const { multiple, search } = this.props
    const { searchQuery, value } = this.state

    if (keyboardKey.getCode(e) !== keyboardKey.Backspace) return
    if (searchQuery || !search || !multiple || isEmpty(value)) return
    e.preventDefault()

    // remove most recent value
    // `multiple` is set (checked above), the value is an array
    const newValue = dropRight(value) as (boolean | number | string)[]

    this.setState({ value: newValue })
    this.handleChange(e, newValue)
  }

  closeOnDocumentClick = (e: MouseEvent) => {
    if (!this.props.closeOnBlur) return

    // If event happened in the dropdown, ignore it
    if (this.ref.current && doesNodeContainClick(this.ref.current, e)) return

    this.close()
  }

  // ----------------------------------------
  // Component Event Handlers
  // ----------------------------------------

  handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    this.isMouseDown = true
    this.props?.onMouseDown?.(e, this.props)
    document.addEventListener('mouseup', this.handleDocumentMouseUp)
  }

  handleDocumentMouseUp = () => {
    this.isMouseDown = false
    document.removeEventListener('mouseup', this.handleDocumentMouseUp)
  }

  handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const { minCharacters, search } = this.props
    const { open, searchQuery } = this.state

    this.props?.onClick?.(e, this.props)
    // prevent closeOnDocumentClick()
    e.stopPropagation()

    if (!search) return this.toggle(e)
    if (open) {
      this.searchRef.current?.focus?.()
      return
    }
    // `minCharacters` is defaulted by the `Dropdown` wrapper
    if (searchQuery.length >= minCharacters! || minCharacters === 1) {
      this.open(e)
      return
    }
    this.searchRef.current?.focus?.()
  }

  handleIconClick = (e: React.MouseEvent<HTMLElement>) => {
    const { clearable } = this.props
    const hasValue = this.hasValue()

    this.props?.onClick?.(e, this.props)
    // prevent handleClick()
    e.stopPropagation()

    if (clearable && hasValue) {
      this.clearValue(e)
    } else {
      this.toggle(e)
    }
  }

  handleItemClick = (e: React.MouseEvent<HTMLElement>, item: DropdownItemProps) => {
    const { multiple, search } = this.props
    const { value: currentValue } = this.state
    const { value } = item

    // prevent toggle() in handleClick()
    e.stopPropagation()

    // prevent closeOnDocumentClick() if multiple or item is disabled
    if (multiple || item.disabled) {
      e.nativeEvent.stopImmediatePropagation()
    }
    if (item.disabled) {
      return
    }

    const isAdditionItem = item['data-additional']
    const newValue = multiple ? union(this.state.value, [value]) : value
    const valueHasChanged = multiple
      ? !!difference(newValue, currentValue).length
      : newValue !== currentValue

    // notify the onChange prop that the user is trying to change value
    if (valueHasChanged) {
      this.setState({ value: newValue })
      this.handleChange(e, newValue)
    }

    this.clearSearchQuery()

    if (search) {
      this.searchRef.current?.focus?.()
    } else {
      this.ref.current?.focus?.()
    }

    this.closeOnChange(e)

    // Heads up! This event handler should be called after `onChange`
    // Notify the onAddItem prop if this is a new value
    if (isAdditionItem) {
      this.props?.onAddItem?.(e, { ...this.props, value })
    }
  }

  handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    const { focus } = this.state

    if (focus) return

    this.props?.onFocus?.(e, this.props)
    this.setState({ focus: true })
  }

  handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    // Heads up! Don't remove this.
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/1315
    const currentTarget = e?.currentTarget
    if (currentTarget && currentTarget.contains(document.activeElement)) return

    const { closeOnBlur, multiple, selectOnBlur } = this.props
    // do not "blur" when the mouse is down inside of the Dropdown
    if (this.isMouseDown) return

    this.props?.onBlur?.(e, this.props)

    if (selectOnBlur && !multiple) {
      this.makeSelectedItemActive(e, this.state.selectedIndex)
      if (closeOnBlur) this.close()
    }

    this.setState({ focus: false })
    this.clearSearchQuery()
  }

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>, { value }: { value: string }) => {
    // prevent propagating to this.props.onChange()
    e.stopPropagation()

    const { minCharacters } = this.props
    const { open } = this.state
    const newQuery = value

    this.props?.onSearchChange?.(e, { ...this.props, searchQuery: newQuery })
    this.setState({ searchQuery: newQuery, selectedIndex: 0 })

    // open search dropdown on search query
    // `minCharacters` is defaulted by the `Dropdown` wrapper
    if (!open && newQuery.length >= minCharacters!) {
      this.open()
      return
    }
    // close search dropdown if search query is too small
    if (open && minCharacters !== 1 && newQuery.length < minCharacters!) this.close()
  }

  handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    this.moveSelectionOnKeyDown(e)
    this.openOnArrow(e)
    this.openOnSpace(e)
    this.selectItemOnEnter(e)

    this.props?.onKeyDown?.(e)
  }

  // ----------------------------------------
  // Getters
  // ----------------------------------------

  getSelectedItem = (selectedIndex: number | undefined): DropdownItemProps | undefined => {
    const options = getMenuOptions({
      value: this.state.value,
      options: this.props.options,
      searchQuery: this.state.searchQuery,

      additionLabel: this.props.additionLabel,
      additionPosition: this.props.additionPosition,
      allowAdditions: this.props.allowAdditions,
      deburr: this.props.deburr,
      multiple: this.props.multiple,
      search: this.props.search,
    })

    return get(options, `[${selectedIndex}]`)
  }

  getItemByValue = (value: DropdownValue): DropdownItemProps | undefined => {
    const { options } = this.props

    return find(options, { value })
  }

  getDropdownAriaOptions = () => {
    const { loading, disabled, search, multiple } = this.props
    const { open } = this.state
    const ariaOptions: any = {
      role: search ? 'combobox' : 'listbox',
      'aria-busy': loading,
      'aria-disabled': disabled,
      'aria-expanded': !!open,
    }
    if (ariaOptions.role === 'listbox') {
      ariaOptions['aria-multiselectable'] = multiple
    }
    return ariaOptions
  }

  getDropdownMenuAriaOptions() {
    const { search, multiple } = this.props
    const ariaOptions: any = {}

    if (search) {
      ariaOptions['aria-multiselectable'] = multiple
      ariaOptions.role = 'listbox'
    }
    return ariaOptions
  }

  // ----------------------------------------
  // Setters
  // ----------------------------------------

  clearSearchQuery = () => {
    const { searchQuery } = this.state
    if (searchQuery === undefined || searchQuery === '') return

    this.setState({ searchQuery: '' })
  }

  handleLabelClick = (e: React.MouseEvent<HTMLElement>, labelProps: LabelProps) => {
    // prevent focusing search input on click
    e.stopPropagation()

    this.setState({ selectedLabel: labelProps.value })
    this.props?.onLabelClick?.(e, labelProps)
  }

  handleLabelRemove = (e: React.MouseEvent<HTMLElement>, labelProps: LabelProps) => {
    // prevent focusing search input on click
    e.stopPropagation()
    const { value } = this.state
    // labels are only rendered for `multiple`, the value is an array
    const newValue = without(value, labelProps.value) as (boolean | number | string)[]

    this.setState({ value: newValue })
    this.handleChange(e, newValue)
  }

  getSelectedIndexAfterMove = (
    offset: number,
    startIndex: number | undefined = this.state.selectedIndex,
  ): number | undefined => {
    const options = getMenuOptions({
      value: this.state.value,
      options: this.props.options,
      searchQuery: this.state.searchQuery,

      additionLabel: this.props.additionLabel,
      additionPosition: this.props.additionPosition,
      allowAdditions: this.props.allowAdditions,
      deburr: this.props.deburr,
      multiple: this.props.multiple,
      search: this.props.search,
    })

    // Prevent infinite loop
    // TODO: remove left part of condition after children API will be removed
    if (options === undefined || every(options, 'disabled')) return

    const lastIndex = options.length - 1
    const { wrapSelection } = this.props
    // next is after last, wrap to beginning
    // next is before first, wrap to end
    // `selectedIndex` is set whenever there are enabled options (checked above)
    let nextIndex = startIndex! + offset

    // if 'wrapSelection' is set to false and selection is after last or before first, it just does not change
    if (!wrapSelection && (nextIndex > lastIndex || nextIndex < 0)) {
      nextIndex = startIndex!
    } else if (nextIndex > lastIndex) {
      nextIndex = 0
    } else if (nextIndex < 0) {
      nextIndex = lastIndex
    }

    if (options[nextIndex].disabled) {
      return this.getSelectedIndexAfterMove(offset, nextIndex)
    }

    return nextIndex
  }

  // ----------------------------------------
  // Overrides
  // ----------------------------------------

  handleIconOverrides = (predefinedProps: IconProps) => {
    const { clearable } = this.props
    const classes = cx(clearable && this.hasValue() && 'clear', predefinedProps.className)

    return {
      className: classes,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        predefinedProps?.onClick?.(e, predefinedProps)
        this.handleIconClick(e)
      },
    }
  }

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  clearValue = (e: React.MouseEvent<HTMLElement>) => {
    const { multiple } = this.props
    const newValue = multiple ? [] : ''

    this.setState({ value: newValue })
    this.handleChange(e, newValue)
  }

  computeSearchInputTabIndex = () => {
    const { disabled, tabIndex } = this.props

    if (tabIndex != null) return tabIndex
    return disabled ? -1 : 0
  }

  computeSearchInputWidth = () => {
    const { searchQuery } = this.state

    if (this.sizerRef.current && searchQuery) {
      // resize the search input, temporarily show the sizer so we can measure it

      this.sizerRef.current.style.display = 'inline'
      this.sizerRef.current.textContent = searchQuery
      const searchWidth = Math.ceil(this.sizerRef.current.getBoundingClientRect().width)
      this.sizerRef.current.style.removeProperty('display')

      return searchWidth
    }
  }

  computeTabIndex = () => {
    const { disabled, search, tabIndex } = this.props

    // don't set a root node tabIndex as the search input has its own tabIndex
    if (search) return undefined
    if (disabled) return -1
    return tabIndex == null ? 0 : tabIndex
  }

  handleSearchInputOverrides = (predefinedProps: DropdownSearchInputProps) => ({
    onChange: (
      e: React.ChangeEvent<HTMLInputElement>,
      inputProps: DropdownSearchInputProps & { value: string },
    ) => {
      predefinedProps?.onChange?.(e, inputProps)
      this.handleSearchChange(e, inputProps)
    },
    ref: this.searchRef,
  })

  hasValue = () => {
    const { multiple } = this.props
    const { value } = this.state

    return multiple ? !isEmpty(value) : value != null && value !== ''
  }

  // ----------------------------------------
  // Behavior
  // ----------------------------------------

  scrollSelectedItemIntoView = () => {
    if (!this.ref.current) return
    const menu = this.ref.current.querySelector('.menu.visible')
    if (!menu) return
    const item = menu.querySelector<HTMLElement>('.item.selected')
    if (!item) return
    const isOutOfUpperView = item.offsetTop < menu.scrollTop
    const isOutOfLowerView = item.offsetTop + item.clientHeight > menu.scrollTop + menu.clientHeight

    if (isOutOfUpperView) {
      menu.scrollTop = item.offsetTop
    } else if (isOutOfLowerView) {
      menu.scrollTop = item.offsetTop + item.clientHeight - menu.clientHeight
    }
  }

  setOpenDirection = () => {
    if (!this.ref.current) return

    const menu = this.ref.current.querySelector('.menu.visible')

    if (!menu) return

    const dropdownRect = this.ref.current.getBoundingClientRect()
    const menuHeight = menu.clientHeight
    const spaceAtTheBottom =
      document.documentElement.clientHeight - dropdownRect.top - dropdownRect.height - menuHeight
    const spaceAtTheTop = dropdownRect.top - menuHeight

    const upward = spaceAtTheBottom < 0 && spaceAtTheTop > spaceAtTheBottom

    // set state only if there's a relevant difference
    if (!upward !== !this.state.upward) {
      this.setState({ upward })
    }
  }

  open = (e: React.SyntheticEvent<HTMLElement> | null = null, triggerSetState = true) => {
    const { disabled, search } = this.props

    if (disabled) return
    if (search) this.searchRef.current?.focus?.()

    // `componentDidMount()` passes `null`, the public type does not allow it
    this.props?.onOpen?.(e as React.SyntheticEvent<HTMLElement>, this.props)

    if (triggerSetState) {
      this.setState({ open: true })
    }
    this.scrollSelectedItemIntoView()
  }

  close = (e?: DropdownEvent, callback = this.handleClose) => {
    if (this.state.open) {
      // `closeOnEscape()` passes a DOM event (EventStack) and some callers pass nothing,
      // the public type only knows React events
      this.props?.onClose?.(e as React.SyntheticEvent<HTMLElement>, this.props)
      this.setState({ open: false }, callback)
    }
  }

  handleClose = () => {
    const hasSearchFocus = document.activeElement === this.searchRef.current
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/627
    // Blur the Dropdown on close so it is blurred after selecting an item.
    // This is to prevent it from re-opening when switching tabs after selecting an item.
    if (!hasSearchFocus && this.ref.current) {
      this.ref.current.blur()
    }

    const hasDropdownFocus = document.activeElement === this.ref.current
    const hasFocus = hasSearchFocus || hasDropdownFocus

    // We need to keep the virtual model in sync with the browser focus change
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/692
    this.setState({ focus: hasFocus })
  }

  toggle = (e: React.SyntheticEvent<HTMLElement>) =>
    this.state.open ? this.close(e) : this.open(e)

  // ----------------------------------------
  // Render
  // ----------------------------------------

  renderText = () => {
    const { multiple, placeholder, search, text } = this.props
    const { searchQuery, selectedIndex, value, open } = this.state
    const hasValue = this.hasValue()

    const classes = cx(
      placeholder && !hasValue && 'default',
      'text',
      search && searchQuery && 'filtered',
    )
    let _text = placeholder
    let selectedItem

    if (text) {
      _text = text
    } else if (open && !multiple) {
      selectedItem = this.getSelectedItem(selectedIndex)
    } else if (hasValue) {
      selectedItem = this.getItemByValue(value)
    }

    return DropdownText.create(selectedItem ? renderItemContent(selectedItem) : _text, {
      defaultProps: {
        className: classes,
      },
    })
  }

  renderSearchInput = () => {
    const { search, searchInput } = this.props
    const { searchQuery } = this.state

    return (
      search &&
      DropdownSearchInput.create(searchInput, {
        defaultProps: {
          style: { width: this.computeSearchInputWidth() },
          tabIndex: this.computeSearchInputTabIndex(),
          value: searchQuery,
        },
        overrideProps: this.handleSearchInputOverrides,
      })
    )
  }

  renderSearchSizer = () => {
    const { search, multiple } = this.props

    return search && multiple && <span className='sizer' ref={this.sizerRef} />
  }

  renderLabels = () => {
    const { multiple, renderLabel } = this.props
    const { selectedLabel, value } = this.state
    if (!multiple || isEmpty(value)) {
      return
    }
    const selectedItems = map(value, this.getItemByValue)

    // if no item could be found for a given state value the selected item will be undefined
    // compact the selectedItems so we only have actual objects left
    return map(compact(selectedItems), (item: DropdownItemProps, index: number) => {
      const defaultProps = {
        active: item.value === selectedLabel,
        as: 'a',
        key: getKeyOrValue(item.key, item.value),
        onClick: this.handleLabelClick,
        onRemove: this.handleLabelRemove,
        value: item.value,
      }

      // `renderLabel` is defaulted by the `Dropdown` wrapper
      return Label.create(renderLabel!(item, index, defaultProps), { defaultProps })
    })
  }

  renderOptions = () => {
    const { lazyLoad, multiple, search, noResultsMessage } = this.props
    const { open, selectedIndex, value } = this.state

    // lazy load, only render options when open
    if (lazyLoad && !open) return null

    const options = getMenuOptions({
      value: this.state.value,
      options: this.props.options,
      searchQuery: this.state.searchQuery,

      additionLabel: this.props.additionLabel,
      additionPosition: this.props.additionPosition,
      allowAdditions: this.props.allowAdditions,
      deburr: this.props.deburr,
      multiple: this.props.multiple,
      search: this.props.search,
    })

    if (noResultsMessage !== null && search && isEmpty(options)) {
      return <div className='message'>{noResultsMessage}</div>
    }

    const isActive = multiple
      ? (optValue: DropdownItemProps['value']) => includes(value, optValue)
      : (optValue: DropdownItemProps['value']) => optValue === value

    return map(options, (opt: DropdownItemProps, i: number) =>
      DropdownItem.create(
        {
          active: isActive(opt.value),
          selected: selectedIndex === i,
          ...opt,
          key: getKeyOrValue(opt.key, opt.value),
          // Needed for handling click events on disabled items
          style: { ...opt.style, pointerEvents: 'all' },
        },
        {
          generateKey: false,
          overrideProps: (predefinedProps: DropdownItemProps) => ({
            onClick: (e: React.MouseEvent<HTMLDivElement>, item: DropdownItemProps) => {
              predefinedProps.onClick?.(e, item)
              this.handleItemClick(e, item)
            },
          }),
        },
      ),
    )
  }

  renderMenu = () => {
    const { children, direction, header } = this.props
    const { open } = this.state
    const ariaOptions = this.getDropdownMenuAriaOptions()

    // single menu child
    if (!childrenUtils.isNil(children)) {
      const menuChild = Children.only(children) as React.ReactElement<any>
      const className = cx(direction, getKeyOnly(open, 'visible'), menuChild.props.className)

      return cloneElement(menuChild, { className, ...ariaOptions })
    }

    return (
      <DropdownMenu {...ariaOptions} direction={direction} open={open}>
        {DropdownHeader.create(header, { autoGenerateKey: false })}
        {this.renderOptions()}
      </DropdownMenu>
    )
  }

  render() {
    const {
      basic,
      button,
      className,
      compact,
      disabled,
      error,
      fluid,
      floating,
      icon,
      inline,
      item,
      labeled,
      loading,
      multiple,
      pointing,
      search,
      selection,
      scrolling,
      simple,
      trigger,
    } = this.props
    const { focus, open, upward } = this.state

    // Classes
    const classes = cx(
      'ui',
      getKeyOnly(open, 'active visible'),
      getKeyOnly(disabled, 'disabled'),
      getKeyOnly(error, 'error'),
      getKeyOnly(loading, 'loading'),

      getKeyOnly(basic, 'basic'),
      getKeyOnly(button, 'button'),
      getKeyOnly(compact, 'compact'),
      getKeyOnly(fluid, 'fluid'),
      getKeyOnly(floating, 'floating'),
      getKeyOnly(inline, 'inline'),
      // TODO: consider augmentation to render Dropdowns as Button/Menu, solves icon/link item issues
      // https://github.com/Semantic-Org/Semantic-UI-React/issues/401#issuecomment-240487229
      // TODO: the icon class is only required when a dropdown is a button
      // getKeyOnly(icon, 'icon'),
      getKeyOnly(labeled, 'labeled'),
      getKeyOnly(item, 'item'),
      getKeyOnly(multiple, 'multiple'),
      getKeyOnly(search, 'search'),
      getKeyOnly(selection, 'selection'),
      getKeyOnly(simple, 'simple'),
      getKeyOnly(scrolling, 'scrolling'),
      getKeyOnly(upward, 'upward'),

      getKeyOrValueAndKey(pointing, 'pointing'),
      'dropdown',
      className,
    )
    const rest = getUnhandledProps(Dropdown, this.props)
    const ElementType = getComponentType(this.props)
    const ariaOptions = this.getDropdownAriaOptions()

    return (
      <ElementType
        {...rest}
        {...ariaOptions}
        className={classes}
        onBlur={this.handleBlur}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onMouseDown={this.handleMouseDown}
        onFocus={this.handleFocus}
        onChange={this.handleChange}
        tabIndex={this.computeTabIndex()}
        ref={this.handleRef}
      >
        {this.renderLabels()}
        {this.renderSearchInput()}
        {this.renderSearchSizer()}
        {trigger || this.renderText()}
        {Icon.create(icon, {
          overrideProps: this.handleIconOverrides,
          autoGenerateKey: false,
        })}
        {this.renderMenu()}

        {open && <EventStack name='keydown' on={this.closeOnEscape} />}
        {open && <EventStack name='click' on={this.closeOnDocumentClick} />}

        {focus && <EventStack name='keydown' on={this.removeItemOnBackspace} />}
      </ElementType>
    )
  }
}

Dropdown.handledProps = [
  'additionLabel',
  'additionPosition',
  'allowAdditions',
  'as',
  'basic',
  'button',
  'children',
  'className',
  'clearable',
  'closeOnBlur',
  'closeOnChange',
  'closeOnEscape',
  'compact',
  'deburr',
  'defaultOpen',
  'defaultSearchQuery',
  'defaultSelectedLabel',
  'defaultUpward',
  'defaultValue',
  'direction',
  'disabled',
  'error',
  'floating',
  'fluid',
  'header',
  'icon',
  'inline',
  'item',
  'labeled',
  'lazyLoad',
  'loading',
  'minCharacters',
  'multiple',
  'noResultsMessage',
  'onAddItem',
  'onBlur',
  'onChange',
  'onClick',
  'onClose',
  'onFocus',
  'onLabelClick',
  'onMouseDown',
  'onOpen',
  'onSearchChange',
  'open',
  'openOnFocus',
  'options',
  'placeholder',
  'pointing',
  'renderLabel',
  'scrolling',
  'search',
  'searchInput',
  'searchQuery',
  'selectOnBlur',
  'selectOnNavigation',
  'selectedLabel',
  'selection',
  'simple',
  'tabIndex',
  'text',
  'trigger',
  'upward',
  'value',
  'wrapSelection',
]

Dropdown.displayName = 'Dropdown'

DropdownInner.autoControlledProps = ['open', 'searchQuery', 'selectedLabel', 'value', 'upward']

Dropdown.Divider = DropdownDivider
Dropdown.Header = DropdownHeader
Dropdown.Item = DropdownItem
Dropdown.Menu = DropdownMenu
Dropdown.SearchInput = DropdownSearchInput
// `Text` is not part of the published `Dropdown` typings
;(Dropdown as any).Text = DropdownText

export default Dropdown
