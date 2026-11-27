# Veilreach checkpoint

Branch `draft/veilreach-shared-height-v1`. Implementation commit `4d41088ed8962029146c6915cfac82cc2300120a`, based on main `7b04720b4d8d68209e7e47837fbc71e1d26a9b51`. The source revision is the parent of this checkpoint commit. Preview shell `20261127-veilreach-v1-preview`. Work is paused at the creator's four-view visual review.

The earlier ground screenshot showed a triangulated distance proxy. Landed views showed native blocks, and the close approach could show both meshes. The proxy now uses axis-aligned, textured faces derived from the same terrain columns, with stepped elevations and material bands. Detailed resident sections use original, editable cubic terrain. The distance draw subtracts detailed section interiors, uses the existing terrain material tags, and has a separate 24,576-vertex budget. It never owns collision, selection, or world state.

## Source and compatibility

- `src/veilreach/generation.mjs` builds deterministic 768-block regions with Verdant Crowns, Shatterpeaks, Moonveil Gardens, scattered outcrops, and anchored vegetation. `source.mjs` registers the immutable natural source. `flora.mjs` defines Veil grass through the native shape pipeline. `distance.mjs` builds the stepped distance mesh and uses shared GPU upload recovery.
- `src/main.mjs`, `src/world-height*.mjs`, `src/voxel.mjs`, and `src/blocks.mjs` use the existing renderer, signed section keys, flight readiness, ray, collision, edit rollback, and natural support transaction. Shared Height incorporates two files from the previous [Floating Islands research](https://github.com/hdog960/Mythwrought/tree/7ce237bc5d4d5353b5a6e71e4aef66b6b0a14bc5/src/floating-islands). The research branch's alternate runtime was unnecessary.
- The candidate's ordinary **New World** action creates the distinct `mythwrought-upper-veilreach-v1` generator with the existing M8 overland and deep baseline. Existing profile identities and their edits stay in their established storage slots. The current source adds no mobs, water features, authored structures, or player menu variants. Ground sky lighting and the original moon cycle retain their existing path.

## Verification

200 focused native tests passed, including source determinism, signed ownership, profile parity, terrain saves, rollback, existing sky, and axis-aligned distance geometry. The budget probe measured 485 natural sections across four seeds and signed regions with zero overflows. The largest was 547,776 bytes against the 884,736-byte per-section cap. The staged manifest verified 343 included source assets.

```sh
node --test --test-concurrency=3 tests/veilreach.test.mjs tests/shared-world-height*.test.mjs tests/manual-biomes/profile-world.test.mjs tests/creative-integration/g2-*.test.mjs tests/app-update.test.mjs tests/compact-menu.test.mjs tests/unified-offline-atomic-cache.test.mjs tests/persistence.test.mjs tests/depth.test.mjs tests/blocks.test.mjs tests/mining-save-replay-scope.test.mjs tests/sky*.test.mjs tests/gpu-recovery.test.mjs
node scripts/ci/veilreach-section-budget.mjs
node scripts/ci/build-stage-cache-manifest.mjs --check
```

The visual WebGL run used the normal New World button and preserved the original seed's save bytes. Seed 180 had zero resident physical island bytes at ground level. From the actual flying route it captured the underside at Y≈78, then approached the crown, landed at Y=117, and walked. At the crown it drew 2,681,640 physical upper mesh bytes in eight owners. Noon daylight and ambient were identical at the original ground and the Veilreach ground, with three moons registered. The original route's fixed placement aim hit a blocked spot after landing, so the browser fixture now selects a verified reachable target. A focused recheck started on a clear site using the localhost camera, then used the real MINE and PLACE controls and the actual WebGL context loss extension. Both edits survived context recovery, reload, and a cold launch with network access disabled. The edited AIR was at (58, 116, 54), and stone was placed at (58, 116, 52). The worker cached 341 assets in the public shell.

The four review images are `01-distant.png`, `02-underside.png`, `04-surface.png` (close block view after landing), and `surface-angle-b.png` (stationary surface view at X=57.5, feet Y=116, Z=53.5). The last view used the localhost camera on existing physical terrain. `03-close-range.png` is an additional approach angle.

The WebGL journey is reproducible with a local server on port 4211 and the project's Playwright installation. Run `VEILREACH_EVIDENCE=/path/to/evidence node tests/veilreach-browser.mjs`. It uses Chromium with SwiftShader at 956×440. Test artifacts are outside the repo under `/workspace/shared/Veilreach-Voxel-Terrain`.

## Remaining release gates

Visual review comes first. The latest screenshots cover one Verdant Crown. Signed generation and section budgets exercised all three families. A physical iPhone review is still open, including sustained traversal, prior installed Home Screen upgrade, and visual transitions under the mobile renderer. Keep this candidate isolated pending creator direction.

## Production qualification

Creator authorized publication through the existing Home Screen shortcut. The candidate shell is `20261127-veilreach-v1`. The release PR tracks the single normal New World flow, the shared physical height and owner budgets, and qualification scope under #492, #498 and #501. The preview native and flight evidence above applies to its recorded source. The service worker and release identifiers changed for this publication, so this gate verifies fresh install and upgrade bytes.

The installation fixture serves two authentic source trees on one origin. It adds upper and underground edits to a real prior world, installs the previous shell, swaps the server to the release, checks the candidate's cached asset hashes, and reopens the same installation offline. It exercises ordinary New World, checks the distant geometry before any physical upper mesh loads, and verifies the historical save remains intact.

```sh
mkdir -p /tmp/mythwrought-prior
git archive 7b04720b4d8d68209e7e47837fbc71e1d26a9b51 | tar -x -C /tmp/mythwrought-prior
VEILREACH_PREVIOUS_ROOT=/tmp/mythwrought-prior node tests/veilreach-home-screen-browser.mjs
```
