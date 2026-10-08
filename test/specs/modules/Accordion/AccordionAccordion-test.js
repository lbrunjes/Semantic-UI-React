import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import AccordionAccordion from 'src/modules/Accordion/AccordionAccordion'
import * as common from 'test/specs/commonTests'
import { consoleUtil } from 'test/utils'

describe('AccordionAccordion', () => {
  common.isConformant(AccordionAccordion)
  common.forwardsRef(AccordionAccordion)
  common.rendersChildren(AccordionAccordion, {
    rendersContent: false,
  })

  common.implementsCreateMethod(AccordionAccordion)

  describe('activeIndex', () => {
    const panels = [
      { key: 'A', title: 'A', content: 'Something A' },
      { key: 'B', title: 'B', content: 'Something B' },
      { key: 'C', title: 'C', content: 'Something C' },
    ]
    const getTitles = (container) => container.querySelectorAll('.title')

    it('there is no active items by default', () => {
      const { container } = render(<AccordionAccordion panels={panels} />)

      expect(container.querySelector('.active')).not.toBeInTheDocument()
    })

    it('there is no active items by default when "exclusive" is false', () => {
      const { container } = render(<AccordionAccordion exclusive={false} panels={panels} />)

      expect(container.querySelector('.active')).not.toBeInTheDocument()
    })

    it('activates an item', () => {
      const { container } = render(<AccordionAccordion activeIndex={0} panels={panels} />)
      const titles = getTitles(container)

      expect(titles[0]).toHaveClass('active')
      expect(titles[1]).not.toHaveClass('active')
      expect(titles[2]).not.toHaveClass('active')
    })

    it('items can be toggled by a click', () => {
      const { container } = render(<AccordionAccordion panels={panels} />)

      fireEvent.click(getTitles(container)[0])
      expect(getTitles(container)[0]).toHaveClass('active')

      fireEvent.click(getTitles(container)[0])
      expect(getTitles(container)[0]).not.toHaveClass('active')
    })

    it('activates a proper item', () => {
      const { container, rerender } = render(<AccordionAccordion activeIndex={0} panels={panels} />)

      rerender(<AccordionAccordion activeIndex={1} panels={panels} />)
      const titles = getTitles(container)

      expect(titles[0]).not.toHaveClass('active')
      expect(titles[1]).toHaveClass('active')
      expect(titles[2]).not.toHaveClass('active')
    })

    it('can activate a single item when "exclusive" is false', () => {
      const { container } = render(
        <AccordionAccordion activeIndex={[0]} exclusive={false} panels={panels} />,
      )
      const titles = getTitles(container)

      expect(titles[0]).toHaveClass('active')
      expect(titles[1]).not.toHaveClass('active')
      expect(titles[2]).not.toHaveClass('active')
    })

    it('can activate multiple items when "exclusive" is false', () => {
      const { container, rerender } = render(
        <AccordionAccordion activeIndex={[0, 1]} exclusive={false} panels={panels} />,
      )

      expect(getTitles(container)[0]).toHaveClass('active')
      expect(getTitles(container)[1]).toHaveClass('active')
      expect(getTitles(container)[2]).not.toHaveClass('active')

      rerender(<AccordionAccordion activeIndex={[1, 2]} exclusive={false} panels={panels} />)

      expect(getTitles(container)[0]).not.toHaveClass('active')
      expect(getTitles(container)[1]).toHaveClass('active')
      expect(getTitles(container)[2]).toHaveClass('active')
    })

    it('can be inclusive and can open multiple panels by clicking', () => {
      const { container } = render(<AccordionAccordion exclusive={false} panels={panels} />)

      fireEvent.click(getTitles(container)[0])
      expect(getTitles(container)[0]).toHaveClass('active')

      fireEvent.click(getTitles(container)[1])
      expect(getTitles(container)[0]).toHaveClass('active')
      expect(getTitles(container)[1]).toHaveClass('active')
    })

    it('can be inclusive and close multiple panels by clicking', () => {
      const { container } = render(
        <AccordionAccordion defaultActiveIndex={[0, 1]} exclusive={false} panels={panels} />,
      )

      fireEvent.click(getTitles(container)[0])
      expect(getTitles(container)[0]).not.toHaveClass('active')
      expect(getTitles(container)[1]).toHaveClass('active')

      fireEvent.click(getTitles(container)[1])
      expect(getTitles(container)[0]).not.toHaveClass('active')
      expect(getTitles(container)[1]).not.toHaveClass('active')
    })

    it('warns if is `exclusive` and is given an array', () => {
      consoleUtil.disableOnce()

      const consoleError = vi.spyOn(console, 'error')
      render(<AccordionAccordion exclusive activeIndex={[1]} />)

      expect(consoleError).toHaveBeenCalledTimes(1)
    })

    it('warns if not `exclusive` and is given a number', () => {
      consoleUtil.disableOnce()

      const consoleError = vi.spyOn(console, 'error')
      render(<AccordionAccordion exclusive={false} activeIndex={1} />)

      expect(consoleError).toHaveBeenCalledTimes(1)
    })
  })

  describe('defaultActiveIndex', () => {
    it('sets the initial activeIndex state', () => {
      const { container } = render(
        <AccordionAccordion
          defaultActiveIndex={1}
          panels={[
            { key: 'A', title: 'A', content: 'Something A' },
            { key: 'B', title: 'B', content: 'Something B' },
          ]}
        />,
      )
      const titles = container.querySelectorAll('.title')

      expect(titles[0]).not.toHaveClass('active')
      expect(titles[1]).toHaveClass('active')
    })
  })

  describe('onTitleClick', () => {
    it('is called with (e, titleProps) when clicked', () => {
      const onClick = vi.fn()
      const onTitleClick = vi.fn()
      const panels = [
        { key: 'A', title: { content: 'A', onClick } },
        { key: 'B', title: 'B' },
      ]

      const { container } = render(
        <AccordionAccordion panels={panels} onTitleClick={onTitleClick} />,
      )
      fireEvent.click(container.querySelectorAll('.title')[0])

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ index: 0, content: 'A' }),
      )
      expect(onTitleClick).toHaveBeenCalledTimes(1)
      expect(onTitleClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ index: 0, content: 'A' }),
      )
    })
  })

  describe('panels', () => {
    const renderPanels = (onClick) => {
      const panels = [
        {
          key: 'A',
          title: { content: 'A', onClick },
          content: { content: 'Content A', 'data-foo': 'something' },
        },
        { key: 'B', title: 'B', content: { content: 'Content B', 'data-foo': 'something' } },
      ]
      const { container } = render(<AccordionAccordion panels={panels} />)

      return {
        titles: container.querySelectorAll('.title'),
        contents: container.querySelectorAll('.content'),
      }
    }

    it('renders children', () => {
      const { titles, contents } = renderPanels()

      expect(titles).toHaveLength(2)
      expect(contents).toHaveLength(2)

      expect(titles[0]).toHaveTextContent('A')
      expect(contents[0]).toHaveTextContent('Content A')

      expect(titles[1]).toHaveTextContent('B')
      expect(contents[1]).toHaveTextContent('Content B')
    })

    it('passes onClick handler', () => {
      const onClick = vi.fn()
      const { titles } = renderPanels(onClick)

      fireEvent.click(titles[0])

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ content: 'A', index: 0 }),
      )
    })

    it('passes arbitrary props', () => {
      const { contents } = renderPanels()

      contents.forEach((item) => expect(item).toHaveAttribute('data-foo', 'something'))
    })
  })
})
