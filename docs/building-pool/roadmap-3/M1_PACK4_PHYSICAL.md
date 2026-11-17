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


## Final physical masonry assembly profile: source-exact geometry

The builder-owned file \`pack4-hearth-junction.mjs\` now generates an
**open-throat fireplace-and-flue assembly** without modifying Pack4's original
standalone block models or numeric IDs. It replaces only two full-width mantle
slabs with four source-material strips each, leaving a true [.34,.66]
centered aperture along X and Z. Original ornament, grate, jambs and
collision/selection remain physically authored. A four-strip .06-high
transition collar joins the fireplace mantle (Y=.94) to the chimney course
(Y=1), and four source-material corner/rim strips finish the .04-high
gap between consecutive hollow chimney courses.

Every new piece uses the exact originating Pack4 material's original
per-face GPU triangle stream, affinely remeshed to the new true AABB.
There is no fake full-cube proxy. Additional collision and selection
bounds are independently derived from visible source parts, and the center
air duct remains clear. Builder-only view returns
\`hearthPhysicalContactCertified:true\` after explicit AABB contact and
air-shaft validations. The source theoretical blueprint remains immutable,
and the production renderer is NOT automatically modified.

The assembly is not a persistent game block ID and must undergo dedicated
live-engine integration later. No simulated fire/smoke or approved artwork.
