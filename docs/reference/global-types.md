# Global Types

Shared widget, timeline, media, system, and data types. The generated section below is sourced from `runtime/types/global.d.ts`.

## Usage

These types are available through `@await-widget/runtime` when the widget project includes:

```json
{
  "compilerOptions": {
    "types": ["@await-widget/runtime"]
  }
}
```

Most widget code uses `WidgetEntry<T>`, `Timeline<T>`, and `TimelineContext` directly in function signatures.

```tsx
type EntryData = {
	label: string;
};

function widget(entry: WidgetEntry<EntryData>) {
	// render entry.label
}
```

<!-- GENERATED:START -->
## Generated Type Declarations

### AudioOption

Source: `runtime/types/global.d.ts:8`

```ts
type AudioOption = "mix" | "duckOthers" | "solo";
```

### ColorScheme

Source: `runtime/types/global.d.ts:9`

```ts
type ColorScheme = "light" | "dark";
```

### RenderingMode

Source: `runtime/types/global.d.ts:10`

```ts
type RenderingMode = "fullColor" | "accented" | "vibrant";
```

### TemplateRenderingMode

Source: `runtime/types/global.d.ts:11`

```ts
type TemplateRenderingMode = "original" | "template";
```

### Update

Source: `runtime/types/global.d.ts:12`

```ts
type Update = Date | "end" | "rapid" | "never";
```

### Size

Source: `runtime/types/global.d.ts:23`

```ts
type Size = { width: number; height: number };
```

### NativeView

Source: `runtime/types/global.d.ts:34`

```ts
type NativeView = SingleNativeView | NativeView[];
```

### IntentInfo

Source: `runtime/types/global.d.ts:36`

```ts
type IntentInfo = {
  name: string;
  args: Encodable[];
};
```

### AudioConfig

Source: `runtime/types/global.d.ts:41`

```ts
type AudioConfig = {
  soundFont?: string;
  volume?: number;
  duration?: number;
  delay?: number;
  velocity?: number;
  preset?: number;
  bank?: number;
  loop?: boolean;
  audioOption?: AudioOption;
};
```

### SoundFontManualMapping

Source: `runtime/types/global.d.ts:53`

```ts
type SoundFontManualMapping = {
  path: string;
  key: number;
};
```

### SoundFontBuildConfig

Source: `runtime/types/global.d.ts:58`

```ts
type SoundFontBuildConfig = {
  savePath: string;
  dataSizeLimitMB?: number;
  mediaFiles?: string[];
  mappings?: SoundFontManualMapping[];
};
```

### SoundFontCompressConfig

Source: `runtime/types/global.d.ts:65`

```ts
type SoundFontCompressConfig = {
  fromPath: string;
  savePath: string;
  dataSizeLimitMB?: number;
};
```

### SoundFontBuildResult

Source: `runtime/types/global.d.ts:71`

```ts
type SoundFontBuildResult = {
  ok: true;
  output: string;
  resolvedOutput: string;
  sizeBytes: number;
};
```

### AwaitWeatherConfig

Source: `runtime/types/global.d.ts:78`

```ts
type AwaitWeatherConfig = {
  latitude?: number;
  longitude?: number;
  hourlyLimit?: number;
  dailyLimit?: number;
};
```

### AwaitWeatherCurrent

Source: `runtime/types/global.d.ts:85`

```ts
type AwaitWeatherCurrent = {
  date: string;
  condition: string;
  symbolName: string;
  temperatureCelsius: number;
  apparentTemperatureCelsius: number;
  humidity: number;
  uvIndex: number;
  windSpeedMetersPerSecond: number;
  windDirectionDegrees: number;
  pressureHectopascals: number;
  visibilityKilometers: number;
};
```

### AwaitWeatherHourly

Source: `runtime/types/global.d.ts:99`

```ts
type AwaitWeatherHourly = {
  date: string;
  condition: string;
  symbolName: string;
  temperatureCelsius: number;
  humidity: number;
  uvIndex: number;
  windSpeedMetersPerSecond: number;
  precipitationChance: number;
};
```

### AwaitWeatherDaily

Source: `runtime/types/global.d.ts:110`

```ts
type AwaitWeatherDaily = {
  date: string;
  condition: string;
  symbolName: string;
  highTemperatureCelsius: number;
  lowTemperatureCelsius: number;
  precipitationChance: number;
  uvIndex: number;
};
```

### AwaitWeatherResult

Source: `runtime/types/global.d.ts:120`

```ts
type AwaitWeatherResult = {
  location: { latitude: number; longitude: number };
  current: AwaitWeatherCurrent;
  hourly: AwaitWeatherHourly[];
  daily: AwaitWeatherDaily[];
};
```

### AwaitHealthInfo

Source: `runtime/types/global.d.ts:127`

```ts
type AwaitHealthInfo = {
  stepCount?: number;
  distanceWalkingRunning?: number;
  flightsClimbed?: number;
};
```

### AwaitLocationConfig

Source: `runtime/types/global.d.ts:133`

```ts
type AwaitLocationConfig = {
  desiredAccuracyMeters?: number;
  timeoutSeconds?: number;
};
```

### AwaitLocationInfo

Source: `runtime/types/global.d.ts:138`

```ts
type AwaitLocationInfo = {
  latitude: number;
  longitude: number;
  date: Date;
  altitudeMeters?: number;
  speedMetersPerSecond?: number;
  courseDegrees?: number;
};
```

### AwaitNowPlayingConfig

Source: `runtime/types/global.d.ts:147`

```ts
type AwaitNowPlayingConfig = {
  artworkSize?: number;
};
```

### AwaitNowPlayingInfo

Source: `runtime/types/global.d.ts:151`

```ts
type AwaitNowPlayingInfo = {
  state?:
    | "playing"
    | "paused"
    | "stopped"
    | "interrupted"
    | "seekingForward"
    | "seekingBackward";
  sourceConfig?: AwaitMediaPlayConfig;
  id?: string;
  title?: string;
  artistName?: string;
  albumTitle?: string;
  artworkURL?: string;
  maximumWidth?: number;
  maximumHeight?: number;
  backgroundColor?: Color;
  primaryTextColor?: Color;
  secondaryTextColor?: Color;
  tertiaryTextColor?: Color;
  quaternaryTextColor?: Color;
};
```

### AwaitMusicPlayerCommand

Source: `runtime/types/global.d.ts:174`

```ts
type AwaitMusicPlayerCommand = "start" | "toggle" | "next" | "previous";
```

### AwaitCalendarConfig

Source: `runtime/types/global.d.ts:200`

```ts
type AwaitCalendarConfig = {
  start?: Date;
  end?: Date;
  limit?: number;
};
```

### AwaitCalendarItem

Source: `runtime/types/global.d.ts:206`

```ts
type AwaitCalendarItem = {
  calendarTitle: string;
  title: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  location?: string;
  notes?: string;
  url?: string;
};
```

### AwaitReminderConfig

Source: `runtime/types/global.d.ts:217`

```ts
type AwaitReminderConfig = {
  type?: "all" | "incomplete" | "completed";
  limit?: number;
};
```

### AwaitReminderItem

Source: `runtime/types/global.d.ts:222`

```ts
type AwaitReminderItem = {
  calendarTitle: string;
  title: string;
  notes?: string;
  isCompleted: boolean;
  priority: number;
  startDate?: Date;
  dueDate?: Date;
  completionDate?: Date;
};
```

### AwaitSystemInfo

Source: `runtime/types/global.d.ts:233`

```ts
type AwaitSystemInfo = {
  battery: {
    state: "charging" | "full" | "unplugged" | "unknown";
    percent: number;
    lowPowerMode: boolean;
  };
  memory?: {
    used: number;
    free: number;
    total: number;
    percent: number;
  };
  cpu: {
    percent?: number;
  };
  storage?: {
    total: number;
    free: number;
    used: number;
    percent: number;
  };
};
```

### AwaitAlarmScheduleConfig

Source: `runtime/types/global.d.ts:256`

```ts
type AwaitAlarmScheduleConfig = {
  title?: string;
  duration?: number;
  date?: Date;
  tint?: Color;
};
```

### WidgetEntry

Source: `runtime/types/global.d.ts:263`

```ts
type WidgetEntry<T extends Record<string, unknown> = Record<string, unknown>> =
  {
    colorScheme: ColorScheme;
    renderingMode: RenderingMode;
    size: Size;
    family: WidgetFamily;
  } & {
    date: Date;
  } & T;
```

### TimelineContext

Source: `runtime/types/global.d.ts:273`

```ts
type TimelineContext = {
  size: Size;
  family: WidgetFamily;
};
```

### Timeline

Source: `runtime/types/global.d.ts:278`

```ts
type Timeline<T extends Record<string, unknown> = Record<string, unknown>> = {
  entries: Array<{ date: Date } & T>;
  update?: Update;
  skipOnPlayingNote?: boolean;
};
```
<!-- GENERATED:END -->
