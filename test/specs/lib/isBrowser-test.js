import isBrowser from 'src/lib/isBrowser'

// Evaluates a fresh copy of the module with stubbed globals, as they are read on module load
const importWithGlobal = async (name, value) => {
  vi.stubGlobal(name, value)
  vi.resetModules()

  try {
    return (await import('src/lib/isBrowser')).default
  } finally {
    vi.unstubAllGlobals()
  }
}

describe('isBrowser', () => {
  describe('browser', () => {
    it('should return true in a browser', () => {
      // tests are run in a browser, this should be true
      expect(isBrowser()).toBe(true)
    })

    it('should return false when there is no document', async () => {
      expect((await importWithGlobal('document', undefined))()).toBe(false)
      expect((await importWithGlobal('document', null))()).toBe(false)
    })

    it('should return false when there is no window', async () => {
      expect((await importWithGlobal('window', undefined))()).toBe(false)
      expect((await importWithGlobal('window', null))()).toBe(false)
    })
  })

  describe('server-side', () => {
    beforeAll(() => {
      isBrowser.override = false
    })

    afterAll(() => {
      isBrowser.override = null
    })

    it('should return override value', () => {
      // tests are run in a browser, this should be true
      expect(isBrowser()).toBe(false)
    })
  })
})
