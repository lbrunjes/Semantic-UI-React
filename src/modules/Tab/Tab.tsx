import PropTypes from 'prop-types'
import * as React from 'react'

import {
  customPropTypes,
  getComponentType,
  getUnhandledProps,
  useAutoControlledValue,
} from '../../lib'
import Grid from '../../collections/Grid/Grid'
import GridColumn from '../../collections/Grid/GridColumn'
import Menu from '../../collections/Menu/Menu'
import TabPane from './TabPane'
import { get, map } from '../../lib/utils'
import type { ForwardRefComponent, SemanticShorthandItem } from '../../generic'
import type { TabPaneProps } from './TabPane'

export interface TabProps extends StrictTabProps {
  [key: string]: any
}

export interface StrictTabProps {
  /** An element type to render as (string or function). */
  as?: any

  /** The initial activeIndex. */
  defaultActiveIndex?: number | string

  /** Index of the currently active tab. */
  activeIndex?: number | string

  /** Shorthand props for the Menu. */
  menu?: any

  /** Align vertical menu */
  menuPosition?: 'left' | 'right'

  /** Shorthand props for the Grid. */
  grid?: any

  /**
   * Called on tab change.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - The proposed new Tab.Pane.
   * @param {object} data.activeIndex - The new proposed activeIndex.
   * @param {object} data.panes - Props of the new proposed active pane.
   */
  onTabChange?: (event: React.MouseEvent<HTMLDivElement>, data: TabProps) => void

  /**
   * Array of objects describing each Menu.Item and Tab.Pane:
   * {
   *   menuItem: 'Home',
   *   render: () => <Tab.Pane>Welcome!</Tab.Pane>,
   * }
   * or
   * {
   *   menuItem: 'Home',
   *   pane: 'Welcome',
   * }
   */
  panes?: {
    pane?: SemanticShorthandItem<TabPaneProps>
    menuItem?: any
    render?: () => React.ReactNode
  }[]

  /** A Tab can render only active pane. */
  renderActiveOnly?: boolean
}

/**
 * A Tab is a hidden section of content activated by a Menu.
 * @see Menu
 * @see Segment
 */
const Tab = React.forwardRef<HTMLDivElement, TabProps>(function (props, ref) {
  const {
    grid = { paneWidth: 12, tabWidth: 4 },
    menu = { attached: true, tabular: true },
    menuPosition,
    panes,
    renderActiveOnly = true,
  } = props

  const [activeIndex, setActiveIndex] = useAutoControlledValue({
    state: props.activeIndex,
    defaultState: props.defaultActiveIndex,
    initialState: 0,
  })

  const handleItemClick = (e, { index }) => {
    props?.onTabChange?.(e, { ...props, activeIndex: index })
    setActiveIndex(index)
  }

  const renderItems = () => {
    if (renderActiveOnly) {
      return get(panes, `[${activeIndex}]`)?.render?.(props)
    }

    return map(panes, ({ pane }, index) =>
      TabPane.create(pane, {
        overrideProps: {
          active: index === activeIndex,
        },
      }),
    )
  }

  const renderMenu = () => {
    if (menu.tabular === true && menuPosition === 'right') {
      menu.tabular = 'right'
    }

    return Menu.create(menu, {
      autoGenerateKey: false,
      overrideProps: {
        items: map(panes, 'menuItem'),
        onItemClick: handleItemClick,
        activeIndex,
      },
    })
  }

  const renderVertical = (menuElement) => {
    const { paneWidth, tabWidth, ...gridProps } = grid

    const position = menuPosition || (menuElement.props.tabular === 'right' && 'right') || 'left'

    return (
      <Grid {...gridProps}>
        {position === 'left' &&
          GridColumn.create({ width: tabWidth, children: menuElement }, { autoGenerateKey: false })}
        {GridColumn.create(
          {
            width: paneWidth,
            children: renderItems(),
            stretched: true,
          },
          { autoGenerateKey: false },
        )}
        {position === 'right' &&
          GridColumn.create({ width: tabWidth, children: menuElement }, { autoGenerateKey: false })}
      </Grid>
    )
  }

  const menuElement = renderMenu()
  const rest = getUnhandledProps(Tab, props)
  const ElementType = getComponentType(props)

  if (menuElement.props.vertical) {
    return (
      <ElementType {...rest} ref={ref}>
        {renderVertical(menuElement)}
      </ElementType>
    )
  }

  return (
    <ElementType {...rest} ref={ref}>
      {menuElement.props.attached !== 'bottom' && menuElement}
      {renderItems()}
      {menuElement.props.attached === 'bottom' && menuElement}
    </ElementType>
  )
}) as ForwardRefComponent<TabProps, HTMLDivElement> & {
  Pane: typeof TabPane
}

Tab.displayName = 'Tab'
Tab.propTypes = {
  /** An element type to render as (string or function). */
  as: PropTypes.elementType,

  /** The initial activeIndex. */
  defaultActiveIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /** Index of the currently active tab. */
  activeIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /**
   * Shorthand props for the Menu.
   * tabular, if true, will derive final value from `menuPosition`, otherwise set 'left' or 'right' explicitly.
   */
  menu: PropTypes.object,

  /** Align vertical menu */
  menuPosition: PropTypes.oneOf(['left', 'right']),

  /** Shorthand props for the Grid. Only applicable to vertical menus. */
  grid: PropTypes.object,

  /**
   * Called on tab change.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed new activeIndex.
   * @param {object} data.activeIndex - The new proposed activeIndex.
   */
  onTabChange: PropTypes.func,

  /**
   * Array of objects describing each Menu.Item and Tab.Pane:
   * { menuItem: 'Home', render: () => <Tab.Pane /> }
   * or
   * { menuItem: 'Home', pane: 'Welcome' }
   */
  panes: PropTypes.arrayOf(
    PropTypes.shape({
      menuItem: customPropTypes.itemShorthand,
      pane: customPropTypes.itemShorthand,
      render: PropTypes.func,
    }),
  ),

  /** A Tab can render only active pane. */
  renderActiveOnly: PropTypes.bool,
}

Tab.Pane = TabPane

export default Tab
