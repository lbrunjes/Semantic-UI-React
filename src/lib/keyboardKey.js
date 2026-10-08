/**
 * Key codes and helpers for keyboard events, covering the keys used in this library.
 * A drop-in replacement for the subset of "keyboard-key" that we use.
 */
const keyCodes = {
  Backspace: 8,
  Enter: 13,
  Escape: 27,
  Spacebar: 32,
  ArrowUp: 38,
  ArrowDown: 40,
}

// Maps `KeyboardEvent.key` values (including legacy ones from IE/Edge) to key codes
const keyNameToCode = {
  ...keyCodes,
  ' ': keyCodes.Spacebar,
  Esc: keyCodes.Escape,
  Up: keyCodes.ArrowUp,
  Down: keyCodes.ArrowDown,
}

// Letters: both "a" and "A" map to 65
for (let code = 65; code <= 90; code += 1) {
  const letter = String.fromCharCode(code)

  keyCodes[letter] = code
  keyNameToCode[letter] = code
  keyNameToCode[letter.toLowerCase()] = code
}

const codeToKeyName = Object.keys(keyCodes).reduce((acc, name) => {
  acc[keyCodes[name]] = name
  return acc
}, {})

const isObject = (value) => value !== null && typeof value === 'object'
const lookupCode = (name) =>
  Object.prototype.hasOwnProperty.call(keyNameToCode, name) ? keyNameToCode[name] : undefined

/**
 * Get the key code from a keyboard event or a key name.
 * @param {KeyboardEvent|Object|string} eventOrKey
 * @returns {number|undefined}
 */
const getCode = (eventOrKey) => {
  if (isObject(eventOrKey)) {
    return eventOrKey.keyCode || eventOrKey.which || lookupCode(eventOrKey.key)
  }

  return lookupCode(eventOrKey)
}

/**
 * Get the key name from a keyboard event or a key code.
 * @param {KeyboardEvent|Object|number} eventOrCode
 * @returns {string|undefined}
 */
const getKey = (eventOrCode) => {
  if (isObject(eventOrCode)) {
    if (eventOrCode.key) return eventOrCode.key

    return codeToKeyName[eventOrCode.keyCode || eventOrCode.which]
  }

  return codeToKeyName[eventOrCode]
}

const keyboardKey = {
  ...keyCodes,
  getCode,
  getKey,
}

export default keyboardKey
