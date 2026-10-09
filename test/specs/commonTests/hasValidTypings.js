import _ from 'lodash'

import { componentInfoContext, getComponentName, getComponentProps } from 'test/utils'
import {
  getNodes,
  getInterfaces,
  hasAnySignature,
  requireTs,
  getComponentType,
  isForwardRefComponent,
} from './tsHelpers'

/**
 * Assert Component has the valid typings.
 * @param {React.Component|Function} Component A component that should conform.
 * @param {Object} [options={}]
 * @param {array} [options.ignoredTypingsProps=[]] Props of the typings that are not handled by the
 *   component (they are passed to the rendered element).
 * @param {Object} [options.requiredProps={}] Props required to render Component without errors or warnings.
 * @param {Object} [options.forwardsRef=true] Indicates if component forwards refs.
 */
export default function hasValidTypings(Component, options = {}) {
  const { displayName, repoPath } = componentInfoContext.byDisplayName[getComponentName(Component)]
  const { ignoredTypingsProps = [], forwardsRef = true, requiredProps } = options

  // TypeScript sources contain their typings, JavaScript sources have ".d.ts" files
  const tsFile = repoPath.replace('src/', '').replace(/\.js$/, '.d.ts')
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

      it('match handled props of the component', () => {
        const { handledProps = [] } = getComponentProps(Component)
        const interfaceProps = _.without(_.map(props, 'name'), ...ignoredTypingsProps)

        handledProps.forEach((propName) => {
          expect(
            interfaceProps,
            `"handledProps" include "${propName}" but it is missing in typings`,
          ).toContain(propName)
        })

        interfaceProps.forEach((propName) => {
          expect(
            handledProps,
            `Typings define prop "${propName}" but it is missing in "handledProps"`,
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
  })
}
