import * as React from 'react'

import Dropdown from '../../modules/Dropdown'
import type { StrictDropdownProps } from '../../modules/Dropdown'
import type DropdownDivider from '../../modules/Dropdown/DropdownDivider'
import type DropdownHeader from '../../modules/Dropdown/DropdownHeader'
import type DropdownItem from '../../modules/Dropdown/DropdownItem'
import type { DropdownItemProps } from '../../modules/Dropdown/DropdownItem'
import type DropdownMenu from '../../modules/Dropdown/DropdownMenu'
import type { ForwardRefComponent } from '../../generic'

export interface SelectProps extends StrictSelectProps {
  [key: string]: any
}

export interface StrictSelectProps extends StrictDropdownProps {
  /** Array of Dropdown.Item props e.g. `{ text: '', value: '' }` */
  options: DropdownItemProps[]
}

/**
 * A Select is sugar for <Dropdown selection />.
 * @see Dropdown
 * @see Form
 */
// Heads up! `PropsWithoutRef<>` drops the required props of the index-signature props interface, so the
// cast goes through `unknown`.
// eslint-disable-next-line react/display-name -- it is assigned below, the cast to the public type hides it from the rule
const Select = React.forwardRef<HTMLDivElement, SelectProps>(function (props, ref) {
  return <Dropdown {...props} selection ref={ref} />
}) as unknown as ForwardRefComponent<SelectProps, HTMLDivElement> & {
  Divider: typeof DropdownDivider
  Header: typeof DropdownHeader
  Item: typeof DropdownItem
  Menu: typeof DropdownMenu
}

Select.displayName = 'Select'
Select.handledProps = ['options']

Select.Divider = Dropdown.Divider
Select.Header = Dropdown.Header
Select.Item = Dropdown.Item
Select.Menu = Dropdown.Menu

export default Select
