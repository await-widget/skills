# Await - Widget Workshop

Await is a widget workshop for makers of small, thoughtful creations.

Start from templates or build from scratch. Craft layouts, try out interactions, tune styles with panels, and shape details to match your personal taste.

Your data stays local, so you can focus on creating—without distractions.

[![Download on the App Store](https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg)](https://apps.apple.com/app/id6755678187)

This repository provides the Await Widget skill and template used to create iOS widgets.

## Links

- [Download Await](https://apps.apple.com/app/id6755678187)
- [Privacy Policy](PRIVACY.md)
- [Skill Instructions](await-widget/SKILL.md)
- [Template Project](await-widget/examples/)
- [Feedback](https://github.com/await-widget/skills/issues)

## Await Widget

This is a skill collection repo. It currently contains the `await-widget` skill for AI agents to create Await widgets.

## Install As A Skill

Install the `await-widget` skill via [`npx skills`](https://github.com/vercel-labs/skills), which works across Claude Code, Codex, Cursor, OpenCode, Gemini CLI, and 40+ other agents.

```bash
# Project-scoped (committed with your project, shared with team)
npx skills add await-widget/skills --skill await-widget

# User-scoped (available across all your projects)
npx skills add await-widget/skills --skill await-widget -g

# Install only to a specific agent
npx skills add await-widget/skills --skill await-widget -a claude-code -g
```

Restart your agent after installing.

The install bundles `await-widget/SKILL.md` and `await-widget/examples/` into your agent's skills directory. The skill registers as `await-widget`, and widget projects use the published `@await-widget/runtime` package for TypeScript declarations.

See [vercel-labs/skills](https://github.com/vercel-labs/skills) for the full list of supported agents and CLI options.

## TypeScript Declarations

Widget projects should install the Await runtime declarations from npm:

```bash
npm install -D @await-widget/runtime typescript
```

Configure TypeScript to use the Await JSX runtime and global bridge declarations:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "await",
    "types": ["@await-widget/runtime"]
  }
}
```

Widget source continues to import components from `await`:

```tsx
import { Text } from "await";

function widget() {
  return (
    <Text value="Hello, World!" maxSides background={1}/>
  );
}

Await.define({
  widget,
});
```

`@await-widget/runtime` provides TypeScript declarations for the `await` module, global Await bridge APIs such as `Await`, `AwaitStore`, and `AwaitNetwork`, and JSX constraints for Await widgets.

## Clone

```bash
git clone https://github.com/await-widget/skills.git
cd skills/await-widget/examples
npm install
npm test
```

## Use With AI Agent

```text
Read `await-widget/SKILL.md` first and follow it strictly.
Then implement or modify the target widget based on my request.
```

`await-widget/SKILL.md` is the main instruction file for agents in this repo.
`await-widget/examples/` is the template project root.

## License

MIT
