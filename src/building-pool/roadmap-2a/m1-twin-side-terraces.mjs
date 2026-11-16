// Six separately specified original four-court commercial buildings, detached from game.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
import {author2AUProfile,carve2AUFootprint} from './m1-u-court-shops.mjs';
import {carve2ALateralGallery} from './m1-lateral-markets.mjs';
import {validateBlueprint} from './schema.mjs';
export const M1_TWIN_SIDE_TERRACE_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "desert",
    "size": "large",
    "variation": 3,
    "w": 37,
    "d": 34,
    "h": 10,
    "entry": 18,
    "left": 12,
    "right": 25,
    "depth": 12,
    "frontSide": "west",
    "stepWidth": 4,
    "stepDepth": 7,
    "lateralWidth": 4,
    "lateralStart": 13,
    "lateralDepth": 4,
    "westWidth": 3,
    "westStart": 12,
    "westDepth": 3,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "annex": "caravan-bond-archive",
    "name": "Sundial Four-Wing Caravan Exchange",
    "masses": [
      [
        3,
        7,
        7,
        12,
        7,
        "sandstone-bell-arcade"
      ],
      [
        28,
        32,
        7,
        12,
        5,
        "east-receipts-tower"
      ],
      [
        3,
        8,
        27,
        30,
        6,
        "back-quarter-trade-hip"
      ]
    ],
    "gables": [
      [
        "front",
        10,
        25,
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
        28,
        4,
        "pack5:086",
        "trade-counter",
        "ledger-service"
      ],
      [
        25,
        9,
        "pack5:087",
        "dry-market-wares",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "desert-ledgers",
        "cartographers-oak-desk"
      ],
      [
        32,
        30,
        "pack4:057",
        "wagon-stock",
        null
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "temperate",
    "size": "medium",
    "variation": 2,
    "w": 29,
    "d": 28,
    "h": 8,
    "entry": 14,
    "left": 10,
    "right": 19,
    "depth": 9,
    "frontSide": "west",
    "stepWidth": 3,
    "stepDepth": 5,
    "lateralWidth": 4,
    "lateralStart": 11,
    "lateralDepth": 3,
    "westWidth": 3,
    "westStart": 12,
    "westDepth": 2,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "annex": "unoccupied-stall-logbook-office",
    "name": "Mossbank Twin-Passage Supply House",
    "masses": [
      [
        3,
        7,
        6,
        10,
        6,
        "stablewatch-timber-canopy"
      ],
      [
        21,
        24,
        7,
        11,
        4,
        "merchant-eaves"
      ],
      [
        3,
        7,
        22,
        25,
        5,
        "dry-bedding-loft"
      ]
    ],
    "gables": [
      [
        "front",
        9,
        19,
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
        22,
        4,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        20,
        9,
        "pack5:087",
        "empty-display-trays",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "empty-stall-ledger",
        "cartographers-oak-desk"
      ],
      [
        23,
        24,
        "pack4:057",
        "dry-supply-crate",
        null
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "snow",
    "size": "small",
    "variation": 1,
    "w": 23,
    "d": 31,
    "h": 8,
    "entry": 11,
    "left": 7,
    "right": 15,
    "depth": 13,
    "frontSide": "west",
    "stepWidth": 4,
    "stepDepth": 6,
    "lateralWidth": 4,
    "lateralStart": 11,
    "lateralDepth": 3,
    "westWidth": 3,
    "westStart": 12,
    "westDepth": 3,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "annex": "unpowered-curio-records",
    "name": "Moonfrost Split-Atrium Curio Vault",
    "masses": [
      [
        3,
        6,
        6,
        10,
        6,
        "snow-scroll-watch"
      ],
      [
        16,
        19,
        7,
        11,
        4,
        "white-glass-side-eaves"
      ],
      [
        3,
        6,
        24,
        27,
        6,
        "rear-bond-hip"
      ]
    ],
    "gables": [
      [
        "front",
        7,
        16,
        7
      ],
      [
        "rear",
        3,
        7,
        6
      ]
    ],
    "furniture": [
      [
        17,
        4,
        "pack5:086",
        "sales-counter",
        "ledger-service"
      ],
      [
        16,
        9,
        "pack5:093",
        "sealed-curio",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        9,
        "pack5:091",
        "dry-scroll-book",
        "cartographers-oak-desk"
      ],
      [
        19,
        28,
        "pack4:057",
        "sealed-trunk",
        null
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "mountain",
    "size": "small",
    "variation": 1,
    "w": 28,
    "d": 31,
    "h": 8,
    "entry": 13,
    "left": 8,
    "right": 19,
    "depth": 12,
    "frontSide": "east",
    "stepWidth": 4,
    "stepDepth": 7,
    "lateralWidth": 4,
    "lateralStart": 11,
    "lateralDepth": 4,
    "westWidth": 4,
    "westStart": 12,
    "westDepth": 3,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "annex": "cold-dry-herb-records",
    "name": "Highrock Cross-Gallery Apothecary",
    "masses": [
      [
        3,
        7,
        6,
        11,
        6,
        "high-stone-vent"
      ],
      [
        20,
        24,
        6,
        10,
        5,
        "east-distiller-cupola"
      ],
      [
        3,
        7,
        24,
        27,
        6,
        "rear-cold-store-hip"
      ]
    ],
    "gables": [
      [
        "front",
        8,
        19,
        6
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
        22,
        4,
        "pack5:086",
        "apothecary-counter",
        "ledger-service"
      ],
      [
        21,
        9,
        "pack5:089",
        "cold-apparatus",
        "iron-tripod-cauldron"
      ],
      [
        3,
        9,
        "pack5:091",
        "herbal-records",
        "cartographers-oak-desk"
      ],
      [
        24,
        28,
        "pack4:057",
        "dry-roots",
        null
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "enchanted-forest",
    "size": "small",
    "variation": 1,
    "w": 22,
    "d": 32,
    "h": 8,
    "entry": 11,
    "left": 7,
    "right": 14,
    "depth": 10,
    "frontSide": "west",
    "stepWidth": 3,
    "stepDepth": 5,
    "lateralWidth": 3,
    "lateralStart": 12,
    "lateralDepth": 5,
    "westWidth": 3,
    "westStart": 13,
    "westDepth": 4,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "annex": "unlit-bake-ledger-store",
    "name": "Hollowglow Winding Oven Galleria",
    "masses": [
      [
        3,
        6,
        6,
        11,
        6,
        "timber-cooling-belfry"
      ],
      [
        15,
        18,
        7,
        11,
        4,
        "pastry-canopy-split-eaves"
      ],
      [
        3,
        6,
        25,
        28,
        6,
        "rear-sugar-dry-roof"
      ]
    ],
    "gables": [
      [
        "front",
        7,
        15,
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
        16,
        4,
        "pack5:086",
        "bakery-counter",
        "ledger-service"
      ],
      [
        15,
        9,
        "pack5:090",
        "unfired-oven",
        "ashstone-bake-oven"
      ],
      [
        3,
        9,
        "pack5:091",
        "grain-inventory",
        "cartographers-oak-desk"
      ],
      [
        18,
        29,
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
    "variation": 3,
    "w": 39,
    "d": 36,
    "h": 12,
    "entry": 19,
    "left": 13,
    "right": 26,
    "depth": 13,
    "frontSide": "east",
    "stepWidth": 4,
    "stepDepth": 7,
    "lateralWidth": 4,
    "lateralStart": 14,
    "lateralDepth": 4,
    "westWidth": 4,
    "westStart": 13,
    "westDepth": 5,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "annex": "bond-audit-tower",
    "name": "Grand Oak Four-Court Bond Treasury",
    "masses": [
      [
        3,
        8,
        7,
        12,
        8,
        "municipal-gabled-archive"
      ],
      [
        29,
        34,
        7,
        12,
        6,
        "teller-wing-watchtower"
      ],
      [
        3,
        8,
        28,
        32,
        8,
        "rear-ledger-stronghold"
      ]
    ],
    "gables": [
      [
        "front",
        12,
        26,
        8
      ],
      [
        "rear",
        3,
        9,
        7
      ]
    ],
    "furniture": [
      [
        31,
        4,
        "pack5:086",
        "teller-ledger",
        "ledger-service"
      ],
      [
        29,
        9,
        "pack5:086",
        "separate-teller",
        "ledger-service"
      ],
      [
        3,
        9,
        "pack5:091",
        "public-bond-record",
        "cartographers-oak-desk"
      ],
      [
        34,
        32,
        "pack4:057",
        "sealed-register",
        null
      ]
    ]
  }
]);
const key=(x,y,z)=>x+','+y+','+z;
export function carveWestServiceTerrace(original,s){
 const w=s.w,d=s.d,inner=s.westWidth,z0=s.westStart,z1=z0+s.westDepth-1,rear=d-s.depth;
 if(inner<3||inner>4||s.westDepth<2||s.westDepth>5||z0<12||z1>=rear-3)
  throw Error('invalid source-authored west garden profile');
 const cells=new Map(original.voxels.map(v=>[key(v.x,v.y,v.z),{...v}]));
 for(let x=0;x<inner;x++)for(let z=z0;z<=z1;z++)for(let y=0;y<original.extents.y;y++){
  const k=key(x,y,z),old=cells.get(k);
  if(old&&['window','fixture','decor'].includes(old.kind))throw Error('protected window/furniture cut by west terrace '+k);
  cells.delete(k);
 }
 const bearing=(x,z,role)=>{
  if(cells.get(key(x,1,z))?.kind!=='floor'||cells.get(key(x,s.h+1,z))?.kind!=='roof')
   throw Error('missing physical root below terrace return '+key(x,1,z));
  for(let y=2;y<=s.h;y++){
   const k=key(x,y,z),old=cells.get(k);
   if(old&&old.kind!=='wall')throw Error('weather return intersects occupied room '+k);
   cells.set(k,{x,y,z,kind:'wall',material:s.wall,architecturalRole:role});
  }
 };
 for(let z=z0;z<=z1;z++)bearing(inner,z,'west-service-garden-inner-weather-leg');
 for(let x=0;x<inner;x++){
  bearing(x,z0-1,'west-service-garden-north-return');
  bearing(x,z1+1,'west-service-garden-south-return');
 }
 const court={kind:'west-side-open-service-garden',x0:0,x1:inner-1,z0,z1,removedColumns:inner*s.westDepth};
 const result={...original,voxels:[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x),
  courtyardGeometry:[...original.courtyardGeometry,court],
  features:[...original.features,'four authentic open-air source-voids with full-height return walls'],
  architecturalSignature:original.architecturalSignature+' / independent opposite-side transverse service terrace'};
 validateBlueprint(result);return Object.freeze(result);
}
export const M1_TWIN_SIDE_TERRACE_PROFILES=Object.freeze(M1_TWIN_SIDE_TERRACE_SPECS.map(author2AUProfile));
export const M1_TWIN_SIDE_TERRACE_SHOPS=Object.freeze(M1_TWIN_SIDE_TERRACE_SPECS.map((s,i)=>{
 const p=M1_TWIN_SIDE_TERRACE_PROFILES[i];
 return carveWestServiceTerrace(carve2ALateralGallery(carve2AUFootprint(assembleSpecialistProfile(p),p),s),s);
}));
