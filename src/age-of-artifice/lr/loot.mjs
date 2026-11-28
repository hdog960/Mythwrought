// LR0/LR2 isolated preview only. Candidate contract #521; dependencies {"rm":"efec9ec8b9d5c307a4334bd1cacbebac39a04105","wa":"58e41e8ff7ddda54975b9a964020af7f7b765ab1","tc":"008dc24b279bb72ba2059d11689ce1229f8261ff"}.
export function resolvePreview(table,event,knownIds,verifiedSourceRefs){const fail=reason=>({ok:false,reason});const int=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;const token=x=>typeof x==="string"&&/^[a-zA-Z0-9][a-zA-Z0-9:_-]{0,95}$/.test(x);if(!table||!event||event.authority!=="isolated-preview"||table.schemaVersion!==1||table.authority!=="isolated-candidate"||typeof table.id!=="string"||!/^artifice:loot:[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(table.id)||!Array.isArray(knownIds)||knownIds.length>4096||!Array.isArray(verifiedSourceRefs)||verifiedSourceRefs.length>4096||!verifiedSourceRefs.includes(table.sourceRef)||event.sourceRef!==table.sourceRef||!token(event.claimId)||!token(event.seed)||!int(table.rolls,1,32)||!Array.isArray(table.entries)||table.entries.length<1||table.entries.length>128)return fail("invalid-source-or-event");const known=new Set(knownIds),seen=new Set();let total=0;for(const e of table.entries){if(!e||!int(e.weight,1,1000000)||seen.has(e.itemId)||(e.itemId===null?(e.min!==0||e.max!==0):(!known.has(e.itemId)||!int(e.min,1,999)||!int(e.max,e.min,999))))return fail("invalid-entry");seen.add(e.itemId);total+=e.weight;if(!int(total,1,0x7fffffff))return fail("weight-overflow");}let s=2166136261;for(const ch of `${event.seed}|${event.claimId}|${table.id}`){s=Math.imul(s^ch.charCodeAt(0),16777619)>>>0;}function draw(bound){const limit=Math.floor(4294967296/bound)*bound;for(let retry=0;retry<128;retry++){s=(s+0x6d2b79f5)>>>0;let t=Math.imul(s^(s>>>15),s|1);t^=t+Math.imul(t^(t>>>7),t|61);let x=(t^(t>>>14))>>>0;if(x<limit)return x%bound;}return null;}const awards=new Map();for(let i=0;i<table.rolls;i++){let v=draw(total);if(v===null)return fail("rng-exhausted");let chosen;for(const e of table.entries){if(v<e.weight){chosen=e;break;}v-=e.weight;}if(!chosen)return fail("invalid-selection");if(chosen.itemId===null)continue;const q=draw(chosen.max-chosen.min+1);if(q===null)return fail("rng-exhausted");awards.set(chosen.itemId,(awards.get(chosen.itemId)||0)+chosen.min+q);}return {ok:true,claimId:event.claimId,sourceRef:event.sourceRef,tableId:table.id,awards:[...awards].sort(([a],[b])=>a.localeCompare(b)).map(([itemId,quantity])=>({itemId,quantity}))};}
export function claimPreview(state,event,table,knownIds,verifiedSourceRefs){const reject=reason=>({ok:false,reason,state});const int=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;if(!state||!event||!int(state.revision,0,Number.MAX_SAFE_INTEGER-1)||event.expectedRevision!==state.revision||!Array.isArray(state.claimed)||state.claimed.length>=4096||new Set(state.claimed).size!==state.claimed.length||state.claimed.some(x=>typeof x!=="string"||!(/^[a-zA-Z0-9][a-zA-Z0-9:_-]{0,95}$/).test(x))||state.claimed.includes(event.claimId)||!state.stock||!state.capacity)return reject("stale-or-replay");if(!Array.isArray(knownIds))return reject("invalid-catalog");const known=new Set(knownIds);for(const [id,q] of Object.entries(state.capacity))if(!known.has(id)||!int(q,0,100000))return reject("invalid-capacity");for(const [id,q] of Object.entries(state.stock))if(!known.has(id)||!Object.hasOwn(state.capacity,id)||!int(q,0,state.capacity[id]))return reject("invalid-stock");const result=resolvePreview(table,event,knownIds,verifiedSourceRefs);if(!result.ok)return reject(result.reason);let stock={...state.stock};for(const a of result.awards){let n=(stock[a.itemId]||0)+a.quantity;if(!Object.hasOwn(state.capacity,a.itemId)||!int(n,0,state.capacity[a.itemId]))return reject("insufficient-capacity");stock[a.itemId]=n;}return {ok:true,receipt:result,state:{...state,stock,revision:state.revision+1,claimed:[...state.claimed,event.claimId]}};}
export const lootTables=[
  {
    "schemaVersion": 1,
    "id": "artifice:loot:giant-spider-starter",
    "sourceRef": "giant-spider",
    "sourceProvenance": {
      "path": "src/mobs/species.mjs",
      "commit": "aff36c2a71f1b84ca3a77bede78ba0998c1cd6e7",
      "blob": "2b49e5e053051fda760b264895785b75c855c7b4"
    },
    "binding": "pending-owner-event-authority",
    "rolls": 1,
    "entries": [
      {
        "itemId": "artifice:material:plant-fiber",
        "weight": 80,
        "min": 1,
        "max": 3
      },
      {
        "itemId": null,
        "weight": 20,
        "min": 0,
        "max": 0
      }
    ],
    "authority": "isolated-candidate"
  },
  {
    "schemaVersion": 1,
    "id": "artifice:loot:goblin-starter",
    "sourceRef": "goblin",
    "sourceProvenance": {
      "path": "src/mobs/species.mjs",
      "commit": "aff36c2a71f1b84ca3a77bede78ba0998c1cd6e7",
      "blob": "2b49e5e053051fda760b264895785b75c855c7b4"
    },
    "binding": "pending-owner-event-authority",
    "rolls": 1,
    "entries": [
      {
        "itemId": "artifice:material:dry-twig",
        "weight": 45,
        "min": 1,
        "max": 2
      },
      {
        "itemId": "artifice:material:flint-shard",
        "weight": 35,
        "min": 1,
        "max": 2
      },
      {
        "itemId": "artifice:material:clay-lump",
        "weight": 10,
        "min": 1,
        "max": 1
      },
      {
        "itemId": null,
        "weight": 10,
        "min": 0,
        "max": 0
      }
    ],
    "authority": "isolated-candidate"
  },
  {
    "schemaVersion": 1,
    "id": "artifice:loot:skeleton-starter",
    "sourceRef": "skeleton",
    "sourceProvenance": {
      "path": "src/mobs/species.mjs",
      "commit": "aff36c2a71f1b84ca3a77bede78ba0998c1cd6e7",
      "blob": "2b49e5e053051fda760b264895785b75c855c7b4"
    },
    "binding": "pending-owner-event-authority",
    "rolls": 1,
    "entries": [
      {
        "itemId": "artifice:material:flint-shard",
        "weight": 45,
        "min": 1,
        "max": 1
      },
      {
        "itemId": "artifice:material:dry-twig",
        "weight": 45,
        "min": 1,
        "max": 2
      },
      {
        "itemId": null,
        "weight": 10,
        "min": 0,
        "max": 0
      }
    ],
    "authority": "isolated-candidate"
  },
  {
    "schemaVersion": 1,
    "id": "artifice:loot:zombie-starter",
    "sourceRef": "zombie",
    "sourceProvenance": {
      "path": "src/mobs/species.mjs",
      "commit": "aff36c2a71f1b84ca3a77bede78ba0998c1cd6e7",
      "blob": "2b49e5e053051fda760b264895785b75c855c7b4"
    },
    "binding": "pending-owner-event-authority",
    "rolls": 1,
    "entries": [
      {
        "itemId": "artifice:material:plant-fiber",
        "weight": 70,
        "min": 1,
        "max": 2
      },
      {
        "itemId": "artifice:material:dry-twig",
        "weight": 20,
        "min": 1,
        "max": 1
      },
      {
        "itemId": null,
        "weight": 10,
        "min": 0,
        "max": 0
      }
    ],
    "authority": "isolated-candidate"
  }
];
export const known=[
  "artifice:equipment:flint-dirk",
  "artifice:equipment:flint-knife",
  "artifice:equipment:splitwood-sword",
  "artifice:equipment:stoneback-seax",
  "artifice:material:clay-lump",
  "artifice:material:dry-twig",
  "artifice:material:flint-shard",
  "artifice:material:plant-fiber",
  "artifice:tool:bound-wedge",
  "artifice:tool:clay-faced-mallet",
  "artifice:tool:flint-edge-chisel",
  "artifice:tool:flint-point-pick"
];
export const mobIds=[
  "zombie",
  "skeleton",
  "giant-spider",
  "goblin"
];
