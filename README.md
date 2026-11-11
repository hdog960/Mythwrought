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
## Current implementation status — v0.01
- [Play the WebGL2 foundation prototype](https://hdog960.github.io/Mythwrought/) (landscape). Current art and terrain are placeholder engineering graphics, **not approved premium art**.
- Seeded 3D voxel terrain, bounded chunk meshes, side-grip movement/look controls, jump, mine/place stone/wood/crystal, local edited-block persistence and JSON backup import/export.
- [Node + Chromium CI passed](https://github.com/hdog960/Mythwrought/actions/runs/42945013621): seven pure-model tests, syntax validation, rendered browser viewport, grip boundaries, live mining interaction and saved world-edit assertion.
- [GitHub Pages deployment and public HTTP check passed](https://github.com/hdog960/Mythwrought/actions/runs/42945013696).
- Gate A remains **open** pending actual iPhone Safari/Home Screen hardware testing, stronger save architecture and premium art approval. No combat, companions, story or magic implemented yet.
