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
## Current implementation status — v0.04
- [Play the WebGL2 foundation prototype](https://hdog960.github.io/Mythwrought/) (landscape). Current art and terrain are engineering graphics with initial material detail and an original WebGL daytime sky; **not approved premium art**.
- Seeded 3D voxel terrain with repeatable named/numeric seeds and independent saved worlds, priority-bounded chunks, original atmospheric shader and prototype material detail, independent dual-thumb controls with swipe/stick aim, fine aiming hold, exact voxel DDA targeting with world-space selection outline, jumping, mine/place blocks and JSON backup import/export.
- [Node + Chromium CI passed](https://github.com/hdog960/Mythwrought/actions/runs/42965722843): **25/25 Node tests**, syntax, screenshot rendering, real two-thumb camera/movement, swipe/stick aim, precision hold, blur cancellation, input focus, seeded saves, mining, chunk rebuilding and nonblank composited screenshot.
- [GitHub Pages deployment and public HTTP check passed](https://github.com/hdog960/Mythwrought/actions/runs/42965722891) for the v0.04 merge commit.
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
