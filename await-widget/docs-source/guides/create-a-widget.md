# Create A Widget

## Steps

1. To start a new workspace, copy `package.json` and `tsconfig.json` from `examples/` into the workspace root, then run `npm install`. `xo.config.js` and `xo` in `package.json` are optional.
2. Keep `package.json` and `tsconfig.json` at the package root, with each widget in a first-level subdirectory:
```text
Widgets/
  package.json
  tsconfig.json
  YourWidget/
    index.tsx
  AnotherWidget/
    index.tsx
```
3. Implement `widget` with components imported from `await`.
4. Register it with `Await.define`.
5. Check runtime declarations before using unfamiliar components, attributes, or bridge APIs.
6. Run `npm test`.
