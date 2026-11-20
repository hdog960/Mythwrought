# Builder D historical D4 repair — independent creator-safe source-only patch

**Purpose:** Fix a real near-clone detected by the independent reverse-orientation test; no historical or original sibling branch edits. This is a new source-only downstream remediation draft stacked on Builder D Wave5 PR #317 HEAD `b6a3c2e93f49915a09a500e92e953e9518c6f524`, not a mutation of protected earlier PRs #297 / #304 / #309 / #311 / #317.

## Verified issue and physically authored fixes

1. Protected historical `r4:schoolhouse:enchanted-forest:large:02` (Luminbough) versus new Wave2 `r4:schoolhouse:temperate:large:02` (Pinewater). Independent archived original source reconstruction proved **historical→new D4 = 0.9073497725640411**, which violates the strict `<0.89` limit despite the opposite direction being only `0.864934456928839`. Cause: floor orientation normalization makes the existing one-sided eight-transform check asymmetric, so the earlier test missed it. Pinewater's actual roof/footprint was reauthored with nine offset masses and broken roof lines, not recolored. **After:** historical→repaired Pinewater `0.8023354564755839`; Pinewater→historical `0.8201114922813036`. Seven functional rooms, 15,857 actual occupied XYZ cells, connected navigation, same canonical ID, zero historical edits.

2. Earlier Wave3 `r4:schoolhouse:mountain:small:02` (Cliffstep) versus Wave4 `r4:schoolhouse:snow:small:02` (Whitepine). Independent bidirectional D4 found one reverse direction `0.91358`, failing despite forward source check `0.856287`. Reauthored Whitepine actual structural wings/roofs, additional supported outbuildings and offset massing, not a palette swap. **After:** Whitepine→Cliffstep `0.8385477018153727`; Cliffstep→Whitepine `0.8286592393392239`. Six rooms, 9,025 source cells, original 4B validator pass.

All new sources remain source-only, with original D0 ID ownership unchanged, no producer Pack approvals or live game registration.

## Independent historical reconstruction and stronger acceptance

Rebuilt all **18 relevant protected historical** school / research / arcane sources from their *real source plan modules* (15 schools, 2 research institutes, 1 academy); the remaining 135 historical healer/library objects cannot share those types, and all 153 are also imported into the new exact-head original catalog validation. Loaded and executed the full **36 newly authored D1–D5** current source objects. Verified all 54 relevant source IDs and all 54 source geometry fingerprints are unique.

Computed **446 strict bidirectional eight-way occupied-floor IoU pairs**:
- 244 cross historical/new same-category pairs: **zero failures**, worst `0.851637`.
- 202 between newly authored D1–D5 same-category pairs: **zero failures**, worst `0.882191`.
- The stricter `<0.89` test is now permanent, **checks both directions**, and requires an extra regression limit `<0.85` for the two specifically repaired fixture pairs. Prior tests remain unmodified; no exemptions, thresholds loosened, or historical objects rewritten.

A new root-native shim and dedicated workflow `.github/workflows/roadmap-d-historical-bidirectional-d4.yml` enforce full 153+36=189 canonical source validation, original D2/D4/D5 integrity and the 446 bidirectional comparisons. These are still PRELIMINARY until exact-head GitHub Actions completes.

## Source-only acceptance hold

Existing original draft PR heads #297, #304, #309, #311 and #317 remain untouched. Only the two current D-owned source modules Wave2/Wave4 are modified on this new child remediation branch, with new independent tests, workflow and documentation.

Changed sources require **new exact-source screenshots** in the inherited D2 36-frame and D4 48-frame Chromium WebGL2 workflows; any images from pre-repair historical branches must not be passed off as repaired versions. The original root CI, native 12 contracts and 20 real full-game Chromium scripts must pass. Actual Pack1–5 final physical meshes, original visual art, mobile iPhone, settlement handoffs and creator aesthetic acceptance remain HOLD. Current independently inspected Wave1 36-frame cube-proxy capture was technically valid, but brown prototype roofing and sparse interior dressing were visibly nonfinal.

**DO NOT MERGE / DEPLOY / LIVE-REGISTER / ALTER SCHEMA-1 SAVES / CHANGE MAIN / TOUCH OTHER BUILDERS / TOUCH AUTOMATIONS / UNLOCK v0.11.**
