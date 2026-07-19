# Design

- [Explore Before Committing](#explore-before-committing)
- [Visual Direction](#visual-direction)
- [Widget Layout](#widget-layout)
- [Layout Rules](#layout-rules)
- [Visual Design](#visual-design)
- [Implementation Notes](#implementation-notes)

## Explore Before Committing

Treat a function explicitly requested by the user as fixed. This fixes the required information and behavior, not an untested visual solution. When the user supplies a visual direction without a function, leave the function open and explore the visual composition first.

Use this constraint order:

1. explicit user requirements;
2. reference evidence and user-supplied style labels;
3. the target widget carrier;
4. agent-invented functions, content, copy, and motif names.

Do not name an invented product concept or commit to a production layout before the visual evidence has met the actual widget carrier. Describe any unvalidated route as an exploration hypothesis, not a named or locked direction. Build an exploratory candidate at the real widget family and display size around the subject, silhouette, scale, negative space, typography relationships, and visual centroid established in [Reference](reference.md). Keep distinct reference clusters as distinct hypotheses when necessary; do not predetermine a number of candidates or functional concepts.

Treat all agent-invented text, data, functions, and assets in an exploratory candidate as disposable. Their presence in TSX does not make them requirements. Implement only enough representative content and behavior to judge the visual relationships; defer production data wiring when it does not affect that judgment. Do not turn the exploratory implementation into a production brief or force the composition to explain a product concept the user never requested.

Lock the visual direction only after a real preview at the target family passes the applicable gates in [Review](review.md#use-review-gates). A reference-led direction must also pass the reference-vocabulary gate before locking; carrier-level similarity alone is insufficient. Before that lock, discard or replace a weak subject, composition, primitive, asset, or agent-invented semantic direction instead of polishing it.

After the visual direction is locked, choose a familiar purpose and content model that naturally reuses the established hierarchy. Before final acceptance, the widget needs a clear purpose and a plausible update path unless it is intentionally static. If an agent-invented function degrades the locked visual relationships, replace it or return to exploration. Never discard or weaken a function explicitly required by the user.

## Visual Direction

Once the purpose is fixed—by the user or after visual exploration—make it clear how users understand or use the widget. If the information hierarchy does not communicate that purpose, refine the concept before final acceptance. Every informational, interactive, and decorative element should support the same concept.

Before production implementation, commit to a specific visual direction with a strong vocabulary. Preserve the exact style or motif name supplied by the user and describe how the references express it instead of replacing it or combining it with the function into a new product name. An agent-invented name is only an exploration label until the direction is locked. A good direction can be recognized at a glance from only a few characteristic elements.

Every motif comes with its own visual vocabulary—a consistent set of shapes, colors, materials, textures, symbols, typography, composition, and level of detail. This vocabulary, rather than the motif's name itself, should guide every visual decision.

**How to find or invent a motif**

Use this process only when the user has not already supplied a named direction. When a name is supplied, investigate its reference-specific vocabulary first.

Don't default to picking from a list. Work through it instead:

1. Picture something concrete and specific — an object, a place, an era, a subculture. Not an abstract mood ("nostalgia") but something with actual physical form ("a 1970s diner menu").
2. Ask: if someone saw only 3–4 characteristic elements, stripped of everything else, would they recognize the intended visual world or reference?
3. Inventory its vocabulary explicitly — recurring shapes, materials/textures, color palette, typography or lettering, repeating symbols, and how dense or sparse the detail is.
4. If no existing category fits well, invent a narrow, specific motif rather than reaching for a generic label — "a 1990s VHS rental store" beats "retro."

The categories and examples below are calibration samples showing *where* motifs can come from — not a menu to select from. When a brief is specific enough (a brand, an era, a product, a mood), construct a motif that matches it precisely, even if it never appears below.

Motifs can come from:

- **Design Movements** — e.g. Synthwave (neon gradients, sunsets, grid floors, chrome lettering), Memphis (bold geometric shapes, squiggles, dots, vibrant colors), Bauhaus (primary colors, geometric forms, grid-based composition)
- **Object Families** — e.g. Vinyl Records (square covers, center labels, paper sleeves), CRT Televisions (scanlines, curved screens, static noise), Game Cartridges (plastic shells, cartridge labels, 8-bit aesthetics)
- **Product Contexts** — e.g. Arcade Cabinets (illuminated buttons, coin slots, glowing marquees), Vending Machines (product grids, transparent windows, button matrices), Gas Stations (tall roadside signs, circular logos, industrial graphics)
- **Cultural References** — e.g. Ukiyo-e (flat colors, expressive outlines, Hokusai-style waves), Soviet Constructivism (bold red, geometric layouts, propaganda typography), Tarot Cards (ornamental borders, symbolic illustrations, symmetrical layouts)

...and any other culturally recognizable theme with a distinctive visual language, including ones not listed here — prefer a motif built for the specific brief over a default pulled from this list.

**Name or preserve the motif explicitly**

State the motif and list the 3–5 characteristic visual elements you'll actually use (shapes, colors, materials, typography, symbols). If you can't name them concretely, the motif isn't specific enough yet — narrow it further.

Treat the motif as a design constraint, not decoration. Every visual decision should reinforce the same vocabulary. Avoid mixing unrelated visual languages, even if individual elements look appealing in isolation. A disciplined motif makes even a small widget feel coherent, recognizable, and memorable.

## Widget Layout

### Widget Size

Size is the first layout constraint. Widgets are much smaller than app screens, so the view must be designed for the widget's actual dimensions. Information can use smaller type than it would in an app, leaving more space for the primary content.

Widget views are responsive, but most widgets do not need to support every size variant. Use `widgetFamilies` in `Await.define` to declare the sizes the widget supports.

Widget size values use iOS logical points `pt`.

Use the runtime `size` parameter as the source of truth for layout. Both `widget()` and `widgetTimeline()` receive parameters that include the widget `size`.

Use the numbers below for design intuition, not as layout constants. Actual dimensions may vary by device, OS version, and preview context.

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

### Size Composition

The unit-and-spacing grid suggests natural relationships between widget sizes, but these relationships are design options, not rules. When two families share a dimension, one layout may extend or focus the other. Use this approach only when the content composes naturally; otherwise, design each size as a distinct view of the same subject.

- `small` and `medium` share height. `medium` is roughly `small` plus one extra width unit — when the content composes well, `small` can read as the focused portion of `medium`.
- `medium` and `large` share width. `large` is roughly `medium` plus one extra height unit — when the content composes well, `large` can extend `medium` downward with secondary content.
- `small` and `large` are more loosely related. Prefer shared components, content vocabulary, and visual identity over literal layout reuse.
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

### Account for Every Inset

Every inset should be added deliberately and serve a clear design purpose. Treat any remaining space or gap without a clear role as a layout error, not intentional whitespace.

Stacks center undersized content by default, so unallocated space can quietly turn into gaps around the content.

When content extends to the widget edge and clipping it to the widget boundary and corners does not compromise information, interaction areas, or the recognizability of the subject, let the outer widget perform the clipping. Do not unconsciously add another layer of inset or corner radius.

### Widget Corners

Widgets are rounded rectangles. The exact corner radius can vary by system version and device. As a reference, widget corner radius on iOS 26/27 is `86 / 3` pt.

Interior views near the widget edge usually look more natural when their corners are concentric with the outer widget corner:

```tsx
const cornerRadius = 86 / 3 - padding;
```

### Stack Views

`VStack`, `HStack`, and `ZStack` center their children as a group by default.

Use the `alignment` prop to control alignment between children. Use the `alignment` value in the `frame` modifier to position the whole child group inside its container:

```tsx
frame={{width: ..., height: ..., alignment: ...}}
```

Use `offset` for visual displacement, not for layout alignment.

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

## Visual Design

### Layering And Contrast

A visual-first widget often benefits from three conceptual layers: a base layer, a subject layer, and a decorative or framing layer. Richer designs can add glow, shadow, foreground framing, texture, or small surface details.

Layering only works when the important content separates clearly from the background. Keep enough value contrast between foreground and background, especially for text. Do not place same-family text over a same-family background with similar brightness.

Decorative elements should guide the eye. Distribute them with rhythm and direction instead of scattering them evenly across the whole widget.

### Element Roles

Assign every visible element a clear role: primary content, action, layout structure, material or lighting expression, or motif-specific decoration. An element may serve more than one role.

Remove an element when its role cannot be named or when it exists only to occupy empty space. Do not preserve a visually heavy decoration merely because the composition feels sparse. Prefer meaningful content, stronger alignment, or intentional negative space.

Check decorative elements independently from the full composition. Ask whether each one reinforces the motif, guides attention, expresses construction or lighting, or communicates something useful. If it does none of these, remove it.

### Typography

Use text roles instead of one undifferentiated text treatment. When the widget benefits from contrast, pair an expressive role for mood or identity with a data-like role for values, labels, or technical details.

When the content benefits from hierarchy, consider using three text scales: primary, secondary, and micro text. Adjust fontWeight when it helps reinforce the hierarchy.

Since widgets have limited space and text is often constrained by the layout, prefer `minimumScaleFactor={0.1}` or `minimumScaleFactor={1 / fontSize}` for informational text that must remain visible. This makes it practical to start with a larger font size and let the system shrink it only when space becomes tight.

The `fontDesign` modifier supports `default`, `rounded`, `serif`, and `monospaced`. Custom fonts are not supported directly, but text can be converted into image or SVG assets instead.

### Copy And Meaning

Use primary copy to explain what the widget shows, what state it is in, or what the user can do. Keep atmospheric, branded, or motif-driven wording secondary unless the primary meaning is already obvious from the content itself.

Use this hierarchy when both clarity and personality are needed:

1. Primary copy states the function, subject, or current value.
2. Secondary copy supplies context, mood, category, or provenance.
3. Microcopy supplies compact technical details, ranges, or labels.

Do not let evocative wording replace basic meaning. Read the copy without the artwork; if its purpose becomes unclear, revise the hierarchy.

Users usually know which widget they added, so a title is usually unnecessary. Add one only when it clarifies content the user must see or when it functions as part of a skeuomorphic decoration.

#### Emoji As Content

Emoji are one way to introduce meaning or reinforce a chosen motif. Use them only when they naturally fit the content or the widget's visual language.

When emoji represent or reinforce a specific piece of primary or secondary copy—a state, category, or value the user needs to read—they become part of the content (☀️ next to a temperature, 🔥 next to a streak count, 🎧 labeling a music widget).

Apply the same test as Element Roles. If removing an emoji would not change what the user understands, treat it as decoration and ask whether it still reinforces the motif or composition. If it does neither, remove it.

Because emoji render as fixed, full-color glyphs and cannot be tinted to match the widget's palette (see Material And Lighting Model), decoration should not depend on them. Avoid scattering or repeating emoji as generic visual accents. Use them deliberately, either as meaningful content or as decoration that genuinely belongs to the chosen motif.

### Decoration Rhythm

Repeated symbols are one way to introduce rhythm and subtle visual texture to a layout.

The examples below show different visual languages, not a fixed set of marks. Without visual references, borrow or invent whatever best fits the motif's visual vocabulary. With visual references, select marks through the [visual-primitive inventory](reference.md#inventory-visual-primitives) and preserve its protected properties.

- **Text Symbols**
  - **Minimal** — subtle, quiet: `·` `•` `∙` `◦`
  - **Technical / Data** — structured, grid-like: `///` `---` `___` `_` `|` `|||`
  - **Editorial / Print** — typographic, publication-like: `•` `—` `※` `§`
  - **Geometric / Modern** — bold, shape-driven: `○` `●` `◎` `□` `■` `△` `▲` `▽` `▼` `◇` `◆`
  - **Elegant / Ornamental** — refined, decorative: `◆` `✦` `✧` `✶` `✳` `❈`
  - **Playful / Expressive** — casual, lively: `♡` `♪` `~` `～` `〰`
- **SF Symbols** — system-native, interface-like: `<Icon value='sfsymbol.name' />`

Prefer two techniques:

- **Repeat** the same mark 3–5 times to establish rhythm.
- **Echo** a mark already used elsewhere in the layout.

Keep decoration secondary to the primary content. Stay within a single visual language, and keep spacing consistent.

### Screenshot Appeal

Before coding, ask whether the widget would feel worth screenshotting and sharing. This is not a requirement for every utility widget, but it is a useful design heuristic for visual-first widgets.

Shareable widgets usually have three traits:

- A clear motif that can be recognized at a glance.
- One memorable visual hook, such as a sunset, repeated symbol, paper tear, large number, or distinctive material detail.
- When the widget is interactive, one satisfying feedback moment, such as a press state that feels responsive and intentional.

### Reference Strategy

Small physical objects are useful references because they already solve compact information design. Examples include stamps, fridge magnets, badges, pins, illustrated bandages, stickers, ticket stubs, bank cards, admission tickets, labels, washi tape, letterpress cards, mini calendars, postcards, paper packaging, zines, small package labels, and paper goods fairs such as Japan's Kami-haku.

Large physical objects can also work as references when they function as signs viewed from a distance, such as storefront signs, plaques, illuminated signs, and light boxes.

Use implementation examples to learn API usage, interaction behavior, data mapping, and layout relationships. Do not inherit their visual style unless it matches the chosen motif.

Use photographs or physical references to study construction, proportions, materials, highlights, shadows, and edge behavior. Compare multiple references when lighting or perspective may distort the result.

Use [Reference](reference.md) before implementing from visual references and [Review](review.md) after capturing the real widget preview.

Separate these questions before implementing:

- **How is it built?** Answer with runtime declarations and implementation examples.
- **How should it look?** Answer with the chosen motif and visual references.

### Structural Realism Before Surface Effects

Build physical or material metaphors from their construction logic first. Establish thickness, overlap, insets, edge exposure, concentric radii, and contact with neighboring surfaces before adding gradients, highlights, or shadows.

Use each nested layer to represent a distinct surface or structural transition. Keep the number of layers minimal, but do not ask one flat surface effect to imply missing geometry.

Treat gradients and shadows as consequences of the structure. Do not use a bright strip, a strong gradient reversal, or a large shadow to compensate for absent thickness or unclear layering.

### Material And Lighting Model

Choose an implied light direction, softness, and environmental hue. Apply that model consistently across surfaces.

- Place highlights on surfaces and edges that plausibly face the light.
- Place the brightest and darkest gradient stops where the material would actually receive or lose light.
- Keep a single material within a coherent hue family unless a reflected color has a physical source.
- Tint shadows with the environment when pure black would disconnect them from the palette.
- Make cast shadows describe separation and contact; make surface gradients describe material and orientation.

Avoid isolated highlight lines that do not follow an edge, bevel, or curvature. Prefer integrating a highlight into the surface gradient when the reflection is broad, and use a separate highlight view only when the material produces a genuinely sharp reflection.

### Building Visual Metaphors

#### Material Or Image Assets

For skeuomorphic or metaphor-driven UI, prefer using real material textures or image assets. They usually produce more convincing results with less complexity than constructing the same effect from basic shapes. See [Resources](resources.md) for sourcing, licensing, and project storage.

A texture can be used as an image layer with a mask, so the material appears only inside the masked shape. It can also be overlaid above the main view with a source-atop style blend mode, so the texture is applied only over the visible content below it.

When the asset is a photo or illustration, it can be loaded directly into the view tree as a background or content layer.

#### Basic Shapes

Use basic shapes only when the metaphor should feel more like flat graphic design. For example, a stamp can be represented by a simple shape with text on top.

When using basic shapes to express a physical metaphor, keep the design simple. Avoid building rich material effects from many basic shapes, as the result usually becomes both more complicated and less convincing.

For a protected reference primitive, follow the substitution decision in the [visual-primitive inventory](reference.md#inventory-visual-primitives) before choosing basic shapes.

## Implementation Notes

### Animation Stability

Widget views render from entry content. iOS WidgetKit automatically computes the view tree diff between two rendered entries. Property interpolation works only when the target view stays at the same position in the view tree and keeps the same `id` value, or when both old and new `id` values are empty. Otherwise, WidgetKit treats the old and new views as unrelated.

### Buttons

Use `FullButton` to quickly create a transparent tappable area that fills the available space.

Use `Button` when it has a child view to display. Use a custom `buttonStyle` to define its `normal` and `press` states. See the [Widget Button](widget-button.md) guide for setup and platform constraints.

### Conditional And Repeated Layout

Use transparent or layout-neutral views for positions that should occupy space without drawing content. Do not use a visible shape as a spacer or placeholder.

Inspect both populated and empty branches in repeated layouts. A mapping can be mathematically correct while an empty branch still renders an unintended fill, hit area, or alignment artifact.
