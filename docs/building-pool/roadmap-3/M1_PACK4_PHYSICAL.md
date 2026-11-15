# Roadmap 3 — physically usable Pack 4 building blocks

This roadmap is still isolated and unmerged. Original blueprints stay valid and
may continue to mark cross-pack occupancy unresolved until the explicit
fill-in/integration phase. This additional native **construction view** is
not a pasted symbolic dependency, a placeholder cube, or a live-world change.

Import \`getM1Pack4Construction\` from \`src/building-pool/roadmap-3/m1-pack4-physical.mjs\`.
Pass the **real** Pack 4 API object containing \`resolvePack4BuilderBlueprint\`
from \`src/block-packs/pack-4/builder-handoff.mjs\`, in an isolated combined
checkout. The Pack 4 source is pinned to
\`65cbddc4721f9d7278d58f8659562982266f7b41\` at draft PR #115.

The return value contains **real original material-specific visible shapes,
collision AABBs, selection AABBs, rotated typed vertex preview meshes and
mounting offsets**, per physical Pack 4 cell in each building. Missing
support cells and non-authored facing state are counted for review; the
adapter will not report those as approved. The source building's own
coordinate-authoring schema remains unchanged.

All 23 Pack 4 IDs 159-181 are physical candidate assets from the isolated
Pack 4 source. They are not automatically registered in production or
inserted into live-world generation. Do not silently substitute a
full-cube model, modify any other block pack, or approve Gate A/v0.11.

Reproduction: GitHub-hosted temporary source-exact overlay of this PR plus
Pack 4 draft PR #115, followed by native builder tests and original
Chromium WebGL2 preview. No PC, paid service, merge, or deployment required.
