# Await Widget Skills

Await is a widget workshop for makers of small, thoughtful creations. Start from templates or build from scratch, tune styles with panels, and create iOS widgets with AI-assisted TSX.

[![Download on the App Store](https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg)](https://apps.apple.com/app/id6755678187)

This repository is the installable `await-widget` agent skill and the developer docs source for Await widgets.

## Links

- [Download Await](https://apps.apple.com/app/id6755678187)
- [Developer Docs](docs/index.md)
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
npx skills add await-widget/skills --skill await-widget

# User-scoped
npx skills add await-widget/skills --skill await-widget -g

# Install only to a specific agent
npx skills add await-widget/skills --skill await-widget -a claude-code -g
```

Restart your agent after installing. The skill registers as `await-widget` and bundles `await-widget/SKILL.md` plus `await-widget/examples/`.

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
import {Text} from "await";

function widget() {
  return <Text value="Hello, World!" />;
}

Await.define({widget});
```

## Clone The Template

```bash
git clone https://github.com/await-widget/skills.git
cd skills/await-widget/examples
npm install
npm test
```

## Use With An AI Agent

```text
Use the await-widget skill. Read await-widget/SKILL.md first, then read docs/README.md before writing code.
```

For full guides, API reference, and AI prompt patterns, open [Developer Docs](docs/index.md).

## License

MIT
