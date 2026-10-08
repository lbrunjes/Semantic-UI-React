/**
 * Setup
 * This is the bootstrap code that is run before any tests, utils, mocks.
 */
import '@testing-library/jest-dom/vitest'
import { expect } from 'vitest'

import { matchers } from './utils/matchers'

// Heads up!
// Components import each other circularly (i.e. "Button" <-> "ButtonGroup"), Vitest creates a module
// graph per test file, so we load the library entry first to initialize modules in the same order
// as consumers do.
import 'semantic-ui-react'

// ----------------------------------------
// Matchers
// ----------------------------------------
// "jest-dom" matchers (i.e. toHaveClass(), toBeInTheDocument()) are registered by its import above
expect.extend(matchers)

// ----------------------------------------
// Console
// ----------------------------------------
// Fail on all activity.
// It is important we overload console here, before consoleUtil.js is loaded and caches it.
let log
let info
let warn
let error

const throwOnConsole =
  (method) =>
  (...args) => {
    throw new Error(
      `console.${method} should never be called but was called with:\n${args.join(' ')}`,
    )
  }

/* eslint-disable no-console */
beforeEach(() => {
  log = console.log
  info = console.info
  warn = console.warn
  error = console.error

  console.log = throwOnConsole('log')
  console.info = throwOnConsole('info')
  console.warn = throwOnConsole('warn')
  console.error = throwOnConsole('error')
})
afterEach(() => {
  console.log = log
  console.info = info
  console.warn = warn
  console.error = error
})
/* eslint-enable no-console */
