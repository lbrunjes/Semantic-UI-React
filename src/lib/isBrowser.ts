const hasDocument = typeof document === 'object' && document !== null
const hasWindow = typeof window === 'object' && window !== null && window.self === window

const isBrowser: { (): any; override?: any } = () =>
  isBrowser.override != null ? isBrowser.override : hasDocument && hasWindow

export default isBrowser
