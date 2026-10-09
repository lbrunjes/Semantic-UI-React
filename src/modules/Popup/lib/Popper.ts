import { createPopper } from '@popperjs/core'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { setRef, useIsomorphicLayoutEffect } from '../../../lib'
import { fromPairs, isEqual } from '../../../lib/utils'

// A port of "Popper" & "usePopper()" from "react-popper" (v2.3.0, unmaintained, does not support
// React 19), a thin React binding to "@popperjs/core".

const EMPTY_MODIFIERS = []

const noop = () => undefined
const noopPromise = () => Promise.resolve(null)

/**
 * Creates a Popper.js instance for the elements and syncs its computed styles to React state.
 *
 * @param {Element|Object} referenceElement An element or a virtual element to position against.
 * @param {HTMLElement} popperElement An element to position.
 * @param {Object} [options] Options for Popper.js.
 */
export function usePopper(referenceElement, popperElement, options: any = {}) {
  const prevOptions = React.useRef(null)

  const optionsWithDefaults = {
    onFirstUpdate: options.onFirstUpdate,
    placement: options.placement || 'bottom',
    strategy: options.strategy || 'absolute',
    modifiers: options.modifiers || EMPTY_MODIFIERS,
  }

  const [state, setState] = React.useState<any>({
    styles: {
      popper: { position: optionsWithDefaults.strategy, left: '0', top: '0' },
      arrow: { position: 'absolute' },
    },
    attributes: {},
  })

  // Applies styles via React instead of Popper.js ("applyStyles" is disabled below)
  const updateStateModifier = React.useMemo(
    () => ({
      name: 'updateState',
      enabled: true,
      phase: 'write',
      fn: ({ state: popperState }) => {
        const elements = Object.keys(popperState.elements)

        ReactDOM.flushSync(() => {
          setState({
            styles: fromPairs(
              elements.map((element) => [element, popperState.styles[element] || {}]),
            ),
            attributes: fromPairs(
              elements.map((element) => [element, popperState.attributes[element]]),
            ),
          })
        })
      },
      requires: ['computeStyles'],
    }),
    [],
  )

  const popperOptions = React.useMemo(() => {
    const newOptions = {
      onFirstUpdate: optionsWithDefaults.onFirstUpdate,
      placement: optionsWithDefaults.placement,
      strategy: optionsWithDefaults.strategy,
      modifiers: [
        ...optionsWithDefaults.modifiers,
        updateStateModifier,
        { name: 'applyStyles', enabled: false },
      ],
    }

    // Heads up! "_.isEqual()" compares functions & DOM nodes by identity, like "react-fast-compare"
    if (isEqual(prevOptions.current, newOptions)) {
      return prevOptions.current || newOptions
    }

    prevOptions.current = newOptions
    return newOptions
  }, [
    optionsWithDefaults.onFirstUpdate,
    optionsWithDefaults.placement,
    optionsWithDefaults.strategy,
    optionsWithDefaults.modifiers,
    updateStateModifier,
  ])

  const popperInstanceRef = React.useRef(undefined)

  useIsomorphicLayoutEffect(() => {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.setOptions(popperOptions)
    }
  }, [popperOptions])

  useIsomorphicLayoutEffect(() => {
    if (referenceElement == null || popperElement == null) {
      return undefined
    }

    const popperInstance = createPopper(referenceElement, popperElement, popperOptions)
    popperInstanceRef.current = popperInstance

    return () => {
      popperInstance.destroy()
      popperInstanceRef.current = null
    }
    // Heads up! Options are applied by the effect above
  }, [referenceElement, popperElement])

  return {
    state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
    styles: state.styles,
    attributes: state.attributes,
    update: popperInstanceRef.current ? popperInstanceRef.current.update : null,
    forceUpdate: popperInstanceRef.current ? popperInstanceRef.current.forceUpdate : null,
  }
}

/**
 * Positions an element rendered by `children` (a render function) against `referenceElement`.
 */
export function Popper(props) {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    modifiers = EMPTY_MODIFIERS,
    referenceElement,
    onFirstUpdate,
    innerRef,
    children,
  } = props

  const [popperElement, setPopperElement] = React.useState(null)
  const [arrowElement, setArrowElement] = React.useState(null)

  React.useEffect(() => {
    setRef(innerRef, popperElement)
  }, [innerRef, popperElement])

  const options = React.useMemo(
    () => ({
      placement,
      strategy,
      onFirstUpdate,
      modifiers: [
        ...modifiers,
        { name: 'arrow', enabled: arrowElement != null, options: { element: arrowElement } },
      ],
    }),
    [placement, strategy, onFirstUpdate, modifiers, arrowElement],
  )

  const { state, styles, forceUpdate, update } = usePopper(referenceElement, popperElement, options)

  const childrenProps = React.useMemo(
    () => ({
      ref: setPopperElement,
      style: styles.popper,
      placement: state ? state.placement : placement,
      hasPopperEscaped: state?.modifiersData.hide
        ? state.modifiersData.hide.hasPopperEscaped
        : null,
      isReferenceHidden: state?.modifiersData.hide
        ? state.modifiersData.hide.isReferenceHidden
        : null,
      arrowProps: { style: styles.arrow, ref: setArrowElement },
      forceUpdate: forceUpdate || noop,
      update: update || noopPromise,
    }),
    [placement, state, styles, update, forceUpdate],
  )

  return children(childrenProps)
}
