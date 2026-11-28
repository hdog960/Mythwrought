// WA0–WA1: candidate-only; no gameplay authority. Materials read-only exact efec9ec8b9d5c307a4334bd1cacbebac39a04105.
export function validateCandidates(records, expectedType, verifiedMaterialIds){const pattern=/^artifice:(equipment|tool):[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;if(!Array.isArray(records)||records.length>512||!Array.isArray(verifiedMaterialIds))throw new TypeError("invalid catalog");const known=new Set(verifiedMaterialIds),ids=new Set(),icons=new Set();const int=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;for(const r of records){if(!r||r.schemaVersion!==1||typeof r.id!=="string"||!pattern.test(r.id)||r.id.split(":")[1]!==expectedType||ids.has(r.id)||r.stackMax!==1||r.tier!==0||r.rarity!=="common"||typeof r.name!=="string"||!r.name.trim()||typeof r.description!=="string"||!r.description.trim()||!Array.isArray(r.tags)||r.tags.some(x=>typeof x!=="string"||!x.trim())||new Set(r.tags).size!==r.tags.length||typeof r.icon!=="string"||icons.has(r.icon)||r.requirements?.status!=="pending-owner-mapping"||!Array.isArray(r.materialRefs)||r.materialRefs.length===0||r.materialRefs.some(x=>!known.has(x))||new Set(r.materialRefs).size!==r.materialRefs.length)throw new TypeError("invalid candidate");const s=r.candidateStats;if(!s||!int(s.power,1,100)||!int(s.reachMm,1,2000)||!int(s.actionTicks,1,120)||!int(s.durabilityMax,1,1000))throw new TypeError("invalid stats");if(expectedType==="equipment"&&(r.slot!=="main-hand"||!["sword","dagger"].includes(r.category)))throw new TypeError("invalid weapon");if(expectedType==="tool"&&(r.operation!=="mining"||r.category!=="mining"))throw new TypeError("invalid tool");const prefix=`assets/age-of-artifice/${expectedType==="equipment"?"wa":"tc"}/`;if(!r.icon.startsWith(prefix)||!(/^[a-z0-9][a-z0-9-]*\.svg$/.test(r.icon.slice(prefix.length))))throw new TypeError("invalid icon");ids.add(r.id);icons.add(r.icon);}return records.map(r=>r.id).sort();}
export const catalog=[
  {
    "schemaVersion": 1,
    "id": "artifice:equipment:flint-dirk",
    "name": "Flint Dirk",
    "description": "A narrow, pointed bound blade designed for deliberate thrusts.",
    "category": "dagger",
    "rarity": "common",
    "tier": 0,
    "stackMax": 1,
    "icon": "assets/age-of-artifice/wa/flint-dirk.svg",
    "tags": [
      "dagger",
      "starter"
    ],
    "slot": "main-hand",
    "candidateStats": {
      "power": 4,
      "reachMm": 600,
      "actionTicks": 13,
      "durabilityMax": 22
    },
    "materialRefs": [
      "artifice:material:flint-shard",
      "artifice:material:dry-twig",
      "artifice:material:plant-fiber"
    ],
    "requirements": {
      "status": "pending-owner-mapping"
    },
    "authority": "candidate-only"
  },
  {
    "schemaVersion": 1,
    "id": "artifice:equipment:flint-knife",
    "name": "Knapped Flint Knife",
    "description": "Compact sharp edge for quick close-range attacks.",
    "category": "dagger",
    "rarity": "common",
    "tier": 0,
    "stackMax": 1,
    "icon": "assets/age-of-artifice/wa/flint-knife.svg",
    "tags": [
      "dagger",
      "starter"
    ],
    "slot": "main-hand",
    "candidateStats": {
      "power": 3,
      "reachMm": 450,
      "actionTicks": 10,
      "durabilityMax": 18
    },
    "materialRefs": [
      "artifice:material:flint-shard",
      "artifice:material:plant-fiber"
    ],
    "requirements": {
      "status": "pending-owner-mapping"
    },
    "authority": "candidate-only"
  },
  {
    "schemaVersion": 1,
    "id": "artifice:equipment:splitwood-sword",
    "name": "Splitwood Sword",
    "description": "A broad split-branch training sword for forgiving sweeps.",
    "category": "sword",
    "rarity": "common",
    "tier": 0,
    "stackMax": 1,
    "icon": "assets/age-of-artifice/wa/splitwood-sword.svg",
    "tags": [
      "sword",
      "starter"
    ],
    "slot": "main-hand",
    "candidateStats": {
      "power": 2,
      "reachMm": 850,
      "actionTicks": 15,
      "durabilityMax": 38
    },
    "materialRefs": [
      "artifice:material:dry-twig",
      "artifice:material:plant-fiber"
    ],
    "requirements": {
      "status": "pending-owner-mapping"
    },
    "authority": "candidate-only"
  },
  {
    "schemaVersion": 1,
    "id": "artifice:equipment:stoneback-seax",
    "name": "Stoneback Seax",
    "description": "A heavy straight-backed flint blade for committed chopping strikes.",
    "category": "sword",
    "rarity": "common",
    "tier": 0,
    "stackMax": 1,
    "icon": "assets/age-of-artifice/wa/stoneback-seax.svg",
    "tags": [
      "sword",
      "starter"
    ],
    "slot": "main-hand",
    "candidateStats": {
      "power": 6,
      "reachMm": 710,
      "actionTicks": 20,
      "durabilityMax": 26
    },
    "materialRefs": [
      "artifice:material:flint-shard",
      "artifice:material:dry-twig",
      "artifice:material:plant-fiber"
    ],
    "requirements": {
      "status": "pending-owner-mapping"
    },
    "authority": "candidate-only"
  }
];
export const materialRefsAtCheckpoint=["artifice:material:clay-lump","artifice:material:dry-twig","artifice:material:flint-shard","artifice:material:plant-fiber"];
