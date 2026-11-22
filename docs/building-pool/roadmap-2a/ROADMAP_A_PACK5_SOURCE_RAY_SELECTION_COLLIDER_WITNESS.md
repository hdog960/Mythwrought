# Roadmap A — original Pack5 collision / selection / authored triangle ray witness

## Why this is a necessary additional source-only gate

The prior authentic Pack5 support, projected footprint and original 0.025-block plaster / 0.015-block ceramic clearances describe *physical support candidate geometry*, not whether a player can target the same object that blocks collision. Original Manual Five Pack reports independent selection and collision boxes; the original Pack5 source authored mesh is a third distinct geometric input. A valid full-cube fired-brick collision may coexist with visibly inset or discontinuous relief geometry, so any inference that collision implies pickable rendered surface is unsafe.

This **source-only** original-producer ray witness checks the three inputs independently. It is not the actual player targeting system, raycaster, shaders, fragment depth, lighting, load-bearing structure, or an approved game block.

## Exact authored read-only scope

- Pure evaluator: \`src/building-pool/roadmap-2a/roadmap-a-pack5-ray-selection-core.mjs\`
- Real original producer adapter: \`src/building-pool/roadmap-2a/roadmap-a-pack5-ray-selection-producer.mjs\`
- Native pure-core tests: \`tests/building-pool/roadmap-2a/roadmap-a-pack5-ray-selection-core.test.mjs\`
- Native original-repository producer tests: \`tests/building-pool/roadmap-2a/roadmap-a-pack5-ray-selection-producer.test.mjs\`

Original selected family roster is ONLY \`pack5:079\` plaster, \`pack5:080\` fired brick and \`pack5:081\` ceramic floor tile. All **six** authored variants, each of the **four** original yaw alternatives, are independently sampled as **explicit preview test alternatives**, not assigned to any original Roadmap A building. There are **24 exact alternative asset audits**, each with **150 deterministic analytical local rays** (six faces times 25 fixed points), totaling **3,600 source-only rays**.

For every analytical ray, the new module determines:

1. Earliest intersection of the original producer's bounding **collision boxes**.
2. Earliest intersection of its **selection boxes**, equal to the original physical visible boxes.
3. Earliest double-sided **triangle ray intersection** with the actual unchanged authored colored source mesh positions/indices. The triangles are not a software GPU renderer or pixel visibility proof.
4. Conservative classification: collision-only rays, selection-only rays, selection recessed beyond collision surface, selection ahead of collision, coincident intersections, source mesh/selection disagreement, and both missed. Face-by-face totals and at most 32 example ray witnesses are retained. It never claims the isolated preview represents the live world's placement, occlusion, visibility, or targeting policy.

The original producer adapter verifies original physical occupancy, authored variants, support offsets/policy, collision boxes, visible boxes, selection boxes, mesh vertex/triangle counts, and the existing source-bound physical seam adapter. It invokes no world mutator, prefab constructor, save writer, live renderer, or gameplay player raycast.

### Fail-closed guarantees

- No missing or inferred yaw/variant, unknown Pack5 ID, source blueprint or real settlement ID
- No unbounded mesh, invalid triangles, malformed source AABBs, spoofed structural/creator approval or source gameplay placement
- Never silently treats collider-only rays as a clickable gameplay bug or a real rendering failure
- Avoids all original A5, builder B/C/D, hourly automations, shared workflows, schema1 saves, installed Home Screen PWA and locked v0.11

## Test and acceptance boundaries

Only the newly authored focused pure-core and original full-repository producer tests should be executed, once, against an authentic original GitHub source checkout. Existing exact-commit evidence is reused: previous **40/40 original-repo native** Actions #45044721507; latest 9/9 footprint pure-core and 5/5 authentic producer tests at Actions #45046409454 and #45046517491; historical original Pack5 24/24 and controlled-source V8 58/58. Do not run redundant broad CI, original WebGL2 or expensive browser suites solely for this source-only audit.

The 207/420 original Roadmap A source-only cohort (213 unwritten), historical 128 commerce, 345 industry, 315 government, and original 79 physical-source design hold census are unchanged. Before any gameplay approval the real player raycast / AABB collision policy, mixed Pack1–5 support, renderer visual occlusion, iPhone landscape GPU/performance, real variants/yaws chosen by authorized creator decision, and physical/art acceptance are still required. No merge or deployment is permitted for this work.
