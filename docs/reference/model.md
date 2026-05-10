# Model

The generated section below is sourced from `runtime/types/model.d.ts`.

<!-- GENERATED:START -->
## Generated Type Declarations

### AudioOption

```ts
type AudioOption = "mix" | "duckOthers" | "solo";
```

### ColorScheme

```ts
type ColorScheme = "light" | "dark";
```

### RenderingMode

```ts
type RenderingMode = "fullColor" | "accented" | "vibrant";
```

### Update

```ts
type Update = Date | "end" | "rapid" | "never";
```

### NativeView

```ts
type NativeView = SingleNativeView | NativeView[];
```

### AudioConfig

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

```ts
type SoundFontManualMapping = {
  path: string;
  key: number;
};
```

### SoundFontBuildConfig

```ts
type SoundFontBuildConfig = {
  savePath: string;
  dataSizeLimitMB?: number;
  mediaFiles?: string[];
  mappings?: SoundFontManualMapping[];
};
```

### SoundFontCompressConfig

```ts
type SoundFontCompressConfig = {
  fromPath: string;
  savePath: string;
  dataSizeLimitMB?: number;
};
```

### SoundFontBuildResult

```ts
type SoundFontBuildResult = {
  ok: true;
  output: string;
  resolvedOutput: string;
  sizeBytes: number;
};
```

### AwaitWeatherConfig

```ts
type AwaitWeatherConfig = {
  latitude?: number;
  longitude?: number;
  hourlyLimit?: number;
  dailyLimit?: number;
};
```

### AwaitWeatherCurrent

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

```ts
type AwaitWeatherResult = {
  location: {
    latitude: number;
    longitude: number;
  };
  current: AwaitWeatherCurrent;
  hourly: AwaitWeatherHourly[];
  daily: AwaitWeatherDaily[];
};
```

### AwaitHealthInfo

```ts
type AwaitHealthInfo = {
  stepCount?: number;
  distanceWalkingRunning?: number;
  flightsClimbed?: number;
};
```

### AwaitLocationConfig

```ts
type AwaitLocationConfig = {
  desiredAccuracyMeters?: number;
  timeoutSeconds?: number;
};
```

### AwaitLocationInfo

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

```ts
type AwaitNowPlayingConfig = {
  artworkSize?: number;
};
```

### AwaitNowPlayingInfo

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

```ts
type AwaitMusicPlayerCommand = "start" | "toggle" | "next" | "previous";
```

### AwaitCalendarConfig

```ts
type AwaitCalendarConfig = {
  start?: Date;
  end?: Date;
  limit?: number;
};
```

### AwaitCalendarItem

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

```ts
type AwaitReminderConfig = {
  type?: "all" | "incomplete" | "completed";
  limit?: number;
};
```

### AwaitReminderItem

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

```ts
type AwaitAlarmScheduleConfig = {
  title?: string;
  duration?: number;
  date?: Date;
  tint?: Color;
};
```

### WidgetEntry

```ts
type WidgetEntry<T extends Record<string, unknown> = Record<string, unknown>> =
  TimelineContext &
    T & {
      date: Date;
      colorScheme: ColorScheme;
      renderingMode: RenderingMode;
    };
```

### TimelineContext

```ts
type TimelineContext = {
  size: Size;
  family: WidgetFamily;
};
```

### Timeline

```ts
type Timeline<T extends Record<string, unknown> = Record<string, unknown>> = {
  entries: Array<{ date: Date } & T>;
  update?: Update;
  skipOnPlayingNote?: boolean;
};
```
<!-- GENERATED:END -->
