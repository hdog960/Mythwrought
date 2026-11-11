# MYTHWROUGHT
**A world to shape. A story to change.**

An original, iPhone-first, landscape first-person voxel fantasy RPG. This public repository contains the authoritative game design, an outcome-gated 100-release development plan, a transparent release ledger, and the playable game as its implementation is validated.

**Official repository:** https://github.com/hdog960/Mythwrought  
**Intended GitHub Pages address:** https://hdog960.github.io/Mythwrought/

## The promise
A continuous, editable, procedural fantasy world with authored branching narrative, rich surface and subterranean civilizations, classless Skyrim-like combat, two reactive platonic companions, Minecraft-like building freedom, crafting and spell experimentation, living settlements, wildlife and original runic engineering.

## Canonical authority documents
1. [Vision & scope](docs/01_VISION_AND_SCOPE.md)
2. [Narrative & world](docs/02_NARRATIVE_AND_WORLD.md)
3. [RPG, characters & inhabitants](docs/03_RPG_AND_CHARACTERS.md)
4. [Voxel sandbox & simulation](docs/04_SANDBOX_SYSTEMS.md)
5. [Art, interface & accessibility](docs/05_ART_AND_UX.md)
6. [Technical architecture & testing](docs/06_TECHNICAL_ARCHITECTURE.md)
7. [100-release roadmap & acceptance gates](docs/07_ROADMAP.md)

See [release ledger](docs/RELEASE_LEDGER.md) for **actually verified** implementation progress. Aspirational features are not shipped features.

## Constraints
Free static GitHub Pages deployment; no paid services, no mandatory external APIs, no Codex/Work/Vercel dependencies. Offline-first where feasible; world saves and export/import belong to the client. The browser is not a server. Performance on a real iPhone is a release gate, **not a claim implied by desktop tests**.

## Local development
The initial prototype is intentionally dependency-free. Open `index.html` with a static HTTP server, e.g. `python3 -m http.server 8000`. Run `npm test` for the Node built-in test suite. Later milestones may change internal technology only if acceptance tests are preserved.

**Versioning:** v0.01–v1.00; release numbers are planned targets, not automatically attained. The next release begins only after the current acceptance gate is met.
## Current implementation status — v0.09
- [Play the WebGL2 foundation prototype](https://hdog960.github.io/Mythwrought/) (landscape). Current art and terrain are engineering graphics with initial material detail and an original WebGL daytime sky; **not approved premium art**.
- Seeded 3D voxel terrain with deterministic separate world seeds and **durable prototype edit-delta journaling**: unchanged original schema-1 save keys plus checksum sidecar, previous-good backup, corruption recovery and explicit import conflict approval. Seamless chunk-border remeshing, grounded movement, protected handheld controls with corrected horizontal axes, 6-block MINE/PLACE, teal/amber world-space target previews and original procedural material shading remain intact.
- [Merged-main Node + Chromium CI passed](https://github.com/hdog960/Mythwrought/actions/runs/43084781057): **77/77 Node tests and seven Chromium suites** verifying schema-1 compatibility, independent seed slots, corruption/backup recovery, import consent and validation, exported file restoration, no unwanted page-exit save writes, and all prior world, two-thumb and mobile regressions.
- [GitHub Pages deployment and public HTML/JS HTTP check passed](https://github.com/hdog960/Mythwrought/actions/runs/43084781232) for the v0.09 merge commit.
- v0.10 Gate A remains **open** pending actual iPhone Safari/Home Screen testing, measurable long-run performance, production-scale save architecture and explicit premium art approval. No combat, companions, story or magic implemented yet.

### v0.10 Gate A device-evidence increment — **NOT GATE A APPROVAL**
- Open **☰ → GATE A · DEVICE CHECK → RUN DEVICE CHECK** in the existing Settings sheet. After some active landscape play, it reports frame intervals, frame/viewport clearance, active GPU chunks, saved-world consistency, separate temporary storage write/read/delete and browser quota estimate. **COPY REPORT** can share the measurements; no automatic server telemetry or world migration occurs.
- [Repaired merged-main verification PASS](https://github.com/hdog960/Mythwrought/actions/runs/43092123202): **82/82 Node tests and 8/8 Chromium suites**, including checks for the new diagnostic, compact landscape, journal recovery, original save preservation and repeated report refresh. [Pages and public HTML/JS publication PASS](https://github.com/hdog960/Mythwrought/actions/runs/43092122969). The failed initial main regression was fixed in [PR #10](https://github.com/hdog960/Mythwrought/pull/10); see [ledger](docs/RELEASE_LEDGER.md) for details.
- [Required manual iPhone test guide](docs/GATE_A_DEVICE_AUDIT.md). Actual iPhone Safari/Home Screen, thermal/endurance, production-scale IndexedDB persistence and premium art approval are **NOT complete**; release version remains v0.09 foundation while Gate A is open.


### v0.02 release verification
- [v0.02 merged PR #1](https://github.com/hdog960/Mythwrought/pull/1), merge commit `401e1df`.
- [Main CI run](https://github.com/hdog960/Mythwrought/actions/runs/42948496448): 12/12 Node tests, syntax and Chromium terrain interaction tests passed.
- [Main Pages release](https://github.com/hdog960/Mythwrought/actions/runs/42948496495): deploy and public HTML/JS fetch passed.
- Hardware iPhone and Gate A remain **not approved**. Prototype localStorage is **not production-grade persistence**.

### v0.03 release verification
- [Merged PR #2](https://github.com/hdog960/Mythwrought/pull/2), release implementation commit `0adbb31`.
- [Main CI](https://github.com/hdog960/Mythwrought/actions/runs/42956423673) passed **17/17** Node tests and headless Chromium browser smoke. Original GPU sky gradient, sun/cloud silhouettes, distant mountain bands, matching distance fog and saved camera sensitivity form a better landscape foundation, not the final art.
- [Pages publication](https://github.com/hdog960/Mythwrought/actions/runs/42956423659) successfully deployed and fetched public HTML and JS files.
- Browser screenshot is archived as `mythwrought-browser-smoke` workflow artifact in main CI. **No physical iPhone acceptance or premium art approval has occurred.**

### v0.04 release verification
- [Merged PR #3](https://github.com/hdog960/Mythwrought/pull/3), main implementation commit `2ad8e4e78c744d141f4abce3522552c80f8fb1ab`.
- [Main CI 42965722843](https://github.com/hdog960/Mythwrought/actions/runs/42965722843): **25/25 Node tests**, zero failures, automated Chromium WebGL layout/seed-edit screenshot smoke, and independent CDP-dispatched two-finger controls test (movement with look, stopping on finger lift, continuous-look mode, persisted preferences, hold precision, blur reset).
- [Pages publication 42965722891](https://github.com/hdog960/Mythwrought/actions/runs/42965722891): deployment and public HTML/JavaScript HTTP checks completed successfully.
- Saved worlds remain the same v0.02 localStorage slots and schema 1; *no migration or destructive reset*. **The localStorage save method is still prototype-only.**
- v0.04 is **NOT** a passed mobile-hardware/visual approval gate. Art remains nonfinal; real iPhone thermal, Safari touch and Home Screen persistence require testing.

### v0.05 release verification
- [Merged PR #4](https://github.com/hdog960/Mythwrought/pull/4), implementation merge commit `3e4ca3c56fc5c6a191ae046430e4f9b25ea3133a`.
- [Main CI 43030671792](https://github.com/hdog960/Mythwrought/actions/runs/43030671792): **29/29 Node tests**, WebGL scene/edit/save checks, simultaneous real Chromium touch interaction, and responsive browser geometry checks on 568×320, 667×375, 844×390, 932×430 and 1180×520 with footer/controls not clipped. Includes persisted large-controls and artificial safe-area inset checks.
- [Pages publication 43030672007](https://github.com/hdog960/Mythwrought/actions/runs/43030672007): merged main deployed; live public HTML/JavaScript retrieval verified.
- Screenshot assets `mythwrought-v005-small-landscape.png`, `mythwrought-v005-regular-landscape.png`, `mythwrought-v005-large-landscape.png` are in the main CI artifact `mythwrought-browser-smoke`. These prove layout screenshots, not user-approved premium fantasy artwork.
- No world save migration: the previous version's seed slots, localStorage schema and JSON exports remain compatible. Persistent IndexedDB migration and real iPhone testing remain open.

### v0.06 release verification
- [Merged PR #5](https://github.com/hdog960/Mythwrought/pull/5), implementation merge commit `c33948bc3955b2b3980562c5240c8dfc936652a6`.
- [Main CI 43036157896](https://github.com/hdog960/Mythwrought/actions/runs/43036157896): **43/43 Node tests**, existing 3 Chromium suites, and new **fourth** live movement/collision browser suite passed. Tests include ground contact, head clearance, safe respawning on edited terrain, 1-block steps, no two-block wall clipping, ledges, fall from mined floors, ceilings, jump landing, motion stop after finger release, slow-frame cap, world seeds and GPU chunk count.
- [Pages publication 43036157699](https://github.com/hdog960/Mythwrought/actions/runs/43036157699): successful static deployment and public HTML/JS retrieval.
- Browser screenshot `mythwrought-v006-walking-landscape.png` is available as `mythwrought-browser-smoke` workflow artifact on main CI. This is an engineering prototype screenshot, not premium visual approval.
- Physics is local, deterministic and compatible with existing world-save schema 1 and named-seed localStorage keys. No migration and no user terrain edits removed.
- **Still OPEN:** physical iPhone Safari/Home Screen control acceptance, production-safe IndexedDB/export integrity, long-session performance/thermal tests and premium original voxel-art acceptance.

### v0.07 release verification
- [Merged PR #6](https://github.com/hdog960/Mythwrought/pull/6), main implementation merge `2ba4254c61fd24312897059f60f6167d0f94e629`.
- [Merged-main CI 43062355962](https://github.com/hdog960/Mythwrought/actions/runs/43062355962): **50/50 Node tests**; **five Chromium suites** passed (landscape WebGL smoke, real dual-touch, five-sized responsive controls, positive/negative seam mine/place and streaming, live movement/landing).
- [Pages deployment 43062355830](https://github.com/hdog960/Mythwrought/actions/runs/43062355830): deployed and verified public HTML/JS. Verified browser screenshots of positive/negative seam travel are attached to the CI artifact `mythwrought-browser-smoke`.
- Adjacent **loaded** edge-chunk meshes are rebuilt and replaced in the same JavaScript event turn; off-screen meshes continue to load in bounded chunks. This is an interim approach rather than worker-based asynchronous mesh generation. Low-frequency world-coordinate tints help avoid visible color jumps between chunks.
- **Horizontal touch direction reversed on both sticks (swipe and continuous-stick look)** in response to player feedback; vertical axes and keyboard controls unchanged. The direction change has automated tests but still requires real iPhone acceptance.
- **Save compatibility:** unchanged schema 1, named-seed storage slots and local voxel edit deltas. **Still open:** physical iPhone Safari/Home Screen tests, thermal/resource profiling, production save safety, premium original voxel-art approval and Gate A.

### v0.08 release verification
- [Merged PR #7](https://github.com/hdog960/Mythwrought/pull/7); implementation merge SHA `8ab0eb094363b6815c2a4d69b345e0c0889b703a`.
- [Main CI 43076661825](https://github.com/hdog960/Mythwrought/actions/runs/43076661825): **61/61 passing Node tests** and **six passing headless Chromium suites**: core WebGL layout/editing, simultaneous two-thumb controls, five landscape sizes, x/z voxel seams, grounded movement and v0.08 interactive build tool tests.
- [Pages 43076661735](https://github.com/hdog960/Mythwrought/actions/runs/43076661735): deploy and public HTML/game JavaScript HTTP verification passed.
- v0.08 introduces pure side-effect-limited block interaction checks: 6-block reach, first-visible-voxel targeting, player-body exclusion, valid material whitelist, atomic restore of a changed voxel on mesh update failure. A world-space amber build preview is paired with a teal mine outline, with status/material/distance text in the right grip only.
- Original procedural stone/timber/crystal/ore surface treatments and palette buttons improved. Browser screenshot `mythwrought-v008-crystal-target.png` is archived in the `mythwrought-browser-smoke` CI artifact and has been visually inspected. **This is not user-approved premium art.**
- Existing schema-1 saved worlds, named seeds, chunk remesh behavior, build materials, and corrected left/right touch controls remain compatible. Full inventory, RPG, NPCs and world simulation are not part of v0.08.
- Hardware iPhone Safari/Home Screen comfort, performance/thermal tests, safe IndexedDB migration and **both Gate A and premium-art signoff remain OPEN**.

### v0.09 release verification
- [Merged PR #8](https://github.com/hdog960/Mythwrought/pull/8); implementation merge `af317c34ffc85dfc44a20ac3729eff90441f07e9`.
- [Merged-main CI 43084781057](https://github.com/hdog960/Mythwrought/actions/runs/43084781057): **77/77 Node tests**, **seven passing real Chromium suites** including the v0.09 browser recovery/import/export/seed-safety suite, unchanged landscape WebGL/movement/dual-thumb tests and 3D block editing.
- [Pages deployment 43084781232](https://github.com/hdog960/Mythwrought/actions/runs/43084781232): successful publication and public HTML/JS fetch verification.
- World edits continue to use the exact `mythwrought-v002-world-<seed>` JSON schema-1 slot. Verified checksum sidecars and previous-good backups protect the canonical original bytes. No migration, deletion or new paid backend. Damaged primary data can be recovered from journal/backup; user can export the original schema-1 JSON.
- Failed writes, broken imports and damaged selected worlds are explicitly warned about and never silently replaced with an empty world. Conflicting imported edits require consent. A real browser test caught an unnecessary `pagehide` rewrite of a damaged key, which was fixed before merge.
- Browser screenshot `mythwrought-v009-persistent-edits.png` is available from the CI workflow artifact and was inspected. It shows working prototype 3D building and unobstructed side controls, **not approved premium voxel art**.
- Still OPEN: IndexedDB/production save architecture, actual iPhone hardware controls/thermals/offline behavior, Gate A, and explicit user premium-art acceptance.
