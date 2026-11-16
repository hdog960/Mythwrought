// Six detached, original Builder 2A L-gallery commercial plans. No gameplay registration.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
import {author2AUProfile,carve2AUFootprint} from './m1-u-court-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const M1_LATERAL_MARKET_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "temperate",
    "size": "large",
    "variation": 2,
    "w": 33,
    "d": 29,
    "h": 10,
    "entry": 16,
    "left": 10,
    "right": 22,
    "depth": 11,
    "frontSide": "west",
    "stepWidth": 5,
    "stepDepth": 6,
    "lateralStart": 11,
    "lateralDepth": 3,
    "lateralWidth": 4,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "annex": "sealed-stock-office",
    "name": "Ferncross Deep Gallery Exchange",
    "masses": [
      [
        3,
        7,
        5,
        10,
        6,
        "merchant-bell-chamber"
      ],
      [
        24,
        28,
        6,
        11,
        4,
        "warehouse-lean-to"
      ],
      [
        3,
        7,
        20,
        24,
        5,
        "west-counting-house-hip"
      ]
    ],
    "gables": [
      [
        "front",
        11,
        21,
        7
      ],
      [
        "rear",
        3,
        8,
        5
      ]
    ],
    "furniture": [
      [
        24,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        22,
        9,
        "pack5:087",
        "dry-goods",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "tally-desk",
        "cartographers-oak-desk"
      ],
      [
        27,
        26,
        "pack4:057",
        "sealed-stock",
        null
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "snow",
    "size": "medium",
    "variation": 2,
    "w": 24,
    "d": 26,
    "h": 8,
    "entry": 12,
    "left": 8,
    "right": 15,
    "depth": 9,
    "frontSide": "east",
    "stepWidth": 3,
    "stepDepth": 5,
    "lateralStart": 11,
    "lateralDepth": 2,
    "lateralWidth": 3,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "annex": "clean-empty-bedding-store",
    "name": "Frostmere Side-Passage Pet Supply",
    "masses": [
      [
        3,
        6,
        6,
        10,
        5,
        "snow-canopy-feed-tower"
      ],
      [
        17,
        20,
        6,
        10,
        4,
        "boarding-gallery-hip"
      ],
      [
        3,
        6,
        19,
        23,
        5,
        "tack-room-high-roof"
      ]
    ],
    "gables": [
      [
        "front",
        8,
        16,
        6
      ],
      [
        "rear",
        3,
        7,
        5
      ]
    ],
    "furniture": [
      [
        18,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        15,
        9,
        "pack5:087",
        "empty-display",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "dry-records",
        "cartographers-oak-desk"
      ],
      [
        18,
        23,
        "pack4:057",
        "unoccupied-pens",
        null
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "desert",
    "size": "large",
    "variation": 2,
    "w": 31,
    "d": 32,
    "h": 10,
    "entry": 15,
    "left": 9,
    "right": 20,
    "depth": 11,
    "frontSide": "west",
    "stepWidth": 4,
    "stepDepth": 6,
    "lateralStart": 12,
    "lateralDepth": 5,
    "lateralWidth": 4,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "annex": "inert-reliquary-store",
    "name": "Saffron Astral Courtyard Curios",
    "masses": [
      [
        3,
        7,
        6,
        12,
        7,
        "sand-observatory-vault"
      ],
      [
        24,
        27,
        7,
        11,
        5,
        "gallery-crescent-roof"
      ],
      [
        4,
        7,
        24,
        28,
        6,
        "sealed-lotus-record-hall"
      ]
    ],
    "gables": [
      [
        "front",
        10,
        20,
        7
      ],
      [
        "rear",
        3,
        8,
        5
      ]
    ],
    "furniture": [
      [
        24,
        4,
        "pack5:086",
        "trade-counter",
        "ledger-service"
      ],
      [
        22,
        9,
        "pack5:093",
        "inert-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        9,
        "pack5:091",
        "scroll-ledger",
        "cartographers-oak-desk"
      ],
      [
        25,
        29,
        "pack4:057",
        "sealed-crate",
        null
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "mountain",
    "size": "medium",
    "variation": 2,
    "w": 25,
    "d": 28,
    "h": 8,
    "entry": 12,
    "left": 8,
    "right": 16,
    "depth": 9,
    "frontSide": "east",
    "stepWidth": 3,
    "stepDepth": 5,
    "lateralStart": 11,
    "lateralDepth": 4,
    "lateralWidth": 4,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "annex": "cold-herb-record-office",
    "name": "Talus Herb & Quiet Apparatus Gallery",
    "masses": [
      [
        3,
        6,
        6,
        11,
        6,
        "stone-drying-vent"
      ],
      [
        18,
        21,
        6,
        10,
        4,
        "high-copper-eaves"
      ],
      [
        3,
        6,
        21,
        25,
        5,
        "winterwort-barn-hip"
      ]
    ],
    "gables": [
      [
        "front",
        8,
        17,
        6
      ],
      [
        "rear",
        3,
        7,
        5
      ]
    ],
    "furniture": [
      [
        18,
        4,
        "pack5:086",
        "service",
        "ledger-service"
      ],
      [
        17,
        9,
        "pack5:087",
        "sealed-vials",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "herb-ledger",
        "cartographers-oak-desk"
      ],
      [
        19,
        25,
        "pack4:057",
        "dry-herbs",
        null
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 2,
    "w": 34,
    "d": 31,
    "h": 10,
    "entry": 17,
    "left": 11,
    "right": 23,
    "depth": 11,
    "frontSide": "west",
    "stepWidth": 5,
    "stepDepth": 6,
    "lateralStart": 12,
    "lateralDepth": 4,
    "lateralWidth": 5,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "annex": "unlit-flour-archive",
    "name": "Hazelglow Twin-Court Oven House",
    "masses": [
      [
        3,
        7,
        6,
        11,
        6,
        "tree-canopy-bake-belfry"
      ],
      [
        25,
        29,
        6,
        11,
        5,
        "open-air-pastry-eaves"
      ],
      [
        4,
        8,
        23,
        27,
        5,
        "flour-archive-hip"
      ]
    ],
    "gables": [
      [
        "front",
        11,
        23,
        7
      ],
      [
        "rear",
        3,
        9,
        5
      ]
    ],
    "furniture": [
      [
        26,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        24,
        9,
        "pack5:090",
        "unfired-oven",
        "ashstone-bake-oven"
      ],
      [
        3,
        9,
        "pack5:091",
        "flour-ledger",
        "cartographers-oak-desk"
      ],
      [
        28,
        28,
        "pack4:057",
        "dry-flour",
        null
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "temperate",
    "size": "large",
    "variation": 2,
    "w": 35,
    "d": 33,
    "h": 11,
    "entry": 17,
    "left": 10,
    "right": 24,
    "depth": 12,
    "frontSide": "east",
    "stepWidth": 4,
    "stepDepth": 5,
    "lateralStart": 12,
    "lateralDepth": 5,
    "lateralWidth": 4,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "annex": "high-security-ledger-office",
    "name": "Rosebridge Three-Arcade Treasury",
    "masses": [
      [
        3,
        7,
        7,
        12,
        7,
        "civic-clock-bastion"
      ],
      [
        26,
        30,
        6,
        11,
        5,
        "teller-roof-dormer"
      ],
      [
        4,
        8,
        24,
        28,
        7,
        "bond-record-hip"
      ]
    ],
    "gables": [
      [
        "front",
        12,
        22,
        7
      ],
      [
        "rear",
        3,
        9,
        6
      ]
    ],
    "furniture": [
      [
        27,
        4,
        "pack5:086",
        "teller-desk",
        "ledger-service"
      ],
      [
        26,
        9,
        "pack5:086",
        "bank-counter",
        "ledger-service"
      ],
      [
        3,
        9,
        "pack5:091",
        "security-record",
        "cartographers-oak-desk"
      ],
      [
        29,
        30,
        "pack4:057",
        "sealed-ledger",
        null
      ]
    ]
  }
]);
const key=(x,y,z)=>x+','+y+','+z;
export function carve2ALateralGallery(blueprint,spec){
 const p=author2AUProfile(spec),x0=p.w-spec.lateralWidth,x1=p.w-1;
 const z0=spec.lateralStart,z1=z0+spec.lateralDepth-1;
 if(spec.lateralWidth<3||spec.lateralWidth>5||spec.lateralDepth<2||spec.lateralDepth>5||
    z0<11||z1>=p.d-p.depth-3||x0<=spec.right+1)
   throw Error('invalid independently authored eastern L court');
 const cells=new Map(blueprint.voxels.map(v=>[key(v.x,v.y,v.z),{...v}]));
 for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)for(let y=0;y<blueprint.extents.y;y++){
  const at=key(x,y,z),v=cells.get(at);
  if(v&&['window','fixture','decor'].includes(v.kind))throw Error('side gallery cuts special cell '+at);
  cells.delete(at);
 }
 const weather=(x,z,role)=>{
  if(cells.get(key(x,1,z))?.kind!=='floor'||cells.get(key(x,p.h+1,z))?.kind!=='roof')
   throw Error('unbearable side gallery return at '+key(x,1,z));
  for(let y=2;y<=p.h;y++){
   const at=key(x,y,z),v=cells.get(at);
   if(v&&v.kind!=='wall')throw Error('side court intersects authored interior '+at);
   cells.set(at,{x,y,z,kind:'wall',material:p.wall,architecturalRole:role});
  }
 };
 for(let z=z0;z<=z1;z++)weather(x0-1,z,'lateral-gallery-inner-weather-wall');
 for(let x=x0;x<=x1;x++){
  weather(x,z0-1,'lateral-gallery-north-return');
  weather(x,z1+1,'lateral-gallery-south-return');
 }
 const courtyard={kind:'east-side-open-L-gallery',x0,x1,z0,z1,removedColumns:(x1-x0+1)*(z1-z0+1)};
 const result={...blueprint,
  voxels:[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x),
  courtyardGeometry:[...blueprint.courtyardGeometry,courtyard],
  features:[...blueprint.features,'real void-carved L side-market with supported full-height weather returns'],
  architecturalSignature:blueprint.architecturalSignature+' / uniquely sized eastern open-air market passage and supporting side returns'};
 validateBlueprint(result);return Object.freeze(result);
}
export const M1_LATERAL_MARKET_PROFILES=Object.freeze(M1_LATERAL_MARKET_SPECS.map(author2AUProfile));
export const M1_LATERAL_MARKETS=Object.freeze(M1_LATERAL_MARKET_SPECS.map((spec,i)=>
 carve2ALateralGallery(carve2AUFootprint(assembleSpecialistProfile(M1_LATERAL_MARKET_PROFILES[i]),M1_LATERAL_MARKET_PROFILES[i]),spec)));
