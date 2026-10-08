import babel from '@rolldown/plugin-babel'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)
const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url))

// The preset reads the build mode from Babel's env name, see ".babel-preset.js"
const { presets, plugins, assumptions } = require('./.babel-preset.js')({ env: () => 'build-umd' })

/**
 * Single file, minified bundles of the library. Select one with "--mode":
 * - "umd": UMD, React & ReactDOM are external ("React" & "ReactDOM" globals or require())
 * - "esm": an ES module, React & ReactDOM are external (imported as "react" & "react-dom")
 * - "standalone": a script for a <script> tag that includes React & ReactDOM, exposes the
 *   "semanticUIReact" global
 */
const bundles = {
  umd: {
    entry: './src/umd.js',
    fileName: 'semantic-ui-react.min.js',
    format: 'umd',
    outDir: './dist/umd',
    external: ['react', 'react-dom'],
  },
  esm: {
    entry: './src/index.js',
    fileName: 'semantic-ui-react.min.mjs',
    format: 'es',
    outDir: './dist/bundle',
    external: ['react', 'react-dom'],
  },
  standalone: {
    entry: './scripts/standalone.js',
    fileName: 'semantic-ui-react.standalone.min.js',
    format: 'iife',
    outDir: './dist/standalone',
    external: [],
  },
}

export default defineConfig(({ mode }) => {
  const bundle = bundles[mode]

  if (!bundle) {
    throw new Error(
      `Unknown bundle "${mode}", use "--mode" with: ${Object.keys(bundles).join(', ')}`,
    )
  }

  return {
    // "process.env.NODE_ENV" is used by React & our sources
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    plugins: [babel({ assumptions, presets, plugins })],
    build: {
      emptyOutDir: false,
      lib: {
        entry: fromRoot(bundle.entry),
        fileName: () => bundle.fileName,
        formats: [bundle.format],
        name: 'semanticUIReact',
      },
      minify: true,
      outDir: fromRoot(bundle.outDir),
      // Heads up! Rolldown has no ES5 target, the CommonJS & ES builds use targets from Babel instead
      target: 'es2015',
      rolldownOptions: {
        external: bundle.external,
        onLog(level, log, defaultHandler) {
          // "use client" directives are meant for the CommonJS & ES builds, they are meaningless in a bundle
          if (log.code === 'MODULE_LEVEL_DIRECTIVE') return
          defaultHandler(level, log)
        },
        output: {
          globals: { react: 'React', 'react-dom': 'ReactDOM' },
          // Heads up! Vite keeps whitespace of ES modules in library mode (to preserve "#__PURE__"
          // annotations for tree shaking), minify them fully as these bundles are single files
          minify: true,
        },
      },
      sourcemap: false,
    },
  }
})
