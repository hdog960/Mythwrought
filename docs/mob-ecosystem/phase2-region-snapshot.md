# Source-read-only original MobEngine regional snapshot bridge

**Detached candidate research ONLY.** Added `src/mobs/ecosystem-region-snapshot.mjs` and focused tests. There are no live MobEngine / PopulationManager imports or runtime changes.

The original PopulationManager counts species only among entities whose `homeChunk` equals the active `cx,cz,section`, excluding `important` or original `isProtected` entities. It still treats every active roster entity as occupying physical space, including protected or foreign-home creatures. The new `deriveRegionalMobState` mirrors those **actual original source rules** on one supplied real `MobEngine.all()` snapshot, rejecting missing/forged source species references, duplicate IDs, unsafe positions or unknown protection. An explicitly full 32-entity live roster rejects another spawn, even when every mob is important.

The returned occupancy list and inner coordinates are independent frozen copies; the local counts Map is a fresh temporary scratch object, NOT an immutable shared store. The wrapper `proposeMobFromRosterSnapshot` consumes one source roster to call the isolated six-attempt candidate evaluator and returns only a proposed, not spawned, mob. It never saves, mutates the engine, grants residency, edits terrain or bypasses original M7 geometry.

The original seed179 natural birth census (1308 attempts/18 births) is historical only; no new births are asserted. Before any release requires actual full-repo native Node and genuine new-head M7 five biome/two cave comparisons, real natural birth gate, unchanged saves and offline PWA acceptance.
