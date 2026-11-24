# Living Ecosystem — static offline cache closure preflight and exact integration HOLD

2026-11-24. Mob-only detached qualification tooling; RELEASE HOLD.

## Exact baseline
Read previous phase2-original-live-projectile-budget-20261124.md blob 5d58ede351f3c553379d6a46439d86d5e94ae055 first. Verified detached commit bb621deacc52fb7c8dc8252b937eda4445aeb1f8, direct parent f98c70f0abe83debbec1e83d0674164c69aa4509, tree dbb9520bf029e495aef9c6cf8c303d9b05a2a4cf. Main db4bbcc32156e5df311f733bcaa53d559c17313b and draft unmerged PR #380 HEAD 508209c5473d3d78668dd394eb6bcdf9e6bcff84 unchanged. Actual local Node v22.16.0; git ls-remote failed DNS. No full checkout. No runtime/owner/worker changes, refs, CI, merge or deployment.

## Verified offline defects in exact detached baseline
Complete recursive Git tree query by detached commit returned 1471 entries, not truncated. Exact detached public worker sw-m5.js blob 75e7e04663b98376c70796963d5fadc58cbc9b33 (release 20261121-unified-environment-rc7), staged worker 2ddeb21e3bb0c6b6724de6d3f28a5a492f46098c, staged manifest e9dca1910ae1eca35a19c51ebe948db28f03ac5f (20261121-v36), original builder scripts/ci/build-stage-cache-manifest.mjs fb7e000f850f9a14cb7d53309f1b1f2e8cf7e906. Public SOURCE_ASSETS has 301 entries; stage manifest 303. Public main independently inspected worker df1ec82b31c02d46ae3c1e60dc0568dc9523b448 likewise omits both newly required runtime imports, but do not copy historical worker over external main.

Exact live-game and live-render source imports and tree verified: of 16 distinct roots and immediate dependencies, 14 are listed in both caches, two are missing from both:
- src/mobs/ecosystem-world-geometry.mjs blob 5f6e5ceb19421323493d3ad1002608a436d1a3f7 SHA256 7e4c238fe9adf37fc768dcc05d3b27d849f3ba8648241eaccbf181b3c191b582. Static import by live-game. Its direct voxel/environment-ground imports already occur in public manifest; environment-ground explicitly present in staged manifest.
- src/mobs/live-projectile-budget.mjs blob 41b5717ddead1dd5c9ef42c2c3fd83175d8c5882 SHA256 f375c27cd909731d5c5ac3381fa7a4cc748f0030003af50980ba1b93b95ab4c5. Static import by both live roots, no dependencies.

Seven changed listed Mob files have stale staged SHA256 (calculated over UTF-8 connector-returned exact blob text using SHA256 implementation checked against empty and abc standard vectors; independently rerun in native checkout):
Path | current detached SHA256
live-game.mjs | 3ebd42cbf28db7946a6877213ec4314fc502563869d59eff7fb59fff2157e8d3
live-render.mjs | 207b08c0c2ebc8d2ae3d6872c9e3fb4538345ff1f2c7334d7c1a6c73e5069afe
host-view.mjs | 9701553febb35aaa75d1b4c4c989fc9d2075f093d3d538d8614905cdfd7418dc
engine.mjs | 07115231b69fdf309de78c34503c54c72e84f3363c56e3f67d7279d5c6aa0793
combat.mjs | e2464d324b5f79145667690772d5f4d20eb658517029e2ad7834b51af67c836b
ecology.mjs | d5f6f09a3c3d687188bab3f2c81be993cc48b5274d5991ac946be0f24f150820
roster-persistence.mjs | 93732e39ec6e3de670789fbdaa500e5bdc5a44325e384b7789447c062384262f

Nine confirmed Mob cache discrepancies, not proof no other dependencies are stale. Stage worker verifies each manifest SHA256 during install; stale hashes prevent a successful candidate install. Missing static runtime imports can prevent cold offline boot. Do not treat cache listing as actual browser installation. source-edit-epoch.mjs is not currently imported by the live roots, and research-only modules must not be blindly cached.

## New read-only qualification tool
scripts/ci/mob-offline-preflight.mjs blob b0dd8af292e59da5f8bbc76969f4e82fc788292c. Uses actual Node vm.SourceTextModule dependencySpecifiers (static ESM parse, including reexports and side-effect imports), recursively traverses both live roots and their local dependencies, deduplicates cycles, compares public declaration and stage SHA256 per reachable file, returns explicit missingPublic/missingStage/staleStage, reports JSON, nonzero CLI exit on discrepancy or invalid/missing source. Does not execute modules or write any file. Not a general JS bundler or dynamic-import audit; does not prove actual cache install, activation, resource availability, worker release version, browser WebGL or device timing. Public declaration parser matches original builder's quoted-line format.

Native fixture suite scripts/ci/mob-offline-preflight.native.mjs blob 32ec27cc2f954eee3a4c00e6ac14085fe054d345. Actual local Node v22.16.0 command:
node --experimental-vm-modules --test scripts/ci/mob-offline-preflight.native.mjs
8/8 PASS, zero failures. Exact local git hash-object matches both uploaded Git blobs. Fixture coverage: dependency closure/reexports/cycles and exclude unreachable research, missing both caches, stale stage bytes, stage-only not public, missing source, unsupported/escaping/versioned imports, syntax/duplicate entries, no evaluation and worker/manifest unchanged. This is genuine native parser/test execution on synthetic repository fixtures, NOT full original native imports or complete candidate audit. Script/test intentionally outside automatic test glob because explicit experimental flag is required.

## Authorized integration steps
On real exact candidate checkout execute:
node --experimental-vm-modules scripts/ci/mob-offline-preflight.mjs .
Expect nonzero for known defects until approved owner changes. Integration owner must update the actual current branch worker list with every proven reachable missing module, advance matching release/cache versions following existing contracts, regenerate the complete staged SHA256 manifest with original builder, repeat read-only preflight to zero discrepancies, and run original required atomic-cache/rollback/browser tests. Do not replace externally advanced main worker with detached historical version. No changes to any worker in this checkpoint.
Reuse previous exact 7/7 native projectile helper and 11/11 controlled original integrations; no redundant CI. Genuine M7 three-seed/21-site test ca55529ae610637da8507f2e3d9ab6a22b8bb313 still UNRUN, authentic original native lifecycle, actual cave/overlay/Schema-1/Pack2, source revision authority, actual 8+4 draw WebGL2/p95 and installed iPhone offline Home Screen PWA acceptance pending. RELEASE HOLD.
