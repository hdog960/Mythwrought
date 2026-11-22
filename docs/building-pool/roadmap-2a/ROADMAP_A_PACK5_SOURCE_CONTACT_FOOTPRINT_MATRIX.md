# Roadmap A — Pack5 authentic source contact-footprint matrix (source-only)

## Why this work exists

The earlier original Pack5 full-backing-collider witness and dependent-to-backing minimum AABB face gap are necessary but not sufficient: the **nearest** original source box pair might be only a small decorative island while the rest of a 1-block face lies farther away. A report of one near/touching pair must never imply entire-face material contact, full collision support, or physical load bearing.

This isolated Roadmap A producer research adds the **exact projected union** (no double counting, no rasterized/sampled shortcuts) of all original source-collider and authored mesh-box overlap rectangles that share the minimum face gap. It separately reports the greater theoretical projected overlap area across *all* box pairs. A close thin decorative region will therefore remain a **partial footprint hold**, even if the wider material projects over the same face. Comparing exact Float32 source-mesh coordinates does not promote near-coincident geometry into exact contact.

The original producer is never modified. Source-only explicit test fixtures use original `pack5:079` plaster, `pack5:080` fired-brick, and `pack5:081` ceramic tile as alternatives, with **explicit caller-provided** variants and yaws. The producer additionally checks that the unchanged original Manual Five Pack selection boxes equal original visible boxes and that original collider/support boxes agree with the previous independent source preview. This is not running the live player's selection raycast.

## New isolated files

- `src/building-pool/roadmap-2a/roadmap-a-pack5-footprint-core.mjs`: bounded exact union of projected in-cell face rectangles, actual closest-gap footprint, previous-contact/dependency cross-check, conservative non-approval result
- `src/building-pool/roadmap-2a/roadmap-a-pack5-footprint-producer.mjs`: original unaltered Manual Five Pack, original Pack5 mesh, support and selection geometry crosswalk, no source A5 choices
- `tests/building-pool/roadmap-2a/roadmap-a-pack5-footprint-core.test.mjs`: nine focused pure-core geometry/guard tests
- `tests/building-pool/roadmap-2a/roadmap-a-pack5-footprint-producer.test.mjs`: five original-repository native tests, including a 16-case original plaster x yaw x brick alternative matrix and a 16-case ceramic x yaw x brick matrix
- This checkpoint

## Expected original physical geometry constraints

The original authored plaster collision is a thin surface inset **0.025 block units** at its mount face, spanning approximately `0.95 x 0.95 = 0.9025` of a single source face tangentially. The original ceramic collider is inset **0.015 block units** above the physical support cell and spans a projected full source face. Even if the original supporting fired-brick collider is a full cube, there is a nonzero gap to these dependent finish objects. That is an **authored clearance observation**, not demonstrated broken real-world physics, gameplay failure, or required original Pack5 design change.

No arbitrary variant or yaw is assigned to any actual original 79 source buildings, no real settlement or world is constructed, and no color/material choice or authored producer geometry is altered. A full projected footprint has no implied bearing capacity; projected mesh overlap is not proof of pixel visibility, connected opaque shell, correct long-span support, actual world collision, or frame time.

## Validation/CI policy

Reuse authenticated original source evidence: 40/40 exact-original-native Node 22.16.0 Actions success #45044721507 at CI-only child `44bbd97814d397646ab63566da007cd5f35c1003` (previous source code `e5fcb952cf90d589a6d0b608ec734e9db2568e39` unchanged), earlier 24/24 original Pack5 rotated cases and 58/58 original Pack5 controlled V8 source cases. Execute **only newly authored focused 9 core + 5 producer tests** once in an isolated exact-source Node checkout; never duplicate prior 40 tests or run expensive browser/full-suite jobs for this source-only witness.

Roadmap A source records remain 207/420 with 213 unwritten, historical 128 commerce, 345 industry, 315 government preserved. Protected production main `7016e14cd6289f45eaf7fc6a79a362b47996df65` and OPEN DRAFT PR406 `1d71f5e37891280a21c777e5189f0762014ed8a9` must remain unchanged. No five automations, other builder lanes, legacy A5 source modules, original game renderer, schema1 saves, installed PWA, locked v0.11, shared CI, merges, deployments, or workflow cancellations.

Remaining real release gates: authoritative source building physical variant/yaw authorship; structural wall/floor/roof and neighboring-pack support; actual renderer collision/selection and WebGL2/iPhone landscape performance; explicit creator physical/art approval.

## Confirmed original-repository native verification (2026-11-22)

Two **narrow, source-only, single-pass** GitHub Actions jobs tested the identical original Pack5 producer module and exact new footprint core blob (`8aa81bb654d8498aaf834b72ae2fd51413412cd1`), avoiding the previously green 40-test regression suite.

1. CI-only child commit `a431cf6818c52711f3ecc08ce326b0eae5b9d521`, Actions [#45046409454](https://github.com/hdog960/Mythwrought/actions/runs/45046409454): **9/9 pure-core tests passed** and **4/5 original-producer tests passed**. The one failure was only an authored test expecting `undefined` for an existing intentionally false safety field `originalGameWebGL2OrIPhoneMeasured`; GitHub's genuine original result correctly returned `false`. No underlying source-producer code failed.
2. Corrected **only that one test assertion** (producer test blob `11477e4ade50cc407036514d9aaa896d42ef8026` to `2b5557e2750e526f1edb797f12fdc392ca3f1d89`). Source-only repaired head `b727eae2ff1ea4318a651815761144b9593a44aa`. GitHub source/core blobs are unchanged.
3. CI-only child `b7bfbab987f1cedaa113b22eeae2012b3735cb04`, native Node 22.16.0 Actions [#45046517491](https://github.com/hdog960/Mythwrought/actions/runs/45046517491): corrected authentic original-producer tests **5/5 passed**, including all 16 plaster and all 16 ceramic source-authored explicit variant/yaw/backing-alternative fixture cases. Previously passed 9/9 pure-core native evidence is reused on exact unchanged blob, not rerun.

Original physical-collider projected dependent attachment areas verified: plaster `0.9025` block faces (90.25%), with `0.025` block-unit mounting clearance, and ceramic `1.0` (100%), with `0.015` block-unit clearance, with full-cube fired brick backing. This demonstrates the *projection-versus-gap* contrast; neither geometry ratio nor a backing source collider is actual structural bearing or live rendering proof. Original game collision/selection, mixed Pack1–5 structural support, WebGL2/iPhone GPU/visual review, creator acceptance, and explicit source selection remain open.

The two narrow one-time workflows live only on separate CI-only child branches and did not alter any pre-existing shared CI workflow. No other suites, workflows, merges, cancellations, deployments, gameplay source variants, original A5 geometry or PWA were changed.
