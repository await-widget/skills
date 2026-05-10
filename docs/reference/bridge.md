# Bridge

The generated section below is sourced from `runtime/types/bridge.d.ts`.

<!-- GENERATED:START -->
## Generated Bridge Declarations

### setTimeout

```ts
export declare function setTimeout(
  callback: (...args: unknown[]) => void,
  ms: number,
): unknown;
```

### clearTimeout

```ts
export declare function clearTimeout(timerID: unknown): void;
```

### setInterval

```ts
export declare function setInterval(
  callback: (...args: unknown[]) => void,
  ms: number,
): unknown;
```

### sleep

```ts
export declare function sleep(ms: number): Promise<void>;
```

### clearInterval

```ts
export declare function clearInterval(timerID: unknown): void;
```

### print

```ts
export declare function print(...args: unknown[]): void;
```

### console

```ts
export declare const console: {
  log(...args: unknown[]): void;
};
```

### AwaitClipboard

```ts
export declare const AwaitClipboard: {
  set(value: string): void;
};
```

### AwaitNetwork

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

```ts
export declare const AwaitWeather: {
  get(config?: AwaitWeatherConfig): Promise<AwaitWeatherResult | undefined>;
};
```

### AwaitHealth

```ts
export declare const AwaitHealth: {
  get(): Promise<AwaitHealthInfo | undefined>;
};
```

### AwaitLocation

```ts
export declare const AwaitLocation: {
  get(config?: AwaitLocationConfig): Promise<AwaitLocationInfo | undefined>;
};
```

### AwaitCalendar

```ts
export declare const AwaitCalendar: {
  get(config?: AwaitCalendarConfig): Promise<AwaitCalendarItem[] | undefined>;
};
```

### AwaitReminder

```ts
export declare const AwaitReminder: {
  get(config?: AwaitReminderConfig): Promise<AwaitReminderItem[] | undefined>;
};
```

### AwaitSystem

```ts
export declare const AwaitSystem: {
  get(): AwaitSystemInfo;
};
```

### AwaitAlarm

```ts
export declare const AwaitAlarm: {
  schedule(config: AwaitAlarmScheduleConfig): Promise<string>;
  cancel(id: string): any;
};
```

### AwaitMedia

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

```ts
export declare const AwaitUI: {
  readonly displayScale: number;
  haptic(type: string): void;
};
```

### Await

```ts
export declare const Await: {
  define<Intents, T extends Record<string, unknown>>(
    config: AwaitDefineConfig<Intents, T>,
  ): AwaitDefineResult<Intents>;
};
```

### AwaitLaunch

```ts
export declare const AwaitLaunch: {
  start(bundleId: string): any;
};
```

### AwaitEnv

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

```ts
type AwaitNetworkResponse = {
  code: number;
  data: string;
};
```

### AwaitNetworkConfig

```ts
type AwaitNetworkConfig = {
  method?: string;
  headers?: Record<string, string>;
  body?: Encodable;
};
```

### AwaitFoufouConfig

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

```ts
type AwaitGlobal = typeof Await;
```

### AwaitEnvGlobal

```ts
type AwaitEnvGlobal = typeof AwaitEnv;
```

### AwaitLaunchGlobal

```ts
type AwaitLaunchGlobal = typeof AwaitLaunch;
```

### AwaitUIGlobal

```ts
type AwaitUIGlobal = typeof AwaitUI;
```

### AwaitClipboardGlobal

```ts
type AwaitClipboardGlobal = typeof AwaitClipboard;
```

### AwaitNetworkGlobal

```ts
type AwaitNetworkGlobal = typeof AwaitNetwork;
```

### AwaitWeatherGlobal

```ts
type AwaitWeatherGlobal = typeof AwaitWeather;
```

### AwaitHealthGlobal

```ts
type AwaitHealthGlobal = typeof AwaitHealth;
```

### AwaitLocationGlobal

```ts
type AwaitLocationGlobal = typeof AwaitLocation;
```

### AwaitCalendarGlobal

```ts
type AwaitCalendarGlobal = typeof AwaitCalendar;
```

### AwaitReminderGlobal

```ts
type AwaitReminderGlobal = typeof AwaitReminder;
```

### AwaitSystemGlobal

```ts
type AwaitSystemGlobal = typeof AwaitSystem;
```

### AwaitAlarmGlobal

```ts
type AwaitAlarmGlobal = typeof AwaitAlarm;
```

### AwaitMediaGlobal

```ts
type AwaitMediaGlobal = typeof AwaitMedia;
```

### AwaitStoreGlobal

```ts
type AwaitStoreGlobal = typeof AwaitStore;
```

### AwaitFileGlobal

```ts
type AwaitFileGlobal = typeof AwaitFile;
```

### AwaitAudioGlobal

```ts
type AwaitAudioGlobal = typeof AwaitAudio;
```

### SleepGlobal

```ts
type SleepGlobal = typeof sleep;
```
<!-- GENERATED:END -->
