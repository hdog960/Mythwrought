# MYTHWROUGHT Builder D36 — independent convex two-face wall socket; source-only research

**Parent:** exact `02f52718ca2dc4b47c646c46609f4716c171e8b4` (D35). **Date:** 2026-11-22. **Scope:** only new source modules, two tests, this note, and one narrow isolated CI workflow. No production, original W16/17 author source, Pack1–5 source ownership, world/save, `live:wood` roof, terrain, settlement or automation changes.

## What D35 actually proved

Across 16 genuine source buildings, the 64 original long bays have 128 wall-rooted diagonal members. A bounded source-owned lateral side selection and axial retreat cleared all 128 source voxel penetrations, but **every trimmed root still lacks a true positive-area contact with its rooted wall and a rated connector**. A genuine ID62 post scanned as a bridge did not satisfy its two-face geometry. D34 separated 1,226 diagonal/chord physical overlaps, but original timber faces touching is NOT a fastener or material-rating evidence. D36 does not dilute these negative results.

## New independent source-constrained connector proposal

`d36-wall-socket-convex-preview.mjs` creates an **independent explicitly unregistered** convex-wall transition sleeve between (A) a small rectangular pad lying exactly on the real original Y6 wall *outside surface* and (B) the genuinely trimmed ID61 core's *oblique* 0.48 × 0.48 end face. It builds a 3D convex hull from the eight genuine cap vertices, computes the actual polygonal hull faces, triangulates them in Float32Array/Uint16Array with only the authenticated original ID61 palette colors, and performs full convex-body SAT collision tests against world AABBs and every original-owner oriented part. It independently compares ray selection from convex half-space planes against the generated triangle mesh, rather than reusing only the same ray algorithm for both.

The wall pad is at most 0.06 × 0.30 world units (0.018 geometric area), deliberately kept within the original full-cube bearing face. The clipped original web core's 0.48 × 0.48 source-derived end cap is 0.2304 geometric area. Their **existence is not proof of rated tensile, compressive, shear, moment, torsional, bending, uplift or lateral load transfer**, valid wall adhesion, a fastener, or effective unique joint area. Convex loft is a NEW proposed shape, **not** an ID61 or ID62 runtime variant, authorized source mesh, historic block, or installed construction. Its RGB samples are owner-palette provenance, not automatically approved UV/texture mapping or color-safety acceptance; projected end caps and renderer remain unapproved.

`d36-original-wall-socket-audit.mjs` independently regenerates each genuine D19/D22/D25/D29/D30 building and statics context and reuses D35's two-sided rooted wall trim. Each root socket is checked against **all nearby authored original voxels** including Y5–Y6 walls, Y7 `live:wood` and higher tiers; the conservative Y2 player-body probe; its own trimmed web; and all other proposed truss members. Collision events are counted, never silently removed. No numerical material strength ratings are fabricated. If an independent connector lacks physical room, its geometry is rejected and must be redesigned before construction.

## Explicit construction veto

All **59,412 distant roof cells across 34 regions remain uncertified**; all 1,354 theoretical pin nodes and 128 root connections require independently approved material, fastener and load-path qualification. Every D36 output has `constructionAllowed:false`, `structuralCertification:false` and no runtime registered shapes. No gamer/WebGL2/iPhone Home Screen PWA tests or real physics were performed. The 3,644 strict bidirectional D4 checks, 285 source IDs (132 provisional), protected draft PRs, five automations, other developers and original save scheme remain mandatory and unmodified.

## CI policy

One isolated branch push, one pinned original checkout, literal source blob checks and only **four D36 pure + two original W16/W17 focused tests**. Previous D25–D35 exact-commit successful CI is reused. No broad/test-screenshot/PWA or other developer jobs are rerun. The original CI output provides all source-authentic counts, including socket clashes and candidate geometrical clearance.
