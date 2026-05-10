# Prop

The generated section below is sourced from `runtime/types/prop.d.ts`.

<!-- GENERATED:START -->
## Generated Type Declarations

### Props

```ts
type Props = Record<string, unknown>;
```

### VStackValue

- `spacing` Default 0.
- `alignment` Horizontal alignment for child views.

```ts
type VStackValue = {
  spacing?: number;
  alignment?: HorizontalAlignment;
};
```

### HStackValue

- `spacing` Default 0.
- `alignment` Vertical alignment for child views.

```ts
type HStackValue = {
  spacing?: number;
  alignment?: VerticalAlignment;
};
```

### ZStackValue

- `alignment` Horizontal and vertical alignment for child views.

```ts
type ZStackValue = {
  alignment?: Alignment;
};
```

### ButtonValue

- `intent` Intent returned by `Await.define(...)`, used to run a registered widget intent when the button is tapped.
- `fast` Only applies in the app; triggers the button as soon as the touch begins.
- `audio` Requests permission to play audio.
- `url` Opens a universal link directly, such as `https://github.com/await-widget/skills`.

```ts
type ButtonValue = {
  intent?: IntentInfo;
  fast?: boolean;
  audio?: boolean;
  url?: string;
};
```

### ShapeValue

- `fill` Default black on light theme, white on dark theme.
- `stroke` Only centered strokes are supported.

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

- `style` Default `continuous`.

```ts
type RoundedRectangleValue = {
  rectRadius?: Dimension;
  style?: CornerRadiusStyle;
};
```

### UnevenRoundedRectangleValue

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

### CapsuleValue

```ts
type CapsuleValue = {
  style?: CornerRadiusStyle;
};
```

### SectorValue

```ts
type SectorValue = {
  value: [start: number, end: number];
};
```

### PolygonValue

```ts
type PolygonValue = {
  value: Array<[x: number, y: number]>;
};
```

### LinkValue

```ts
type LinkValue = {
  url?: string;
};
```

### ColorValue

```ts
type ColorValue = {
  value?: Color;
};
```

### TextValue

- `value` Text or encodable value rendered by the component.

```ts
type TextValue = {
  value?: Encodable;
};
```

### ImageValue

- `url` Local or remote path such as `img.png` `path/img.png` `https://example.com/img.png`
- `resizable` The modes used to resize an image to fit within its containing view.
- `interpolation` The level of quality for rendering an image that requires interpolation, such as a scaled image.
- `style` A type that indicates how images are rendered

```ts
type ImageValue = {
  url?: string;
  resizable?: Resizable;
  interpolation?: Interpolation;
  style?: TemplateRenderingMode;
};
```

### IconValue

- `value` The name of the system symbol image. Use the SF Symbols app to look up the names of system symbol images.

```ts
type IconValue = {
  value?: string;
};
```

### TimeValue

- `style` Use `timer` to update once per second.

```ts
type TimeValue = {
  date?: Date;
  style?: TimeStyle;
};
```

### SvgValue

- `url` For example, `img.png`, `path/img.png`, or `https://example.com/img.png`.
- `value` For example, `<svg><path d="M0 0h10v10h-10z"/></svg>`.

```ts
type SvgValue = {
  url?: string;
  value?: string;
};
```

### SpacerValue

```ts
type SpacerValue = {
  minLength?: number;
};
```

### GifValue

```ts
type GifValue = {
  size: Size;
  duration: GifDuration;
};
```

### Mods

```ts
type Mods = {
  [K in keyof BaseMods]?: BaseMods[K];
} & {
  [K in keyof BaseMods as `${K & string}_${string}`]?: BaseMods[K];
};
```

### BaseMods

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
  blur?: Blur;
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
  fixedSize?: FixedSize;
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
  lineHeight?: LineHeight | "";
  lineLimit?: number | "";
  lineSpacing?: number;
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
  strikethrough?:
    | boolean
    | { isActive?: boolean; pattern?: Pattern; color?: Color };
  test?: unknown;
  textAlignment?: TextAlignment;
  tint?: ShapeStyle;
  tracking?: number;
  transform?: [number, number, number, number, number, number];
  transition?: Transition;
  truncationMode?: "head" | "middle" | "tail";
  typesettingLanguage?: string;
  underline?:
    | boolean
    | { isActive?: boolean; pattern?: Pattern; color?: Color };
  width?: number;
  zIndex?: number;
};
```
<!-- GENERATED:END -->
