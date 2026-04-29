# Await - Widget Workshop

Await is a widget workshop for people who like crafting small things.

Start from templates or from scratch — arrange layouts, try out interactions, and tune the style with panels. Turn your ideas into home screen widgets, with a bit of your own taste.

Await is local-first. Your widgets and data stay with you.

This repository provides the public Await Widget and widget template used to create Await widgets.

## Links

- [Download Await](https://apps.apple.com/app/id6755678187)
- [Privacy Policy](PRIVACY.md)
- [Skill Instructions](await-widget/SKILL.md)
- [Template Project](await-widget/examples/)
- [Feedback](https://github.com/await-widget/skills/issues)

## Await Widget

This is an installable skill and template repo for AI agents to create Await widgets.

## Install As A Skill

Install via [`npx skills`](https://github.com/vercel-labs/skills), which works across Claude Code, Codex, Cursor, OpenCode, Gemini CLI, and 40+ other agents.

```bash
# Project-scoped (committed with your project, shared with team)
npx skills add await-widget/skills

# User-scoped (available across all your projects)
npx skills add await-widget/skills -g

# Install only to a specific agent
npx skills add await-widget/skills -a claude-code -g
```

Restart your agent after installing.

The install bundles the widget instructions and template into your agent's skills directory. The skill registers as `await-widget` in your agent's skill list, and widget projects use the published `@await-widget/runtime` package for TypeScript declarations.

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
import { Text, ZStack } from "await";

function widget() {
  return (
    <ZStack>
      <Text value="Hello, World!" />
    </ZStack>
  );
}

Await.define({
  widget,
});
```

`@await-widget/runtime` provides the `await` module, `await/jsx-runtime`, global Await bridge APIs such as `Await`, `AwaitStore`, and `AwaitNetwork`, and JSX constraints for Await widgets.

## Clone

```bash
git clone https://github.com/await-widget/skills.git
cd skills/await-widget/examples
npm install
npm test
```

## Use With AI Agent

```text
Read `SKILL.md` first and follow it strictly.
Then implement or modify the target widget based on my request.
```

`SKILL.md` is the main instruction file for agents in this repo.
`await-widget/examples/` is the template project root.

## License

MIT
