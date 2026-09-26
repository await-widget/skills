# Connection Guide

Use the computer bridge to sync a local widget folder with Await or to run app commands for previews and debugging.

## Project Shape

Use the workspace layout from [Create A Widget](create-a-widget.md). Running `npx await-widget` from the package root opens a directory selector. Running it from a first-level widget folder connects that widget directly.

## Start And Connect

1. Start the bridge:
```sh
npx await-widget
```
Select the widget directory when prompted.
2. Open the matching widget detail page in Await.
3. Choose `Connect Computer` from the detail menu.
4. Paste the primary URL printed by the terminal.
5. Keep the Await app in the foreground while you edit.

Run `npx await-widget --help` for the current command list and schemas.

## Agent Loop

1. Edit widget files in the local workspace.
2. Open the connected detail page with `open-syncing-widget-detail`.
3. Wait after sync or preview changes with `wait-for-widget-ready --widget-id <id>`.
4. Inspect failures with `get-build-errors --widget-id <id>`.
5. Use `get-recent-widget-logs --widget-id <id>` to view `print()` output. Requires Lifetime Pro.
6. Set widget preview mode with `set-preview-mode --mode <small|medium|large|extraLarge> --widget-id <id>`.
7. Capture the result with `capture-current-preview --widget-id <id>`.

## Sync Behavior

- The local widget folder connected through the computer bridge is the source of truth.
- Each local widget folder is bound to one widget in Await. Connecting another widget detail page replaces the current binding.
- Sync replaces the connected widget's files in Await. It does not merge files, preserve old widget files, resolve conflicts, or create a copy.
- `AwaitStore` data are not deleted.
- `node_modules`, `.git`, `.build`, `dist`, `build`, and hidden items are not synced.

## Stop

- Stop the computer bridge with `Ctrl+C` in the terminal.
- Use `Disconnect Computer` in the connected widget detail menu to stop sync from the app.
- If Await is fully closed or killed by the system, connect again from the widget detail page.
