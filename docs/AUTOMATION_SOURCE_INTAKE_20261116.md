# Automation source intake — 2026-11-16

**Status:** isolated, test-gated creator-authorized automation-only source integration. No automatic world placement, live registry assignments, biome activation, or saved-world changes.

Baseline main: `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`. Source inputs are exact draft PR source/test blobs: #171, #176, #188, #189, #190, #191, #192, #193, #194, #195, #197, #198, #199, #196. Automation lane :12 contributes symbolic physical asset families **biome130:071–130** (60 families), using isolated catalog source modules and their source-specific tests. Automation lane :00 contributes the opt-in `shape-edit-transaction` edit safety adapter with its focused test; no host hookup.

The root Node test bridge `tests/auto-catalog-intake-20261116.test.mjs` executes every added nested catalog and edit-adapter test under normal `npm test`; this integration is classified as shared and must pass the complete 20-browser production gate before merging.

**Not player-visible / deferred:** The game cannot place or save provisional numeric IDs 326–385 without independently verified widened-ID persistence, shape-aware meshing/picking/collision, transparent foliage rendering, and production registration. Families 001–070 already on main must not be overwritten. :24 region changes, :36 deep-cave traversal and :48 canopy visual cleanup explicitly remain not-ready for live hookup. No manual Block Pack 1–5, building pool, Creative Mode, automations, control rails, minimap, saves, or release gates may be modified.

**Safety gate:** Do not merge if any exact-head checks fail, main moved with relevant overlaps, or any added family has a duplicate symbolic ID. Keep v0.10 Gate A open and v0.11 locked.
