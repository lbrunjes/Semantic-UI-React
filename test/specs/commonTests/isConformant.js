import { fireEvent, render } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as semanticUIReact from 'semantic-ui-react'

import { isValidElementType } from 'src/lib/reactIs'
import {
  componentInfoContext,
  consoleUtil,
  getComponentName,
  getComponentProps,
  syntheticEvent,
} from 'test/utils'
import faker from 'test/utils/faker'
import hasValidTypings from './hasValidTypings'

/**
 * Assert Component conforms to guidelines that are applicable to all components.
 * @param {React.Component|Function} Component A component that should conform.
 * @param {Object} [options={}]
 * @param {string} [options.componentClassName] The Semantic UI className of the component, by
 *   default it is computed from the component's name (i.e. "item" for "ListItem").
 * @param {Object} [options.eventTargets={}] Map of events and a CSS selector of the element to target.
 * @param {boolean} [options.rendersChildren=false] Does this component render any children?
 * @param {boolean} [options.rendersFragmentByDefault=false] Does this component renders React.Fragment by default?
 * @param {boolean} [options.rendersPortal=false] Does this component render a Portal powered component?
 * @param {Object} [options.requiredProps={}] Props required to render Component without errors or warnings.
 * @param {boolean} [options.spreadsUserProps=true] Are user props spread to a DOM element? Disable
 *   it for components that pass them to components without a DOM element (i.e. "Portal"), and test
 *   that props are passed instead.
 * @param {Object} [options.forwardsRef=true] Indicates if component forwards refs.
 */
export default function isConformant(Component, options = {}) {
  const {
    eventTargets = {},
    requiredProps = {},
    rendersChildren = true,
    rendersFragmentByDefault = false,
    rendersPortal = false,
    spreadsUserProps = true,
  } = options
  const constructorName = getComponentName(Component)

  // Renders the component and returns its root DOM node
  const renderWithProps = (props) =>
    render(<Component {...requiredProps} {...props} />).container.firstElementChild

  // Data for events that React ignores otherwise
  const getEventInit = (listenerName, tagName) => {
    // React ignores "keypress" events without a char code
    if (listenerName === 'onKeyPress') return { charCode: 13 }

    // React fires "onChange" for form fields only when their value changes
    if (listenerName === 'onChange' && ['input', 'select', 'textarea'].includes(tagName)) {
      return { target: { value: 'is-conformant-value' } }
    }

    return undefined
  }

  // Checks that a plain element receives an event, some events are handled by React only on
  // specific elements (i.e. "onLoad" on "img") or are not supported by jsdom (i.e. animations)
  const firesOnPlainElement = _.memoize(
    (tagName, listenerName) => {
      const handler = vi.fn()
      const eventName = _.camelCase(listenerName.replace('on', ''))
      const { container, unmount } = render(
        React.createElement(tagName, { [listenerName]: handler }),
      )

      fireEvent[eventName](container.firstElementChild, getEventInit(listenerName, tagName))
      unmount()

      return handler.mock.calls.length === 1
    },
    (tagName, listenerName) => `${tagName}:${listenerName}`,
  )

  it('a valid component should be exported', () => {
    expect(
      isValidElementType(Component),
      `Components should export a class or function, got: ${typeof Component}.`,
    ).toBe(true)
  })

  it('a component should be a function/class or "displayName" should be defined', () => {
    if (!constructorName) {
      throw new Error(
        [
          'Component is not a named function and does not have a "displayName".',
          'This should help identify it:\n\n',
          `${ReactDOMServer.renderToStaticMarkup(<Component {...requiredProps} />)}`,
        ].join(''),
      )
    }
  })

  const info = componentInfoContext.byDisplayName[constructorName]

  // ----------------------------------------
  // Class and file name
  // ----------------------------------------
  it(`constructor name matches filename "${constructorName}"`, () => {
    expect(constructorName).toBe(info.filenameWithoutExt)
  })

  // ----------------------------------------
  // Is exported or private
  // ----------------------------------------
  // detect components like: semanticUIReact.H1
  const isTopLevelAPIProp = _.has(semanticUIReact, constructorName)

  // find the apiPath in the semanticUIReact object
  const foundAsSubcomponent = isValidElementType(_.get(semanticUIReact, info.apiPath))

  // require all components to be exported at the top level
  it('is exported at the top level', () => {
    expect(
      isTopLevelAPIProp,
      `"${info.displayName}" must be exported at top level. Export it in \`src/index.js\`.`,
    ).toBe(true)
  })

  if (info.isChild) {
    it('is a static component on its parent', () => {
      expect(
        foundAsSubcomponent,
        `\`${info.displayName}\` is a child component (is in ${info.repoPath}).` +
          ` It must be a static prop of its parent \`${info.parentDisplayName}\``,
      ).toBe(true)
    })
  }

  // ----------------------------------------
  // Props
  // ----------------------------------------
  if (rendersChildren && spreadsUserProps) {
    it('spreads user props', () => {
      // silence element nesting warnings, i.e. "tbody" rendered in a "div"
      consoleUtil.disableOnce()

      const propName = 'data-is-conformant-spread-props'
      const props = {
        as: rendersFragmentByDefault ? 'div' : undefined,
        // Portal powered components render nothing until they are open
        open: rendersPortal ? true : undefined,
        [propName]: true,
      }

      const { baseElement } = render(<Component {...props} {...requiredProps} />)

      expect(baseElement.querySelector(`[${propName}]`)).toBeInTheDocument()
    })
  }

  if (rendersChildren && !rendersPortal) {
    describe('"as" prop (common)', () => {
      it('renders the component as HTML tags', () => {
        // silence element nesting warnings
        consoleUtil.disableOnce()

        const tags = [
          'a',
          'em',
          'div',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'i',
          'p',
          'span',
          'strong',
        ]

        tags.forEach((tag) => {
          expect(renderWithProps({ as: tag })).toHaveProperty('tagName', tag.toUpperCase())
        })
      })

      it('renders as a functional component', () => {
        // silence warnings from React as components may pass refs to function components
        consoleUtil.disableOnce()

        const MyComponent = ({ children }) => <div data-my-functional-component>{children}</div>

        expect(renderWithProps({ as: MyComponent })).toHaveAttribute('data-my-functional-component')
      })

      it('renders as a ReactClass', () => {
        class MyComponent extends React.Component {
          render() {
            return <div data-my-react-class>{this.props.children}</div>
          }
        }

        expect(renderWithProps({ as: MyComponent })).toHaveAttribute('data-my-react-class')
      })

      it('passes extra props to the component it is renders as', () => {
        // silence warnings from React as components may pass refs to function components
        consoleUtil.disableOnce()

        const MyComponent = (props) => (
          <div data-extra-prop={props['data-extra-prop']}>{props.children}</div>
        )

        expect(renderWithProps({ as: MyComponent, 'data-extra-prop': 'foo' })).toHaveAttribute(
          'data-extra-prop',
          'foo',
        )
      })
    })
  }

  describe('handles props', () => {
    const componentProps = getComponentProps(Component)

    it('defines handled props in Component.handledProps', () => {
      expect(componentProps).toHaveProperty('handledProps')
      expect(componentProps.handledProps).toBeInstanceOf(Array)
    })

    it('Component.handledProps includes all handled props', () => {
      const computedProps = _.union(
        componentProps.autoControlledProps,
        _.keys(componentProps.propTypes),
      )
      const expectedProps = _.uniq(computedProps).sort()

      expect(
        componentProps.handledProps,
        'It seems that not all props were defined in Component.handledProps, you need to check that they are equal ' +
          'to the union of Component.autoControlledProps and keys of Component.propTypes',
      ).toEqual(expectedProps)
    })
  })

  // ----------------------------------------
  // Events
  // ----------------------------------------
  if (rendersChildren && !rendersPortal) {
    it('handles events transparently', () => {
      // Events should be handled transparently, working just as they would in vanilla React.
      // Example, both of these handler()s should be called with the same event:
      //
      //   <Button onClick={handler} />
      //   <button onClick={handler} />
      //
      // This test catches the case where a developer forgot to call the event prop
      // after handling it internally. It also catch cases where the synthetic event was not passed back.
      _.each(syntheticEvent.types, ({ listeners }) => {
        _.each(listeners, (listenerName) => {
          // onKeyDown => keyDown
          const eventName = _.camelCase(listenerName.replace('on', ''))

          // onKeyDown => handleKeyDown
          const handlerName = _.camelCase(listenerName.replace('on', 'handle'))

          const handlerSpy = vi.fn()
          const props = {
            ...requiredProps,
            [listenerName]: handlerSpy,
            'data-simulate-event-here': true,
          }

          consoleUtil.disableOnce()
          const { container, unmount } = render(
            <Component as={rendersFragmentByDefault ? 'div' : undefined} {...props} />,
          )

          const eventTarget = container.querySelector(
            eventTargets[listenerName] || '[data-simulate-event-here]',
          )

          // Components can't handle an event that React does not fire on a plain element
          if (!firesOnPlainElement(eventTarget.tagName.toLowerCase(), listenerName)) {
            unmount()
            return
          }

          fireEvent[eventName](
            eventTarget,
            getEventInit(listenerName, eventTarget.tagName.toLowerCase()),
          )

          // give event listeners opportunity to cleanup
          unmount()

          // <Dropdown onBlur={handleBlur} />
          //                   ^ was not called once on "blur"
          const leftPad = ' '.repeat(info.displayName.length + listenerName.length + 3)

          expect(
            handlerSpy,
            `<${info.displayName} ${listenerName}={${handlerName}} />\n` +
              `${leftPad} ^ was not called once on "${eventName}".` +
              'You may need to hoist your event handlers up to the root element.\n',
          ).toHaveBeenCalledTimes(1)

          const [event, data] = handlerSpy.mock.calls[0]

          // Components should return the event first, then any data
          expect(
            event,
            `<${info.displayName} ${listenerName}={${handlerName}} />\n` +
              `${leftPad} ^ was not called with (event)`,
          ).toHaveProperty('nativeEvent')

          if (_.has(Component.propTypes, listenerName)) {
            expect(
              data,
              `<${info.displayName} ${listenerName}={${handlerName}} />\n` +
                `${leftPad} ^ was not called with (event, data)`,
            ).toMatchObject(props)
          }
        })
      })
    })
  }

  // ----------------------------------------
  // Has no deprecated _meta
  // ----------------------------------------
  describe('_meta', () => {
    it('does not exist', () => {
      expect(Component._meta).toBeUndefined()
    })
  })

  // ----------------------------------------
  // Has no deprecated .defaultProps
  // ----------------------------------------
  describe('defaultProps', () => {
    it('does not exist', () => {
      expect(Component.defaultProps).toBeUndefined()
    })
  })

  // ----------------------------------------
  // Handles className
  // ----------------------------------------
  if (_.has(Component.propTypes, 'className')) {
    if (rendersChildren) {
      describe('className (common)', () => {
        const { componentClassName = info.componentClassName } = options

        it(`has the Semantic UI className "${componentClassName}"`, () => {
          // silence element nesting warnings, i.e. "tbody" rendered in a "div"
          consoleUtil.disableOnce()

          const root = renderWithProps()

          // don't test components with no className at all
          if (root && root.className) {
            expect(root).toHaveClass(componentClassName)
          }
        })

        it("applies user's className to root component", () => {
          const className = 'is-conformant-class-string'

          // Portal powered components can render to two elements, a trigger and the actual component
          // The actual component is shown when the portal is open
          // If a trigger is rendered, open the portal and make assertions on the portal element
          if (rendersPortal) {
            const { rerender } = render(<Component {...requiredProps} className={className} />)
            rerender(<Component {...requiredProps} className={className} open />)

            // portals/popups/etc may render the component to somewhere besides descendants
            // we look for the component anywhere in the DOM
            expect(document.body.querySelector(`.${className}`)).toBeInTheDocument()
          } else {
            expect(
              renderWithProps({ as: rendersFragmentByDefault ? 'div' : undefined, className }),
            ).toHaveClass(className)
          }
        })

        it("user's className does not override the default classes", () => {
          const defaultRoot = renderWithProps()
          const defaultClasses = defaultRoot && defaultRoot.className

          if (!defaultClasses) return

          const userClasses = faker.hacker.verb()
          const mixedRoot = renderWithProps({ className: userClasses })

          defaultClasses.split(' ').forEach((defaultClass) => {
            expect(
              mixedRoot,
              [
                'Make sure you are using the `getUnhandledProps` util to spread the `rest` props.',
                'This may also be of help: https://facebook.github.io/react/docs/transferring-props.html.',
              ].join(' '),
            ).toHaveClass(defaultClass)
          })
        })
      })
    }
  }

  // ----------------------------------------
  // Test typings
  // ----------------------------------------
  hasValidTypings(Component, options)
}
