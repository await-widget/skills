# Create A Widget

## Steps

1. To start a new workspace, copy `package.json` and `tsconfig.json` from `examples/` into the workspace root, then run `npm install`. `xo.config.js` and `xo` in `package.json` are optional.
2. Implement `widget` with components imported from `await`.
3. Register it with `Await.define`.
4. Check runtime declarations before using unfamiliar components, attributes, or bridge APIs.
5. Run `npm test`.
