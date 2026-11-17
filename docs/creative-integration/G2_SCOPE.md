# Mythwrought Creative Mode — G2A Flight Scope

**Authorization:** Creator approved ONLY isolated G2A development. This proposal is not authorization for G2B production attachment, G3 construction, merging, deploying, changing save schema, or unlocking v0.11.

## Branch and ownership

Production main at branch creation: 1f67efc9805e83866549515ffdad4dc7e225b234.
Separate branch: integration/creative-flight-g2-20261116; draft PR only.
Preserve Creative prototype PR #186 (HEAD 6222efa17acb0863fea42574be9748760dd877f0) and accepted read-only registry G1 PR #200 (HEAD 9770ce0155138299dec79dbfe53f838cc620c136), both draft/unmerged.

Exactly 11 G2A-owned write paths:

1. src/creative-integration/g2-flight.mjs
2. src/creative-integration/g2-control-state.mjs
3. src/creative-integration/g2-streaming.mjs
4. src/creative-integration/g2-landing.mjs
5. tests/creative-integration/g2-flight.test.mjs
6. tests/creative-integration/g2-controls.test.mjs
7. tests/creative-integration/g2-stream-landing.test.mjs
8. tests/creative-integration/g2-real-browser.mjs
9. tests/creative-integration-g2.test.mjs
10. docs/creative-integration/G2_SCOPE.md
11. docs/creative-integration/G2_ACCEPTANCE.md

All other paths are strictly read-only. In particular do not modify src/main.mjs, index.html, styles.css, input/camera/physics/chunks/depth/exploration-map, renderer, G1 seven-file ABI, CI, service worker, storage/schema-1, manual Block Packs, builder roadmaps or automation producers.

## Safety, ownership and functional specification

- Feature OFF by default. Source modules are pure: no DOM installation, import of draft Creative prototypes, game runtime mount, actual chunk fetch, GPU upload, save or world edit.
- Speeds: precision 1.4, normal 4, fast 8, travel 15 world units/s. Maximum frame duration 50ms; normalize 3D diagonal input; sample every 0.25 world units or less along the candidate path.
- Require host-supplied real isRegionReady, isBodyClear and sectionForY readers. Do not substitute terrain height for player-body collisions or assume producer overlay passability.
- Streaming planning only: at most two new requests/update and six pending; region keys include actual production vertical section, deduplicate and return cancellation plans for direction or world changes. The real runtime owner must enforce GPU budgets and cancellation in a later authorized G2B attachment.
- Input ownership pure state supports separate MOVE and LOOK fingers, UP/DOWN held actions, a LAND request, WASD/Q/E, and mandatory blur/hidden/orientationchange/pointercancel/contextlost/overlay-open release. Do not attach any browser or DOM handlers at G2A.
- Landing: maximum 64 host-proposed candidates, within 8 units horizontally and at most 32 units below, verified ready, supported, full player AABB clear and swept descent safe; recheck immediately before outputting a suggested grounded state. No verified landing means remain hovering with flight control ownership; never force gravity.
- Four speed profiles are design candidates only. Real physical iPhone controls and profile feel need later creator acceptance.
- Existing upper-right tap-to-expand discovered map, two-thumb landscape controls, camera/physics and schema1 saves remain unchanged.

## G2B restriction and rollback

G2B shared attachment would separately require explicit authorization for narrow hooks in src/main.mjs, index.html and styles.css, plus current owner consent. No implicit permission for input.mjs, camera.mjs, physics.mjs, chunks.mjs or depth.mjs. Preserve original Explore mode and world fog-of-war map.

For G2A, stopping or discarding the unmerged draft branch is the full rollback: no production integration or stored-world data is altered. Failure in exact-head tests, source authority, ownership, safety callbacks or baseline compatibility blocks further progress; CI success alone does not authorize G2B or deployment.
