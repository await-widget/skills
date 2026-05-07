# Prompt Cookbook

Use these prompts with an AI agent when creating or changing Await widgets.

## Read The Docs First

```text
Read skills/await-widget/SKILL.md, skills/docs/README.md, and the relevant files under skills/docs/reference before writing code.
Use runtime/types/*.d.ts as the source of truth.
```

## Create A Widget

```text
Create an Await widget for: [describe the idea].
Use components only from await.
Add @panel controls for the main editable values.
Use widgetTimeline only if the widget needs data or scheduled updates.
Run npm test after editing.
```

## Modify A Widget

```text
Modify this Await widget: [file path].
Keep the existing structure unless the request requires a change.
Check docs/reference before adding any component, prop, modifier, or bridge API.
Do not add HTML, CSS, React hooks, React state, fetch, or browser APIs.
```

## Debug TypeScript Errors

```text
Fix TypeScript errors in this Await widget.
Compare each failing component, prop, modifier, global API, and type against @await-widget/runtime declarations.
Prefer removing invalid API usage over inventing compatibility code.
Run npm test when done.
```

## Use Only Available APIs

```text
Before coding, list the Await components and bridge APIs you plan to use, with the reference file where each is declared.
If an API is not declared in runtime/types/*.d.ts, do not use it.
```

## Weather Widget With Panel Color

```text
Build an Await weather widget.
Read skills/docs/guides/create-a-widget.md, skills/docs/guides/panels.md, skills/docs/guides/timeline.md, and skills/docs/guides/bridge-apis.md.
Use AwaitWeather.get in widgetTimeline.
Add a @panel {type:'color'} top-level const for the accent color.
Render current temperature and condition with components from await.
Run npm test.
```

