/**
 * A minimal replacement for the "faker" package, covering only what our tests use.
 * Every call returns a unique value, so tests can safely rely on values being distinct.
 */
let counter = 0

// Converts a number to letters (1 => "a", 26 => "z", 27 => "aa"), keeps words alphabetic
const toLetters = (num) => {
  let n = num
  let result = ''

  while (n > 0) {
    const rem = (n - 1) % 26

    result = String.fromCharCode(97 + rem) + result
    n = Math.floor((n - 1) / 26)
  }

  return result
}

const word = () => {
  counter += 1
  return `word${toLetters(counter)}`
}

const phrase = () => [word(), word(), word()].join(' ')

const amount = (min = 0, max = 1000, decimals = 2, symbol = '') => {
  counter += 1
  return `${symbol}${(min + (counter % (max - min))).toFixed(decimals)}`
}

const faker = {
  finance: { amount },
  hacker: { noun: word, phrase, verb: word },
  image: { imageUrl: () => `https://example.com/${word()}.png` },
  internet: { url: () => `https://example.com/${word()}` },
  lorem: { word },
  random: { word },
}

export default faker
