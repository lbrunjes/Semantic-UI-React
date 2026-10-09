import * as React from 'react'

import {
  childrenUtils,
  createShorthandFactory,
  cx,
  getComponentType,
  getUnhandledProps,
  getKeyOnly,
  getKeyOrValueAndKey,
  getValueAndKey,
  useEventCallback,
} from '../../lib'
import Icon from '../Icon/Icon'
import Image from '../Image/Image'
import LabelDetail from './LabelDetail'
import LabelGroup from './LabelGroup'
import type {
  ForwardRefComponent,
  SemanticCOLORS,
  SemanticShorthandContent,
  SemanticShorthandItem,
  SemanticSIZES,
} from '../../generic'
import type { IconProps } from '../Icon'
import type { LabelDetailProps } from './LabelDetail'

export interface LabelProps extends StrictLabelProps {
  [key: string]: any
}

export interface StrictLabelProps {
  /** An element type to render as (string or function). */
  as?: any

  /** A label can be active. */
  active?: boolean

  /** A label can attach to a content segment. */
  attached?: 'top' | 'bottom' | 'top right' | 'top left' | 'bottom left' | 'bottom right'

  /** A label can reduce its complexity. */
  basic?: boolean

  /** Primary content. */
  children?: React.ReactNode

  /** A label can be circular. */
  circular?: boolean

  /** Additional classes. */
  className?: string

  /** Color of the label. */
  color?: SemanticCOLORS

  /** Shorthand for primary content. */
  content?: SemanticShorthandContent

  /** A label can position itself in the corner of an element. */
  corner?: boolean | 'left' | 'right'

  /** Shorthand for LabelDetail. */
  detail?: SemanticShorthandItem<LabelDetailProps>

  /** Formats the label as a dot. */
  empty?: any

  /** Float above another element in the upper right corner. */
  floating?: boolean

  /** A horizontal label is formatted to label content along-side it horizontally. */
  horizontal?: boolean

  /** Add an icon by icon name or pass an <Icon /.> */
  icon?: SemanticShorthandItem<IconProps>

  /** A label can be formatted to emphasize an image or prop can be used as shorthand for Image. */
  image?: any

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>, data: LabelProps) => void

  /**
   * Adds an "x" icon, called when "x" is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onRemove?: (event: React.MouseEvent<HTMLElement>, data: LabelProps) => void

  /** A label can point to content next to it. */
  pointing?: boolean | 'above' | 'below' | 'left' | 'right'

  /** A label can prompt for an error in your forms. */
  prompt?: boolean

  /** Shorthand for Icon to appear as the last child and trigger onRemove. */
  removeIcon?: SemanticShorthandItem<IconProps>

  /** A label can appear as a ribbon attaching itself to an element. */
  ribbon?: boolean | 'right'

  /** A label can have different sizes. */
  size?: SemanticSIZES

  /** A label can appear as a tag. */
  tag?: boolean
}

/**
 * A label displays content classification.
 */
const Label = React.forwardRef<HTMLDivElement, LabelProps>(function (props, ref) {
  const {
    active,
    attached,
    basic,
    children,
    circular,
    className,
    color,
    content,
    corner,
    detail,
    empty,
    floating,
    horizontal,
    icon,
    image,
    onRemove,
    pointing,
    prompt,
    removeIcon,
    ribbon,
    size,
    tag,
  } = props

  const pointingClass =
    (pointing === true && 'pointing') ||
    ((pointing === 'left' || pointing === 'right') && `${pointing} pointing`) ||
    ((pointing === 'above' || pointing === 'below') && `pointing ${pointing}`)

  const classes = cx(
    'ui',
    color,
    pointingClass,
    size,
    getKeyOnly(active, 'active'),
    getKeyOnly(basic, 'basic'),
    getKeyOnly(circular, 'circular'),
    getKeyOnly(empty, 'empty'),
    getKeyOnly(floating, 'floating'),
    getKeyOnly(horizontal, 'horizontal'),
    getKeyOnly(image === true, 'image'),
    getKeyOnly(prompt, 'prompt'),
    getKeyOnly(tag, 'tag'),
    getKeyOrValueAndKey(corner, 'corner'),
    getKeyOrValueAndKey(ribbon, 'ribbon'),
    getValueAndKey(attached, 'attached'),
    'label',
    className,
  )
  const rest = getUnhandledProps(Label, props)
  const ElementType = getComponentType(props)

  const handleClick = useEventCallback((e: React.MouseEvent<HTMLElement>) => {
    props?.onClick?.(e, props)
  })

  if (!childrenUtils.isNil(children)) {
    return (
      <ElementType {...rest} className={classes} onClick={handleClick} ref={ref}>
        {children}
      </ElementType>
    )
  }

  const removeIconShorthand = removeIcon === undefined ? 'delete' : removeIcon

  return (
    <ElementType {...rest} className={classes} onClick={handleClick} ref={ref}>
      {Icon.create(icon, { autoGenerateKey: false })}
      {typeof image !== 'boolean' && Image.create(image, { autoGenerateKey: false })}
      {content}
      {LabelDetail.create(detail, { autoGenerateKey: false })}
      {onRemove &&
        Icon.create(removeIconShorthand, {
          autoGenerateKey: false,
          overrideProps: (predefinedProps: IconProps) => ({
            onClick: (e: React.MouseEvent<HTMLElement>) => {
              predefinedProps?.onClick?.(e)
              props?.onRemove?.(e, props)
            },
          }),
        })}
    </ElementType>
  )
}) as ForwardRefComponent<LabelProps, HTMLDivElement> & {
  Detail: typeof LabelDetail
  Group: typeof LabelGroup
}

Label.displayName = 'Label'
Label.handledProps = [
  'active',
  'as',
  'attached',
  'basic',
  'children',
  'circular',
  'className',
  'color',
  'content',
  'corner',
  'detail',
  'empty',
  'floating',
  'horizontal',
  'icon',
  'image',
  'onClick',
  'onRemove',
  'pointing',
  'prompt',
  'removeIcon',
  'ribbon',
  'size',
  'tag',
]

Label.Detail = LabelDetail
Label.Group = LabelGroup

Label.create = createShorthandFactory(Label, (value) => ({ content: value }))

export default Label
