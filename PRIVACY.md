# Privacy Policy

Last updated: June 19, 2026

This policy applies to Await, its widget extension and skills.

## Summary

Await is a local-first widget workshop app. The app does not use developer-operated accounts, advertising SDKs, third-party analytics SDKs, or third-party tracking SDKs.

Most data stays on your device. Some features may send data to Apple services, to network endpoints used by widgets that you create or add, or to Await's servers for minimal anonymous usage analytics. No personal information is collected, and the analytics are used solely to improve the app.

## Data Stored On Your Device

Await may store the following data locally:

- Widget source files, generated widget bundles, imported assets, and exported widget folders.
- Widget state saved through `AwaitStore`.
- App settings, preview preferences, permission status-related state, and cached purchase entitlement state.
- A random anonymous install identifier used for app usage analytics.
- A recent now-playing media snapshot for widgets that display media state.
- Cached remote images used by widgets.

This data is stored in the app container or the shared app group container so the main app and widget extension can both access it.

## Anonymous App Analytics

Await sends limited anonymous app usage events to help understand whether people can successfully try the app and create widgets. Events may include app opens, tab views, widget creation/import/open/clone actions, Gallery usage, and purchase flow status.

Analytics events include a random anonymous install identifier, a per-session identifier, app version, build number, iOS version, device model category, locale, country inferred by Cloudflare, event name, event time, and small event properties. Await does not send your email address, Apple ID, contact data, calendar content, Health content, widget source code, widget file contents, or user-entered widget names for analytics.

These analytics are used for product improvement and growth measurement. They are not used for advertising, cross-app tracking, or cross-site tracking.

## Permissions

Await requests permissions only when a feature or widget needs them.

Depending on the widgets you use, Await may process:

- Location data, used for location-aware widgets and weather widgets.
- Weather data from Apple WeatherKit, based on coordinates provided by the app or widget.
- Calendar events, including event titles, dates, calendar names, locations, notes, and URLs.
- Reminders, including reminder titles, notes, dates, completion state, priority, and list names.
- Health data, currently step count, walking/running distance, and flights climbed.
- Apple Music or media library access, used for music and now-playing widgets.
- Alarm access, used to schedule widget-related alarms or timers.
- Files or folders you explicitly import or export through the system document picker.

Permission-protected data is used to render widgets or perform the action you requested. Await does not sell this data or use it for advertising.

## Network Requests

Await can make network requests in these cases:

- Anonymous app usage analytics sent to `stats.awaitwidget.com`.
- StoreKit requests to Apple for purchases and purchase restoration.
- WeatherKit requests to Apple for weather data.
- Apple Music catalog requests for music metadata and artwork.
- Remote image loading for widget rendering.
- Requests made by widgets through `AwaitNetwork`.

When a widget makes a request, the destination service will process the data according to its own privacy policy. Only send requests to reliable services.

## Purchases

Await uses Apple's StoreKit for in-app purchases. Purchase processing is handled by Apple. Await stores only the local entitlement state needed to unlock purchased features.

## Sharing And Export

You can export widget folders or import folders through the system document picker. Exported widgets may contain editable widget files, assets, and other files you placed in the widget folder. You control where those files are shared.

## Deletion

You can delete widgets and their local stored data from within Await. Deleting the app also removes app-local data from the device, subject to OS behavior for Keychain items, system-managed purchase records, and external copies you exported.

## User-Created Widgets

Await lets you create widgets based on your own preferences. Depending on the features you choose, a widget may use local widget files, store local widget state, access supported permission-based features, or make network requests to services you configure.

Please ensure that any widgets you create or import do not contain potential security risks. You are responsible for any risks associated with running widgets from unverified sources or writing insecure code.

## Changes

This policy may be updated when Await's behavior changes. The date at the top shows the latest update.

## Contact

For privacy questions, open an issue at:

https://github.com/await-widget/skills/issues
