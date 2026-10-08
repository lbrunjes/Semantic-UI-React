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
  const isLibBuild = envName === 'build' || isESBuild || isUMDBuild

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        // https://github.com/babel/babel/issues/10261
        version: require('@babel/runtime/package.json').version,
      },
    ],
    // Plugins that allow to reduce the target bundle size

    // `babel-plugin-lodash` is required for all kinds of modules to simplify the resolution of
    // modules and avoid modules that prevent tree-shaking:
    // https://github.com/lodash/lodash/issues/4119
    'lodash',
    [
      'transform-next-use-client',
      {
        customClientImports: ['useAutoControlledValue', 'useEventCallback', 'useMergedRefs'],
      },
    ],
    // CJS modules are not tree-shakable in any bundler by default
    // https://github.com/formium/tsdx#using-lodash
    (isESBuild || isUMDBuild) && [
      'babel-plugin-transform-rename-import',
      {
        replacements: [{ original: 'lodash', replacement: 'lodash-es' }],
      },
    ],

    'transform-react-handled-props',
    [
      'transform-react-remove-prop-types',
      {
        mode: isUMDBuild ? 'remove' : 'wrap',
        removeImport: isUMDBuild,
      },
    ],
    // A plugin for removal of debug in production builds
    isLibBuild && [
      'filter-imports',
      {
        imports: {
          './makeDebugger': ['default'],
          '../../lib': ['makeDebugger'],
        },
      },
    ],
  ].filter(Boolean)

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
    ],
    plugins,
  }
}
