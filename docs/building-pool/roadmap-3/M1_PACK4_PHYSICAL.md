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

## Actual Pack4-supported forge construction sidecar

All fifteen original blacksmith blueprints remain unchanged, including
their open vent-cell reservations, unique architecture fingerprints and
navigable corridors. The builder-specific \`physicalSource\` now physically
authors: a registered masonry backing cell where a fireplace has no
structural neighbor, north/east facade-facing orientation based on the
backing, and a stack of actual \`pack4:063\` hollow chimney units from
inside the room up through the original upper courses.

This resolves previously ABSENT adjacent support cells without inserting
solid stone into the centered vertical smoke duct. No fire/smoke simulation
or live-world placement is implied.

**Sub-box contact is still pending:** the original fireplace's stone
mantle ends at local Y=.94, leaving a .06-cell seam under the first
chimney course. The sidecar emits \`chimneySubBoxContactReview:true\`
rather than claiming that voxel adjacency alone certifies finished
masonry contact. Do not waive physical-iPhone or creator visual approval.
