// CP0–CP1 isolated preview only. Candidate contract #521; dependencies {"rm":"efec9ec8b9d5c307a4334bd1cacbebac39a04105","wa":"58e41e8ff7ddda54975b9a964020af7f7b765ab1","tc":"008dc24b279bb72ba2059d11689ce1229f8261ff"}.
export function craftPreview(state,request,recipes,knownIds){const err=reason=>({ok:false,reason,state});const int=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;const idPattern=/^artifice:(material|equipment|tool|consumable):[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;const keyPattern=/^[a-zA-Z0-9][a-zA-Z0-9:_-]{0,95}$/;if(!state||!request||request.authority!=="isolated-preview"||!int(state.revision,0,Number.MAX_SAFE_INTEGER-1)||request.expectedRevision!==state.revision||typeof request.transactionId!=="string"||!keyPattern.test(request.transactionId)||!Array.isArray(state.applied)||state.applied.length>=4096||state.applied.some(x=>typeof x!=="string"||!keyPattern.test(x))||new Set(state.applied).size!==state.applied.length||state.applied.includes(request.transactionId)||!Array.isArray(knownIds)||knownIds.length>4096||new Set(knownIds).size!==knownIds.length||knownIds.some(x=>typeof x!=="string"||!idPattern.test(x))||!Array.isArray(recipes)||recipes.length>400||!state.stock||!state.capacity)return err("invalid-or-replay");const known=new Set(knownIds);for(const [id,q] of Object.entries(state.capacity))if(!known.has(id)||!int(q,0,100000))return err("invalid-capacity");for(const [id,q] of Object.entries(state.stock))if(!known.has(id)||!int(q,0,100000)||!Object.hasOwn(state.capacity,id)||q>state.capacity[id])return err("invalid-stock");const matching=recipes.filter(r=>r?.id===request.recipeId);if(matching.length!==1)return err("unknown-recipe");const r=matching[0];if(r.schemaVersion!==1||r.authority!=="isolated-candidate"||r.requirements?.status!=="pending-owner-mapping"||r.unlock?.kind!=="candidate-starter"||typeof r.id!=="string"||!/^artifice:recipe:[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(r.id)||r.stationRef!==request.stationRef||!int(r.durationTicks,1,100000)||!int(request.elapsedTicks,r.durationTicks,100000))return err("station-time-or-requirement");function aggregate(lines){if(!Array.isArray(lines)||lines.length<1||lines.length>64)return null;const m=new Map();for(const line of lines){if(!line||!known.has(line.itemId)||!int(line.quantity,1,999))return null;let total=(m.get(line.itemId)||0)+line.quantity;if(!int(total,1,100000))return null;m.set(line.itemId,total);}return m;}const debit=aggregate(r.ingredients),credit=aggregate(r.outputs);if(!debit||!credit)return err("invalid-recipe");for(const [id,q] of debit)if(!Object.hasOwn(state.stock,id)||state.stock[id]<q)return err("insufficient-input");const next={...state.stock};for(const [id,q] of debit)next[id]-=q;for(const [id,q] of credit){const n=(next[id]||0)+q;if(!Object.hasOwn(state.capacity,id)||!int(n,0,state.capacity[id]))return err("insufficient-capacity");next[id]=n;}return {ok:true,state:{...state,stock:next,revision:state.revision+1,applied:[...state.applied,request.transactionId]}};}
export const recipes=[
  {
    "schemaVersion": 1,
    "id": "artifice:recipe:clay-faced-mallet",
    "stationRef": "artifice:candidate-station:handcraft",
    "ingredients": [
      {
        "itemId": "artifice:material:clay-lump",
        "quantity": 3
      },
      {
        "itemId": "artifice:material:dry-twig",
        "quantity": 2
      },
      {
        "itemId": "artifice:material:plant-fiber",
        "quantity": 1
      }
    ],
    "outputs": [
      {
        "itemId": "artifice:tool:clay-faced-mallet",
        "quantity": 1
      }
    ],
    "durationTicks": 17,
    "requirements": {
      "status": "pending-owner-mapping"
    },
    "unlock": {
      "kind": "candidate-starter"
    },
    "authority": "isolated-candidate"
  },
  {
    "schemaVersion": 1,
    "id": "artifice:recipe:flint-edge-chisel",
    "stationRef": "artifice:candidate-station:handcraft",
    "ingredients": [
      {
        "itemId": "artifice:material:flint-shard",
        "quantity": 2
      },
      {
        "itemId": "artifice:material:plant-fiber",
        "quantity": 1
      }
    ],
    "outputs": [
      {
        "itemId": "artifice:tool:flint-edge-chisel",
        "quantity": 1
      }
    ],
    "durationTicks": 8,
    "requirements": {
      "status": "pending-owner-mapping"
    },
    "unlock": {
      "kind": "candidate-starter"
    },
    "authority": "isolated-candidate"
  },
  {
    "schemaVersion": 1,
    "id": "artifice:recipe:knapped-flint-knife",
    "stationRef": "artifice:candidate-station:handcraft",
    "ingredients": [
      {
        "itemId": "artifice:material:flint-shard",
        "quantity": 2
      },
      {
        "itemId": "artifice:material:plant-fiber",
        "quantity": 1
      }
    ],
    "outputs": [
      {
        "itemId": "artifice:equipment:flint-knife",
        "quantity": 1
      }
    ],
    "durationTicks": 9,
    "requirements": {
      "status": "pending-owner-mapping"
    },
    "unlock": {
      "kind": "candidate-starter"
    },
    "authority": "isolated-candidate"
  },
  {
    "schemaVersion": 1,
    "id": "artifice:recipe:splitwood-training-sword",
    "stationRef": "artifice:candidate-station:handcraft",
    "ingredients": [
      {
        "itemId": "artifice:material:dry-twig",
        "quantity": 3
      },
      {
        "itemId": "artifice:material:plant-fiber",
        "quantity": 2
      }
    ],
    "outputs": [
      {
        "itemId": "artifice:equipment:splitwood-sword",
        "quantity": 1
      }
    ],
    "durationTicks": 13,
    "requirements": {
      "status": "pending-owner-mapping"
    },
    "unlock": {
      "kind": "candidate-starter"
    },
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
