import { render } from '@testing-library/react'
import React from 'react'

import TransitionGroup from 'src/modules/Transition/TransitionGroup'
import {
  TRANSITION_STATUS_ENTERED,
  TRANSITION_STATUS_ENTERING,
  TRANSITION_STATUS_EXITING,
} from 'src/modules/Transition/utils/computeStatuses'
import * as common from 'test/specs/commonTests'

describe('TransitionGroup', () => {
  common.isConformant(TransitionGroup, {
    rendersFragmentByDefault: true,
    rendersChildren: false,
  })
  common.forwardsRef(TransitionGroup, { requiredProps: { as: 'div' } })

  describe('children', () => {
    // Heads up! A child wrapped with Transition gets "data-test-status" attribute & Transition's classes
    it('wraps all children to Transition', () => {
      const { container } = render(
        <TransitionGroup>
          <div />
          <div />
          <div />
        </TransitionGroup>,
      )

      expect(container.children).toHaveLength(3)
      Array.from(container.children).forEach((child) => {
        expect(child).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERED)
        expect(child).toHaveClass('fade', 'visible', 'transition')
      })
    })

    it('passes props to children', () => {
      const { container, rerender } = render(
        <TransitionGroup animation='scale' directional duration={1500}>
          <div />
          <div />
          <div />
        </TransitionGroup>,
      )

      expect(container.children).toHaveLength(3)
      Array.from(container.children).forEach((child) => {
        expect(child).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERED)
        // "animation" & "directional"
        expect(child).toHaveClass('scale', 'visible', 'transition')
      })

      // "duration" is visible only during a transition
      rerender(<TransitionGroup animation='scale' directional duration={1500} />)

      expect(container.children).toHaveLength(3)
      Array.from(container.children).forEach((child) => {
        expect(child).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
        expect(child).toHaveClass('scale', 'out')
        expect(child).toHaveStyle({ animationDuration: '1500ms' })
      })
    })

    it('wraps new child to Transition and sets transitionOnMount to true', () => {
      const { container, rerender } = render(
        <TransitionGroup>
          <div key='first' id='first' />
        </TransitionGroup>,
      )
      rerender(
        <TransitionGroup>
          {[<div key='first' id='first' />, <div key='second' id='second' />]}
        </TransitionGroup>,
      )

      const secondChild = container.children[1]

      expect(secondChild).toHaveAttribute('id', 'second')
      expect(secondChild).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERING)
      expect(secondChild).toHaveAttribute('data-test-next-status', TRANSITION_STATUS_ENTERED)
    })

    it('skips invalid children', () => {
      const { container, rerender } = render(
        <TransitionGroup>
          <div key='first' id='first' />
        </TransitionGroup>,
      )
      rerender(
        <TransitionGroup>
          {[<div key='first' id='first' />, '', <div key='second' id='second' />]}
        </TransitionGroup>,
      )

      expect(container.childNodes).toHaveLength(2)
      expect(container.children[0]).toHaveAttribute('id', 'first')
      expect(container.children[1]).toHaveAttribute('id', 'second')
    })

    it('sets visible to false when child was removed', () => {
      const { container, rerender } = render(
        <TransitionGroup>
          <div key='first' id='first' />
          <div key='second' id='second' />
        </TransitionGroup>,
      )
      rerender(<TransitionGroup>{[<div key='first' id='first' />]}</TransitionGroup>)

      expect(container.children).toHaveLength(2)
      expect(container.children[0]).toHaveAttribute('id', 'first')
      expect(container.children[0]).toHaveAttribute('data-test-status', TRANSITION_STATUS_ENTERED)
      expect(container.children[1]).toHaveAttribute('id', 'second')
      expect(container.children[1]).toHaveAttribute('data-test-status', TRANSITION_STATUS_EXITING)
    })

    it('removes child after transition', () => {
      const { container, rerender } = render(
        <TransitionGroup duration={0}>
          <div key='first' id='first' />
          <div key='second' id='second' />
        </TransitionGroup>,
      )
      rerender(<TransitionGroup duration={0}>{[<div key='first' id='first' />]}</TransitionGroup>)

      expect(container.children).toHaveLength(1)
      expect(container.children[0]).toHaveAttribute('id', 'first')
    })
  })
})
