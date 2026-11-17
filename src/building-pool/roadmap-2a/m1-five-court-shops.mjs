// Builder 2A: independently coordinate-specified five-court shop/bank originals.
// Never register with world/runtime, alter saves or assign physical production IDs.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
import {author2AUProfile,carve2AUFootprint} from './m1-u-court-shops.mjs';
import {carve2ALateralGallery} from './m1-lateral-markets.mjs';
import {carveWestServiceTerrace} from './m1-twin-side-terraces.mjs';
import {validateBlueprint} from './schema.mjs';
export const M1_FIVE_COURT_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "snow",
    "size": "large",
    "variation": 4,
    "w": 41,
    "d": 28,
    "h": 10,
    "entry": 20,
    "left": 14,
    "right": 29,
    "depth": 9,
    "frontSide": "east",
    "stepWidth": 4,
    "stepDepth": 4,
    "lateralWidth": 3,
    "lateralStart": 12,
    "lateralDepth": 2,
    "westWidth": 3,
    "westStart": 12,
    "westDepth": 3,
    "fifthWidth": 3,
    "fifthStart": 5,
    "fifthDepth": 3,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "annex": "rime-vaults",
    "name": "Snowglass Ridgeline Mercantile",
    "masses": [
      [
        3,
        9,
        6,
        11,
        6,
        "snow-ledger-attic"
      ],
      [
        30,
        36,
        7,
        11,
        5,
        "winter-roof-fin"
      ],
      [
        3,
        8,
        21,
        24,
        6,
        "icebound-storeroom-hip"
      ]
    ],
    "gables": [
      [
        "front",
        12,
        25,
        7
      ],
      [
        "rear",
        3,
        10,
        6
      ]
    ],
    "furniture": [
      [
        34,
        4,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        33,
        9,
        "pack5:087",
        "unoccupied-display",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "record-desk",
        "cartographers-oak-desk"
      ],
      [
        35,
        23,
        "pack4:057",
        "sealed-crate",
        null
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "mountain",
    "size": "large",
    "variation": 1,
    "w": 40,
    "d": 31,
    "h": 10,
    "entry": 20,
    "left": 11,
    "right": 26,
    "depth": 10,
    "frontSide": "west",
    "stepWidth": 4,
    "stepDepth": 5,
    "lateralWidth": 4,
    "lateralStart": 13,
    "lateralDepth": 3,
    "westWidth": 3,
    "westStart": 13,
    "westDepth": 3,
    "fifthWidth": 3,
    "fifthStart": 5,
    "fifthDepth": 3,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "annex": "empty-stall-stock",
    "name": "Ridgehaven Empty-Stall Supply Court",
    "masses": [
      [
        3,
        8,
        6,
        12,
        7,
        "unoccupied-stablewatch"
      ],
      [
        29,
        35,
        7,
        12,
        5,
        "ridge-tack-gallery"
      ],
      [
        3,
        8,
        24,
        27,
        6,
        "rear-supply-hip"
      ]
    ],
    "gables": [
      [
        "front",
        13,
        25,
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
        33,
        4,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        32,
        9,
        "pack5:087",
        "unoccupied-display",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "record-desk",
        "cartographers-oak-desk"
      ],
      [
        34,
        26,
        "pack4:057",
        "sealed-crate",
        null
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "temperate",
    "size": "small",
    "variation": 1,
    "w": 23,
    "d": 36,
    "h": 8,
    "entry": 11,
    "left": 7,
    "right": 14,
    "depth": 13,
    "frontSide": "east",
    "stepWidth": 3,
    "stepDepth": 4,
    "lateralWidth": 3,
    "lateralStart": 14,
    "lateralDepth": 4,
    "westWidth": 3,
    "westStart": 14,
    "westDepth": 4,
    "fifthWidth": 3,
    "fifthStart": 5,
    "fifthDepth": 3,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "annex": "inert-archive",
    "name": "Willowmere Silent Relic Galleries",
    "masses": [
      [
        3,
        5,
        7,
        12,
        6,
        "timber-scroll-gallery"
      ],
      [
        16,
        19,
        7,
        11,
        4,
        "sealed-curio-hip"
      ],
      [
        3,
        6,
        27,
        31,
        7,
        "unlit-archive-tower"
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
        "service-counter",
        "ledger-service"
      ],
      [
        15,
        9,
        "pack5:093",
        "inert-curio",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        9,
        "pack5:091",
        "record-desk",
        "cartographers-oak-desk"
      ],
      [
        17,
        31,
        "pack4:057",
        "sealed-crate",
        null
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "desert",
    "size": "medium",
    "variation": 1,
    "w": 30,
    "d": 36,
    "h": 8,
    "entry": 15,
    "left": 10,
    "right": 20,
    "depth": 11,
    "frontSide": "west",
    "stepWidth": 3,
    "stepDepth": 4,
    "lateralWidth": 3,
    "lateralStart": 14,
    "lateralDepth": 4,
    "westWidth": 3,
    "westStart": 14,
    "westDepth": 4,
    "fifthWidth": 3,
    "fifthStart": 5,
    "fifthDepth": 3,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "annex": "dry-herb-notes",
    "name": "Duststep Split-Vault Apothecary",
    "masses": [
      [
        3,
        7,
        7,
        12,
        6,
        "sand-herb-vent"
      ],
      [
        22,
        25,
        7,
        11,
        5,
        "passive-cooling-cupola"
      ],
      [
        3,
        6,
        28,
        32,
        6,
        "dry-reagent-roof"
      ]
    ],
    "gables": [
      [
        "front",
        9,
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
        23,
        4,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        22,
        9,
        "pack5:089",
        "unlit-alchemy",
        "alchemists-spiral-stand"
      ],
      [
        3,
        9,
        "pack5:091",
        "record-desk",
        "cartographers-oak-desk"
      ],
      [
        24,
        31,
        "pack4:057",
        "sealed-crate",
        null
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "mountain",
    "size": "large",
    "variation": 1,
    "w": 36,
    "d": 29,
    "h": 10,
    "entry": 18,
    "left": 12,
    "right": 24,
    "depth": 9,
    "frontSide": "east",
    "stepWidth": 4,
    "stepDepth": 4,
    "lateralWidth": 4,
    "lateralStart": 12,
    "lateralDepth": 3,
    "westWidth": 4,
    "westStart": 12,
    "westDepth": 3,
    "fifthWidth": 3,
    "fifthStart": 5,
    "fifthDepth": 3,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "annex": "grain-ledger",
    "name": "Ironbloom Mountain Oven Hall",
    "masses": [
      [
        3,
        8,
        6,
        11,
        6,
        "granary-ridge"
      ],
      [
        27,
        31,
        6,
        12,
        5,
        "cooling-porch-roof"
      ],
      [
        4,
        8,
        22,
        25,
        7,
        "flour-store-peak"
      ]
    ],
    "gables": [
      [
        "front",
        11,
        24,
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
        29,
        4,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        28,
        9,
        "pack5:090",
        "unfired-oven",
        "ashstone-bake-oven"
      ],
      [
        3,
        9,
        "pack5:091",
        "record-desk",
        "cartographers-oak-desk"
      ],
      [
        30,
        24,
        "pack4:057",
        "sealed-crate",
        null
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "snow",
    "size": "small",
    "variation": 1,
    "w": 28,
    "d": 37,
    "h": 9,
    "entry": 14,
    "left": 8,
    "right": 18,
    "depth": 13,
    "frontSide": "west",
    "stepWidth": 4,
    "stepDepth": 4,
    "lateralWidth": 3,
    "lateralStart": 14,
    "lateralDepth": 4,
    "westWidth": 3,
    "westStart": 14,
    "westDepth": 3,
    "fifthWidth": 3,
    "fifthStart": 5,
    "fifthDepth": 3,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "annex": "bond-office",
    "name": "Snowveil Five-Arcade Savings Hall",
    "masses": [
      [
        3,
        6,
        7,
        13,
        6,
        "winter-ledger-keep"
      ],
      [
        21,
        24,
        7,
        11,
        5,
        "teller-side-watch"
      ],
      [
        3,
        7,
        29,
        33,
        6,
        "rear-vault-roof"
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
        6
      ]
    ],
    "furniture": [
      [
        21,
        4,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        20,
        9,
        "pack5:087",
        "unoccupied-display",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "record-desk",
        "cartographers-oak-desk"
      ],
      [
        22,
        32,
        "pack4:057",
        "sealed-crate",
        null
      ]
    ]
  }
]);
const key=(x,y,z)=>x+','+y+','+z;
export function carveFrontEastRecess(base,s){
 const start=s.fifthStart,end=start+s.fifthDepth-1,west=s.w-s.fifthWidth,inner=west-1;
 if(![s.fifthWidth,s.fifthStart,s.fifthDepth].every(Number.isInteger)||s.fifthWidth<3||
   s.fifthWidth>4||(s.frontSide==='east'&&s.fifthStart<=s.stepDepth)||end>=9||start<5||
   end>=s.lateralStart-3||inner<=s.right+1)
  throw Error('invalid protected five-court front-east-recess profile');
 const cells=new Map(base.voxels.map(v=>[key(v.x,v.y,v.z),{...v}]));
 for(let x=west;x<s.w;x++)for(let z=start;z<=end;z++)for(let y=0;y<base.extents.y;y++){
  const loc=key(x,y,z),v=cells.get(loc);
  if(v&&['fixture','window','decor'].includes(v.kind))
   throw Error('authored fifth court would destroy a protected fixture/window/decor '+loc);
  cells.delete(loc);
 }
 const weather=(x,z,role)=>{
  if(cells.get(key(x,1,z))?.kind!=='floor'||cells.get(key(x,s.h+1,z))?.kind!=='roof')
   throw Error('fifth court weather return lacks actual floor/roof root '+key(x,1,z));
  for(let y=2;y<=s.h;y++){
   const loc=key(x,y,z),v=cells.get(loc);
   if(v&&v.kind!=='wall')throw Error('fifth courtyard return collides with room source '+loc);
   cells.set(loc,{x,y,z,material:s.wall,kind:'wall',architecturalRole:role});
  }
 };
 for(let z=start;z<=end;z++)weather(inner,z,'fifth-court-front-east-bearing-wall');
 for(let x=west;x<s.w;x++){
  weather(x,start-1,'fifth-court-north-weather-return');
  weather(x,end+1,'fifth-court-south-weather-return');
 }
 const court={kind:'front-east-independent-lane',x0:west,x1:s.w-1,z0:start,z1:end,
   removedColumns:s.fifthWidth*s.fifthDepth};
 const out={...base,voxels:[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x),
  courtyardGeometry:[...base.courtyardGeometry,court],
  features:[...base.features,'fifth genuine source-column-empty front east passage with explicit bearing wall returns'],
  architecturalSignature:base.architecturalSignature+' / fifth original independent east-front courtyard and high varied roof masses'};
 validateBlueprint(out);return Object.freeze(out);
}
export const M1_FIVE_COURT_PROFILES=Object.freeze(M1_FIVE_COURT_SPECS.map(author2AUProfile));
export const M1_FIVE_COURT_SHOPS=Object.freeze(M1_FIVE_COURT_SPECS.map((s,i)=>{
 const p=M1_FIVE_COURT_PROFILES[i];
 return carveFrontEastRecess(
  carveWestServiceTerrace(
    carve2ALateralGallery(
      carve2AUFootprint(assembleSpecialistProfile(p),p),s),s),s);
}));
