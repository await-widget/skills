# Await - Widget Workshop

Await is a widget workshop for people who like crafting small things. 

Start from templates or from scratch — arrange layouts, try out interactions, and tune the style with panels. Turn your ideas into home screen widgets, with a bit of your own taste.

Await is local-first. Your widgets and data stay with you.

This repository provides the public Await Widget Skill and widget template used to create Await widgets.

## Links

- [Privacy Policy](PRIVACY.md)
- [Skill Instructions](SKILL.md)
- [Template Project](assets/)
- [Feedback](https://github.com/maundytime/Await-Widget-Skill/issues)

## Await Widget Skill

This is an installable skill and template repo for AI agents to create Await widgets.

## Install As A Skill

Install via [`npx skills`](https://github.com/vercel-labs/skills), which works across Claude Code, Codex, Cursor, OpenCode, Gemini CLI, and 40+ other agents.

```bash
# Project-scoped (committed with your project, shared with team)
npx skills add maundytime/Await-Widget-Skill

# User-scoped (available across all your projects)
npx skills add maundytime/Await-Widget-Skill -g

# Install only to a specific agent
npx skills add maundytime/Await-Widget-Skill -a claude-code -g
```

Restart your agent after installing.

The install bundles the full template into your agent's skills directory: `SKILL.md`, type definitions in `assets/runtime/` and `assets/types/`, starter templates (`Minimal`, `Gif`, `Panels`), and Codex's `agents/openai.yaml`. The agent reads `SKILL.md` first, then the `.d.ts` files as the public contract. The skill registers as `await-widget` in your agent's skill list.

See [vercel-labs/skills](https://github.com/vercel-labs/skills) for the full list of supported agents and CLI options.

## Clone

```bash
git clone https://github.com/maundytime/Await-Widget-Skill.git
cd Await-Widget-Skill
cd assets
npm install
npm test
```

## Use With AI Agent

```text
Read `SKILL.md` first and follow it strictly.
Then implement or modify the target widget based on my request.
```

`SKILL.md` is the main instruction file for agents in this repo.
`assets/` is the template project root.
