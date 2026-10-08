import { fireEvent } from '@testing-library/react'
import React from 'react'

import Step from 'src/elements/Step/Step'
import StepContent from 'src/elements/Step/StepContent'
import StepDescription from 'src/elements/Step/StepDescription'
import StepTitle from 'src/elements/Step/StepTitle'
import * as common from 'test/specs/commonTests'
import faker from 'test/utils/faker'
import { renderRoot } from 'test/utils'

describe('Step', () => {
  common.isConformant(Step)
  common.forwardsRef(Step)
  common.forwardsRef(Step, { requiredProps: { content: faker.lorem.word() } })
  common.forwardsRef(Step, { requiredProps: { content: <span /> } })
  common.hasSubcomponents(Step, [StepContent, StepDescription, StepTitle])
  common.rendersChildren(Step)

  common.implementsIconProp(Step, { autoGenerateKey: false })

  common.propKeyOnlyToClassName(Step, 'active')
  common.propKeyOnlyToClassName(Step, 'completed')
  common.propKeyOnlyToClassName(Step, 'disabled')
  common.propKeyOnlyToClassName(Step, 'link')

  it('renders as a div by default', () => {
    expect(renderRoot(<Step />).tagName).toBe('DIV')
  })

  describe('children', () => {
    it('does not render StepContent', () => {
      const root = renderRoot(<Step>{faker.hacker.phrase()}</Step>)

      expect(root.querySelector('.content')).not.toBeInTheDocument()
    })
  })

  describe('description', () => {
    it('passes prop to StepContent', () => {
      const description = faker.hacker.phrase()
      const root = renderRoot(<Step description={description} />)

      expect(root.querySelector('.content > .description')).toHaveTextContent(description)
    })
  })

  describe('href', () => {
    it('renders as `a` when defined', () => {
      const url = faker.internet.url()
      const root = renderRoot(<Step href={url} />)

      expect(root.tagName).toBe('A')
      expect(root).toHaveAttribute('href', url)
    })
  })

  describe('onClick', () => {
    it('is called with (e, data) when clicked', () => {
      const onClick = vi.fn()

      fireEvent.click(renderRoot(<Step onClick={onClick} />))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' }),
        expect.objectContaining({ onClick }),
      )
    })

    it('is not called when is disabled', () => {
      const onClick = vi.fn()

      fireEvent.click(renderRoot(<Step disabled onClick={onClick} />))

      expect(onClick).not.toHaveBeenCalled()
    })

    it('renders as `a` when defined', () => {
      expect(renderRoot(<Step onClick={() => null} />).tagName).toBe('A')
    })
  })

  describe('title', () => {
    it('passes prop to StepContent', () => {
      const title = faker.hacker.phrase()
      const root = renderRoot(<Step title={title} />)

      expect(root.querySelector('.content > .title')).toHaveTextContent(title)
    })
  })
})
