# Roadmap A — original Pack5 collider vs authored mesh-boundary witness

## Source-only engineering boundary

This is **not** a design assignment to any of the 79 original source-only Roadmap A structures. It does not select any Pack5 material variant/yaw, place terrain, create actual 4,096-instance batches, register blocks, write saves, modify the live renderer, touch automations, or approve structural bearing. All fixtures require explicit test-only caller choices.

## Issue isolated

A source-authored Pack5 fired-brick cell (`pack5:080`) has an honest, *full-cube collision box*, while the decorative source-authored physical mesh can be inset or contain gaps at the **outside cell contact plane**. The existing authentic support preflight intentionally classifies a full collision face as a **candidate**, not proof of visual or structural backing. The new witness makes that distinction measurable, using the actual producer's rotated Float32 mesh box bounds (already validated against original builder visible boxes) and the independent original producer's collider/support offsets.

For each explicit original Pack5 preview collider candidate, the new pure evaluator:

1. Cross-checks original preview fixture identity, exact selected preview variant and yaw, world integer anchor, candidate neighbor, support target and dependency edge. On disagreement, **throws** rather than providing a false visual or support classification.
2. Finds the actual supporting cell face on X/Y/Z in either direction using the one-cell original support offset, not a default facing direction.
3. Computes the exact projected *union area* of source-authored physical box faces touching the exterior plane. Zero/partial/full authored-boundary coverage is reported distinctly. This is a bounding-box witness, **not an occlusion test or rendered pixel claim**.
4. Preserves the original physical-collider candidate but flags any inset/gapped visual boundary; even full authored face area never certifies real support or renderer occlusion.
5. Returns only a source-only diagnostic with explicit false approvals for structural loading, world placement, renderer, original Roadmap A source assignments, iPhone/GPU performance, saves and creator acceptance.

### New files

- `src/building-pool/roadmap-2a/roadmap-a-pack5-mesh-backing-core.mjs`
- `src/building-pool/roadmap-2a/roadmap-a-pack5-mesh-backing-producer.mjs`
- `tests/building-pool/roadmap-2a/roadmap-a-pack5-mesh-backing-core.test.mjs`
- `tests/building-pool/roadmap-2a/roadmap-a-pack5-mesh-backing-producer.test.mjs`

## Focused evidence and remaining gates

**9/9 new pure-core native Node tests PASS locally**, using the exact new pure-core file: both opposite face directions across three axes, split/full boundary unions, inset gaps, near-coincident planes (cannot falsely round up), explicit original preview source identity, bad source dependency edges, contradictory approval flags and world-geometry guardrails. Initially one new test had an incomplete five-number synthetic box; that test fixture was corrected and the full 9/9 then passed.

**Four new source-authentic original-producer Node tests authored, NOT executed** against the complete repository. A local complete GitHub checkout was unavailable; network DNS blocked fetching through local `git`. These tests need the exact original repository imports and will check the genuine Pack5 two variants, 4 yaws, brick/art divergence, partial plaster backing, proposed split warning and invalid source choices. Previous original 24/24 rotated source-backed Pack5 cases, 58/58 controlled V8 checks and prior 6/6 core native tests are historical evidence only, not re-run here. No expensive Actions or browser suite launched.

Before any actual building/world integration: execute four new source-producer tests in authentic checkout; inspect any real differences; confirm collision and support with original game mechanics and real World/mesh/owner semantics; run targeted WebGL2 and iPhone landscape measurements at final authorized integration; obtain creator visual/structural acceptance. The 207/420 A5 source-only count, 213 unwritten, original 128 commerce, industrial 345, government 315, PR406, main, five automations, schema1, PWA and v0.11 all remain untouched.
