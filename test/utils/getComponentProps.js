const MEMO_TYPE = Symbol.for('react.memo')

/**
 * Gets proper props for a component.
 *
 * @param {React.ElementType} Component
 * @return {Object}
 */
export default function getComponentProps(Component) {
  if (Component.$$typeof === MEMO_TYPE) {
    return getComponentProps(Component.type)
  }

  return {
    autoControlledProps: Component.autoControlledProps,
    handledProps: Component.handledProps,
  }
}
