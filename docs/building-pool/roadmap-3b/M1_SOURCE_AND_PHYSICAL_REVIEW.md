# Builder 3B — M1 source-exact inheritance and physical-ABI inspection

**DRAFT / NOT MERGED / NOT DEPLOYED.** M0 at PR #181 head
`39f224272924c49cd33406cf648753572548db56` passed actual GitHub Actions
[#43766836100](https://github.com/hdog960/Mythwrought/actions/runs/43766836100):
focused native nested tests and production Chromium smoke/layout successful.
**Those screenshots are production smoke, not inherited-watchtower render evidence.**

## Inheritance parity at actual source
Original read-only PR #122 exact HEAD: `e35b8eca644f6de06e76ab946103ce64a6b7fb91`.
Original source `src/building-pool/roadmap-3/m1.mjs` blob
`189ac4deb11042534743045b5087a7a7525e3bf1`.
Independent original-vs-imported comparison confirmed the geometry-critical
4,151-character helpers and 6,121-character watchtower generator are byte-identical.
Their original-derived Git blob SHA-1 witnesses are:
- helper: `df0e19da6d8263f99ec77b8cdde9e9e9cf416d06`
- watchtower: `febd8388f51bb42e1a9b4ef0aa5914facc2dc336`

The isolated nested M1 parity test verifies both source witnesses against exact
owned PR-head bytes. Original serialized watchtower semantics preserved by same
function, same slot ID contract, source-identical validator (except error label)
and same symbolic asset refs. It also generates independent per-blueprint
architecture SHA-256 witnesses for 15 watchtowers; these need to be pinned
after committed-source native execution to add an extra regression baseline.
**This is source-equivalence evidence, not an independently executed original
PR #122-vs-new-native bilateral output comparison.** No blacksmiths copied.

## Physical API reality (main integrated catalog; review only)
The source-derived `reviewM1PhysicalDependencies()` reads the actual
`src/builder-assets/manual-five-pack.mjs` and
`src/biome130-registry.mjs` exported ABIs without writes. The merged manual
bridge has **96 family symbols and 106 physical variants**, but the original
watchtowers describe each occupied position as `[x,y,z,ref]` only.
They do **not** select numeric variants, orientations, states, multi-cell
reservations or actual mounting/support for each structural placement.
Diagnostic default-north candidate shapes are NOT automatically authoritative
construction choices and may require geometry/collision revision.

Critical biome130 discrepancy resolved honestly: `biome130:006` currently
appears in the registered source manifest; `biome130:094`, `:096`, `:098`,
and `:104` are beyond the current registered range 001–070 on pinned main,
and must remain symbolic. No fabricated IDs or shapes.

## New source-exact nested acceptance
Run `node --test tests/building-pool/roadmap-3b/*.test.mjs` on the exact head
for original-source Git blob witnesses, 15 exact original IDs, independently
flooded supported two-wide routes, 3-tier stair supports, snow canopy ties,
real typed family ABI review, unique geometry, and 360/15/345 accounting.
After this commit, recheck exact HEAD GitHub Actions, not local-only execution.

## Source-anchored diagnostic WebGL2 preview harness
The watchtower-only preview (under 3B-owned `tests/` files) now adapts the
original PR #122 generic mesh/camera QA, without copying blacksmith blueprint
generation or changing original #122. It consumes **real authored 3B watchtower
coordinates** but renders unit-cube *envelopes*, NOT the integrated physical
manual/biome shape AABBs. Native mesh/camera tests exercise all 15 × 2
exterior/cutaway × 3 phone landscape viewport combinations (90).
Optional `preview-browser.mjs` saves **90 genuine Chromium WebGL2 screenshots**
only when deliberately executed with a permitted browser and local HTTP server.
Do not claim such images are captured merely because the harness is committed.

15 SHA-256 fingerprints and 15 canonical coordinate Blueprint SHA-256 hashes
were actually emitted by native GitHub Actions #43768554260 and pinned under
`M1_GEOMETRY_WITNESSES.json`. The nested tests now verify them on subsequent
PR heads; they originate from byte-preserved inherited code, but separate direct
legacy PR #122 binary execution remains a distinct optional proof gate.

## Unresolved review gates
1. Capture **actual 3B coordinate source** in Chromium WebGL2 at 667×375,
   844×390, 932×430, exterior and cutaway, and inspect readability.
   Production app smoke does NOT satisfy this candidate art gate.
2. Re-author per-placement metadata against exact physical manual family
   variants and current source-authentic collision/support, without silently
   changing the original coordinates or counting migration repairs as new designs.
3. Final original-PR-bilateral generated hash parity remains independent
   of this static source equivalence and must be tested where both original
   and isolated sources can run, ideally without adding original 3A files
   to the 3B-owned repository path.
4. Creator artwork and physical-iPhone tests are pending. No final building
   approval, no bridge-to-world installation, and no Gate A promotion.
