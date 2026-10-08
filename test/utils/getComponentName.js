const MEMO_TYPE = Symbol.for('react.memo')
const FORWARD_REF_TYPE = Symbol.for('react.forward_ref')

/**
 * Gets a proper `displayName` for a component.
 *
 * @param {React.ElementType} Component
 * @return {String}
 */
export default function getComponentName(Component) {
  if (Component.$$typeof === MEMO_TYPE) {
    return getComponentName(Component.type)
  }

  if (Component.$$typeof === FORWARD_REF_TYPE) {
    return Component.displayName
  }

  return Component.prototype?.constructor?.name
}
