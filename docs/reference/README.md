# Reference

The files in this directory are generated skeletons plus concise manual guidance. Runtime declarations remain the source of truth.

Run the generator from the repository root:

```sh
node skills/scripts/generate-reference.mjs
```

Generated content is placed between:

```md
<!-- GENERATED:START -->
...
<!-- GENERATED:END -->
```

Manual sections outside those markers are preserved.

## Pages

- [Components](components.md)
- [Props And Modifiers](props-and-modifiers.md)
- [Bridge APIs](bridge-apis.md)
- [Global Types](global-types.md)
- [JSX Runtime](jsx-runtime.md)

