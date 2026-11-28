// Artifice item contract v1 — isolated candidate, no runtime authority (#521).
export function validateItemCatalog(records){const allowed=new Set(["common","uncommon","rare","epic","legendary","mythic"]);const pattern=/^artifice:(material|equipment|tool|consumable):[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;const owners={material:"rm",equipment:"wa",tool:"tc",consumable:"tc"};const str=v=>typeof v==="string"&&v.trim().length>0&&v.length<=512;const int=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;const unique=new Set();const icons=new Set();if(!Array.isArray(records)||records.length>4096)throw new TypeError("invalid catalog");for(const item of records){if(!item||item.schemaVersion!==1||!pattern.test(item.id)||unique.has(item.id)||!str(item.name)||!str(item.description)||!str(item.category)||!allowed.has(item.rarity)||!int(item.tier,0,5)||!int(item.stackMax,1,999)||!Array.isArray(item.tags)||item.tags.length>32||item.tags.some(t=>!str(t))||new Set(item.tags).size!==item.tags.length)throw new TypeError("invalid item");const type=item.id.split(":")[1];if((type==="equipment"||type==="tool")&&item.stackMax!==1)throw new TypeError("durable item stack");const prefix=`assets/age-of-artifice/${owners[type]}/`;if(typeof item.icon!=="string"||!item.icon.startsWith(prefix)||!(/^[a-z0-9][a-z0-9-]*\.(svg|png)$/.test(item.icon.slice(prefix.length)))||icons.has(item.icon))throw new TypeError("invalid or duplicate icon");unique.add(item.id);icons.add(item.icon);}return records.map(i=>i.id).sort();}
export const catalog = [
  {
    "schemaVersion": 1,
    "id": "artifice:material:clay-lump",
    "name": "Clay Lump",
    "description": "Soft earthy sediment that can be shaped and fired.",
    "category": "sediment",
    "rarity": "common",
    "tier": 0,
    "stackMax": 64,
    "icon": "assets/age-of-artifice/rm/clay-lump.svg",
    "tags": [
      "clay",
      "malleable"
    ],
    "properties": [
      "malleable"
    ],
    "acquisition": {
      "status": "pending-owner-mapping",
      "proposal": "Gathering from suitable sediment; owner mapping pending."
    },
    "intendedUses": [
      "ceramics",
      "molds"
    ]
  },
  {
    "schemaVersion": 1,
    "id": "artifice:material:dry-twig",
    "name": "Dry Twig",
    "description": "A light woody branch useful in basic assembly.",
    "category": "wood",
    "rarity": "common",
    "tier": 0,
    "stackMax": 64,
    "icon": "assets/age-of-artifice/rm/dry-twig.svg",
    "tags": [
      "twig",
      "lightweight"
    ],
    "properties": [
      "lightweight"
    ],
    "acquisition": {
      "status": "pending-owner-mapping",
      "proposal": "Deadwood gathering candidate; source owner mapping pending."
    },
    "intendedUses": [
      "handles",
      "basic crafting"
    ]
  },
  {
    "schemaVersion": 1,
    "id": "artifice:material:flint-shard",
    "name": "Flint Shard",
    "description": "A sharp fractured stone suitable for simple edge tools.",
    "category": "stone",
    "rarity": "common",
    "tier": 0,
    "stackMax": 64,
    "icon": "assets/age-of-artifice/rm/flint-shard.svg",
    "tags": [
      "flint",
      "brittle"
    ],
    "properties": [
      "brittle"
    ],
    "acquisition": {
      "status": "pending-owner-mapping",
      "proposal": "Stone gathering candidate; source owner mapping pending."
    },
    "intendedUses": [
      "starter blades",
      "striking"
    ]
  },
  {
    "schemaVersion": 1,
    "id": "artifice:material:plant-fiber",
    "name": "Plant Fiber",
    "description": "Flexible dried strands for binding and weaving.",
    "category": "fiber",
    "rarity": "common",
    "tier": 0,
    "stackMax": 64,
    "icon": "assets/age-of-artifice/rm/plant-fiber.svg",
    "tags": [
      "fiber",
      "flexible"
    ],
    "properties": [
      "flexible"
    ],
    "acquisition": {
      "status": "pending-owner-mapping",
      "proposal": "Vegetation gathering candidate; source owner mapping pending."
    },
    "intendedUses": [
      "cordage",
      "cloth"
    ]
  }
];
