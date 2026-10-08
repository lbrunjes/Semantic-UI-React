import { fireEvent } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import Label from 'src/elements/Label/Label'
import LabelDetail from 'src/elements/Label/LabelDetail'
import LabelGroup from 'src/elements/Label/LabelGroup'
import * as common from 'test/specs/commonTests'
import { SUI } from 'src/lib'
import { renderRoot } from 'test/utils'

describe('Label', () => {
  common.isConformant(Label)
  common.forwardsRef(Label)
  common.forwardsRef(Label, { requiredProps: { children: <span /> } })
  common.hasSubcomponents(Label, [LabelDetail, LabelGroup])
  common.hasUIClassName(Label)
  common.rendersChildren(Label)

  common.implementsCreateMethod(Label)
  common.implementsIconProp(Label, { autoGenerateKey: false })
  common.implementsImageProp(Label, { autoGenerateKey: false })
  common.implementsShorthandProp(Label, {
    autoGenerateKey: false,
    propKey: 'detail',
    ShorthandComponent: LabelDetail,
    mapValueToProps: (val) => ({ content: val }),
  })

  common.propKeyAndValueToClassName(Label, 'attached', [
    'top',
    'bottom',
    'top right',
    'top left',
    'bottom left',
    'bottom right',
  ])

  common.propKeyOnlyToClassName(Label, 'active')
  common.propKeyOnlyToClassName(Label, 'basic')
  common.propKeyOnlyToClassName(Label, 'circular')
  common.propKeyOnlyToClassName(Label, 'empty')
  common.propKeyOnlyToClassName(Label, 'floating')
  common.propKeyOnlyToClassName(Label, 'horizontal')
  common.propKeyOnlyToClassName(Label, 'prompt')
  common.propKeyOnlyToClassName(Label, 'tag')

  common.propKeyOrValueAndKeyToClassName(Label, 'corner', ['left', 'right'])
  common.propKeyOrValueAndKeyToClassName(Label, 'ribbon', ['right'])

  common.propValueOnlyToClassName(Label, 'color', SUI.COLORS)
  common.propValueOnlyToClassName(Label, 'size', SUI.SIZES)

  it('is a div by default', () => {
    expect(renderRoot(<Label />).tagName).toBe('DIV')
  })

  describe('removeIcon', () => {
    it('has no icon without onRemove', () => {
      expect(renderRoot(<Label />).querySelector('i.icon')).not.toBeInTheDocument()
    })

    it('has delete icon by default', () => {
      const root = renderRoot(<Label onRemove={_.noop} />)

      expect(root.querySelectorAll('i.icon')).toHaveLength(1)
      expect(root.querySelector('i.icon')).toHaveClassName('delete icon')
    })

    it('uses passed removeIcon string', () => {
      const root = renderRoot(<Label onRemove={_.noop} removeIcon='foo' />)

      expect(root.querySelectorAll('i.icon')).toHaveLength(1)
      expect(root.querySelector('i.icon')).toHaveClassName('foo icon')
    })

    it('uses passed removeIcon props', () => {
      const root = renderRoot(<Label onRemove={_.noop} removeIcon={{ 'data-foo': true }} />)

      expect(root.querySelector('i.icon')).toHaveAttribute('data-foo', 'true')
    })

    it('handles events on Label and Icon', () => {
      const iconSpy = vi.fn()
      const labelSpy = vi.fn()

      const iconProps = { 'data-foo': true, onClick: iconSpy }
      const labelProps = { onRemove: labelSpy, removeIcon: iconProps }

      const root = renderRoot(<Label {...labelProps} />)
      fireEvent.click(root.querySelector('i.icon'))

      expect(iconSpy).toHaveBeenCalledTimes(1)
      expect(labelSpy).toHaveBeenCalledTimes(1)
      expect(labelSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining(labelProps),
      )
    })
  })

  describe('image', () => {
    it('adds an image class when true', () => {
      expect(renderRoot(<Label image />)).toHaveClass('image')
    })
    it('does not add an Image when true', () => {
      const root = renderRoot(<Label image />)

      expect(root.querySelector('img')).not.toBeInTheDocument()
      expect(root.querySelector('.image')).not.toBeInTheDocument()
    })
  })

  describe('onClick', () => {
    it('is called with (e) when clicked', () => {
      const onClick = vi.fn()

      fireEvent.click(renderRoot(<Label onClick={onClick} />))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.anything(),
      )
    })
  })

  describe('pointing', () => {
    it('adds an poiting class when true', () => {
      expect(renderRoot(<Label pointing />)).toHaveClass('pointing')
    })

    it('does not add any poiting option class when true', () => {
      const options = ['above', 'below', 'left', 'right']
      const root = renderRoot(<Label pointing />)

      options.forEach((className) => expect(root).not.toHaveClass(className))
    })

    it('adds `above` as suffix', () => {
      expect(renderRoot(<Label pointing='above' />)).toHaveClassName('pointing above')
    })

    it('adds `below` as suffix', () => {
      expect(renderRoot(<Label pointing='below' />)).toHaveClassName('pointing below')
    })

    it('adds `left` as prefix', () => {
      expect(renderRoot(<Label pointing='left' />)).toHaveClassName('left pointing')
    })

    it('adds `right` as prefix', () => {
      expect(renderRoot(<Label pointing='right' />)).toHaveClassName('right pointing')
    })
  })
})
