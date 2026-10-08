import _ from 'lodash'

import { customPropTypes } from 'src/lib'
import { componentInfoContext, getComponentName, getComponentProps } from 'test/utils'
import {
  getNodes,
  getInterfaces,
  hasAnySignature,
  requireTs,
  getComponentType,
  isForwardRefComponent,
} from './tsHelpers'

const isShorthand = (propType) =>
  _.includes(
    [
      customPropTypes.collectionShorthand,
      customPropTypes.contentShorthand,
      customPropTypes.itemShorthand,
    ],
    propType,
  )
const shorthandMap = {
  SemanticShorthandContent: customPropTypes.contentShorthand,
  SemanticShorthandItem: customPropTypes.itemShorthand,
  SemanticShorthandCollection: customPropTypes.collectionShorthand,
}

/**
 * Assert Component has the valid typings.
 * @param {React.Component|Function} Component A component that should conform.
 * @param {Object} [options={}]
 * @param {array} [options.ignoredTypingsProps=[]] Props that will be ignored in tests.
 * @param {Object} [options.requiredProps={}] Props required to render Component without errors or warnings.
 * @param {Object} [options.forwardsRef=true] Indicates if component forwards refs.
 */
export default function hasValidTypings(Component, options = {}) {
  const { displayName, repoPath } = componentInfoContext.byDisplayName[getComponentName(Component)]
  const { ignoredTypingsProps = [], forwardsRef = true, requiredProps } = options

  const tsFile = repoPath.replace('src/', '').replace('.js', '.d.ts')
  const tsContent = requireTs(tsFile)

  describe('typings', () => {
    describe('structure', () => {
      it(`${tsFile} exists`, () => {
        expect(tsContent).not.toBe(false)
      })
    })

    const tsNodes = getNodes(tsFile, tsContent)
    const componentType = getComponentType(tsNodes, displayName)

    const propsInterfaceName = `${displayName}Props`
    const strictInterfaceName = `Strict${displayName}Props`

    const propsInterfaceObject = _.find(getInterfaces(tsNodes), { name: propsInterfaceName })
    const strictInterfaceObject = _.find(getInterfaces(tsNodes), { name: strictInterfaceName })

    describe(`component ${displayName}`, () => {
      it('has component type', () => {
        expect(componentType).toBeInstanceOf(Object)
      })

      if (forwardsRef) {
        it('is ForwardRefComponent', () => {
          expect(isForwardRefComponent(componentType)).toBe(true)
        })
      }
    })

    describe(`interface ${propsInterfaceName}`, () => {
      it('has interface', () => {
        expect(propsInterfaceObject).toBeInstanceOf(Object)
      })

      it('is exported', () => {
        const { exported } = propsInterfaceObject
        expect(exported).toBe(true)
      })
    })

    describe(`interface ${strictInterfaceName}`, () => {
      it('has interface', () => {
        expect(strictInterfaceObject).toBeInstanceOf(Object)
      })

      it('is exported', () => {
        const { exported } = strictInterfaceObject
        expect(exported).toBe(true)
      })
    })

    describe('props', () => {
      const { props } = strictInterfaceObject

      it('has any signature', () => {
        expect(hasAnySignature(tsNodes)).toBe(true)
      })

      it('match the typings interface', () => {
        const componentPropTypes = getComponentProps(Component).propTypes
        const componentProps = _.keys(componentPropTypes)
        const interfaceProps = _.without(_.map(props, 'name'), ...ignoredTypingsProps)

        componentProps.forEach((propName, index) => {
          expect(
            interfaceProps,
            `propTypes define "${propName}" but it is missing in typings`,
          ).toContain(propName)
          expect(
            interfaceProps[index],
            `propTypes define "${propName}" but its order doesn't match typings`,
          ).toBe(propName)
        })

        interfaceProps.forEach((propName) => {
          expect(
            componentProps,
            `Typings define prop "${propName}" but it is missing in propTypes`,
          ).toContain(propName)
        })
      })

      it('isRequired props match required typings', () => {
        const componentRequired = _.keys(requiredProps)
        const interfaceRequired = _.map(_.filter(props, ['required', true]), 'name')

        componentRequired.forEach((propName) => {
          expect(
            interfaceRequired,
            `Tests require prop "${propName}" but it is optional in typings`,
          ).toContain(propName)
        })

        interfaceRequired.forEach((propName) => {
          expect(
            componentRequired,
            `Typings require "${propName}" but it is optional in tests`,
          ).toContain(propName)
        })
      })
    })

    const componentShorthands = _.pickBy(_.get(Component, 'propTypes'), isShorthand)

    // Heads up! Vitest fails on empty suites
    if (_.isEmpty(componentShorthands)) return

    describe('shorthands', () => {
      const { shorthands } = strictInterfaceObject

      _.forEach(componentShorthands, (propType, propName) => {
        it(`"${propName}" should have the correct shorthand type `, () => {
          const { type } = _.find(shorthands, ['name', propName])

          expect(shorthandMap[type]).toBe(propType)
        })
      })
    })
  })
}
