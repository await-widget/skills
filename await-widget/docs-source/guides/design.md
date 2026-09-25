# Design

- [Widget Layout](#widget-layout)
- [Layout Rules](#layout-rules)
- [Legibility And Content](#legibility-and-content)
- [Usability Review](#usability-review)
- [Implementation Notes](#implementation-notes)

## Widget Layout

### Widget Size

Size is the first layout constraint. Widgets are much smaller than app screens, so the view must be designed for the widget's actual dimensions. Choose text sizes against the actual widget dimensions and verify that required information remains legible.

Widget views are responsive, but most widgets do not need to support every size variant. Use `widgetFamilies` in `Await.define` to declare the sizes the widget supports.

Widget size values use iOS logical points `pt`.

Use the runtime `size` parameter as the source of truth for layout. Both `widget()` and `widgetTimeline()` receive parameters that include the widget `size`.

Use the numbers below for rough planning, not as layout constants. Actual dimensions may vary by device, OS version, and preview context.

### Common Layouts

Common widget families follow a unit-and-spacing grid. As a rough reference, `unit` is about **170 pt** and `spacing` is about **20 pt**.

| Size | Grid | Approx. dimensions | Notes |
|------|------|--------------------|-------|
| `small` | 1 x 1 | 170 x 170 pt | - |
| `medium` | 2 x 1 | 360 x 170 pt | - |
| `large` | 2 x 2 | 360 x 360 pt | - |
| `extraLargePortrait` | 2 x 3 | 360 x 550 pt | Requires iOS 27 or later |
| `extraLarge` | 4 x 2 | 740 x 360 pt | iPad and Mac only |

The rough dimensions come from this grid formula:

```text
width  = columns x unit + (columns - 1) x spacing
height = rows    x unit + (rows    - 1) x spacing
```

Each additional row or column adds one unit and one spacing, except for the first unit.

### Layout Across Families

The unit-and-spacing grid suggests possible relationships between widget sizes, but these relationships are options, not rules. When two families share a dimension, one layout may extend or focus the other. Use this approach only when the content fits; otherwise, give each size its own layout.

- `small` and `medium` share height. `medium` is roughly `small` plus one extra width unit — when the content composes well, `small` can contain the primary subset of `medium`.
- `medium` and `large` share width. `large` is roughly `medium` plus one extra height unit — when the content composes well, `large` can extend `medium` downward with secondary content.
- `small` and `large` are more loosely related. Prefer shared components and a consistent content model over literal layout reuse.
- `extraLargePortrait` and `extraLarge` continue the same idea with even less obligation to mirror smaller layouts.

### Special Layouts

These layouts do not follow the unit-and-spacing grid.

| Size | Description | Approx. dimensions |
|------|-------------|----------------------|
| `accessoryInline` | Lock Screen inline text | 342 x 36 pt |
| `accessoryCircular` | Lock Screen circular widget | 58 x 58 pt |
| `accessoryRectangular` | Lock Screen rectangular widget | 148 x 58 pt |
| `fullscreen` | Full-screen preview inside the Await app | - |

For `accessoryInline`, only the first `Text` is rendered.

## Layout Rules

### Fill the Root View

The widget size represents the available layout space for the widget itself.

Unless you intentionally want transparent margins around the widget, the root view returned by `widget()` should fill the entire widget area.

For example:

```tsx
<ZStack maxSides background={color} />
```

or

```tsx
<ZStack>
  <Color value={color} />
</ZStack>
```

or

```tsx
<ZStack>
  <Image url={image} resizable aspectRatio='fill' />
</ZStack>
```

Since the widget size is available as the `size` parameter, you can also write:

```tsx
<ZStack frame={size} background={color} />
```

This also fills the entire widget layout.

### Widget Corners

Widgets are rounded rectangles. The exact corner radius can vary by system version and device. As a reference, widget corner radius on iOS 26/27 is `86 / 3` pt.

For an interior rounded view inset by `padding`, a concentric corner radius is:

```tsx
const cornerRadius = 86 / 3 - padding;
```

### Stack Views

`VStack`, `HStack`, and `ZStack` center their children as a group by default.

Use the `alignment` prop to control alignment between children. Use the `alignment` value in the `frame` modifier to position the whole child group inside its container:

```tsx
frame={{width: ..., height: ..., alignment: ...}}
```

Use `offset` for displacement, not for layout alignment.

Avoid placing `offset` and `scaleEffect` on the same view layer, because that makes layout mistakes more likely.

### Aspect Ratio

`aspectRatio` sizes the view content before the modifier into the view container after the modifier. Modifier order therefore matters.

When an image should fit or fill a specific frame, put `aspectRatio` before `frame`, and append a `clipped` modifier to avoid image overflow:

```tsx
<Image url={image} resizable aspectRatio='fill' frame={{width: 120, height: 80}} clipped />
```

Do not put the target frame before `aspectRatio`:

```tsx
<Image url={image} resizable frame={{width: 120, height: 80}} aspectRatio='fill' clipped />
```

When an image view is set to `resizable`, it automatically fills all available space. For setting a background image, use the following syntax:

```tsx
<Image url={image} resizable aspectRatio='fill' />
```

## Legibility And Content

Keep enough contrast between informational text or graphics and their background for users to read them at the actual widget size. Check text and controls in the captured preview, not only in source code.

When content benefits from hierarchy, use distinct text sizes and weights for primary and secondary information. Do not use `fontWidth` as a substitute for measuring or fitting text. For constrained informational text that must remain visible, `minimumScaleFactor={0.1}` or `minimumScaleFactor={1 / fontSize}` lets the system shrink it when space is tight; inspect the resulting size for legibility.

Use primary copy to explain what the widget shows, what state it is in, or what the user can do. Secondary copy can add context; microcopy can carry compact ranges or labels. Users usually know which widget they added, so add a title only when it clarifies required content.

If an emoji conveys a state, category, or value, treat it as content and check that its meaning remains clear at the rendered size.

## Implementation Notes

### Animation Stability

Widget views render from entry content. iOS WidgetKit automatically computes the view tree diff between two rendered entries. Property interpolation works only when the target view stays at the same position in the view tree and keeps the same `id` value, or when both old and new `id` values are empty. Otherwise, WidgetKit treats the old and new views as unrelated.

### Buttons

Use `FullButton` to quickly create a transparent tappable area that fills the available space.

Use `Button` when it has a child view to display. Use a custom `buttonStyle` to define its `normal` and `press` states. See the [Widget Button](widget-button.md) guide for setup and platform constraints.