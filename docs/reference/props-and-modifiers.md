# Props And Modifiers

Props and modifiers are the styling and layout surface for Await widgets. The generated section below is sourced from `runtime/types/prop.d.ts`.

## Usage

Component props describe the component's own value, such as `TextValue.value`, `ImageValue.url`, or `ButtonValue.intent`. Modifiers are shared styling and layout props from `BaseMods`, such as `padding`, `background`, `fontSize`, `frame`, `foreground`, and `transition`.

```tsx
<Text
	value='Hello'
	fontSize={18}
	fontWeight='semibold'
	foreground='primary'
	padding={8}
	background='background'
/>
```

Modifier order is semantic in Await. Later modifiers wrap earlier modifiers. For label, tag, or capsule-like blocks, write `padding` before `background` when the background should include the padding area.

## Important Types

- `Color`, `RawColor`, and gradient types define color-like values.
- `BaseMods` is the shared modifier surface.
- `Mods` allows base modifiers and suffixed variants such as ``padding_name``.
- `Frame`, `Padding`, `Point`, `ScaleEffect`, and `RotationEffect` are layout and transform helpers.
- `NativeAnimation`, `Transition`, and `ContentTransition` describe animation-related values.

<!-- GENERATED:START -->
## Generated Type Declarations

### CornerRadiusStyle

Source: `runtime/types/prop.d.ts:1`

```ts
type CornerRadiusStyle = "circular" | "continuous";
```

### NativeAnimation

Source: `runtime/types/prop.d.ts:15`

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

Source: `runtime/types/prop.d.ts:78`

```ts
type Edge = "top" | "bottom" | "leading" | "trailing";
```

### Transition

Source: `runtime/types/prop.d.ts:91`

```ts
type Transition = RawTransition | [RawTransition, RawTransition];
```

### UnevenRoundedRectangleValue

Source: `runtime/types/prop.d.ts:105`

```ts
type UnevenRoundedRectangleValue = {
  rectRadius?: {
    topLeft?: Dimension;
    topRight?: Dimension;
    bottomRight?: Dimension;
    bottomLeft?: Dimension;
    bottom?: Dimension;
    top?: Dimension;
    left?: Dimension;
    right?: Dimension;
  };
  style?: CornerRadiusStyle;
};
```

### ShapeValue

Source: `runtime/types/prop.d.ts:119`

```ts
type ShapeValue = {
  fill?: ShapeStyle;
  stroke?: {
    color?: Color;
    lineWidth?: number;
    lineCap?: string;
    lineJoin?: string;
    miterLimit?: number;
    dash?: number[];
    dashPhase?: number;
  };
  shape?: {
    trim?: [number, number];
    rotation?: RotationEffect;
    offset?: Point;
    scale?: ScaleEffect;
    in?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
};
```

### RoundedRectangleValue

Source: `runtime/types/prop.d.ts:144`

```ts
type RoundedRectangleValue = {
  rectRadius?: Dimension;
  style?: CornerRadiusStyle;
};
```

### VStackValue

Source: `runtime/types/prop.d.ts:149`

```ts
type VStackValue = {
  spacing?: number;
  alignment?: HorizontalAlignment;
};
```

### HStackValue

Source: `runtime/types/prop.d.ts:154`

```ts
type HStackValue = {
  spacing?: number;
  alignment?: VerticalAlignment;
};
```

### ZStackValue

Source: `runtime/types/prop.d.ts:159`

```ts
type ZStackValue = {
  alignment?: Alignment;
};
```

### LinkValue

Source: `runtime/types/prop.d.ts:163`

```ts
type LinkValue = {
  url?: string;
};
```

### ButtonValue

Source: `runtime/types/prop.d.ts:167`

```ts
type ButtonValue = {
  intent?: IntentInfo;
  fast?: boolean;
  audio?: boolean;
  url?: string;
};
```

### ColorValue

Source: `runtime/types/prop.d.ts:174`

```ts
type ColorValue = {
  value?: Color;
};
```

### TextValue

Source: `runtime/types/prop.d.ts:178`

```ts
type TextValue = {
  value?: Encodable;
};
```

### ImageValue

Source: `runtime/types/prop.d.ts:182`

```ts
type ImageValue = {
  url?: string;
  resizable?: Resizable;
  interpolation?: Interpolation;
  style?: TemplateRenderingMode;
};
```

### IconValue

Source: `runtime/types/prop.d.ts:189`

```ts
type IconValue = {
  value?: string;
};
```

### TimeValueStrict

Source: `runtime/types/prop.d.ts:193`

```ts
type TimeValueStrict = {
  value?: number;
  style?: "time" | "date" | "relative" | "offset" | "timer";
};
```

### TimeValue

Source: `runtime/types/prop.d.ts:198`

```ts
type TimeValue = {
  date?: Date;
  style?: "time" | "date" | "relative" | "offset" | "timer";
};
```

### SvgValue

Source: `runtime/types/prop.d.ts:203`

```ts
type SvgValue = {
  url?: string;
  value?: string;
};
```

### CapsuleValue

Source: `runtime/types/prop.d.ts:208`

```ts
type CapsuleValue = {
  style?: CornerRadiusStyle;
};
```

### SectorValue

Source: `runtime/types/prop.d.ts:212`

```ts
type SectorValue = {
  value: [start: number, end: number];
};
```

### PolygonValue

Source: `runtime/types/prop.d.ts:216`

```ts
type PolygonValue = {
  value: Array<[x: number, y: number]>;
};
```

### SpacerValue

Source: `runtime/types/prop.d.ts:220`

```ts
type SpacerValue = {
  minLength?: number;
};
```

### RadialGradient

Source: `runtime/types/prop.d.ts:224`

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

Source: `runtime/types/prop.d.ts:232`

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

Source: `runtime/types/prop.d.ts:240`

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

Source: `runtime/types/prop.d.ts:261`

```ts
type Stop = [Color, number];
```

### RawThemeColor

Source: `runtime/types/prop.d.ts:287`

```ts
type RawThemeColor = RawColor | [RawColor, number];
```

### Dimension

Source: `runtime/types/prop.d.ts:327`

```ts
type Dimension = "max" | number;
```

### LooseValues

Source: `runtime/types/prop.d.ts:333`

```ts
type LooseValues = {
  [P in keyof (ButtonValue &
    HStackValue &
    VStackValue &
    ZStackValue &
    ColorValue &
    ImageValue &
    LinkValue &
    SpacerValue &
    SvgValue &
    IconValue &
    TextValue &
    TimeValueStrict &
    CapsuleValue &
    RoundedRectangleValue &
    SectorValue &
    ShapeValue &
    UnevenRoundedRectangleValue)]?: unknown;
};
```

### Props

Source: `runtime/types/prop.d.ts:353`

```ts
type Props = ID & Mods & LooseValues & { children?: NativeView };
```

### ID

Source: `runtime/types/prop.d.ts:354`

```ts
type ID = { id?: Encodable };
```

### TextAlignment

Source: `runtime/types/prop.d.ts:355`

```ts
type TextAlignment = "center" | "leading" | "trailing";
```

### FontDesign

Source: `runtime/types/prop.d.ts:356`

```ts
type FontDesign = "monospaced" | "rounded" | "serif" | "default";
```

### Material

Source: `runtime/types/prop.d.ts:377`

```ts
type Material = "regular" | "thin" | "thick" | "ultraThin" | "ultraThick";
```

### FontWidth

Source: `runtime/types/prop.d.ts:378`

```ts
type FontWidth = "compressed" | "condensed" | "standard" | "expanded" | number;
```

### Interpolation

Source: `runtime/types/prop.d.ts:379`

```ts
type Interpolation = "none" | "low" | "medium" | "high";
```

### Resizable

Source: `runtime/types/prop.d.ts:380`

```ts
type Resizable = boolean | "stretch" | "tile";
```

### Point

Source: `runtime/types/prop.d.ts:382`

```ts
type Point = { x?: number; y?: number } | number;
```

### Font

Source: `runtime/types/prop.d.ts:387`

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

Source: `runtime/types/prop.d.ts:403`

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

### RotationEffect

Source: `runtime/types/prop.d.ts:412`

```ts
type RotationEffect = { angle: number; anchor: UnitPoint } | number;
```

### Shadow

Source: `runtime/types/prop.d.ts:417`

```ts
type Shadow = {
  color?: Color;
  x?: number;
  y?: number;
  blur?: number;
};
```

### Pattern

Source: `runtime/types/prop.d.ts:423`

```ts
type Pattern = "dash" | "dashDot" | "dashDotDot" | "dot" | "solid";
```

### CustomButtonStyle

Source: `runtime/types/prop.d.ts:455`

```ts
type CustomButtonStyle = {
  press: NativeView;
  normal: NativeView;
};
```

### Duration

Source: `runtime/types/prop.d.ts:460`

```ts
type Duration = 2 | 4 | 6 | 10 | 12 | 20 | 30 | 60;
```

### GifValue

Source: `runtime/types/prop.d.ts:461`

```ts
type GifValue = { size: Size; duration: Duration };
```

### BaseMods

Source: `runtime/types/prop.d.ts:471`

```ts
type BaseMods = {
  animation?: NativeAnimation | number | "";
  aspectRatio?: AspectRatio;
  background?:
    | ShapeStyle
    | NativeView
    | { alignment: Alignment; content: NativeView };
  baselineOffset?: number;
  blendMode?: BlendMode;
  blur?: number | { blur: number; opaque: boolean };
  brightness?: number;
  buttonStyle?: ButtonStyle;
  clipped?: boolean;
  clipShape?: NativeView | "";
  colorInvert?: boolean;
  colorMultiply?: Color;
  compositingGroup?: boolean;
  contentShape?: NativeView | "";
  contentTransition?: ContentTransition;
  contrast?: number;
  cornerRadius?: number;
  debug?: boolean;
  disable?: boolean;
  drawingGroup?: boolean;
  fixedSize?: boolean | { horizontal?: boolean; vertical?: boolean };
  font?: Font | "";
  fontDesign?: FontDesign | "";
  fontSize?: number;
  fontWeight?: FontWeight | "";
  fontWidth?: FontWidth | "";
  foreground?: ShapeStyle;
  frame?: Frame;
  geometryGroup?: boolean;
  grayscale?: number;
  height?: number;
  hidden?: boolean;
  hueRotation?: number;
  ignoresSafeArea?: boolean;
  italic?: boolean;
  kerning?: number;
  layoutPriority?: number;
  lineLimit?: number | "";
  lineSpacing?: number;
  lineHeight?: LineHeight | "";
  luminanceToAlpha?: boolean;
  mask?: NativeView;
  maxHeight?: Dimension | boolean;
  maxSides?: Dimension | boolean;
  maxWidth?: Dimension | boolean;
  minimumScaleFactor?: number;
  monospaced?: boolean;
  monospacedDigit?: boolean;
  offset?: Point;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  overlay?:
    | ShapeStyle
    | NativeView
    | { alignment: Alignment; content: NativeView };
  padding?: Padding | boolean;
  pixelPerfectCenter?: boolean | Point;
  position?: Point;
  reverseMask?: NativeView;
  rotation3DEffect?: Rotation3DEffect;
  rotationEffect?: RotationEffect;
  saturation?: number;
  scaleEffect?: ScaleEffect;
  shadow?: Shadow;
  sides?: number;
  strikethrough?: boolean | { isActive?: boolean; color?: Color };
  test?: unknown;
  textAlignment?: TextAlignment;
  tint?: ShapeStyle;
  tracking?: number;
  transform?: [number, number, number, number, number, number];
  transition?: Transition;
  truncationMode?: "head" | "middle" | "tail";
  underline?:
    | boolean
    | { isActive?: boolean; pattern?: Pattern; color?: Color };
  width?: number;
  zIndex?: number;
};
```

### Mods

Source: `runtime/types/prop.d.ts:556`

```ts
type Mods = {
  [K in keyof BaseMods]?: BaseMods[K];
} & {
  [K in keyof BaseMods as `${K & string}_${string}`]?: BaseMods[K];
};
```

### ObjectToTuple

Source: `runtime/types/prop.d.ts:562`

```ts
type ObjectToTuple<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];
```

### ModTuple

Source: `runtime/types/prop.d.ts:566`

```ts
type ModTuple = ObjectToTuple<BaseMods>;
```
<!-- GENERATED:END -->
