// Citizen data is shared by isolated fixtures and future settlement adapters.
export const RACES = Object.freeze(Object.fromEntries([
  ['human', 'Human', false],
  ['elf', 'Elf', false],
  ['dwarf', 'Dwarf', false],
  ['thornkin', 'Thornkin', true],
  ['asteri', 'Asteri', true],
  ['glassborn', 'Glassborn', true],
].map(([id, name, provisional]) => [id, Object.freeze({id, name, provisional})])));

export const BIOMES = Object.freeze(['temperate', 'desert', 'snow', 'enchanted-forest', 'mountain']);
export const SETTLEMENT_STYLES = Object.freeze(['village', 'town', 'city']);

const biomeAliases = new Map([
  ['temperate', 'temperate'], ['standard', 'temperate'], ['plains', 'temperate'],
  ['desert', 'desert'], ['snow', 'snow'],
  ['enchanted', 'enchanted-forest'], ['enchantedforest', 'enchanted-forest'],
  ['enchanted-forest', 'enchanted-forest'], ['enchanted_forest', 'enchanted-forest'],
  ['mountain', 'mountain'], ['mountains', 'mountain'],
]);

export function citizenBiome(value) {
  const biome = typeof value === 'string' && biomeAliases.get(value.trim().toLowerCase().replaceAll(' ', '-'));
  if (!biome) throw new RangeError('Unknown citizen biome');
  return biome;
}

const defenders = new Set(['guard', 'watchman', 'soldier', 'ranger', 'gatekeeper']);

// Each row describes a career, compatible anchor tags, and its intended
// activity. An optional service dependency is documentation, not a grant
// to execute a transaction or a claim that the service is available.
const groups = [
  ['agriculture-food', [
    ['farmer', 'Farmer', ['crop-field', 'farm'], 'tend-crops', 'offer-crops', 'crop-production'],
    ['rancher', 'Rancher', ['ranch', 'livestock-pen'], 'tend-livestock', 'offer-animal-products', 'livestock-products'],
    ['shepherd', 'Shepherd', ['pasture', 'sheep-pen'], 'tend-herd', 'herd-information'],
    ['gardener', 'Gardener', ['garden', 'flower-bed'], 'tend-garden', 'garden-information'],
    ['greenhouse-grower', 'Greenhouse Grower', ['greenhouse', 'potting-bench'], 'tend-greenhouse', 'offer-plants', 'plant-production'],
    ['beekeeper', 'Beekeeper', ['apiary', 'beehive'], 'inspect-hive', 'offer-honey', 'beekeeping'],
    ['hunter', 'Hunter', ['hunting-post', 'hunting-blind'], 'inspect-hunting-post', 'offer-hunting-goods', 'hunting-goods'],
    ['fisherman', 'Fisherman', ['fishing-spot', 'fishing-dock'], 'fish', 'offer-fish', 'fishing'],
    ['miller', 'Miller', ['mill', 'millstone'], 'operate-mill', 'offer-flour', 'milling'],
    ['baker', 'Baker', ['bakery', 'baking-oven'], 'bake', 'offer-baked-goods', 'baking'],
    ['butcher', 'Butcher', ['butcher-shop', 'butcher-block'], 'prepare-cuts', 'offer-cuts', 'food-inventory'],
    ['brewer', 'Brewer', ['brewery', 'brew-kettle'], 'brew', 'offer-beverages', 'brewing'],
  ]],
  ['resources-craftsmanship', [
    ['miner', 'Miner', ['mine', 'mining-face'], 'inspect-mine', 'offer-mining-supplies', 'trade-inventory'],
    ['prospector', 'Prospector', ['ore-survey', 'assay-bench'], 'survey-ore', 'ore-information'],
    ['quarry-worker', 'Quarry Worker', ['quarry', 'quarry-bench'], 'split-stone', 'quarry-information'],
    ['lumberjack', 'Lumberjack', ['logging-yard', 'sawhorse'], 'work-timber', 'offer-timber', 'trade-inventory'],
    ['forester', 'Forester', ['forest-nursery', 'sapling-bed'], 'tend-woodland', 'woodland-information'],
    ['blacksmith', 'Blacksmith', ['forge', 'anvil'], 'hammer-metal', 'offer-tools', 'trade-inventory'],
    ['armorer', 'Armorer', ['armory', 'armoring-bench'], 'fit-armor', 'offer-armor', 'armor-inventory'],
    ['carpenter', 'Carpenter', ['carpentry-shop', 'carpentry-bench'], 'shape-wood', 'offer-wood-products', 'trade-inventory'],
    ['stonemason', 'Stonemason', ['masonry-yard', 'stonecutter'], 'dress-stone', 'offer-stonework', 'trade-inventory'],
    ['potter', 'Potter', ['pottery-shop', 'pottery-wheel'], 'shape-clay', 'offer-pottery', 'trade-inventory'],
    ['glassmaker', 'Glassmaker', ['glassworks', 'glass-furnace'], 'shape-glass', 'offer-glass', 'trade-inventory'],
    ['tailor', 'Tailor', ['tailor-shop', 'sewing-bench'], 'stitch-cloth', 'offer-clothing', 'clothing-inventory'],
    ['jeweler', 'Jeweler', ['jewelry-shop', 'jewelry-bench'], 'set-jewels', 'offer-jewelry', 'jewelry-inventory'],
  ]],
  ['commerce-hospitality', [
    ['general-merchant', 'General Merchant', ['general-store', 'merchant-counter'], 'attend-counter', 'offer-general-goods', 'trade-inventory'],
    ['market-vendor', 'Market Vendor', ['market-stall'], 'attend-stall', 'offer-stall-goods', 'trade-inventory'],
    ['caravan-trader', 'Caravan Trader', ['caravan-stop', 'trader-stall'], 'attend-caravan', 'offer-caravan-goods', 'trade-inventory'],
    ['banker', 'Banker', ['bank', 'bank-counter'], 'attend-bank', 'bank-service', 'banking'],
    ['moneychanger', 'Moneychanger', ['exchange-desk'], 'attend-exchange', 'exchange-currency', 'currency'],
    ['innkeeper', 'Innkeeper', ['inn', 'inn-desk'], 'attend-inn', 'offer-lodging', 'lodging'],
    ['tavern-keeper', 'Tavern Keeper', ['tavern', 'tavern-bar'], 'attend-tavern', 'offer-tavern-goods', 'trade-inventory'],
    ['cook', 'Cook', ['kitchen', 'cookstove'], 'cook-meal', 'offer-meals', 'food-inventory'],
    ['stablekeeper', 'Stablekeeper', ['stable', 'hitching-post'], 'tend-stable', 'mount-services', 'mount-services'],
    ['pet-shopkeeper', 'Pet Shopkeeper', ['pet-shop', 'pet-counter'], 'attend-pets', 'offer-pet-goods', 'animal-goods'],
    ['bathhouse-attendant', 'Bathhouse Attendant', ['bathhouse', 'bathhouse-desk'], 'attend-bathhouse', 'bathhouse-information'],
  ]],
  ['government-administration', [
    ['mayor', 'Mayor', ['civic-hall', 'mayor-desk'], 'attend-civic-hall', 'settlement-information'],
    ['councilor', 'Councilor', ['civic-hall', 'council-seat'], 'attend-council', 'council-information'],
    ['clerk', 'Clerk', ['records-office', 'clerk-desk'], 'check-records', 'records-information'],
    ['treasurer', 'Treasurer', ['treasury', 'treasury-desk'], 'check-ledger', 'treasury-services', 'treasury'],
    ['judge', 'Judge', ['courthouse', 'judgment-seat'], 'read-case', 'courthouse-information'],
    ['diplomat', 'Diplomat', ['embassy', 'reception-room'], 'attend-reception', 'diplomacy-information'],
    ['guildmaster', 'Guildmaster', ['guildhall', 'guild-desk'], 'attend-guild', 'guild-information'],
    ['town-planner', 'Town Planner', ['planning-desk', 'map-table'], 'review-plans', 'planning-information'],
    ['messenger', 'Messenger', ['message-post', 'delivery-anchor'], 'visit-message-points', 'deliver-message', 'message-delivery'],
  ]],
  ['defense-transportation', [
    ['guard', 'Guard', ['guard-post', 'patrol-point'], 'patrol', 'guard-information'],
    ['watchman', 'Watchman', ['watch-post', 'watchtower'], 'keep-watch', 'watch-information'],
    ['soldier', 'Soldier', ['barracks', 'military-post'], 'guard-post', 'military-information'],
    ['ranger', 'Ranger', ['ranger-post', 'edge-patrol'], 'patrol-edge', 'ranger-information'],
    ['scout', 'Scout', ['scout-post', 'lookout'], 'visit-lookout', 'scout-information'],
    ['gatekeeper', 'Gatekeeper', ['gate-post', 'gatehouse'], 'watch-gate', 'gate-information'],
    ['animal-handler', 'Animal Handler', ['animal-yard', 'handling-pen'], 'tend-animals', 'animal-information'],
    ['dockworker', 'Dockworker', ['dock', 'cargo-station'], 'handle-cargo', 'dock-information'],
    ['sailor', 'Sailor', ['ship-berth', 'dock'], 'attend-berth', 'sailing-information'],
    ['lighthouse-keeper', 'Lighthouse Keeper', ['lighthouse', 'beacon-station'], 'inspect-beacon', 'lighthouse-information'],
  ]],
  ['healing-education-knowledge', [
    ['healer', 'Healer', ['infirmary', 'healing-station'], 'attend-infirmary', 'heal-player', 'player-health'],
    ['apothecary', 'Apothecary', ['apothecary', 'medicine-counter'], 'prepare-medicine', 'offer-medicine', 'medicine-inventory'],
    ['herbalist', 'Herbalist', ['herb-bench', 'herb-garden'], 'sort-herbs', 'offer-herbs', 'trade-inventory'],
    ['teacher', 'Teacher', ['classroom', 'teaching-desk'], 'teach', 'lesson-information'],
    ['librarian', 'Librarian', ['library', 'reading-desk'], 'sort-books', 'library-information'],
    ['archivist', 'Archivist', ['archive', 'records-shelf'], 'catalog-records', 'archive-information'],
    ['scholar', 'Scholar', ['study', 'study-desk'], 'study', 'scholarly-information'],
    ['astronomer', 'Astronomer', ['observatory', 'telescope'], 'observe-sky', 'sky-information'],
    ['cartographer', 'Cartographer', ['mapping-station', 'map-table'], 'draw-map', 'map-information'],
  ]],
  ['magic-arcane', [
    ['mage', 'Mage', ['arcane-station', 'mage-study'], 'study-arcana', 'arcane-information'],
    ['alchemist', 'Alchemist', ['alchemy-station'], 'mix-reagents', 'offer-alchemy-goods', 'alchemy-inventory'],
    ['potion-maker', 'Potion Maker', ['potion-bench', 'brew-kettle'], 'prepare-potion', 'offer-potions', 'potion-inventory'],
    ['enchanter', 'Enchanter', ['enchanting-station'], 'inspect-enchantment', 'enchant-item', 'enchanting'],
    ['arcane-researcher', 'Arcane Researcher', ['arcane-lab', 'research-desk'], 'record-arcane-observation', 'research-information'],
    ['crystal-attuner', 'Crystal Attuner', ['crystal-station', 'attunement-bench'], 'inspect-crystal', 'attune-crystal', 'resonance'],
    ['arcane-teacher', 'Arcane Teacher', ['arcane-classroom'], 'teach-arcana', 'arcane-lesson-information'],
    ['magical-creature-keeper', 'Magical Creature Keeper', ['magical-creature-pen', 'creature-sanctuary'], 'tend-magical-creature', 'magical-creature-information'],
  ]],
  ['culture-construction-utilities', [
    ['actor', 'Actor', ['stage', 'theater'], 'perform-scene', 'performance-information'],
    ['musician', 'Musician', ['stage', 'music-stand'], 'play-instrument', 'music-information'],
    ['temple-keeper', 'Temple Keeper', ['temple', 'temple-shrine'], 'tend-shrine', 'temple-information'],
    ['priest', 'Priest', ['temple', 'temple-lectern'], 'attend-lectern', 'temple-dialogue'],
    ['artist', 'Artist', ['artist-studio', 'easel'], 'paint', 'offer-art', 'trade-inventory'],
    ['builder', 'Builder', ['construction-yard', 'workbench'], 'inspect-building-materials', 'offer-building-supplies', 'trade-inventory'],
    ['architect', 'Architect', ['architecture-office', 'drafting-desk'], 'draft-plan', 'architecture-information'],
    ['engineer', 'Engineer', ['engineering-station', 'machine-bench'], 'inspect-equipment', 'equipment-services', 'equipment-services'],
    ['shipwright', 'Shipwright', ['shipyard', 'keel-bench'], 'inspect-hull', 'shipwright-information'],
    ['resonance-technician', 'Resonance Technician', ['resonance-station', 'resonance-workbench'], 'inspect-resonance-device', 'maintain-resonance', 'resonance'],
  ]],
];

export const PROFESSIONS = Object.freeze(Object.fromEntries(groups.flatMap(([group, rows]) =>
  rows.map(([id, name, workplaceTags, activity, interaction, dependency = null]) => [id, Object.freeze({
    id, name, group, workplaceTags: Object.freeze(workplaceTags), activity, interaction, dependency,
    threatResponse: defenders.has(id) ? 'defend' : 'flee',
  })]),
)));
