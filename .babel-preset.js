const browsers = [
  'last 8 versions',
  'safari > 8',
  'firefox > 23',
  'chrome > 24',
  'opera > 15',
  'not ie < 11',
  'not ie_mob <= 11',
]

// Equivalent of the removed "loose" mode of "@babel/preset-env"
// https://babeljs.io/docs/assumptions
const assumptions = {
  constantSuper: true,
  enumerableModuleMeta: true,
  ignoreFunctionLength: true,
  ignoreToPrimitiveHint: true,
  iterableIsArray: true,
  mutableTemplateObject: true,
  noClassCalls: true,
  noDocumentAll: true,
  objectRestNoSymbols: true,
  privateFieldsAsProperties: true,
  pureGetters: true,
  setClassMethods: true,
  setComputedProperties: true,
  setPublicClassFields: true,
  setSpreadProperties: true,
  skipForOfIteratorClosing: true,
  superIsCallableConstructor: true,
}

/**
 * The build mode is Babel's env name: "--env-name" of the CLI, otherwise BABEL_ENV or NODE_ENV.
 * - "build": CommonJS build
 * - "build-es": ES modules build
 * - "build-umd": UMD bundle
 */
module.exports = (api) => {
  const envName = api.env()

  const isESBuild = envName === 'build-es'
  const isUMDBuild = envName === 'build-umd'

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        // https://github.com/babel/babel/issues/10261
        version: require('@babel/runtime/package.json').version,
      },
    ],
    [
      'transform-next-use-client',
      {
        customClientImports: ['useAutoControlledValue', 'useEventCallback', 'useMergedRefs'],
      },
    ],
  ]

  return {
    assumptions,
    compact: false,
    presets: [
      [
        '@babel/env',
        {
          modules: isESBuild || isUMDBuild ? false : 'commonjs',
          targets: { browsers },
        },
      ],
      // Heads up! The classic runtime keeps support of React versions without 'react/jsx-runtime'
      ['@babel/react', { runtime: 'classic' }],
      // Heads up! Presets run in reverse order, types are removed first
      '@babel/typescript',
    ],
    plugins,
  }
}
