# Connecting settlement citizens

Use the isolated preview at `citizen-preview/settlement.html` for development. The appearance gallery is at `citizen-preview/`. Both use local modules and the existing WebGL2 creature meshes. Neither is linked from the game.

## Settlement input

A settlement owner supplies `id`, `name`, `type`, `biome`, `populationLimit`, and one or more safe `regions` described by minimum and maximum X and Z coordinates. Supply `housing` entries with stable IDs and standing positions, and `workplaces` with stable IDs, this settlement's ID, compatibility tags, standing positions and optional labels. A patrol, scout or messenger workplace can also supply bounded `waypoints`. Optional `gathering` positions help citizens return after a deliberate relocation.

Call `planSettlementCitizens` with the world seed, settlement, the game's shape-aware world query and an array of `{slot, race, profession, variant?, homeId?}` requests. Use stable slots from the layout. Supply `profession: null` for ordinary citizens and use `ordinaryAppearancePool` to choose the 10 base appearances for a biome. The planner admits workers only where it verifies compatible, physically reachable anchors. Housing access points and compound routes longer than the game's existing local navigator limit need layout-owner metadata when the real settlement arrives.

Keep one simulation per loaded settlement. Use `add` for planned or restored records, `assign` for player-approved workplaces, and `removeWorkplace` when an anchor disappears. Tick `step` at a bounded rate and pass the player position as the optional focus. Send nearby snapshots to the renderer using the game's camera and depth state. Unload by saving `snapshots()` and releasing the simulation and renderer when their owner leaves scope. Spawn frequency, housing counts, permanent death, recovery, and population distribution are settlement-owner decisions.

## Creature and interaction integration

Pass the current `MobEngine` to the simulation. The citizen runtime reads real hostile identities, uses the current world query for sight and collision, and submits eligible damage to the same engine. The mob combat owner can use `combatTarget(id)` for a nearby citizen when it chooses an appropriate target. The fixture uses one target per existing combat tick and leaves the established 40-creature roster intact.

The player host owns input and opens `interact` after resolving a selected citizen. The simulation checks player range, line of sight, citizen health and current threats. The snapshot gives the selected citizen's identity, career, and available conversation. A playable service requires a workplace and an authoritative `jobHost.services[serviceId]` handler. Workstation actions can receive separate trusted `jobHost.activities[activityId]` handlers. Both run locally and must respect the owning game system's validation.

## Services awaiting a host

The registry identifies the exact dependency for every deferred service. Item trades require a real transaction or inventory owner. Banking, currency exchange, lodging, food production, crop and animal products, fishing and healing require their corresponding gameplay APIs. The current live health API exposes revival, so ordinary healing awaits a bounded health operation. Enchanting, potion and Resonance services need the relevant owners. Citizen animations and workplace activity do not create items, credits, edits or machine effects. The astronomer can report the supplied game clock, and the mayor can report actual settlement and civic anchor information.

The 43 careers below have a deferred transaction or effect. All 82 can reach compatible work markers and respond to the player. The other 39 have no transactional backend requirement in this draft.

| Host capability | Careers |
| --- | --- |
| `alchemy-inventory` | Alchemist |
| `animal-goods` | Pet Shopkeeper |
| `armor-inventory` | Armorer |
| `baking` | Baker |
| `banking` | Banker |
| `beekeeping` | Beekeeper |
| `brewing` | Brewer |
| `clothing-inventory` | Tailor |
| `crop-production` | Farmer |
| `currency` | Moneychanger |
| `enchanting` | Enchanter |
| `equipment-services` | Engineer |
| `fishing` | Fisherman |
| `food-inventory` | Butcher, Cook |
| `hunting-goods` | Hunter |
| `jewelry-inventory` | Jeweler |
| `livestock-products` | Rancher |
| `lodging` | Innkeeper |
| `medicine-inventory` | Apothecary |
| `message-delivery` | Messenger |
| `milling` | Miller |
| `mount-services` | Stablekeeper |
| `plant-production` | Greenhouse Grower |
| `player-health` | Healer |
| `potion-inventory` | Potion Maker |
| `resonance` | Crystal Attuner, Resonance Technician |
| `trade-inventory` | Miner, Lumberjack, Blacksmith, Carpenter, Stonemason, Potter, Glassmaker, General Merchant, Market Vendor, Caravan Trader, Tavern Keeper, Herbalist, Artist, Builder |
| `treasury` | Treasurer |

## Persistence and acceptance

Use `loadCitizenState` and `saveCitizenState` with the world seed and settlement ID. They use a versioned, checksummed sidecar and previous-good recovery. The records contain identity, career, appearance, home, workplace, position and health. Restore only currently safe positions. For a blocked saved position, the settlement owner supplies a safe fall-back anchor and preserves the citizen's identity. Schema-1 terrain storage and the established creatures' sidecar remain independent.

Run `node --test tests/citizens-*.test.mjs` for the role, navigation, combat, and persistence checks. Use the browser scripts in `scripts/ci/` for WebGL2 visual evidence, touchscreen-sized fixture interactions and stress tiers. Chromium evidence supports the draft handoff. Physical iPhone frame timing and final performance in real generated settlements remain device and integration acceptance tasks.
