/**
 * Returns an object consisting of props beyond the scope of the Component.
 * Useful for getting and spreading unknown props from the user.
 * @param {function} Component A function or ReactClass.
 * @param {object} props A ReactElement props object
 * @returns {{}} A shallow copy of the prop object
 */
const getUnhandledProps = (
  Component: { handledProps?: string[] },
  props: Record<string, any>,
): Record<string, any> => {
  // "handledProps" are lists of props handled by a component, assigned next to its definition
  const { handledProps = [] } = Component

  return Object.keys(props).reduce(
    (acc, prop) => {
      // "childKey" and "innerRef" are internal props of Semantic UI React
      // "innerRef" can be removed when "Search" & "Dropdown components will be removed to be functional
      if (prop === 'childKey' || prop === 'innerRef') return acc
      if (handledProps.indexOf(prop) === -1) acc[prop] = props[prop]
      return acc
    },
    {} as Record<string, any>,
  )
}

export default getUnhandledProps
