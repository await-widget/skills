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

- [Await](await.md)
- [Bridge](bridge.md)
- [JSX](jsx.md)
- [Meta](meta.md)
- [Model](model.md)
- [Prop](prop.md)
