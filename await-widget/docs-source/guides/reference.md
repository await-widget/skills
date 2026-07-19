# Reference

- [Purpose](#purpose)
- [Separate Evidence From Decisions](#separate-evidence-from-decisions)
- [Classify Reference Inputs](#classify-reference-inputs)
- [Segment Reference Collections](#segment-reference-collections)
- [Run A Pre-Semantic Pass](#run-a-pre-semantic-pass)
- [Record A Reference Signature](#record-a-reference-signature)
- [Inventory Visual Primitives](#inventory-visual-primitives)
- [Translate Into The Widget Carrier](#translate-into-the-widget-carrier)
- [Reference Brief Template](#reference-brief-template)

## Purpose

Use this workflow before designing or implementing a widget from visual references. Produce a reference map, per-example gestalt signatures, and a carrier-translation brief for exploration in [Design](design.md) and later acceptance in [Review](review.md).

Do not begin by inventing labels such as “weather,” “calendar,” “industrial,” or “retro.” Those labels describe content or style vocabulary and can hide differences in composition.

Treat this analysis as an evidence chain, not as a claim of human-equivalent perception. Reduce semantic influence with fixed image transforms, record global relationships explicitly, and preserve distinct examples instead of averaging them.

## Separate Evidence From Decisions

Preserve style names and other explicit labels supplied by the user, including terms in the prompt, URL query, page title, and filename. Treat those labels as evidence to investigate in the references, not as names to silently replace with an invented motif.

Separate the brief into four kinds of information:

- **Fixed requirements:** choices the user made, such as function, family, content, interaction, or named visual direction.
- **Open decisions:** choices the user left unspecified. Keep them open during reference analysis.
- **Reference evidence:** visible relationships supported by specific examples or clusters.
- **Agent hypotheses:** proposed carrier translations, content, functions, or motif names that remain disposable until visual exploration validates them.

Do not convert an open decision into a requirement merely to make the brief feel complete. When the user supplies a visual direction but no widget function, leave the function open. The reference brief should describe visual evidence and carrier hypotheses, not an untested product concept.

## Classify Reference Inputs

Do not equate an image-file boundary with an artwork boundary. Classify every supplied image first:

- **Single composition:** one work whose elements form one intentional whole.
- **Reference collection:** several independent examples arranged in one file for convenient delivery.
- **Sheet-level reference:** a moodboard, contact sheet, or collage whose overall arrangement is explicitly part of the requested direction.

Treat the image as a likely collection when it contains repeated frames, regular gutters, multiple unrelated backgrounds, equal-sized tiles, separate captions, abrupt style changes, or several self-contained focal hierarchies. When the user says that one file contains multiple examples, treat it as a collection unless they explicitly ask to reproduce the sheet layout.

## Segment Reference Collections

For a reference collection:

1. Identify the example boundaries before analyzing style.
2. Crop or enlarge each example so small tiles can be inspected independently.
3. Assign stable labels such as `A`, `B`, `C`, and record their bounds.
4. Exclude the sheet grid, gutters, captions, and outer canvas from each example.
5. Run the pre-semantic and gestalt passes on each example separately.
6. Preserve the per-example reports before synthesizing across the set.

Synthesize without averaging:

- record shared invariants that genuinely recur;
- record variation axes such as dense/sparse, centered/edge-aligned, or photographic/geometric;
- cluster examples that form distinct visual families;
- preserve each example's unique visual hook;
- report contradictions instead of weakening them into a generic midpoint.

Do not average palettes, silhouettes, layouts, contrast hierarchies, or negative-space structures into one neutral result. If ten vivid examples differ, their arithmetic or verbal average is not an eleventh style.

## Run A Pre-Semantic Pass

Create the same derived views for each independent reference:

1. Show it at the target widget's actual display size.
2. Reduce its long edge to about 64 pixels.
3. Convert it to grayscale.
4. Create blurred versions using radii near 1%, 3%, and 6% of the short edge.
5. Create a foreground-occupancy or edge-density view when foreground extraction is reliable.

Use available image tooling rather than reproducing these transforms with widget code. Preserve the derived images with the reference brief.

Describe each transformed image using geometry only. Name shapes, directions, quantities, density, gaps, and visual weight. Do not transcribe text or identify depicted objects.

Good:

> One horizontal block, three internal groups, a heavy left anchor, and one large void near the lower right.

Bad:

> A weather badge sits next to temperature and calendar information.

If the description uses semantic nouns, repeat the pass before continuing.

## Record A Reference Signature

Record these properties for each example:

- one-sentence geometric first impression;
- dominant outer silhouette;
- content bounding-box width and height relative to its carrier;
- top, right, bottom, and left margins;
- perceptual macro-group count at each blur scale, ignoring individual letters and small glyph fragments;
- occupied and empty carrier corners;
- anchors at the four corners of the normalized content-group box;
- visual centroid and its offset from the carrier center;
- largest internal empty region and its location;
- horizontal and vertical density projections;
- adjacent gap sizes and the ratio of the largest gap to the median gap;
- number and relative strength of dominant attention peaks;
- coarse density distribution, such as an `8 × 4` occupancy grid.

Do not optimize every value toward uniformity. Record structure and relative rhythm. Treat masks, thresholds, saliency estimates, and numeric ratios as supporting evidence rather than replacements for judgment.

## Inventory Visual Primitives

Crop and label every local primitive that materially contributes to the reference vocabulary, such as barcodes, dense code-like textures, ruled frames, line clusters, stamps, arrows, repeated glyphs, or distinctive typographic fragments. Assign each primitive to a specific vocabulary donor instead of deriving it from the collection average.

For each primitive, record:

- its compositional role and actual-size crop;
- outer silhouette and aspect ratio;
- internal topology, including intersections, enclosures, and focal marks;
- stroke or cell count range, thickness, spacing, frequency, and fill ratio;
- color placement and contrast;
- properties that must remain protected and properties that may adapt to widget content.

Compare any proposed substitute beside the donor crop at the actual output size. Treat a high-frequency texture as a visual shape, not merely as a semantic category. Do not replace a dense barcode, code field, or repeated-line texture with a few thick bars or sparse text glyphs because both representations have the same name. Do not add a new focal mark inside a protected primitive, such as a center target inside a plain crossed frame.

When faithful construction would require many widget nodes, prefer an SVG or image asset allowed by the runtime instead of lowering the primitive's frequency, topology, or density. The minimal-view-tree rule does not authorize vocabulary loss.

## Translate Into The Widget Carrier

Record fixed requirements and open decisions before deriving targets from the reference.

Use two coordinate spaces:

- **Carrier space:** the full poster, screenshot, or widget boundary. Use it to judge content scale, safe insets, and placement in the target product.
- **Content-group space:** the inferred bounding box of the visual composition. Normalize it before comparing internal grouping, corner anchors, gaps, and negative-space topology.

Usually preserve dominant silhouette, grouping, closure, visual-weight distribution, negative-space topology, relative rhythm, and contrast economy.

Usually adapt content-area scale, outer margins, safe insets, aspect ratio, typography size, and information density. Treat explicit target-carrier requirements as authoritative. Do not copy a poster's surrounding canvas into a widget without a carrier-specific reason.

For a reference collection, assign roles explicitly:

- **Composition anchor:** the example that controls carrier use, silhouette, grouping, and negative space.
- **Vocabulary donors:** a small number of examples that contribute named properties such as typography, symbols, material, or color.
- **Excluded traits:** attractive but incompatible properties that should not enter the result.

If no composition anchor is clear, keep the clusters as separate design directions or ask the user to select one when the choice would materially change the result. Do not silently blend all examples.

Set evidence-based visual target ranges before exploration. Treat carrier hypotheses and agent-invented semantics as provisional until the actual-size exploration in [Design](design.md#explore-before-committing). Revise them only when the carrier reveals new evidence, not to excuse a weak candidate. Once the visual direction is locked, freeze the targets for [Review](review.md).

## Reference Brief Template

```text
User-supplied style labels:
Fixed requirements:
Open decisions:
Agent hypotheses:
Reference type: single composition / collection / sheet-level reference
Example map or bounds:
Reference clusters:
Composition anchor:
Vocabulary donors:
Excluded traits:
Visual-primitive inventory:
Protected primitive properties:

Reference invariants:
Carrier hypotheses:
Do not copy:
Target geometric first impression:
Target ranges:
Lock status: exploratory

Per-example gestalt signatures:
```
