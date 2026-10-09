import { createPopper } from '@popperjs/core'
import type {
  Instance,
  Modifier,
  Options,
  Placement,
  PositioningStrategy,
  State,
  VirtualElement,
} from '@popperjs/core'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { setRef, useIsomorphicLayoutEffect } from '../../../lib'
import { fromPairs, isEqual } from '../../../lib/utils'

// A port of "Popper" & "usePopper()" from "react-popper" (v2.3.0, unmaintained, does not support
// React 19), a thin React binding to "@popperjs/core".

type PopperModifier = Partial<Modifier<any, any>>

const EMPTY_MODIFIERS: PopperModifier[] = []

const noop = () => undefined
const noopPromise = () => Promise.resolve(null)

/**
 * Creates a Popper.js instance for the elements and syncs its computed styles to React state.
 *
 * @param {Element|Object} referenceElement An element or a virtual element to position against.
 * @param {HTMLElement} popperElement An element to position.
 * @param {Object} [options] Options for Popper.js.
 */
export function usePopper(
  referenceElement: Element | VirtualElement | null | undefined,
  popperElement: HTMLElement | null | undefined,
  options: any = {},
) {
  const prevOptions = React.useRef<Partial<Options> | null>(null)

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
      fn: ({ state: popperState }: { state: State }) => {
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
    const newOptions: Partial<Options> = {
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

  const popperInstanceRef = React.useRef<Instance | null | undefined>(undefined)

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

export interface PopperChildrenProps {
  ref: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  style: React.CSSProperties
  placement: Placement
  hasPopperEscaped: boolean | null | undefined
  isReferenceHidden: boolean | null | undefined
  arrowProps: {
    style: React.CSSProperties
    ref: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  }
  forceUpdate: () => void
  update: () => Promise<Partial<State> | null>
}

export interface PopperProps {
  placement?: Placement
  strategy?: PositioningStrategy | null
  modifiers?: PopperModifier[]
  referenceElement?: Element | VirtualElement | null
  onFirstUpdate?: (state: Partial<State>) => void
  innerRef?: React.Ref<HTMLElement | null>
  children: (childrenProps: PopperChildrenProps) => React.ReactNode
}

/**
 * Positions an element rendered by `children` (a render function) against `referenceElement`.
 */
export function Popper(props: PopperProps) {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    modifiers = EMPTY_MODIFIERS,
    referenceElement,
    onFirstUpdate,
    innerRef,
    children,
  } = props

  const [popperElement, setPopperElement] = React.useState<HTMLElement | null>(null)
  const [arrowElement, setArrowElement] = React.useState<HTMLElement | null>(null)

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
