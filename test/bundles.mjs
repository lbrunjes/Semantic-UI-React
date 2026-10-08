// Smoke tests of the single file bundles, see "vite.bundle.config.mjs"
import assert from 'node:assert'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { JSDOM } from 'jsdom'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'

const require = createRequire(import.meta.url)
const fromRoot = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url))

const expectedHTML = '<button class="ui button">Foo</button>'
const renderButton = (semanticUIReact) =>
  ReactDOMServer.renderToStaticMarkup(React.createElement(semanticUIReact.Button, null, 'Foo'))

// UMD: resolves "react" & "react-dom" via require() when loaded as a CommonJS module
assert.strictEqual(
  renderButton(require(fromRoot('dist/umd/semantic-ui-react.min.js'))),
  expectedHTML,
  'UMD bundle: Something wrong with the build, please check!',
)

// ES module: imports "react" & "react-dom"
assert.strictEqual(
  renderButton(await import(pathToFileURL(fromRoot('dist/bundle/semantic-ui-react.min.mjs')).href)),
  expectedHTML,
  'ES module bundle: Something wrong with the build, please check!',
)

// Standalone: runs in a page without anything else & renders with its own React
const { window } = new JSDOM('<!DOCTYPE html><div id="root"></div>', { runScripts: 'outside-only' })
window.eval(readFileSync(fromRoot('dist/standalone/semantic-ui-react.standalone.min.js'), 'utf8'))

const { semanticUIReact } = window
const root = semanticUIReact.createRoot(window.document.getElementById('root'))

semanticUIReact.flushSync(() => {
  root.render(semanticUIReact.React.createElement(semanticUIReact.Button, null, 'Foo'))
})

assert.strictEqual(
  window.document.getElementById('root').innerHTML,
  expectedHTML,
  'Standalone bundle: Something wrong with the build, please check!',
)

// eslint-disable-next-line no-console
console.log('UMD, ES module & standalone bundles are OK')
