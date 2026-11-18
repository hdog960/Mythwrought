# Roadmap A3 — fail-closed physical remediation decisions (read-only)

**Status:** Isolated draft branch only. No repair approval, no physical placement, no original 3A design edit, no game integration. This document is a handoff for later separately authorized manual/engineering review, not an acceptance or proof of structural capacity.

New source-exact classifier: `src/building-pool/roadmap-3a/a3-readonly-risk-disposition.mjs`, backed by the accepted four-yaw physical producer matrix and dedicated native tests.

| Priority | Producer/source cases | Required before any placement |
|---|---|---|
| P0 — smoke-lumen collision | **60 of 120** tested four-yaw fireplace/chimney mounting cases overlap the **reserved hollow-flue AABB** | Independent oriented layout; exclude any obstructing solids; heat, smoke movement, weather sealing and cap flashing review |
| P1 — source support absent | **118 of 120** mounted fixture orientations lack at least one source-authored required support offset | Real Pack4 physical box and mounting point, oriented wall/pier rear support, load, connection and room clearance; an apparently supported yaw is **not** approval |
| P1 — new roof-bearing beams | **156 distinct** third-variant *unplaced* beam positions, **624** four-yaw read-only physical producer checks | Source-specific immediate bearing and continuous load path missing; full assemblies, roof pitch and overhang, headroom, stairs/corridors and fire exclusion must all be independently approved |
| P2 — historic roof witness samples | **274** sampled roof positions (33 M2 fourth; 118 M2 fifth; 83 M3 second; 40 M3 third) lacking a nearby heuristic witness | Separate source structural trace and real roof-weather engineering; these are **not automatically 274 proven failures** |

## Hard gates

- Every one of the 30 legacy Pack4 fireplace/chimney **source fixtures** remains unresolved; group each fixture into four yaw alternatives and record which have missing producer support offsets, flue intersections or symbolic-neighbor proxy uncertainty.
- Every one of the 156 proposed Pack2 beam positions must remain uninstalled. A temporary shape-clear spot is not a bearing anchor, and **0** direct flue/walkway overlaps in prior candidate checks is not an engineering certificate.
- Preserve the exact 345 original Builder 3A building fingerprints, protected PR #183 and original PR #122. Never fill the functional hollow chimney lumen, block passages, place thermal-adjacent masonry, alter roof geometry or silently edit existing producer boxes.
- The producer audit tests actual read-only Manual Five Pack collision/occupied/support offsets where available. Nearby plain source cubes may still be conservative collision stand-ins; assembly can reveal conflicts the static checks miss.
- No actual iPhone device check, live world placement, schema-1 save alteration, structural-capacity certificate, thermal/weather load signoff, official physical ABI acceptance or creator art approval is implied.
- Separate explicit creator authorization is required **before** any physical source insertion, repair PR merge, production registration or Pages deployment.

## Next specific work

For each of the 60 flue-crossing yaw cases, decide whether the visual fixture attachment should be entirely rejected or whether a separately supported offset location could keep the entire smoke lumen empty. Investigate 118 lacking supports with real producer-facing anchor proposals without writing their source; reject unproved alternatives. For the 156 beams, require a full support path through actual authored wall/roof structure to underlying foundations; nearby beam proximity alone is not proof. For the 274 roof samples, classify false negatives versus real load-path missing evidence. Report conflicts and ask separate explicit approval before placing anything.
