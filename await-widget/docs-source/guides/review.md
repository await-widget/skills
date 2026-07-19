# Review

- [Purpose](#purpose)
- [Identify Candidate Stage](#identify-candidate-stage)
- [Prepare The Candidate](#prepare-the-candidate)
- [Compare Gestalt Signatures](#compare-gestalt-signatures)
- [Use Review Gates](#use-review-gates)
- [Check Design Conformance](#check-design-conformance)
- [Review Adversarially](#review-adversarially)
- [Iterate From Screenshots](#iterate-from-screenshots)
- [Review Report Template](#review-report-template)

## Purpose

Use this workflow after capturing a real widget preview. Identify whether it is an exploratory or acceptance candidate, compare it against the user requirements and translation brief produced by [Reference](reference.md), then choose the appropriate return path.

Do not use this review to discover what the reference means for the first time. If the reference map, composition anchor, carrier hypotheses, or target first impression are missing, stop and complete [Reference](reference.md) before reviewing the candidate.

Treat improvement and acceptance as different judgments. A candidate can be closer than the previous revision and still fail.

## Identify Candidate Stage

- **Exploration candidate:** the visual direction is not locked. Use the first four gates to test carrier-level relationships. When visual references are supplied, also run the reference-vocabulary gate before locking the direction. Then return to [Design](design.md#explore-before-committing). The subject, primitives, assets, copy, content, and agent-invented function may be replaced or removed.
- **Acceptance candidate:** the visual direction is locked. Run every gate and the design-conformance checks before accepting it.

If the stage is unclear, treat the candidate as exploratory. Acceptance requires a reference map, composition anchor, carrier hypotheses, target first impression, and an explicit visual-direction lock.

## Prepare The Candidate

A successful type check or build proves only that the widget is executable, not that it is visually complete. Treat visual acceptance as a separate step. An exploratory candidate may omit a final purpose; an acceptance candidate must have a clear user-facing purpose and a plausible way for its content or state to update unless it is intentionally static.

Capture the real widget preview at its actual family and display size. Apply the [pre-semantic pass](reference.md#run-a-pre-semantic-pass) and [reference signature](reference.md#record-a-reference-signature) to the candidate. For reference-led work, also crop each protected primitive using the same actual-size comparison established in the [visual-primitive inventory](reference.md#inventory-visual-primitives). Preserve the screenshot, derived views, and primitive crops as one checkpoint.

## Compare Gestalt Signatures

Record differences between the candidate signature and the composition anchor, named vocabulary donors, protected primitives, and target ranges in the reference brief. Apply the [carrier and content-group coordinate spaces](reference.md#translate-into-the-widget-carrier) consistently. Never rewrite fixed user requirements or reference evidence to make a candidate pass. During exploration, return to Design to revise carrier hypotheses or agent-invented semantics. During acceptance, do not move the locked targets.

## Use Review Gates

Review in this order. Exploration candidates run gates 1–4. Reference-led exploration candidates must also pass gate 5 before visual-direction lock. Acceptance candidates run all six:

1. **Carrier:** Does the composition use the widget boundary and safe area according to the user requirements and target product?
2. **Macro composition:** After normalizing content-group boxes, do the silhouette, first-impression group count, and visual centroid match the brief?
3. **Negative space:** Do the largest voids, corner anchors, and relative gaps support the same grouping?
4. **Contrast hierarchy:** Does attention encounter the intended number and order of dominant contrasts?
5. **Local rhythm and reference vocabulary:** Do typography, icons, symbols, alignment, and repeated spacing reinforce the whole? For every protected primitive, does an actual-size crop preserve the donor's topology, frequency, density, stroke rhythm, color placement, and focal structure without a lower-frequency substitute or invented focal mark?
6. **Semantics and utility:** Is the information meaningful, truthful, legible, and useful across populated and empty states?

Stop when a gate fails. Do not use good typography, accurate data, or matching colors to compensate for a failed macro composition. Do not combine the gates into one score that lets minor strengths offset a fatal mismatch.

When an agent-invented function or content model causes a visual gate to fail, return to design exploration and replace it. Do not preserve it by layering on more colors, symbols, copy, or local decoration.

## Check Design Conformance

After the acceptance gates pass, record each applicable outcome below as pass or fail. The linked sections in [Design](design.md) remain the source for how to achieve them.

- All informational text and graphics are fully visible without unintended clipping.
- Every visible element follows its assigned [element role](design.md#element-roles) and supports the same concept.
- Non-tappable decoration does not look like a tappable control.
- The [root view](design.md#fill-the-root-view) uses the widget area as intended.
- The composition fits the target [widget size](design.md#widget-size).
- Expressive or shareable widgets satisfy the [motif and visual-hook criteria](design.md#screenshot-appeal).
- Interactive widgets include the intended visible feedback.
- Primary copy passes the [meaning test](design.md#copy-and-meaning) without relying on atmospheric wording.
- [Repeated and conditional states](design.md#conditional-and-repeated-layout), including empty positions, render without unintended shapes, fills, or hit areas.
- Highlights, gradients, and shadows follow the chosen [material and lighting model](design.md#material-and-lighting-model).
- Skeuomorphic depth follows the defined [construction logic](design.md#structural-realism-before-surface-effects).
- A motif that depends on a material or image uses the required [asset](design.md#material-or-image-assets) rather than an approximation made from many basic shapes.

## Review Adversarially

List mismatches before matches. Ask:

- What is the strongest reason to reject this screenshot?
- Which single mismatch most changes the first impression?
- Does the image still split into unintended groups after blurring?
- Did the revision solve the target problem or only make it less obvious?
- Did the standard change because the implementation was difficult?
- Is an agent-invented function being protected even though it weakens the visual direction?
- Does an actual-size crop reveal a sparse approximation or invented feature that the carrier-level comparison hides?

Treat “closer than before” as evidence of progress, not a pass condition.

When practical, request a blind review from someone who did not make the revision. Provide only the reference brief, reference artifacts, candidate, carrier description, and review template. Do not reveal the intended fix or iteration history.

## Iterate From Screenshots

1. Before revising, save a baseline screenshot with its path and important implementation values.
2. Identify the highest failed gate.
3. Change one relationship at a time when diagnosing material, spacing, hierarchy, or lighting. Otherwise change the smallest set of relationships that can address the failed gate.
4. Capture the real preview again at its actual display size.
5. Restart review from the carrier gate instead of checking only the edited detail.
6. Keep the strongest checkpoint and restore it if the macro result becomes worse. Do not keep layering compensating effects onto a weak intermediate state.
7. If the failure comes from an agent-invented function, content model, or motif, return to design exploration instead of treating it as a local styling problem.
8. Inspect copy, data, permissions, long strings, and empty states only after the visual gates pass.

## Review Report Template

```text
Candidate screenshot:
Candidate stage: exploration / acceptance
Visual-direction lock: exploratory / locked
Reference brief:
Build and purpose check:
Mutable agent hypotheses:

Carrier gate:
Macro-composition gate:
Negative-space gate:
Contrast-hierarchy gate:
Local-rhythm/reference-vocabulary gate:
Semantic-utility gate:
Design conformance:
Strongest rejection reason:
Second rejection reason:
Highest failed gate:
Return stage: design exploration / review iteration / none
Decision: discard / continue exploring / reject / accept
```
