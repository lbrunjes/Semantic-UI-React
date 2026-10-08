import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import AccordionContent from 'src/modules/Accordion/AccordionContent'
import AccordionPanel from 'src/modules/Accordion/AccordionPanel'
import AccordionTitle from 'src/modules/Accordion/AccordionTitle'
import * as common from 'test/specs/commonTests'

describe('AccordionPanel', () => {
  common.isConformant(AccordionPanel, { rendersChildren: false, forwardsRef: false })

  common.implementsShorthandProp(AccordionPanel, {
    assertExactMatch: false,
    autoGenerateKey: false,
    parentIsFragment: true,
    propKey: 'content',
    ShorthandComponent: AccordionContent,
    mapValueToProps: (content) => ({ content }),
  })
  common.implementsShorthandProp(AccordionPanel, {
    assertExactMatch: false,
    autoGenerateKey: false,
    parentIsFragment: true,
    propKey: 'title',
    ShorthandComponent: AccordionTitle,
    mapValueToProps: (content) => ({ content }),
  })

  describe('active', () => {
    it('should passed to children', () => {
      const { container } = render(<AccordionPanel active content='Content' title='Title' />)
      const [title, content] = container.children

      expect(title).toHaveClassName('active title')
      expect(content).toHaveClassName('content active')
    })
  })

  describe('index', () => {
    it('should passed to title', () => {
      const onTitleClick = vi.fn()
      const { container } = render(
        <AccordionPanel content='Content' index={5} onTitleClick={onTitleClick} title='Title' />,
      )
      const [title, content] = container.children

      // Heads up! "index" is handled by AccordionTitle and is visible only in its callbacks
      fireEvent.click(title)
      expect(onTitleClick).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ index: 5 }),
      )

      // AccordionContent does not handle "index", it would be passed to the DOM
      expect(content).not.toHaveAttribute('index')
    })
  })

  describe('onTitleClick', () => {
    it('is called with (e, titleProps) when clicked', () => {
      const onClick = vi.fn()
      const onTitleClick = vi.fn()

      const { container } = render(
        <AccordionPanel
          content='Content'
          onTitleClick={onTitleClick}
          title={{ content: 'Title', onClick }}
        />,
      )
      fireEvent.click(container.querySelector('.title'))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ content: 'Title' }),
      )

      expect(onTitleClick).toHaveBeenCalledTimes(1)
      expect(onTitleClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ content: 'Title' }),
      )
    })
  })
})
