# Pack 4 -> physical construction builders (candidate handoff)

**M5's 181 native cases and original Chromium WebGL2 gallery passed at PR head
593e36e2. That did NOT register or resolve the blocks in builders.**
This is the follow-up physical builder API, not a production integration.

## What builders actually get
Import \`src/block-packs/pack-4/builder-handoff.mjs\` from an isolated
checkout including Pack 4's original sources. No re-created flat cubes,
fake symbolic geometry, screenshot-only assets, or duplicated roster IDs.

- \`PACK4_BUILDER_CATALOG\`: all 23 IDs 159-181 in 22 unique rosters.
- \`PACK4_BUILDER_FAMILIES\`: stable \`pack4:030\` through \`pack4:068\`
  roster references as they already appear in building roadmaps.
- \`pack4BuildingVariants(ref)\`: exact variant choices; stained glass roster
  \`pack4:031\` exposes 160 Sunfire (default) and 161 Moonveil (explicit).
- \`pack4BuilderAsset(ref,{candidateId,rotation})\`: the ORIGINAL shape's
  per-material visible sub-boxes, true union collision/selection AABBs,
  rotated support/mount offset, and full Float32 opaque/translucent
  WebGL2 preview mesh for that orientation.
- \`pack4BuilderPlacement({at,asset,orientation,candidateId})\`: actual
  single-cell construction placement with position, orientation and
  support cell, without altering a game save.
- \`resolvePack4BuilderBlueprint(blueprint,{variantByRef,fixedSupportCells,
  requireSupport})\`: consumes an existing Roadmap 1 \`placements\` or
  Roadmaps 2-4 \`cells\` array, resolves each \`pack4:###\` reference into
  exact candidate geometry, and can **reject missing structural support**.
  It returns a separate physical plan, leaving the draft's original
  unresolved-symbol schema unchanged.

Example (Node ES modules, builder preview only):

\`\`\`js
import {resolvePack4BuilderBlueprint} from './src/block-packs/pack-4/builder-handoff.mjs';
const plan=resolvePack4BuilderBlueprint({
  id:'village-inn',placements:[
    {at:[2,2,0],asset:'pack4:030',orientation:'north'},
    {at:[3,1,3],asset:'pack4:059',orientation:'east'}
  ]
},{fixedSupportCells:[[3,0,3]],requireSupport:true});
console.log(plan.placements.map(p=>[p.candidateId,p.rotation,p.physical.collision]));
\`\`\`

## Provenance / builder lane integration
PR [#115](https://github.com/hdog960/Mythwrought/pull/115)
on branch \`pack-4-m0-m1-windows-openings-20261114\` is the
canonical physical source. Resolve against its **exact latest Git SHA**, not
a stale copy or an unrelated \`main\` path. Building PRs #121-124 are separate
branches: the Pack 4 files do **not automatically appear** there. Any builder
integrating this adapter should bring the exact same source files into a
disposable combined checkout, verify their \`git hash-object\` against the
pinned PR source, run the builder tests, and only then consume the adapter.

Do **not** silently rewrite building roadmaps' schema validators that still
mark cross-pack references unresolved. Instead run the opt-in resolved
physical-plan adapter alongside the untouched authored blueprint. This
makes actual construction model/preview work possible now while preserving
per-lane ownership and future change control.

The adapter is **not** the production renderer, block registration, live world
placement, save migration, fire/smoke/water mechanics, or physical-iPhone
approval. Candidate IDs remain reserved, not deployed. Settlement generation
and full live-world rendering require a **separate explicit incorporation**.


### Actual independent roadmap schemas (do not fake compatibility)
- Roadmap 1 / PR #121: \`placements: [{at,asset,orientation,...}]\`.
- Roadmap 2 / PR #124: \`voxels: [{x,y,z,material,kind}]\`.
  Only perimeter window facing can be derived from bounds. Others default
  to north **preview only** with \`orientationRequiresReview:true\`.
- Roadmap 3 / PR #122: \`modules: [{role,cells:[[x,y,z,ref],...]}]\`.
  Each absent facing becomes explicitly \`default-preview-only\`, requiring
  designer orientation review before physical final signoff.
- Roadmap 4 / PR #123: \`cells: [{at,asset,facing,...}]\`.
The adapter always returns per-cell real geometry, while it separately
reports \`orientationReviewCount\` and \`supportVerified\` so missing
builder context is not mistaken for approved physical placement.
