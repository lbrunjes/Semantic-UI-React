// Types used only to compile the library, they are not part of the published typings.
import 'react'

declare module 'react' {
  // Static properties assigned to components at runtime, they are not part of the public types:
  // - "handledProps" lists props handled by a component, see "getUnhandledProps()"
  // - "create" is the shorthand factory of a component
  interface RuntimeComponentStatics {
    animationDuration?: number
    autoControlledProps?: string[]
    create?: any
    defaultProps?: any
    handledProps?: string[]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ForwardRefExoticComponent<P> extends RuntimeComponentStatics {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface NamedExoticComponent<P> extends RuntimeComponentStatics {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface FunctionComponent<P> extends RuntimeComponentStatics {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentClass<P, S> extends RuntimeComponentStatics {}

  // The same statics on class components: a namespace merged into a class adds static members
  namespace Component {
    let animationDuration: number | undefined
    let autoControlledProps: string[] | undefined
    let create: any
    let defaultProps: any
    let handledProps: string[] | undefined
  }
}

declare global {
  // Only "process.env.NODE_ENV" is used, it is replaced by bundlers
  const process: { env: { NODE_ENV?: string } }
}
