<p align="center"><img width="128" src="https://raw.githubusercontent.com/await-widget/.github/refs/heads/main/assets/app-icon.webp" /></p>

<h1 align="center">Await Widget Skills</h1>

<p align="center">Await is a widget workshop for makers of small, thoughtful creations. Start from templates or build from scratch, tune styles with panels, and create iOS widgets with AI-assisted TSX.</p>

<p align="center"><a href="https://apps.apple.com/app/id6755678187"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" /></a></p>

<p align="center">This repository is the installable <code>await-widget</code> agent skill and the developer docs source for Await widgets.</p>

## Links

- [Download Await](https://apps.apple.com/app/id6755678187)
- [Developer Docs](await-widget/docs-source/index.md)
- [Skill Instructions](await-widget/SKILL.md)
- [Template Project](await-widget/examples/)
- [Privacy Policy](PRIVACY.md)
- [Feedback](https://github.com/await-widget/skills/issues)

## Await Widget Workspace

The wider Await Widget workspace is split by responsibility:

- `skills`: installable agent skill, widget templates, and docs site source.
- `library`: gallery/widget files built for Await App download.
- `runtime`: `@await-widget/runtime`, the public TypeScript declarations package used for widget type checking.

## Install As A Skill

Install the `await-widget` skill via [`npx skills`](https://github.com/vercel-labs/skills), which works across Claude Code, Codex, Cursor, OpenCode, Gemini CLI, and other agents.

```bash
# Project-scoped
npx skills add await-widget/skills

# User-scoped
npx skills add await-widget/skills -g

# Install only to a specific agent
npx skills add await-widget/skills -a claude-code -g
```

Restart your agent after installing. The skill registers as `await-widget` and bundles `await-widget/SKILL.md`, `await-widget/docs-source/`, and `await-widget/examples/`.

## TypeScript Declarations

Widget projects should install the runtime declarations from npm:

```bash
npm install -D @await-widget/runtime typescript
```

Configure TypeScript to use the Await JSX runtime and declarations:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "await",
    "types": ["@await-widget/runtime"]
  }
}
```

Import widget components from `await`:

```tsx
import { Text } from "await";

function widget() {
  return <Text value="Hello world" />;
}

Await.define({ widget });
```

## Computer Connection

Run the Await computer connection from a first-level widget folder inside a package that depends on `@await-widget/runtime`:

```bash
npx await-widget
```

Paste the printed URL into Await's `Connect Computer` sheet. Agents can then run commands such as:

```bash
npx await-widget app open-syncing-widget-detail
npx await-widget app wait-for-widget-ready --widget-id YourWidget
npx await-widget app capture-current-preview --widget-id YourWidget
```

Run `npx await-widget --help` for command descriptions and input schemas.

## Clone The Template

```bash
git clone https://github.com/await-widget/skills.git
cd skills/await-widget/examples
npm install
npm test
```

## Use With An AI Agent

```text
Use the await-widget skill. Read await-widget/SKILL.md first, then read await-widget/docs-source/README.md before writing code.
```

For full guides, API reference, and AI prompt patterns, open [Developer Docs](await-widget/docs-source/index.md).

## License

MIT
