# Semantic UI React (fork)

React components for [Semantic UI](https://semantic-ui.com/).

This is an independent fork of [Semantic UI React](https://github.com/Semantic-Org/Semantic-UI-React)
(v3.0.0-beta.2). It is not the official package and is not maintained by its authors. Compared with
upstream, it has far fewer dependencies, supports React 19 and uses a modern toolchain; see
[CHANGELOG.md](CHANGELOG.md) for details.

The component API is the same as upstream, so the
[upstream documentation](https://react.semantic-ui.com/) still applies.

## Usage

The components render Semantic UI markup but include no CSS. Load a Semantic UI theme yourself,
for example [Fomantic UI](https://fomantic-ui.com/) or `semantic-ui-css`.

```jsx
import { Button } from 'semantic-ui-react'

const App = () => <Button primary>Click me</Button>
```

Supported React versions: 16.8, 17, 18 and 19.

## Builds

`yarn build` writes everything to `dist/`:

| Output | Description |
| --- | --- |
| `dist/commonjs`, `dist/es` | CommonJS & ES modules builds, for bundlers |
| `dist/umd/semantic-ui-react.min.js` | UMD bundle, React supplied by the page or `require()` |
| `dist/bundle/semantic-ui-react.min.mjs` | Single file ES module, imports `react` & `react-dom` |
| `dist/standalone/semantic-ui-react.standalone.min.js` | Single `<script>` with React included, global `semanticUIReact` |

## Development

Requires Node.js 22 or newer (see `.nvmrc`) and Yarn 1.

```sh
yarn install
yarn test           # unit tests (Vitest + React Testing Library)
yarn test:bundles   # builds & checks the single file bundles
yarn typecheck      # type checks the sources
yarn tsd:test       # builds & checks the published typings
yarn lint           # ESLint
yarn prettier       # checks formatting
yarn build          # all builds
```

## Credit & license

Semantic UI React was created by [Levi Thomason](https://github.com/levithomason) and its
[contributors](https://github.com/Semantic-Org/Semantic-UI-React/graphs/contributors), and builds
on [Semantic UI](https://semantic-ui.com/) by [Jack Lukic](https://github.com/jlukic).

Released under the MIT license, see [LICENSE.md](LICENSE.md).
