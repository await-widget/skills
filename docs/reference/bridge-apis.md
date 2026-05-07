# Bridge APIs

Bridge APIs are global objects provided by the Await host. The generated section below is sourced from `runtime/types/bridge.d.ts`.

## Usage

Bridge APIs are globals. Do not import them.

```tsx
const count = AwaitStore.num('count', 0);
AwaitStore.set('count', count + 1);
```

Use these APIs only as declared here. This reference documents the public contract, not the host implementation.

## Categories

- Registration: `Await.define`.
- Environment: `AwaitEnv`, `AwaitSystem`, `AwaitUI`.
- State and files: `AwaitStore`, `AwaitFile`, `AwaitClipboard`.
- Data: `AwaitNetwork`, `AwaitWeather`, `AwaitHealth`, `AwaitLocation`, `AwaitCalendar`, `AwaitReminder`.
- Actions and media: `AwaitAlarm`, `AwaitMedia`, `AwaitAudio`, `AwaitLaunch`.
- Timers and logging: `setTimeout`, `setInterval`, `sleep`, `print`, `console.log`.

<!-- GENERATED:START -->
## Generated Bridge Declarations

### setTimeout

Source: `runtime/types/bridge.d.ts:5`

```ts
export declare function setTimeout(
  callback: (...args: unknown[]) => void,
  ms: number,
): unknown;
```

### clearTimeout

Source: `runtime/types/bridge.d.ts:9`

```ts
export declare function clearTimeout(timerID: unknown): void;
```

### setInterval

Source: `runtime/types/bridge.d.ts:10`

```ts
export declare function setInterval(
  callback: (...args: unknown[]) => void,
  ms: number,
): unknown;
```

### sleep

Source: `runtime/types/bridge.d.ts:14`

```ts
export declare function sleep(ms: number): Promise<void>;
```

### clearInterval

Source: `runtime/types/bridge.d.ts:15`

```ts
export declare function clearInterval(timerID: unknown): void;
```

### print

Source: `runtime/types/bridge.d.ts:16`

```ts
export declare function print(...args: unknown[]): void;
```

### console

Source: `runtime/types/bridge.d.ts:17`

```ts
export declare const console: {
  log(...args: unknown[]): void;
};
```

### AwaitClipboard

Source: `runtime/types/bridge.d.ts:20`

```ts
export declare const AwaitClipboard: {
  set(value: string): void;
};
```

### AwaitNetwork

Source: `runtime/types/bridge.d.ts:39`

```ts
export declare const AwaitNetwork: {
  request(
    urlString: string,
    config?: AwaitNetworkConfig,
  ): Promise<AwaitNetworkResponse>;
  fanfou(urlString: string, config?: AwaitFoufouConfig): Promise<unknown>;
};
```

### AwaitWeather

Source: `runtime/types/bridge.d.ts:46`

```ts
export declare const AwaitWeather: {
  get(config?: AwaitWeatherConfig): Promise<AwaitWeatherResult | undefined>;
};
```

### AwaitHealth

Source: `runtime/types/bridge.d.ts:49`

```ts
export declare const AwaitHealth: {
  get(): Promise<AwaitHealthInfo | undefined>;
};
```

### AwaitLocation

Source: `runtime/types/bridge.d.ts:52`

```ts
export declare const AwaitLocation: {
  get(config?: AwaitLocationConfig): Promise<AwaitLocationInfo | undefined>;
};
```

### AwaitCalendar

Source: `runtime/types/bridge.d.ts:55`

```ts
export declare const AwaitCalendar: {
  get(config?: AwaitCalendarConfig): Promise<AwaitCalendarItem[] | undefined>;
};
```

### AwaitReminder

Source: `runtime/types/bridge.d.ts:58`

```ts
export declare const AwaitReminder: {
  get(config?: AwaitReminderConfig): Promise<AwaitReminderItem[] | undefined>;
};
```

### AwaitSystem

Source: `runtime/types/bridge.d.ts:61`

```ts
export declare const AwaitSystem: {
  get(): AwaitSystemInfo;
};
```

### AwaitAlarm

Source: `runtime/types/bridge.d.ts:64`

```ts
export declare const AwaitAlarm: {
  schedule(config: AwaitAlarmScheduleConfig): Promise<string>;
  cancel(id: string): any;
};
```

### AwaitMedia

Source: `runtime/types/bridge.d.ts:68`

```ts
export declare const AwaitMedia: {
  nowPlayingMedia(config?: AwaitNowPlayingConfig): Promise<AwaitNowPlayingInfo>;
  mediaPlayerCommand(
    command: AwaitMusicPlayerCommand,
    config?: AwaitMediaPlayConfig,
  ): Promise<void>;
};
```

### AwaitStore

Source: `runtime/types/bridge.d.ts:75`

```ts
export declare const AwaitStore: {
  get<T>(key: string): T | undefined;
  num(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
  string(key: string, defaultValue?: string): string;
  array<T>(key: string, defaultValue?: T[]): T[];
  delete(key: string): void;
  set(key: string, value: Encodable): void;
};
```

### AwaitFile

Source: `runtime/types/bridge.d.ts:84`

```ts
export declare const AwaitFile: {
  files(path: string): string[];
  readJSON(path: string): unknown;
  readText(path: string): string | undefined;
  fileSize(path: string): number | undefined;
  readTextByPage(
    path: string,
    page: number,
    pageSize: number,
  ): string | undefined;
  readTextByPages(
    path: string,
    pages: number[],
    pageSize: number,
  ): Array<string | undefined>;
  saveUIRenderImage(path: string, value: NativeView): void;
};
```

### AwaitAudio

Source: `runtime/types/bridge.d.ts:101`

```ts
export declare const AwaitAudio: {
  readonly isPlayingNote: boolean;
  setAudioSession(active: boolean, option?: AudioOption): void;
  reinstallInstruments(): void;
  playAudio(url: string, config?: AudioConfig): void;
  pauseAudio(): void;
  playMidi(url: string, config?: AudioConfig): void;
  stopMidi(): void;
  replayMidi(config?: AudioConfig): void;
  recordMidi(): void;
  buildSoundFont(config: SoundFontBuildConfig): Promise<SoundFontBuildResult>;
  compressSoundFont(
    config: SoundFontCompressConfig,
  ): Promise<SoundFontBuildResult>;
  playNote(notes: number[] | number, config?: AudioConfig): void;
};
```

### AwaitUI

Source: `runtime/types/bridge.d.ts:117`

```ts
export declare const AwaitUI: {
  readonly displayScale: number;
  haptic(type: string): void;
};
```

### Await

Source: `runtime/types/bridge.d.ts:143`

```ts
export declare const Await: {
  define<Intents, T extends Record<string, unknown>>(
    config: AwaitDefineConfig<Intents, T>,
  ): AwaitDefineResult<Intents>;
};
```

### AwaitLaunch

Source: `runtime/types/bridge.d.ts:148`

```ts
export declare const AwaitLaunch: {
  start(bundleId: string): any;
};
```

### AwaitEnv

Source: `runtime/types/bridge.d.ts:151`

```ts
export declare const AwaitEnv: {
  readonly id: string;
  readonly tag: number;
  readonly host: "app" | "widget";
  test(...args: unknown[]): unknown;
};
```

## Generated Bridge Helper Types

### AwaitNetworkResponse

Source: `runtime/types/bridge.d.ts:1`

```ts
type AwaitNetworkResponse = {
  code: number;
  data: string;
};
```

### AwaitNetworkConfig

Source: `runtime/types/bridge.d.ts:23`

```ts
type AwaitNetworkConfig = {
  method?: string;
  headers?: Record<string, string>;
  body?: Encodable;
};
```

### AwaitFoufouConfig

Source: `runtime/types/bridge.d.ts:28`

```ts
type AwaitFoufouConfig = {
  method?: string;
  image?: string;
  oauthToken?: string;
  oauthTokenSecret?: string;
  consumerKey?: string;
  consumerSecret?: string;
  username?: string;
  password?: string;
  parameters?: Record<string, string | number | boolean>;
};
```

### AwaitDefineConfig

Source: `runtime/types/bridge.d.ts:121`

```ts
type AwaitDefineConfig<Intents, T extends Record<string, unknown>> = {
  widget: (entry: WidgetEntry<T>) => NativeView;
  widgetTimeline?: (
    context: TimelineContext,
  ) => Timeline<T> | Promise<Timeline<T>>;
  widgetIntents?: {
    [IntentKey in keyof Intents]: Intents[IntentKey] extends (
      ...args: infer IntentArguments
    ) => void
      ? IntentArguments extends Encodable[]
        ? Intents[IntentKey]
        : never
      : never;
  };
};
```

### AwaitDefineResult

Source: `runtime/types/bridge.d.ts:136`

```ts
type AwaitDefineResult<Intents> = {
  [IntentKey in keyof Intents]: Intents[IntentKey] extends (
    ...args: infer IntentArguments
  ) => void
    ? (...args: IntentArguments) => IntentInfo
    : never;
};
```

### AwaitGlobal

Source: `runtime/types/bridge.d.ts:157`

```ts
type AwaitGlobal = typeof Await;
```

### AwaitEnvGlobal

Source: `runtime/types/bridge.d.ts:158`

```ts
type AwaitEnvGlobal = typeof AwaitEnv;
```

### AwaitLaunchGlobal

Source: `runtime/types/bridge.d.ts:159`

```ts
type AwaitLaunchGlobal = typeof AwaitLaunch;
```

### AwaitUIGlobal

Source: `runtime/types/bridge.d.ts:160`

```ts
type AwaitUIGlobal = typeof AwaitUI;
```

### AwaitClipboardGlobal

Source: `runtime/types/bridge.d.ts:161`

```ts
type AwaitClipboardGlobal = typeof AwaitClipboard;
```

### AwaitNetworkGlobal

Source: `runtime/types/bridge.d.ts:162`

```ts
type AwaitNetworkGlobal = typeof AwaitNetwork;
```

### AwaitWeatherGlobal

Source: `runtime/types/bridge.d.ts:163`

```ts
type AwaitWeatherGlobal = typeof AwaitWeather;
```

### AwaitHealthGlobal

Source: `runtime/types/bridge.d.ts:164`

```ts
type AwaitHealthGlobal = typeof AwaitHealth;
```

### AwaitLocationGlobal

Source: `runtime/types/bridge.d.ts:165`

```ts
type AwaitLocationGlobal = typeof AwaitLocation;
```

### AwaitCalendarGlobal

Source: `runtime/types/bridge.d.ts:166`

```ts
type AwaitCalendarGlobal = typeof AwaitCalendar;
```

### AwaitReminderGlobal

Source: `runtime/types/bridge.d.ts:167`

```ts
type AwaitReminderGlobal = typeof AwaitReminder;
```

### AwaitSystemGlobal

Source: `runtime/types/bridge.d.ts:168`

```ts
type AwaitSystemGlobal = typeof AwaitSystem;
```

### AwaitAlarmGlobal

Source: `runtime/types/bridge.d.ts:169`

```ts
type AwaitAlarmGlobal = typeof AwaitAlarm;
```

### AwaitMediaGlobal

Source: `runtime/types/bridge.d.ts:170`

```ts
type AwaitMediaGlobal = typeof AwaitMedia;
```

### AwaitStoreGlobal

Source: `runtime/types/bridge.d.ts:171`

```ts
type AwaitStoreGlobal = typeof AwaitStore;
```

### AwaitFileGlobal

Source: `runtime/types/bridge.d.ts:172`

```ts
type AwaitFileGlobal = typeof AwaitFile;
```

### AwaitAudioGlobal

Source: `runtime/types/bridge.d.ts:173`

```ts
type AwaitAudioGlobal = typeof AwaitAudio;
```

### SleepGlobal

Source: `runtime/types/bridge.d.ts:174`

```ts
type SleepGlobal = typeof sleep;
```
<!-- GENERATED:END -->
