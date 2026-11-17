// Isolated Roadmap 2A: independent skyline landmarks; six architectural source geometries.
// No placements, production registration, save mutation, interaction logic, or other roadmaps.
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const M1_SIGNATURE_SKYLINE_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "snow",
    "size": "small",
    "variation": 3,
    "name": "Frostgate Switchback Emporium",
    "w": 35,
    "d": 37,
    "h": 9,
    "entry": 17,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        6,
        29,
        0,
        12
      ],
      [
        1,
        15,
        10,
        26
      ],
      [
        12,
        30,
        21,
        30
      ],
      [
        25,
        34,
        22,
        36
      ],
      [
        1,
        17,
        30,
        36
      ]
    ],
    "cuts": [
      [
        16,
        23,
        24,
        27
      ],
      [
        18,
        28,
        33,
        36
      ]
    ],
    "anchors": [
      [
        17,
        6
      ],
      [
        6,
        18
      ],
      [
        30,
        28
      ],
      [
        8,
        33
      ]
    ],
    "fixtures": [
      [
        21,
        6,
        "pack5:086",
        "ledger-service",
        "trading-counter"
      ],
      [
        7,
        20,
        "pack5:091",
        "cartographers-oak-desk",
        "tall-inventory-ledger"
      ],
      [
        31,
        26,
        "pack5:087",
        "curio-arcade",
        "winter-merchandise"
      ],
      [
        11,
        34,
        "pack4:057",
        null,
        "sealed-cargo"
      ]
    ],
    "roofs": [
      [
        [
          6,
          29,
          0,
          12
        ],
        "x",
        6,
        "central-steep-snow-gable",
        "gable"
      ],
      [
        [
          1,
          15,
          10,
          26
        ],
        "z",
        4,
        "low-west-timber-awning",
        "terrace"
      ],
      [
        [
          25,
          34,
          22,
          36
        ],
        "z",
        5,
        "high-east-tollhouse-eaves",
        "saw"
      ],
      [
        [
          1,
          17,
          30,
          36
        ],
        "x",
        3,
        "rear-deliveries-lean-to",
        "terrace"
      ]
    ],
    "finials": [
      {
        "name": "lantern-toll-tower",
        "center": [
          12,
          10
        ],
        "radius": 2,
        "height": 13,
        "shape": "square"
      }
    ]
  },
  {
    "category": "pet-shop",
    "biome": "enchanted-forest",
    "size": "small",
    "variation": 3,
    "name": "Mothgrove Empty-Stall Crescent",
    "w": 37,
    "d": 39,
    "h": 9,
    "entry": 18,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        7,
        31,
        0,
        13
      ],
      [
        0,
        14,
        10,
        36
      ],
      [
        25,
        36,
        11,
        35
      ],
      [
        8,
        31,
        29,
        38
      ],
      [
        10,
        27,
        21,
        25
      ]
    ],
    "cuts": [
      [
        15,
        24,
        15,
        24
      ],
      [
        17,
        24,
        31,
        37
      ]
    ],
    "anchors": [
      [
        18,
        6
      ],
      [
        6,
        21
      ],
      [
        30,
        20
      ],
      [
        11,
        34
      ]
    ],
    "fixtures": [
      [
        23,
        6,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        7,
        21,
        "pack5:091",
        "cartographers-oak-desk",
        "stall-ledger"
      ],
      [
        31,
        21,
        "pack5:087",
        "curio-arcade",
        "empty-display"
      ],
      [
        14,
        36,
        "pack4:057",
        null,
        "dry-feed-crate"
      ]
    ],
    "roofs": [
      [
        [
          7,
          31,
          0,
          13
        ],
        "x",
        4,
        "draped-mothbark-eaves",
        "terrace"
      ],
      [
        [
          0,
          14,
          10,
          36
        ],
        "z",
        6,
        "west-pen-gabled-ridge",
        "gable"
      ],
      [
        [
          25,
          36,
          11,
          35
        ],
        "z",
        5,
        "east-stall-sawroof",
        "saw"
      ],
      [
        [
          8,
          31,
          29,
          38
        ],
        "x",
        3,
        "rear-feed-hip",
        "terrace"
      ]
    ],
    "finials": [
      {
        "name": "western-stall-spire",
        "center": [
          4,
          23
        ],
        "radius": 1,
        "height": 11,
        "shape": "diamond"
      },
      {
        "name": "east-stall-vent",
        "center": [
          32,
          20
        ],
        "radius": 1,
        "height": 10,
        "shape": "diamond"
      }
    ]
  },
  {
    "category": "magic-shop",
    "biome": "temperate",
    "size": "medium",
    "variation": 3,
    "name": "Willowglass Skywatch Gallery",
    "w": 42,
    "d": 42,
    "h": 11,
    "entry": 20,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        7,
        34,
        0,
        15
      ],
      [
        0,
        15,
        12,
        37
      ],
      [
        29,
        41,
        14,
        38
      ],
      [
        10,
        36,
        32,
        41
      ],
      [
        14,
        31,
        23,
        29
      ]
    ],
    "cuts": [
      [
        16,
        28,
        17,
        22
      ],
      [
        17,
        27,
        35,
        40
      ]
    ],
    "anchors": [
      [
        20,
        7
      ],
      [
        7,
        20
      ],
      [
        35,
        23
      ],
      [
        13,
        36
      ]
    ],
    "fixtures": [
      [
        25,
        7,
        "pack5:086",
        "ledger-service",
        "relic-counter"
      ],
      [
        7,
        23,
        "pack5:091",
        "cartographers-oak-desk",
        "sky-chart-desk"
      ],
      [
        35,
        22,
        "pack5:093",
        "sunspire-reliquary-plinth",
        "inert-relic"
      ],
      [
        11,
        39,
        "pack4:057",
        null,
        "scrolls-crate"
      ]
    ],
    "roofs": [
      [
        [
          7,
          34,
          0,
          15
        ],
        "x",
        7,
        "front-observatory-gable",
        "gable"
      ],
      [
        [
          0,
          15,
          12,
          37
        ],
        "z",
        4,
        "west-chart-terrace",
        "terrace"
      ],
      [
        [
          29,
          41,
          14,
          38
        ],
        "z",
        5,
        "east-astral-sawtooth",
        "saw"
      ],
      [
        [
          10,
          36,
          32,
          41
        ],
        "x",
        4,
        "rear-lookout-gable",
        "gable"
      ]
    ],
    "finials": [
      {
        "name": "skywatch-observatory",
        "center": [
          20,
          10
        ],
        "radius": 3,
        "height": 16,
        "shape": "octagonal"
      }
    ]
  },
  {
    "category": "potion-shop",
    "biome": "mountain",
    "size": "large",
    "variation": 3,
    "name": "Cliffroot Cascade Apothecary",
    "w": 46,
    "d": 41,
    "h": 11,
    "entry": 22,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        8,
        37,
        0,
        14
      ],
      [
        0,
        16,
        10,
        33
      ],
      [
        29,
        45,
        15,
        40
      ],
      [
        13,
        36,
        25,
        31
      ],
      [
        3,
        24,
        34,
        40
      ],
      [
        10,
        31,
        30,
        36
      ]
    ],
    "cuts": [
      [
        17,
        28,
        15,
        24
      ],
      [
        18,
        27,
        34,
        38
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        7,
        19
      ],
      [
        38,
        25
      ],
      [
        9,
        37
      ]
    ],
    "fixtures": [
      [
        27,
        6,
        "pack5:086",
        "ledger-service",
        "herb-counter"
      ],
      [
        8,
        19,
        "pack5:091",
        "cartographers-oak-desk",
        "herb-ledger"
      ],
      [
        36,
        29,
        "pack5:089",
        "alchemists-spiral-stand",
        "inert-distiller"
      ],
      [
        13,
        39,
        "pack4:057",
        null,
        "root-storage"
      ]
    ],
    "roofs": [
      [
        [
          8,
          37,
          0,
          14
        ],
        "x",
        5,
        "front-stone-timber-pitch",
        "gable"
      ],
      [
        [
          0,
          16,
          10,
          33
        ],
        "z",
        7,
        "cliffroot-drying-sawtooth",
        "saw"
      ],
      [
        [
          29,
          45,
          15,
          40
        ],
        "z",
        4,
        "east-cliff-terrace",
        "terrace"
      ],
      [
        [
          3,
          24,
          34,
          40
        ],
        "x",
        3,
        "rear-root-arcade",
        "terrace"
      ]
    ],
    "finials": [
      {
        "name": "cascade-drying-tower",
        "center": [
          6,
          24
        ],
        "radius": 2,
        "height": 14,
        "shape": "square"
      },
      {
        "name": "east-reagent-vent",
        "center": [
          39,
          29
        ],
        "radius": 1,
        "height": 9,
        "shape": "diamond"
      }
    ]
  },
  {
    "category": "bakery",
    "biome": "desert",
    "size": "medium",
    "variation": 3,
    "name": "Sunbrick Twin-Chimney Ovenhall",
    "w": 40,
    "d": 43,
    "h": 10,
    "entry": 19,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        6,
        33,
        0,
        14
      ],
      [
        0,
        13,
        10,
        41
      ],
      [
        28,
        39,
        11,
        35
      ],
      [
        10,
        31,
        22,
        29
      ],
      [
        7,
        36,
        34,
        42
      ],
      [
        8,
        17,
        28,
        37
      ],
      [
        28,
        34,
        29,
        37
      ]
    ],
    "cuts": [
      [
        14,
        27,
        16,
        21
      ],
      [
        18,
        26,
        35,
        41
      ]
    ],
    "anchors": [
      [
        19,
        6
      ],
      [
        7,
        24
      ],
      [
        34,
        20
      ],
      [
        12,
        37
      ]
    ],
    "fixtures": [
      [
        24,
        6,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        7,
        22,
        "pack5:091",
        "cartographers-oak-desk",
        "grain-ledger"
      ],
      [
        34,
        23,
        "pack5:090",
        "ashstone-bake-oven",
        "unlit-oven"
      ],
      [
        16,
        38,
        "pack4:057",
        null,
        "flour-crate"
      ]
    ],
    "roofs": [
      [
        [
          6,
          33,
          0,
          14
        ],
        "x",
        4,
        "front-low-sunshade",
        "terrace"
      ],
      [
        [
          0,
          13,
          10,
          41
        ],
        "z",
        5,
        "west-grain-sawridge",
        "saw"
      ],
      [
        [
          28,
          39,
          11,
          35
        ],
        "z",
        5,
        "oven-shed-pitch",
        "gable"
      ],
      [
        [
          7,
          36,
          34,
          42
        ],
        "x",
        3,
        "rear-bake-breeze-terrace",
        "terrace"
      ]
    ],
    "finials": [
      {
        "name": "north-chimney",
        "center": [
          34,
          18
        ],
        "radius": 1,
        "height": 15,
        "shape": "square"
      },
      {
        "name": "south-chimney",
        "center": [
          34,
          30
        ],
        "radius": 1,
        "height": 13,
        "shape": "square"
      }
    ]
  },
  {
    "category": "bank",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 2,
    "name": "Elderbough Bastion Treasury",
    "w": 45,
    "d": 44,
    "h": 12,
    "entry": 22,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        7,
        37,
        0,
        14
      ],
      [
        0,
        18,
        10,
        41
      ],
      [
        29,
        44,
        10,
        43
      ],
      [
        13,
        33,
        23,
        32
      ],
      [
        7,
        37,
        34,
        43
      ]
    ],
    "cuts": [
      [
        19,
        28,
        15,
        22
      ],
      [
        20,
        28,
        36,
        42
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        7,
        24
      ],
      [
        39,
        29
      ],
      [
        12,
        38
      ]
    ],
    "fixtures": [
      [
        26,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller"
      ],
      [
        7,
        21,
        "pack5:091",
        "cartographers-oak-desk",
        "bond-ledger"
      ],
      [
        34,
        21,
        "pack5:086",
        "ledger-service",
        "second-teller"
      ],
      [
        15,
        40,
        "pack4:057",
        null,
        "sealed-bonds"
      ]
    ],
    "roofs": [
      [
        [
          7,
          37,
          0,
          14
        ],
        "x",
        6,
        "front-ledger-citadel-gable",
        "gable"
      ],
      [
        [
          0,
          18,
          10,
          41
        ],
        "z",
        4,
        "west-bond-records",
        "terrace"
      ],
      [
        [
          29,
          44,
          10,
          43
        ],
        "z",
        7,
        "east-fortified-wood-keep",
        "tower"
      ],
      [
        [
          7,
          37,
          34,
          43
        ],
        "x",
        3,
        "rear-stone-bastion",
        "saw"
      ]
    ],
    "finials": [
      {
        "name": "west-flanking-watch",
        "center": [
          6,
          17
        ],
        "radius": 2,
        "height": 12,
        "shape": "octagonal"
      },
      {
        "name": "east-vault-watch",
        "center": [
          38,
          20
        ],
        "radius": 2,
        "height": 15,
        "shape": "octagonal"
      }
    ],
    "vault": [
      35,
      42,
      23,
      33,
      26,
      27
    ]
  }
]);
const K=(x,y,z)=>x+','+y+','+z;
const inside=(dx,dz,r,shape)=>shape==='diamond'?Math.abs(dx)+Math.abs(dz)<=r:
  shape==='octagonal'?(Math.max(Math.abs(dx),Math.abs(dz))<=r && Math.abs(dx)+Math.abs(dz)<=Math.max(1,2*r-1)):
  Math.max(Math.abs(dx),Math.abs(dz))<=r;
export function author2ASignatureSkyline(s){
 const base=author2ALandmark(s);
 const cells=new Map(base.voxels.map(v=>[K(v.x,v.y,v.z),{...v}]));
 if(!Array.isArray(s.finials)||!s.finials.length)throw Error('source architecture must author individually visible roofline finials');
 const marks=[];
 for(const [i,f] of s.finials.entries()){
  const [cx,cz]=f.center,valid=Number.isSafeInteger(cx)&&Number.isSafeInteger(cz)&&
   ['octagonal','diamond','square'].includes(f.shape)&&Number.isSafeInteger(f.radius)&&f.radius>=1&&f.radius<=3&&
   Number.isSafeInteger(f.height)&&f.height>=9&&f.height<=18;
  if(!valid)throw Error('invalid bespoke rooftop landmark '+i);
  let placed=0;
  for(let level=2;level<=f.height;level++){
   const r=level>=f.height-1?Math.max(0,f.radius-1):f.radius;
   for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){
    if(!inside(dx,dz,r,f.shape))continue;
    const x=cx+dx,z=cz+dz,y=s.h+level,k=K(x,y,z),prior=cells.get(k);
    if(cells.get(K(x,s.h+1,z))?.kind!=='roof')throw Error('roofline finial has no actual source-roof support plate '+k);
    if(prior){if(prior.kind!=='roof')throw Error('finial intersects occupied source room '+k);continue;}
    if(cells.get(K(x,y-1,z))?.kind!=='roof')throw Error('floating rooftop-finial tier '+k);
    cells.set(k,{x,y,z,material:s.roof,kind:'roof',
      architecturalRole:'source-bearing-'+f.name,
      roofBearing:'vertically-backed-roof-cells; physical real Pack family load unapproved',
      skylineForm:f.shape,skylineHeight:f.height});
    placed++;
   }
  }
  if(placed<6)throw Error('roofline addition did not add actual original geometry '+f.name);
  marks.push({name:f.name,shape:f.shape,height:f.height,addedCells:placed,root:[cx,cz],realWalkableUpperFloor:false});
 }
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const out={...base,
  voxels,extents:{...base.extents,y:Math.max(...voxels.map(v=>v.y))+1},
  architecturalSignature:base.architecturalSignature+' / visibly different fully source-backed shaped rooftop skyline: '+marks.map(m=>m.name).join(','),
  roof:{...base.roof,form:'asymmetric gallery geometry with independently backed roofline '+marks.map(m=>m.shape).join('/')},
  skylineStructures:Object.freeze(marks.map(m=>Object.freeze(m))),
  features:[...base.features,'true source-occupied individually silhouetted rooftop timber/masonry lookout and vent geometry'],
  unresolvedDependencies:base.unresolvedDependencies,
  worldPlaced:false,numericIdsAssigned:false};
 validateBlueprint(out);return Object.freeze(out);
}
export const M1_SIGNATURE_SKYLINE_SHOPS=Object.freeze(M1_SIGNATURE_SKYLINE_SPECS.map(author2ASignatureSkyline));
