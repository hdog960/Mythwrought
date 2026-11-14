# Mythwrought — 10× underground world capacity (manual candidate)

**Status:** isolated, unmerged manual depth-engine candidate; NOT an automated lane contribution. No live Pages deployment, no Gate A or v0.11 approval.

## Precise coordinate contract
- Original **surface/old underground** Y = -3 .. 19, 23 layers, unchanged in place.
- Proposed combined voxel height: **230 layers (10 × 23)**, Y = -210 .. 19.
- All original Y cells, seeded height/noise formulas, original cave algorithm, landmark overlay, and original surface mesh iteration continue to use the legacy envelope.
- Below Y=-3 is new engine-owned, deterministic solid substrate: STONE to -32 and existing physical DEEPSTONE below. This is **not deep cave generation** or gameplay-design approval. The :24 terrain AI owns authored deep caves when explicitly coordinated after incorporation.
- Surface GPU section 0 retains original 23-layer mesher and key `cx,cz`. Additional independent 16-layer sections -1 .. -13 are keyed `cx,cz,section`; the last section clips at Y=-210. Deep section meshes are physical, voxel-targetable, editable, and support collision.

## Bounded rendering
- Typical surface elevation: original **25** horizontal GPU chunks, unchanged.
- Near surface/deep boundary: at most **34** resident GPU sections (surface 25 + deep 9).
- Deep below boundary: at most **27** resident GPU sections (3 vertical slices × 3×3 horizontal), with each deep slice independently generated, uploaded and evicted.
- One GPU upload per eligible frame; existing mesh cadence/backoff and context-loss recovery remain in use.
- Depth-adjacent edits invalidate loaded meshes on either side of Y seams, in addition to the existing X/Z neighbors.
- No new per-block IDs, storage keys, save fields, interface controls or PWA dependencies. Existing schema-1 saves retain their coordinates, and deeper edit deltas roundtrip through the same serializer.
- Void respawn follows the true new Y minimum instead of the obsolete -15 cutoff.

## Ownership, acceptance, and integration
- Does not edit manual Block Packs 1–5, four theoretical building roadmaps, :24 cave composition, :36 structure placement or :48 environmental dressing.
- Does not merge automation development, adjust automation schedules, enable :00 or touch registered material IDs.
- Existing `.github/workflows/ci.yml` remains unchanged; the depth-specific CI file runs genuine exact-source Node and Chromium/WebGL2 checks.
- Passing Node and Chromium evidence is **not** physical-iPhone acceptance. Screen artifacts must be reviewed before visual acceptance.
- Depth expansion is a **candidate** until exact-head CI passes, saved-world cases are checked, and incorporation is explicitly authorized; do not assume it is deployed.
- Three temporary automation ownership guards remain in place pending reviewed integration. On accepted incorporation, revise/remove their temporary no-depth clauses while preserving their schedules and independent world-content ownership. Do not remove these safeguards merely because the draft PR is opened.

## Verification matrix
1. All existing npm/Node tests on exact candidate PR head.
2. New depth native tests: range and partition, deterministic legacy cells, schema-1 saved deep edits, bounded windows, seam invalidation, both vertical/horizontal mesh face exclusions.
3. Actual SwiftShader WebGL2 Chromium at **667×375, 844×390 and 932×430**, with real edited underground room at Y=-78, 27 streamed GPU sections, original thumb-grip spacing, genuine screenshots, persisted reload.
4. Review the exact Actions outcome, screenshot artifacts, and any test failures. Never report queued/unrun checks as passed.

## Deferred to :24 / :36 / :48
- Descending cave networks, subterranean biome planning, and exposure pathways (:24).
- Underground ruins, cities, constructed placements (:36).
- Lighting, mushrooms, flora, storytelling props (:48).
- Actual real-iPhone thermal/memory review belongs to creator's Gate A evidence, not CI.
