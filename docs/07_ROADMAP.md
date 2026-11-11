# Authority 07 — 100-release roadmap and gates
**Status:** planned milestones, NOT completed claims. Each entry needs actual work + tests. Initial numbering is v0.01…v0.99 then v1.00.

## Governance
Complete milestones sequentially unless user approves reordering, with independently verified git commits, tests, ledger and deployment. A release is not completed merely by writing code. No fake ETA, “100% complete” or unreviewed art approval. Each milestone must have at least a checkable behavior, reproducible test and honest ledger note. Larger feature completion can require multiple development sessions; version numbers are not promises of equal work. Gates (v0.10, v0.20, …, v1.00) are acceptance reviews, not automatic promotions. In particular, premium art gate always needs real visual evidence and player approval. All authority docs stay synchronized when design changes.

## Priorities
1. Prove authentic 3D editable voxel performance, persistent edits, and unobstructed landscape iPhone controls.
2. Prove authored/procedural world coexistence and premium stylized visual direction BEFORE multiplying content.
3. Add combat, quests and companions as real world features, then enrich underground, automation and settlements.
4. Validate security/integrity, long-session stability and owner-approved artistic quality continually.


### Phase 1: Core voxel renderer & safety

| Release | Deliverable | Evidence required |
|---|---|---|
| v0.01 | Static website and pixel-art framing | Page opens with correct layout and no missing imports |
| v0.02 | Deterministic terrain seed | Same seed produces same heights across reloads |
| v0.03 | First WebGL landscape | Visible 3D voxel terrain and sky render |
| v0.04 | Mouse/touch camera | Look controls alter view without scrolling |
| v0.05 | Landscape side grips | Movement/look widgets outside central view |
| v0.06 | 3D movement & collision | Hero walks and cannot fall through solid blocks |
| v0.07 | Chunk boundaries | Adjacent chunks join without seams |
| v0.08 | Basic block interactions | Player can remove and place eligible blocks |
| v0.09 | Persistent edit deltas | Block changes remain after reload |
| v0.10 | Foundation Gate A | Automated/browser/iPhone control and save checks documented |

### Phase 2: Terrain, caves and survival foundation

| Release | Deliverable | Evidence required |
|---|---|---|
| v0.11 | Chunk-streaming radius | Camera travel loads/unloads bounded chunks |
| v0.12 | Multi-biome surfaces | Visibly distinct terrain palettes and generation |
| v0.13 | Cave entrances | Connected openings into underground stone |
| v0.14 | Deep cavern silhouettes | Large cave volume with distance culling |
| v0.15 | Starter ores by depth/biome | Block ore placement repeatable per seed |
| v0.16 | Basic fluid sources | Water flows boundedly from sources |
| v0.17 | Lava, freezing and drainage | Coherent heat/frost/drain interactions |
| v0.18 | Save and backup export | Download/restore complete seed and edits |
| v0.19 | Night/day and visual controls | User-adjustable brightness and visibility |
| v0.20 | World Gate B | World editing, caves, fluid and iPhone test pass |

### Phase 3: Construction and life

| Release | Deliverable | Evidence required |
|---|---|---|
| v0.21 | Crafting basics | Recipes consume actual inputs |
| v0.22 | Fantasy block palette | Roofs, beams, trims and arches place cleanly |
| v0.23 | Placement ergonomics | Mobile editing targeting/undo is usable |
| v0.24 | Doors and windows | Functional interactive building elements |
| v0.25 | Home recognition | Furniture/access determine viable dwelling |
| v0.26 | 3D blueprint capture | Existing structure copied with boundaries |
| v0.27 | Virtual blueprint editor | Place/mirror/rotate/edit preview without materials |
| v0.28 | Blueprint build validation | Bills, conflicts and phased construction |
| v0.29 | Farming and irrigation | Crops respond to actual environmental state |
| v0.30 | Building Gate C | Premium building visuals plus save/performance test |

### Phase 4: Character, combat, magic

| Release | Deliverable | Evidence required |
|---|---|---|
| v0.31 | Hero creation | Ancestry, appearance and backgrounds persist |
| v0.32 | Combat hand equipment | Valid weapon/shield/spell combinations |
| v0.33 | Melee responsiveness | Hits, recovery and enemy reaction readable |
| v0.34 | Defense and telegraphs | Shield, enemy windups and positioning usable |
| v0.35 | Archery/projectiles | Aim and ranged hit validated |
| v0.36 | Enemy families | Distinct authored attack signatures |
| v0.37 | Magic essences | Basic modular essence/forms/modifiers |
| v0.38 | Environmental spells | Water/frost/earth interact with voxels |
| v0.39 | Death Echo transactions | Multiple persistent echoes restore exactly once |
| v0.40 | Combat Gate D | Touch ergonomics and real combat acceptance |

### Phase 5: NPCs, companions and relationships

| Release | Deliverable | Evidence required |
|---|---|---|
| v0.41 | Authored starting settlement | Village fits deterministic terrain |
| v0.42 | Conversation and journal | Dialogue persists choices and notes |
| v0.43 | Resident schedules | Work/home/community routines within active radius |
| v0.44 | Functional jobs | Approved assignments consume only assigned resources |
| v0.45 | Terraria-like arrival | Homes, unlocks, rescue and invitation states |
| v0.46 | Major companion recruitment | First deep companion joins via authored quest |
| v0.47 | Companion follow and stance | Follow/wait/combat without unapproved edits |
| v0.48 | Second active companion | Party cap two and bench/return home |
| v0.49 | Companion dialogue and trust | Context, postponement, memory and platonic bonds |
| v0.50 | Inhabitants Gate E | NPC pathing in edited settlement and mobile validated |

### Phase 6: Underground world & ecology

| Release | Deliverable | Evidence required |
|---|---|---|
| v0.51 | Massive cave geography | Seamless large vertical cavern profiles |
| v0.52 | Dark vs luminous biomes | Strong readable lighting contrasts |
| v0.53 | Underground settlement generator | Several physically reachable civic styles |
| v0.54 | Deep political hubs | Authored major city integrates generated world |
| v0.55 | Trade routes and roads | Passable routes support eligible caravans |
| v0.56 | Wildlife senses | Light, sound and movement influence behavior |
| v0.57 | Rare terrain burrowers | Bounded digging only unprotected natural blocks |
| v0.58 | Sanctuaries and trust | Organic suitability + optional named protection |
| v0.59 | Rescue and caretakers | Selective humane relocation, approved chores |
| v0.60 | Depths Gate F | Surface/deep transit seamless; NPC and memory budget met |

### Phase 7: Runic construction & automation

| Release | Deliverable | Evidence required |
|---|---|---|
| v0.61 | Energy conduit grammar | Source/consumption and power losses consistent |
| v0.62 | Signal runes and switches | Sensors, timers, conditions, activation |
| v0.63 | Visible/hidden wiring | Runic Sight exposes concealed conduit status |
| v0.64 | Wireless relay crystals | Bounded paired relay separate from portals |
| v0.65 | Sorting and item logistics | Items conserved across routes/storage |
| v0.66 | Smeltery and workshops | Recipes + power produce exact outputs |
| v0.67 | Automated agriculture | Harvest/irrigation with permissions |
| v0.68 | Mining zone planner | Bounded 3D quarry respects sanctuary/story zones |
| v0.69 | Companion magical build assist | Material-consuming placement follows blueprint exactly |
| v0.70 | Engineering Gate G | Circuit loop/resource duplication safeguards verified |

### Phase 8: Settlements & daily living

| Release | Deliverable | Evidence required |
|---|---|---|
| v0.71 | Settlement charter & zoning | Flexible homes/jobs/visitor permissions |
| v0.72 | Surface-deep trading | Player-built navigable routes enable trade agreements |
| v0.73 | Fishing and aquarium | Accessible minigame and owned aquatic display |
| v0.74 | Cooking and recipes | Food crafted with varied bonuses, no forced hunger |
| v0.75 | Livestock and pets | Selective compatible species and care |
| v0.76 | Town architecture sets | Distinct regional furniture and cultural building |
| v0.77 | NPC community dynamics | Lightweight social and relationship states |
| v0.78 | Sanctuary town integration | Visitors naturalists and controlled care |
| v0.79 | Map and portal travel | Atlas-selected ground portal and named anchors |
| v0.80 | Living World Gate H | A working optional village survives long-play test |

### Phase 9: Authored campaign and endgame

| Release | Deliverable | Evidence required |
|---|---|---|
| v0.81 | Traveler opening narrative | Background-specific motives and village cast |
| v0.82 | Regional resource conflict | Engineer/naturalist/scholar dispute has consequences |
| v0.83 | Underground civil conflicts | Competing deep societies develop authored quests |
| v0.84 | Companion personal arcs | Companion story choices and fallout |
| v0.85 | Factions and reputation | Nonbinary regional reactions persistent |
| v0.86 | Ancient magic discovery | Buried history revealed by exploration |
| v0.87 | Forbidden magic dilemmas | Consequences clearly previewed before commitment |
| v0.88 | World-scale decision branches | Meaningful viable major resolutions |
| v0.89 | Endgame follow-through | World supports play after main ending |
| v0.90 | Story Gate I | Narrative/campaign state and decisions independently QAed |

### Phase 10: Polish, reliability, launch

| Release | Deliverable | Evidence required |
|---|---|---|
| v0.91 | Art cohesion pass | Original character/terrain/architecture consistency |
| v0.92 | Animation/telegraph polish | No unreadable action language on iPhone |
| v0.93 | Audio and accessibility | Contrast/motion/controls/audio preferences verified |
| v0.94 | Long-run persistence audit | Fuzz test saves, migrations, backups and echoes |
| v0.95 | Large world stress test | Memory budgets across caves and settlements |
| v0.96 | Construction simulation stress | Bounded fluids/automation under changing terrain |
| v0.97 | Full campaign playtest | No softlocks in authored/procedural variants |
| v0.98 | PWA and offline verification | Install, update and backup paths tested |
| v0.99 | Release candidate and user gate | All authority acceptance evidence + approval |
| v1.00 | v1.00 ship gate | Only publish polished verified playable launch with user approval |

## Invariants tested at every gate
Same-seed stable generation; block edit persistence; no blank-screen regressions; central viewport never covered by touch controls; no silent resource duplication or deletion; saved data backwards-compatible; normal gameplay and animation continue after failures; no unsupported “deployed” or device-performance claim.

## Current reality
The first implemented release must be explicitly marked with its actual commit/test/deploy evidence in RELEASE_LEDGER.md. No roadmap item is implementation evidence.