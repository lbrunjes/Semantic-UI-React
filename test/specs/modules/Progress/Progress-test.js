import { render } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import { SUI } from 'src/lib'
import Progress from 'src/modules/Progress/Progress'
import * as common from 'test/specs/commonTests'
import { renderRoot } from 'test/utils'

// Heads up! The root element also has "progress" className, "querySelector()" searches only
// descendants
const getProgressText = (element) => renderRoot(element).querySelector('.progress')

describe('Progress', () => {
  common.isConformant(Progress)
  common.forwardsRef(Progress)
  common.hasUIClassName(Progress)
  common.rendersChildren(Progress)

  common.propKeyAndValueToClassName(Progress, 'attached', ['top', 'bottom'])

  common.propKeyOnlyToClassName(Progress, 'active')
  common.propKeyOnlyToClassName(Progress, 'disabled')
  common.propKeyOnlyToClassName(Progress, 'error')
  common.propKeyOnlyToClassName(Progress, 'indicating')
  common.propKeyOnlyToClassName(Progress, 'inverted')
  common.propKeyOnlyToClassName(Progress, 'success')
  common.propKeyOnlyToClassName(Progress, 'warning')

  common.propValueOnlyToClassName(Progress, 'color', SUI.COLORS)
  common.propValueOnlyToClassName(Progress, 'size', _.without(SUI.SIZES, 'mini', 'huge', 'massive'))

  it('contains div with className bar', () => {
    const root = renderRoot(<Progress />)

    expect(root.tagName).toBe('DIV')
    expect(root.querySelector('.bar')).toBeInTheDocument()
    expect(root.querySelector('.bar').tagName).toBe('DIV')
  })

  describe('attached', () => {
    it('removes the progress label from the bar', () => {
      const root = renderRoot(<Progress attached='top' />)

      expect(root.querySelector('.bar .progress')).not.toBeInTheDocument()
    })
  })

  describe('autoSuccess', () => {
    it('applies the success class when percent >= 100%', () => {
      const { container, rerender } = render(<Progress autoSuccess />)

      rerender(<Progress autoSuccess percent={100} />)
      expect(container.firstElementChild).toHaveClass('success')

      rerender(<Progress autoSuccess percent={99} />)
      expect(container.firstElementChild).not.toHaveClass('success')

      rerender(<Progress autoSuccess percent={101} />)
      expect(container.firstElementChild).toHaveClass('success')
    })

    it('applies the success class when value >= total', () => {
      const { container, rerender } = render(<Progress autoSuccess />)

      rerender(<Progress autoSuccess total={1} value={1} />)
      expect(container.firstElementChild).toHaveClass('success')

      rerender(<Progress autoSuccess total={1} value={0} />)
      expect(container.firstElementChild).not.toHaveClass('success')

      rerender(<Progress autoSuccess total={1} value={2} />)
      expect(container.firstElementChild).toHaveClass('success')
    })
  })

  describe('bar', () => {
    it('has a width equal to the percent complete', () => {
      expect(renderRoot(<Progress percent={33.333} />).querySelector('.bar')).toHaveStyle({
        width: '33.333%',
      })
    })
    it('cannot have its width set >100%', () => {
      expect(renderRoot(<Progress percent={101} />).querySelector('.bar')).toHaveStyle({
        width: '100%',
      })
    })
    it('cannot have its width set <0%', () => {
      expect(renderRoot(<Progress percent={-1} />).querySelector('.bar')).toHaveStyle({
        width: '0%',
      })
    })
    it('has a width equal to the percentage of the value of the total, when progress="value"', () => {
      expect(
        renderRoot(<Progress progress='value' value={5} total={10} />).querySelector('.bar'),
      ).toHaveStyle({ width: '50%' })
    })
  })

  describe('data-percent', () => {
    it('adds prop by default', () => {
      expect(renderRoot(<Progress />)).toHaveAttribute('data-percent')
    })

    it('passes value of percent prop', () => {
      expect(renderRoot(<Progress percent={10} />)).toHaveAttribute('data-percent', '10')
    })

    it('floors the value of percent prop', () => {
      expect(renderRoot(<Progress percent={8.28} />)).toHaveAttribute('data-percent', '8')
    })

    it('floors the results value and total props', () => {
      expect(renderRoot(<Progress value={828} total={10000} />)).toHaveAttribute(
        'data-percent',
        '8',
      )
    })
  })

  describe('indicating', () => {
    it('adds the "active" class', () => {
      expect(renderRoot(<Progress indicating />)).toHaveClass('active')
    })
  })

  describe('label', () => {
    it('shows the label text when provided', () => {
      expect(renderRoot(<Progress label='some-label' />).querySelector('.label')).toHaveTextContent(
        'some-label',
      )
    })
  })

  describe('progress', () => {
    it('hides the progress text by default', () => {
      expect(renderRoot(<Progress />).querySelector('.bar .progress')).not.toBeInTheDocument()
    })
    it('shows the progress text when true', () => {
      expect(renderRoot(<Progress progress />).querySelector('.bar .progress')).toBeInTheDocument()
    })
    it('hides the progress text when false', () => {
      expect(
        renderRoot(<Progress progress={false} />).querySelector('.bar .progress'),
      ).not.toBeInTheDocument()
    })
    it('displays the progress as a percentage by default', () => {
      const root = renderRoot(<Progress percent={20} progress />)

      expect(root.querySelector('.progress')).toBeInTheDocument()
      expect(root).toHaveTextContent('20%')
    })
    it('displays the progress as a ratio when set to "ratio"', () => {
      expect(getProgressText(<Progress progress='ratio' value={1} total={2} />)).toHaveTextContent(
        '1/2',
      )
    })
    it('displays the progress as a percentage when set to "percent"', () => {
      expect(
        getProgressText(<Progress progress='percent' value={1} total={2} />),
      ).toHaveTextContent('50%')
    })
    it('displays the progress as text when set to "value"', () => {
      expect(getProgressText(<Progress progress='value' value={1} total={2} />)).toHaveTextContent(
        '1',
      )
    })
    it('shows the percent complete', () => {
      expect(getProgressText(<Progress percent={72} progress />)).toHaveTextContent('72%')
    })
    it('cannot be set >100%', () => {
      expect(getProgressText(<Progress percent={101} progress />)).toHaveTextContent('100%')
    })
    it('cannot be set <0%', () => {
      expect(getProgressText(<Progress percent={-1} progress />)).toHaveTextContent('0%')
    })
    it('displays values with a decimal', () => {
      expect(getProgressText(<Progress percent={10.12345} progress />)).toHaveTextContent(
        '10.12345%',
      )
    })
    it('displays values without a decimal', () => {
      expect(getProgressText(<Progress percent={35} progress />)).toHaveTextContent('35%')
    })
  })

  describe('precision', () => {
    it('rounds the progress label to 0 decimal places by default', () => {
      expect(getProgressText(<Progress percent={10.12345} precision={0} />)).toHaveTextContent(
        '10%',
      )
    })
    it('removes the decimal from progress label when set to 0', () => {
      expect(getProgressText(<Progress percent={10.12345} precision={0} />)).toHaveTextContent(
        '10%',
      )
    })
    it('rounds the decimal in the progress label to the number of digits', () => {
      expect(getProgressText(<Progress percent={10.12345} precision={1} />)).toHaveTextContent(
        '10.1%',
      )
      expect(getProgressText(<Progress percent={10.12345} precision={4} />)).toHaveTextContent(
        '10.1235%',
      )
    })
  })

  describe('total/value', () => {
    it('calculates the percent complete', () => {
      expect(getProgressText(<Progress value={1} total={2} progress />)).toHaveTextContent('50%')
    })
  })
})
