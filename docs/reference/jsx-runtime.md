# JSX Runtime

Await widgets use the Await JSX runtime, not browser HTML. The generated section below is sourced from `runtime/types/jsx.d.ts`.

## Usage

Configure TypeScript with `jsxImportSource: "await"`. Native HTML intrinsic elements are intentionally unavailable, so tags such as `<div>` and `<span>` are invalid.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "await",
    "types": ["@await-widget/runtime"]
  }
}
```

<!-- GENERATED:START -->
```ts
declare namespace JSX {
  type Element = NativeView;
  type IntrinsicElements = never;
}
```
<!-- GENERATED:END -->
