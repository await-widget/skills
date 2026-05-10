# Meta

The generated section below is sourced from `runtime/types/meta.d.ts`.

<!-- GENERATED:START -->
## Generated Type Declarations

### CornerRadiusStyle

```ts
type CornerRadiusStyle = "circular" | "continuous";
```

### TimeStyle

```ts
type TimeStyle = "time" | "date" | "relative" | "offset" | "timer";
```

### Material

```ts
type Material = "regular" | "thin" | "thick" | "ultraThin" | "ultraThick";
```

### NativeAnimation

```ts
type NativeAnimation = (
  | {
      type?:
        | "linear"
        | "default"
        | "easeIn"
        | "easeInOut"
        | "easeOut"
        | "circularEaseIn"
        | "circularEaseInOut"
        | "circularEaseOut";
      duration?: number;
    }
  | {
      type: "interactiveSpring";
      blendDuration?: number;
      duration?: number;
      bounce?: number;
    }
  | {
      type: "bouncy";
      bounce?: number;
      duration?: number;
    }
  | {
      type: "smooth";
      duration?: number;
      bounce?: number;
    }
  | {
      type: "spring";
      blendDuration?: number;
      duration?: number;
      bounce?: number;
    }
  | {
      type: "timingCurve";
      start: UnitPoint;
      end: UnitPoint;
      duration?: number;
    }
  | {
      type: "snappy";
      bounce?: number;
      duration?: number;
    }
) & {
  value?: unknown;
  delay?: number;
  autoreverses?: boolean;
  speed?: number;
  loop?: boolean | number;
};
```

### Edge

```ts
type Edge = "top" | "bottom" | "leading" | "trailing";
```

### Transition

```ts
type Transition = RawTransition | [RawTransition, RawTransition];
```

### RadialGradient

```ts
type RadialGradient = {
  gradient: "radial";
  colors?: Color[];
  stops?: Array<[Color, number]>;
  startRadius?: number;
  endRadius?: number;
};
```

### AngularGradient

```ts
type AngularGradient = {
  gradient: "angular";
  colors?: Color[];
  stops?: Array<[Color, number]>;
  angle?: number;
  center?: UnitPoint;
};
```

### LinearGradient

```ts
type LinearGradient = {
  gradient: "linear";
  colors?: Color[];
  stops?: Stop[];
  startPoint?: UnitPoint;
  endPoint?: UnitPoint;
};
```

### Stop

```ts
type Stop = [Color, number];
```

### RawThemeColor

```ts
type RawThemeColor = RawColor | [RawColor, number];
```

### Dimension

```ts
type Dimension = "max" | number;
```

### Size

```ts
type Size = {
  width: number;
  height: number;
};
```

### TemplateRenderingMode

```ts
type TemplateRenderingMode = "original" | "template";
```

### IntentInfo

```ts
type IntentInfo = {
  name: string;
  args: Encodable[];
};
```

### ID

```ts
type ID = {
  id?: Encodable;
};
```

### TextAlignment

```ts
type TextAlignment = "center" | "leading" | "trailing";
```

### FontDesign

```ts
type FontDesign = "monospaced" | "rounded" | "serif" | "default";
```

### FontWidth

```ts
type FontWidth = "compressed" | "condensed" | "standard" | "expanded" | number;
```

### Interpolation

```ts
type Interpolation = "none" | "low" | "medium" | "high";
```

### Resizable

```ts
type Resizable = boolean | "stretch" | "tile";
```

### Font

```ts
type Font = {
  name: string;
  size: number;
  wght?: number;
  wdth?: number;
  opsz?: number;
  slnt?: number;
  ital?: number;

  GRAD?: number;
  HGHT?: number;
  SOFT?: number;

  monospacedDigit?: boolean;
  features?: string[] | string;
};
```

### Rotation3DEffect

```ts
type Rotation3DEffect = {
  angle: number;
  x?: number;
  y?: number;
  z?: number;
  anchor?: UnitPoint;
  anchorZ?: number;
  perspective?: number;
};
```

### Shadow

```ts
type Shadow = {
  color?: Color;
  x?: number;
  y?: number;
  blur?: number;
};
```

### Pattern

```ts
type Pattern = "dash" | "dashDot" | "dashDotDot" | "dot" | "solid";
```

### CustomButtonStyle

```ts
type CustomButtonStyle = {
  press: NativeView;
  normal: NativeView;
};
```

### GifDuration

```ts
type GifDuration = 2 | 4 | 6 | 10 | 12 | 20 | 30 | 60;
```
<!-- GENERATED:END -->
