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
## Current implementation status — v0.07
- [Play the WebGL2 foundation prototype](https://hdog960.github.io/Mythwrought/) (landscape). Current art and terrain are engineering graphics with initial material detail and an original WebGL daytime sky; **not approved premium art**.
- Seeded 3D voxel terrain with named/numeric seeds and isolated saves; correct adjacent chunk-boundary face culling; atomic remeshing of loaded neighbors after edge edits; world-space terrain coloring; bounded chunk streaming/GPU disposal; original sky; dedicated side-grip thumb controls with corrected horizontal axes; full-body collision, grounded movement, real mining/placement and JSON save backup/export.
- [Node + Chromium CI passed](https://github.com/hdog960/Mythwrought/actions/runs/43062355962): **50/50 Node tests and five Chromium suites**, covering seam topology, real mining and placement across positive/negative chunk borders, cross-chunk streaming and save reload, horizontally corrected touch controls and preserved vertical input, plus the existing movement, rendering and mobile-layout regressions.
- [GitHub Pages deployment and public HTML/JS HTTP check passed](https://github.com/hdog960/Mythwrought/actions/runs/43062355830) for the v0.07 merge commit.
- Gate A remains **open** pending actual iPhone Safari/Home Screen hardware testing, stronger save architecture and premium art approval. No combat, companions, story or magic implemented yet.

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
