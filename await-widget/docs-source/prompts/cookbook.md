# Prompt Cookbook

Use these prompts with an AI agent when creating or changing Await widgets.

## Read The Docs First

```text
Read the await-widget skill, this docs README, and the relevant runtime type declarations before writing code.
Use runtime/types/*.d.ts as the source of truth.
```

## Create A Widget

```text
Create an Await widget for: [describe the idea].
Use components only from await.
Add @panel controls for the main editable values.
Use widgetTimeline only if the widget needs data or scheduled updates.
Run npm test after editing.
If a computer connection is active, use npx await-widget app commands to preview and capture the result.
```

## Modify A Widget

```text
Modify this Await widget: [file path].
Keep the existing structure unless the request requires a change.
Check runtime type declarations before adding any component, prop, modifier, or bridge API.
Do not add HTML, CSS, React hooks, React state, fetch, or browser APIs.
If a computer connection is active, use npx await-widget app get-build-errors, wait-for-widget-ready, and capture-current-preview while iterating. Use get-recent-widget-logs for print() output only when Lifetime Pro is unlocked in Await.
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
Read the create-a-widget, panels, timeline, and bridge-apis guides.
Use AwaitWeather.get in widgetTimeline.
Add a @panel {type:'color'} top-level const for the accent color.
Render current temperature and condition with components from await.
Run npm test.
```
