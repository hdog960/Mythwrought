# Builder 4A M2 — Chambers and Crafts, independently source-authored

New immutable source module `src/building-pool/roadmap-4a/m2-chambers-crafts.mjs` at Git blob `b55739c8b5e822bf5c6cdce7acd8dbeb1169294b`.

- `r4:civic-hall:temperate:large:05` — temperate confluence council with eastern lockkeeper and western drainage-archive outboards
- `r4:civic-hall:desert:small:05` — desert oasis escutcheon and western date-palm claims chamber
- `r4:civic-hall:snow:large:05` — snow stormgate legislature with eastern lantern and western blizzard archives
- `r4:civic-hall:enchanted-forest:medium:05` — enchanted forest bough compact with outboard pollen vault and nightbloom inspector
- `r4:guildhall:temperate:medium:04` — temperate millwrights guild with western waterclock calibration annex
- `r4:guildhall:snow:medium:04` — snow frostglass-making guild with separate eastern iceglass polishing hall
- `r4:guildhall:mountain:medium:04` — mountain twin crane stonework guild with east forge bridge and west rigging branch
- `r4:guildhall:enchanted-forest:small:03` — forest elderleaf restoration guild with outboard eastern spirit-ink press

**Exact source preflight:** 65,396 occupied structural voxels; 15,013 traversable two-headroom positions; 47 distinct connected rooms; 21 functional interior doorway partitions. Independent roofing and opening support audit checked 17,439 roof cells, 55 source glazing sockets and 29 openings with zero violations. Across the complete 132-candidate theoretical catalog: 132 distinct IDs, 132 unique geometry signatures, maximum new same-type D4-normalized footprint IoU 0.84428 (<0.85 hard rejection). Reworked rejected snow/forest guild near-matches into different physical wing layouts before authoring manifest counts.

Symbolic source dependencies are manual Pack1 masonry, Pack2 fixtures, Pack3 roof families, and Pack4 window glass; Pack5 producer ABI must still be read-only checked by combined tests, without falsely asserting that the eight buildings instantiate Pack5 objects. Physical producer numeric variants, 3D AABBs/physics mounting and support remain unresolved, never production-ready.

**Acceptance pending** exact-head dedicated native Node, genuine 48-view source-pinned Chromium WebGL2 exterior/cutaway screenshots at 667×375, 844×390 and 932×430, individually hashed with PNG dimension validation and contact-sheet inspection. Candidate WebGL2 proxies cannot prove live-game material fidelity or iPhone GPU performance.

Approval/integration state: 0/0. Forbidden: merge, deploy, live world registration, save edits, shared CI/runtime, sibling builders, manual Block Packs, biome130, automations, PR #123 or v0.11 changes.
