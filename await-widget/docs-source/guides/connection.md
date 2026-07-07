# Connection Guide

Use the computer bridge when a local widget folder needs live sync with Await, or when an agent needs app commands for preview and debugging.

## Project Shape

Use the workspace layout from [Create A Widget](create-a-widget.md). Start the bridge from the widget folder you want to preview.

## Start And Connect

1. Start the bridge:
```sh
cd YourWidget
npx await-widget
```
2. Open the matching widget detail page in Await.
3. Choose `Connect Computer` from the detail menu.
4. Paste the primary URL printed by the terminal.
5. Keep Await app foreground while you edit.

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

- The connected computer widget folder is the source of truth.
- Sync is one-to-one: one computer widget folder to one Await widget. Connecting another widget detail page replaces the current binding.
- Sync replaces the connected widget directory in Await. It does not merge files, preserve old widget files, resolve conflicts, or create a copy.
- `AwaitStore` data are not deleted.
- `node_modules`, `.git`, `.build`, `dist`, `build`, and hidden items are not synced.

## Stop

- Stop the computer bridge with `Ctrl+C` in the terminal.
- Use `Disconnect Computer` in the connected widget detail menu to stop sync from the app.
- If Await is fully closed or killed by the system, connect again from the widget detail page.
