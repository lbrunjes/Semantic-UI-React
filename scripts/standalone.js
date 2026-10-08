// Entry of the standalone bundle (see "vite.bundle.config.mjs"), it includes React & ReactDOM so a
// page needs nothing else:
//
//   <script src="semantic-ui-react.standalone.min.js"></script>
//   <script>
//     const { Button, React, createRoot } = semanticUIReact
//     createRoot(document.getElementById('root')).render(React.createElement(Button, null, 'Hi'))
//   </script>
//
// Heads up! It lives outside of "src/" so it is not part of the CommonJS & ES builds.
import * as React from 'react'
import { createPortal, flushSync } from 'react-dom'
import { createRoot, hydrateRoot } from 'react-dom/client'

export * from '../src/index'
export { React, createPortal, createRoot, flushSync, hydrateRoot }
