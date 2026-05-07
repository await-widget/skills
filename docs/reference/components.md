# Components

Import components only from `await`. The generated section below is sourced from `runtime/types/await.d.ts`.

## Usage

```tsx
import {Text, VStack} from 'await';
```

All components return `NativeView`. Container components accept `children`; leaf components usually declare `children?: never`.

## Groups

- Layout: `VStack`, `HStack`, `ZStack`, `Spacer`, `Group`, `Fragment`.
- Interaction: `Button`, `FullButton`, `Link`.
- Text and media: `Text`, `Time`, `Image`, `Icon`, `Svg`, `Gif`.
- Shapes: `Color`, `RoundedRectangle`, `UnevenRoundedRectangle`, `Rectangle`, `Sector`, `Ellipse`, `Circle`, `Polygon`, `Diamond`, `Capsule`.
- Utility: `Modifier`, `EmptyView`, `Stamp`.

Use component-specific value props plus shared modifiers from [Props And Modifiers](props-and-modifiers.md).

<!-- GENERATED:START -->
## Generated Component Signatures

### VStack

Source: `runtime/types/await.d.ts:11`

```ts
export function VStack(
    props: VStackValue &
      ID &
      Mods & {
        children?: NativeView;
      },
  ): NativeView;
```

### HStack

Source: `runtime/types/await.d.ts:18`

```ts
export function HStack(
    props: HStackValue &
      ID &
      Mods & {
        children?: NativeView;
      },
  ): NativeView;
```

### ZStack

Source: `runtime/types/await.d.ts:25`

```ts
export function ZStack(
    props: ZStackValue &
      ID &
      Mods & {
        children?: NativeView;
      },
  ): NativeView;
```

### Link

Source: `runtime/types/await.d.ts:32`

```ts
export function Link(
    props: LinkValue &
      ID &
      Mods & {
        children?: NativeView;
      },
  ): NativeView;
```

### Button

Source: `runtime/types/await.d.ts:39`

```ts
export function Button(
    props: ButtonValue &
      ID &
      Mods & {
        children?: NativeView;
      },
  ): NativeView;
```

### Color

Source: `runtime/types/await.d.ts:46`

```ts
export function Color(
    props: ColorValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Text

Source: `runtime/types/await.d.ts:53`

```ts
export function Text(
    props: TextValue &
      ID &
      Mods & {
        children?: NativeView;
      },
  ): NativeView;
```

### Time

Source: `runtime/types/await.d.ts:60`

```ts
export function Time(
    props: TimeValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Image

Source: `runtime/types/await.d.ts:67`

```ts
export function Image(
    props: ImageValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Icon

Source: `runtime/types/await.d.ts:74`

```ts
export function Icon(
    props: IconValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Svg

Source: `runtime/types/await.d.ts:81`

```ts
export function Svg(
    props: SvgValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### RoundedRectangle

Source: `runtime/types/await.d.ts:88`

```ts
export function RoundedRectangle(
    props: RoundedRectangleValue &
      ShapeValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### UnevenRoundedRectangle

Source: `runtime/types/await.d.ts:96`

```ts
export function UnevenRoundedRectangle(
    props: UnevenRoundedRectangleValue &
      ShapeValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Rectangle

Source: `runtime/types/await.d.ts:104`

```ts
export function Rectangle(
    props: ShapeValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Sector

Source: `runtime/types/await.d.ts:111`

```ts
export function Sector(
    props: SectorValue &
      ShapeValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Ellipse

Source: `runtime/types/await.d.ts:119`

```ts
export function Ellipse(
    props: ShapeValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Circle

Source: `runtime/types/await.d.ts:126`

```ts
export function Circle(
    props: ShapeValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Polygon

Source: `runtime/types/await.d.ts:133`

```ts
export function Polygon(
    props: PolygonValue &
      ShapeValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Diamond

Source: `runtime/types/await.d.ts:141`

```ts
export function Diamond(
    props: ShapeValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Capsule

Source: `runtime/types/await.d.ts:148`

```ts
export function Capsule(
    props: CapsuleValue &
      ShapeValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Spacer

Source: `runtime/types/await.d.ts:156`

```ts
export function Spacer(
    props: SpacerValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Group

Source: `runtime/types/await.d.ts:163`

```ts
export function Group(
    props: ID &
      Mods & {
        children?: NativeView;
      },
  ): NativeView;
```

### Modifier

Source: `runtime/types/await.d.ts:169`

```ts
export function Modifier(
    props: ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### EmptyView

Source: `runtime/types/await.d.ts:175`

```ts
export function EmptyView(
    props: ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### FullButton

Source: `runtime/types/await.d.ts:181`

```ts
export function FullButton(
    props: ButtonValue &
      ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Stamp

Source: `runtime/types/await.d.ts:188`

```ts
export function Stamp(
    props: ID &
      Mods & {
        children?: never;
      },
  ): NativeView;
```

### Gif

Source: `runtime/types/await.d.ts:194`

```ts
export function Gif(
    props: GifValue &
      ID &
      Mods & {
        children: NativeView[];
      },
  ): NativeView;
```
<!-- GENERATED:END -->
