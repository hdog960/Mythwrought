// Age of Beasts AB0/AB1 isolated contract; NOT imported by production runtime.
// Approved identities and habitat requirements are planning/validation metadata,
// not implemented creatures, spawn authority, renderer assets or qualification.
export const BIOMES=Object.freeze(["meadow","desert","snow","forest","alpine","cave"]);
export const ORIGINAL_IDS=Object.freeze(["cow","sheep","pig","chicken","horse","deer","rabbit","fox","mountain-goat","wolf","duskhorn","moonmoth","glassback","frosthorn","mossback","sunskipper","cloudfinch","glownewt","reedwhisker","emberwing","zombie","skeleton","giant-spider","goblin","slime","wraith","troll","harpy","mimic","gargoyle","shardmaw","thornwraith","hollowbound","sandstalker","frostwraith","stoneclaw","gloomcrawler","ashfang","briarlurker","voidmoth"]);
export const APPROVED=Object.freeze([
  {
    "id": "bison",
    "displayName": "Bison",
    "biome": "meadow",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "open-grass",
      "ground",
      "large-clearance"
    ],
    "abilities": [
      "herd",
      "grazing",
      "defense"
    ],
    "rarity": null
  },
  {
    "id": "badger",
    "displayName": "Badger",
    "biome": "meadow",
    "classification": "passive",
    "time": "prefer-dusk",
    "habitat": [
      "ground",
      "vegetation-or-hills",
      "burrow-site"
    ],
    "abilities": [
      "forage",
      "burrow"
    ],
    "rarity": null
  },
  {
    "id": "meadowlark",
    "displayName": "Meadowlark",
    "biome": "meadow",
    "classification": "passive",
    "time": "day",
    "habitat": [
      "open-grass",
      "flight-clearance",
      "landing-site"
    ],
    "abilities": [
      "flight",
      "forage",
      "landing"
    ],
    "rarity": null
  },
  {
    "id": "honeybee",
    "displayName": "Honeybee",
    "biome": "meadow",
    "classification": "passive",
    "time": "day",
    "habitat": [
      "flowers",
      "flight-clearance"
    ],
    "abilities": [
      "flight",
      "pollination",
      "hive"
    ],
    "rarity": null
  },
  {
    "id": "golden-antelope",
    "displayName": "Golden Antelope",
    "biome": "meadow",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "open-grass",
      "ground",
      "running-clearance"
    ],
    "abilities": [
      "evasion",
      "herd"
    ],
    "rarity": null
  },
  {
    "id": "werewolf",
    "displayName": "Werewolf",
    "biome": "meadow",
    "classification": "hostile",
    "time": "night",
    "habitat": [
      "ground",
      "darkness"
    ],
    "abilities": [
      "pursuit",
      "claw"
    ],
    "rarity": null
  },
  {
    "id": "scarefiend",
    "displayName": "Scarefiend",
    "biome": "meadow",
    "classification": "hostile",
    "time": "night",
    "habitat": [
      "open-grass",
      "ground"
    ],
    "abilities": [
      "disguise",
      "awakening",
      "ambush"
    ],
    "rarity": null
  },
  {
    "id": "headless-knight",
    "displayName": "Headless Knight",
    "biome": "meadow",
    "classification": "hostile",
    "time": "night",
    "habitat": [
      "ground"
    ],
    "abilities": [
      "sword",
      "heavy-melee"
    ],
    "rarity": "rare"
  },
  {
    "id": "dire-hound",
    "displayName": "Dire Hound",
    "biome": "meadow",
    "classification": "hostile",
    "time": "dusk-or-night",
    "habitat": [
      "open-grass",
      "ground"
    ],
    "abilities": [
      "pack",
      "lunge",
      "bite"
    ],
    "rarity": null
  },
  {
    "id": "gravehand",
    "displayName": "Gravehand",
    "biome": "meadow",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "ground",
      "darkness",
      "emergence-site"
    ],
    "abilities": [
      "concealment",
      "emergence",
      "restraint"
    ],
    "rarity": null
  },
  {
    "id": "camel",
    "displayName": "Camel",
    "biome": "desert",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "sand",
      "open-ground",
      "rider-clearance"
    ],
    "abilities": [
      "tame",
      "ground-mount"
    ],
    "rarity": null
  },
  {
    "id": "jerboa",
    "displayName": "Jerboa",
    "biome": "desert",
    "classification": "passive",
    "time": "prefer-night",
    "habitat": [
      "sand",
      "ground"
    ],
    "abilities": [
      "hop",
      "evasion"
    ],
    "rarity": null
  },
  {
    "id": "golden-scarab",
    "displayName": "Golden Scarab",
    "biome": "desert",
    "classification": "passive",
    "time": "prefer-day",
    "habitat": [
      "sand",
      "ground"
    ],
    "abilities": [
      "crawl",
      "concealment"
    ],
    "rarity": null
  },
  {
    "id": "oasis-ibis",
    "displayName": "Oasis Ibis",
    "biome": "desert",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "water-nearby",
      "shoreline",
      "flight-clearance",
      "landing-site"
    ],
    "abilities": [
      "wade",
      "forage",
      "flight"
    ],
    "rarity": null
  },
  {
    "id": "dunewalker",
    "displayName": "Dunewalker",
    "biome": "desert",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "open-ground",
      "ground",
      "large-clearance"
    ],
    "abilities": [
      "herd",
      "six-legged-walk"
    ],
    "rarity": "rare"
  },
  {
    "id": "mummy",
    "displayName": "Mummy",
    "biome": "desert",
    "classification": "hostile",
    "time": "night-or-dark",
    "habitat": [
      "ground"
    ],
    "abilities": [
      "pursuit",
      "melee"
    ],
    "rarity": null
  },
  {
    "id": "giant-scorpion",
    "displayName": "Giant Scorpion",
    "biome": "desert",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "rock-or-sand",
      "ground"
    ],
    "abilities": [
      "pincers",
      "tail",
      "venom"
    ],
    "rarity": null
  },
  {
    "id": "dune-serpent",
    "displayName": "Dune Serpent",
    "biome": "desert",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "loose-sand",
      "open-ground",
      "emergence-site"
    ],
    "abilities": [
      "serpentine",
      "ambush",
      "emergence"
    ],
    "rarity": null
  },
  {
    "id": "mirage-djinn",
    "displayName": "Mirage Djinn",
    "biome": "desert",
    "classification": "hostile",
    "time": "prefer-day",
    "habitat": [
      "flight-clearance"
    ],
    "abilities": [
      "float",
      "illusion",
      "magic"
    ],
    "rarity": "rare"
  },
  {
    "id": "sand-colossus",
    "displayName": "Sand Colossus",
    "biome": "desert",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "open-ground",
      "ground",
      "large-clearance"
    ],
    "abilities": [
      "territory",
      "heavy-melee"
    ],
    "rarity": "very-rare"
  },
  {
    "id": "woolly-mammoth",
    "displayName": "Woolly Mammoth",
    "biome": "snow",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "open-snow",
      "ground",
      "large-clearance"
    ],
    "abilities": [
      "herd",
      "defense",
      "domestication",
      "conditional-ground-mount"
    ],
    "rarity": null
  },
  {
    "id": "ptarmigan",
    "displayName": "Ptarmigan",
    "biome": "snow",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "snow-or-vegetation",
      "ground",
      "flight-clearance"
    ],
    "abilities": [
      "forage",
      "short-flight",
      "evasion"
    ],
    "rarity": null
  },
  {
    "id": "ermine",
    "displayName": "Ermine",
    "biome": "snow",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "rock-or-vegetation",
      "ground"
    ],
    "abilities": [
      "evasion",
      "explore"
    ],
    "rarity": null
  },
  {
    "id": "aurora-wisp",
    "displayName": "Aurora Wisp",
    "biome": "snow",
    "classification": "passive",
    "time": "night",
    "habitat": [
      "flight-clearance"
    ],
    "abilities": [
      "float",
      "illumination"
    ],
    "rarity": "rare"
  },
  {
    "id": "snowdrifter",
    "displayName": "Snowdrifter",
    "biome": "snow",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "snow-slope",
      "ground"
    ],
    "abilities": [
      "walk",
      "roll"
    ],
    "rarity": null
  },
  {
    "id": "yeti",
    "displayName": "Yeti",
    "biome": "snow",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "ground",
      "large-clearance"
    ],
    "abilities": [
      "charge",
      "heavy-melee",
      "ice-projectile"
    ],
    "rarity": null
  },
  {
    "id": "ice-golem",
    "displayName": "Ice Golem",
    "biome": "snow",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "frozen-ground",
      "ground"
    ],
    "abilities": [
      "heavy-melee"
    ],
    "rarity": null
  },
  {
    "id": "rime-widow",
    "displayName": "Rime Widow",
    "biome": "snow",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "snow-ground",
      "ground"
    ],
    "abilities": [
      "crawl",
      "concealment",
      "freezing-venom"
    ],
    "rarity": null
  },
  {
    "id": "blizzard-drake",
    "displayName": "Blizzard Drake",
    "biome": "snow",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "open-ground",
      "flight-clearance",
      "landing-site"
    ],
    "abilities": [
      "flight",
      "swoop",
      "freezing-breath"
    ],
    "rarity": "rare"
  },
  {
    "id": "pale-reaper",
    "displayName": "Pale Reaper",
    "biome": "snow",
    "classification": "hostile",
    "time": "night",
    "habitat": [
      "darkness"
    ],
    "abilities": [
      "stalk",
      "supernatural-combat"
    ],
    "rarity": "rare"
  },
  {
    "id": "unicorn",
    "displayName": "Unicorn",
    "biome": "forest",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "clearing",
      "ground",
      "rider-clearance"
    ],
    "abilities": [
      "tame",
      "ground-mount"
    ],
    "rarity": "rare"
  },
  {
    "id": "faerie",
    "displayName": "Faerie",
    "biome": "forest",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "flowers",
      "vegetation",
      "flight-clearance"
    ],
    "abilities": [
      "flight",
      "flower-visit"
    ],
    "rarity": null
  },
  {
    "id": "sproutling",
    "displayName": "Sproutling",
    "biome": "forest",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "vegetation",
      "ground"
    ],
    "abilities": [
      "waddle",
      "concealment",
      "rest"
    ],
    "rarity": null
  },
  {
    "id": "prismwing",
    "displayName": "Prismwing",
    "biome": "forest",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "flowers",
      "sunlit-clearing",
      "flight-clearance"
    ],
    "abilities": [
      "flight",
      "flower-visit",
      "rest"
    ],
    "rarity": null
  },
  {
    "id": "glimmerstag",
    "displayName": "Glimmerstag",
    "biome": "forest",
    "classification": "passive",
    "time": "prefer-dusk",
    "habitat": [
      "clearing",
      "ground"
    ],
    "abilities": [
      "walk",
      "illumination"
    ],
    "rarity": "rare"
  },
  {
    "id": "corrupted-treant",
    "displayName": "Corrupted Treant",
    "biome": "forest",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "dense-forest",
      "ground",
      "large-clearance"
    ],
    "abilities": [
      "branch-attack",
      "root-attack"
    ],
    "rarity": null
  },
  {
    "id": "nightshade-witch",
    "displayName": "Nightshade Witch",
    "biome": "forest",
    "classification": "hostile",
    "time": "night",
    "habitat": [
      "ground",
      "darkness"
    ],
    "abilities": [
      "poison-spell",
      "slow-spell"
    ],
    "rarity": null
  },
  {
    "id": "sporebeast",
    "displayName": "Sporebeast",
    "biome": "forest",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "mushrooms",
      "ground"
    ],
    "abilities": [
      "spore-cloud"
    ],
    "rarity": null
  },
  {
    "id": "chimera",
    "displayName": "Chimera",
    "biome": "forest",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "ground",
      "large-clearance"
    ],
    "abilities": [
      "territory",
      "multi-attack"
    ],
    "rarity": "rare"
  },
  {
    "id": "dreamweaver",
    "displayName": "Dreamweaver",
    "biome": "forest",
    "classification": "hostile",
    "time": "night",
    "habitat": [
      "magical-or-dark-forest",
      "flight-clearance"
    ],
    "abilities": [
      "float",
      "magic",
      "vision-distortion"
    ],
    "rarity": null
  },
  {
    "id": "yak",
    "displayName": "Yak",
    "biome": "alpine",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "high-meadow",
      "ground"
    ],
    "abilities": [
      "herd",
      "grazing",
      "domestication"
    ],
    "rarity": null
  },
  {
    "id": "golden-eagle",
    "displayName": "Golden Eagle",
    "biome": "alpine",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "cliff-ledge",
      "flight-clearance",
      "perch-site"
    ],
    "abilities": [
      "soar",
      "perch"
    ],
    "rarity": null
  },
  {
    "id": "pika",
    "displayName": "Pika",
    "biome": "alpine",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "rock",
      "vegetation",
      "ground"
    ],
    "abilities": [
      "gather",
      "evasion",
      "shelter"
    ],
    "rarity": null
  },
  {
    "id": "skyray",
    "displayName": "Skyray",
    "biome": "alpine",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "high-elevation",
      "flight-clearance",
      "large-clearance"
    ],
    "abilities": [
      "glide",
      "flight"
    ],
    "rarity": null
  },
  {
    "id": "griffin",
    "displayName": "Griffin",
    "biome": "alpine",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "remote-peak",
      "flight-clearance",
      "landing-site",
      "rider-clearance"
    ],
    "abilities": [
      "tame",
      "flight",
      "aerial-mount",
      "defense"
    ],
    "rarity": "exceptional"
  },
  {
    "id": "cyclops",
    "displayName": "Cyclops",
    "biome": "alpine",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "open-ground",
      "ground",
      "large-clearance"
    ],
    "abilities": [
      "club",
      "rock-projectile"
    ],
    "rarity": null
  },
  {
    "id": "wyvern",
    "displayName": "Wyvern",
    "biome": "alpine",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "high-elevation",
      "flight-clearance"
    ],
    "abilities": [
      "flight",
      "pursuit",
      "venom"
    ],
    "rarity": "rare"
  },
  {
    "id": "avalanche-beast",
    "displayName": "Avalanche Beast",
    "biome": "alpine",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "rocky-slope",
      "ground",
      "running-clearance"
    ],
    "abilities": [
      "charge"
    ],
    "rarity": null
  },
  {
    "id": "storm-elemental",
    "displayName": "Storm Elemental",
    "biome": "alpine",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "high-elevation",
      "flight-clearance"
    ],
    "abilities": [
      "float",
      "electric-projectile"
    ],
    "rarity": null
  },
  {
    "id": "cliff-reaver",
    "displayName": "Cliff Reaver",
    "biome": "alpine",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "cliff-ledge",
      "climb-site"
    ],
    "abilities": [
      "climb",
      "leap"
    ],
    "rarity": null
  },
  {
    "id": "cave-bat",
    "displayName": "Cave Bat",
    "biome": "cave",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "shallow-or-middle-cave",
      "ceiling",
      "flight-clearance"
    ],
    "abilities": [
      "flight",
      "roost",
      "colony"
    ],
    "rarity": null
  },
  {
    "id": "crystal-snail",
    "displayName": "Crystal Snail",
    "biome": "cave",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "crystal-floor",
      "ground"
    ],
    "abilities": [
      "crawl",
      "illumination",
      "harvest-eligible"
    ],
    "rarity": null
  },
  {
    "id": "blind-cavefish",
    "displayName": "Blind Cavefish",
    "biome": "cave",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "submerged-space"
    ],
    "abilities": [
      "swim"
    ],
    "rarity": null
  },
  {
    "id": "lantern-beetle",
    "displayName": "Lantern Beetle",
    "biome": "cave",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "middle-or-deep-cave",
      "ground"
    ],
    "abilities": [
      "crawl",
      "illumination"
    ],
    "rarity": null
  },
  {
    "id": "geodeback",
    "displayName": "Geodeback",
    "biome": "cave",
    "classification": "passive",
    "time": "any",
    "habitat": [
      "deep-cave",
      "ground",
      "large-clearance"
    ],
    "abilities": [
      "defense",
      "walk"
    ],
    "rarity": "rare"
  },
  {
    "id": "burrowing-horror",
    "displayName": "Burrowing Horror",
    "biome": "cave",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "deep-cave",
      "emergence-site"
    ],
    "abilities": [
      "concealment",
      "emergence",
      "pursuit"
    ],
    "rarity": null
  },
  {
    "id": "abyssal-sentinel",
    "displayName": "Abyssal Sentinel",
    "biome": "cave",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "deep-cave",
      "ground",
      "chamber-clearance"
    ],
    "abilities": [
      "territory",
      "heavy-melee"
    ],
    "rarity": "rare"
  },
  {
    "id": "echo-stalker",
    "displayName": "Echo Stalker",
    "biome": "cave",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "darkness",
      "ground",
      "traversable-cave"
    ],
    "abilities": [
      "sound-perception",
      "pursuit"
    ],
    "rarity": null
  },
  {
    "id": "ceiling-lurker",
    "displayName": "Ceiling Lurker",
    "biome": "cave",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "ceiling",
      "vertical-clearance"
    ],
    "abilities": [
      "ceiling-attachment",
      "drop-attack"
    ],
    "rarity": null
  },
  {
    "id": "abyssal-hydra",
    "displayName": "Abyssal Hydra",
    "biome": "cave",
    "classification": "hostile",
    "time": "any",
    "habitat": [
      "deep-cave",
      "natural-large-chamber",
      "ground",
      "large-clearance"
    ],
    "abilities": [
      "multi-attack",
      "heavy-melee"
    ],
    "rarity": "exceptional"
  }
].map(x=>Object.freeze({...x,habitat:Object.freeze(x.habitat),abilities:Object.freeze(x.abilities)})));
export function validateApprovedRoster(roster=APPROVED) {
  if (!Array.isArray(roster)||roster.length!==60) throw new TypeError("Expected exactly 60 additions");
  const ids=new Set(),counts=new Map();
  for(const item of roster){
    if(!item||typeof item.id!=="string"||!item.id.match(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/)||ids.has(item.id)||ORIGINAL_IDS.includes(item.id)||!BIOMES.includes(item.biome)||!["passive","hostile"].includes(item.classification))throw new TypeError("Invalid or duplicate addition");
    ids.add(item.id);
    const key=item.biome+":"+item.classification;counts.set(key,(counts.get(key)??0)+1);
    const expected=APPROVED.find(x=>x.id===item.id);
    if(!expected||JSON.stringify(item)!==JSON.stringify(expected))throw new TypeError("Unapproved roster identity or metadata");
  }
  for(const biome of BIOMES)for(const kind of ["passive","hostile"])if(counts.get(biome+":"+kind)!==5)throw new TypeError("Invalid biome quota");
  return true;
}
 // Structural check only; actual model, behavior, native and gameplay evidence are separate mandatory gates.
export function composeCompleteRoster(original,additions){
  if(!Array.isArray(original)||original.length!==40||new Set(original.map(x=>x?.id)).size!==40||ORIGINAL_IDS.some((id,i)=>original[i]?.id!==id||original[i]?.classification!==(i<20?"passive":"hostile")||original[i]?.implementation!=="preview"||original[i]?.render?.model!==id))throw new TypeError("Original roster mismatch");
  if(!Array.isArray(additions)||additions.length!==60||new Set(additions.map(x=>x?.id)).size!==60)throw new TypeError("Incomplete expansion");
  const records=APPROVED.map(spec=>{
    const record=additions.find(x=>x?.id===spec.id);
    if(!record||record.classification!==spec.classification||record.displayName!==spec.displayName||record.implementation!=="preview"||record.render?.model!==spec.id||record.habitat?.biomes?.length!==1||record.habitat.biomes[0]!==spec.biome)throw new TypeError("Expansion record not structurally admissible: "+spec.id);
    return record;
  });
  return Object.freeze([...original,...records]);
}
export function matchesRequiredTime(spec,phase,darkness){
  if(!spec||!["dawn","day","dusk","night"].includes(phase))return false;
  switch(spec.time){
    case "night":return phase==="night";
    case "day":return phase==="day";
    case "dusk-or-night":return phase==="dusk"||phase==="night";
    case "night-or-dark":return phase==="night"||darkness===true;
    case "any":case "prefer-day":case "prefer-dusk":case "prefer-night":return true;
    default:return false;
  }
}
validateApprovedRoster();
