# Await Widget Developer Docs

Await widgets are small iOS widget experiences written in TSX with a SwiftUI-style component DSL. They run in the Await host, not in a browser, so code uses components from `await`, global Await bridge APIs, and TypeScript declarations from `@await-widget/runtime`.

This documentation is AI-first: it is meant to be read by coding agents as well as by people.

## Start Here

- [Overview For AI Agents](README.md)
- [Create A Widget](guides/create-a-widget.md)
- [Runtime Model](guides/runtime-model.md)
- [Reference](reference/index.md)
- [Prompt Cookbook](prompts/cookbook.md)

## Core Rules

- Import components only from `await`.
- Register widgets with `Await.define({...})`.
- Do not write HTML tags, CSS, React hooks, React state, browser `fetch`, or DOM code.
- Use `runtime/types/*.d.ts` and the generated reference as the public API source of truth.
