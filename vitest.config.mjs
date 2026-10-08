import babel from '@rolldown/plugin-babel'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [
    // Our sources use JSX in ".js" files and rely on "babel-plugin-transform-react-handled-props"
    // at runtime (see "getUnhandledProps()"), other plugins from ".babel-preset.js" are only needed
    // for builds.
    babel({
      include: /[\\/](src|test)[\\/].+\.js$/,
      presets: [['@babel/preset-react', { runtime: 'classic' }]],
      plugins: ['transform-react-handled-props'],
    }),
  ],
  resolve: {
    alias: [
      { find: /^semantic-ui-react$/, replacement: fromRoot('./src/index.js') },
      { find: /^src\//, replacement: fromRoot('./src/') },
      { find: /^test\//, replacement: fromRoot('./test/') },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/specs/**/*-test.js'],
    // Restore "vi.spyOn()" mocks & "vi.stubGlobal()" stubs after each test
    restoreMocks: true,
    unstubGlobals: true,
    setupFiles: ['test/setup.js'],
  },
})
