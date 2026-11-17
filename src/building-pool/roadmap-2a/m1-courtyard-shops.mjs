// Six genuinely coordinate-authored nonrectangular shops and banking plans — 2A only.
// No world placement or game state; all real Pack physical ABI still review pending.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
import {validateBlueprint} from './schema.mjs';
export const M1_COURTYARD_PROFILES=Object.freeze([
  {
    "category": "general-store",
    "biome": "enchanted-forest",
    "size": "small",
    "w": 17,
    "d": 17,
    "h": 7,
    "entry": 8,
    "partZ": [
      [
        11,
        9
      ]
    ],
    "partX": [
      [
        5,
        3,
        10,
        7
      ]
    ],
    "caps": [],
    "foundation": "pack1:001",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:026",
    "fixtures": [
      [
        12,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        12,
        8,
        "pack5:087",
        "merchandise",
        "curio-arcade"
      ],
      [
        3,
        6,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        12,
        14,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Briarwood public shop",
        "bounds": {
          "x0": 6,
          "x1": 15,
          "z0": 1,
          "z1": 10
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "display-shelves"
        ],
        "access": [
          9,
          6
        ]
      },
      {
        "name": "West counting apse",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 3,
          "z1": 10
        },
        "uses": [
          "ledger-work"
        ],
        "access": [
          3,
          7
        ]
      },
      {
        "name": "Back dry store",
        "bounds": {
          "x0": 5,
          "x1": 15,
          "z0": 12,
          "z1": 15
        },
        "uses": [
          "storage"
        ],
        "access": [
          11,
          13
        ]
      }
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        13,
        0
      ],
      [
        0,
        7
      ],
      [
        16,
        8
      ]
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "wooden portal"
      ],
      [
        "sales-floor",
        "ledger-work",
        "west counting door"
      ],
      [
        "sales-floor",
        "storage",
        "rear store arch"
      ]
    ],
    "towers": [
      [
        3,
        8,
        3
      ],
      [
        13,
        12,
        5
      ]
    ],
    "lamp": [
      8,
      7,
      3
    ],
    "roofMassing": [
      [
        9,
        13,
        4,
        7,
        5,
        "root-crown"
      ],
      [
        10,
        14,
        12,
        14,
        3,
        "cargo-hip"
      ]
    ],
    "facadeGables": [
      [
        "front",
        5,
        12,
        5
      ]
    ],
    "facadeRecesses": [
      [
        10,
        13,
        16,
        "rear-tree-alcove"
      ]
    ],
    "frontPorticoes": [
      [
        5,
        11,
        2,
        "livingwood-entrance"
      ]
    ],
    "cornerCourtyards": [
      {
        "side": "west",
        "width": 4,
        "depth": 5,
        "role": "northwestern-garden-court"
      }
    ],
    "roofForm": "L-shaped forest trader with nonrectangular garden courtyard and root crown",
    "title": "Whisperbark Corner Trading Hall",
    "signature": "small forest market L plan with separate counting chamber and recessed freight alcove",
    "variation": 2
  },
  {
    "category": "pet-shop",
    "biome": "snow",
    "size": "large",
    "w": 25,
    "d": 23,
    "h": 9,
    "entry": 12,
    "partZ": [
      [
        16,
        13
      ]
    ],
    "partX": [
      [
        8,
        4,
        15,
        9
      ]
    ],
    "caps": [],
    "foundation": "pack1:004",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:025",
    "fixtures": [
      [
        18,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        20,
        10,
        "pack5:087",
        "merchandise",
        "curio-arcade"
      ],
      [
        2,
        5,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        5,
        5,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        2,
        9,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        5,
        10,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        5,
        19,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Snow gear arcade",
        "bounds": {
          "x0": 9,
          "x1": 23,
          "z0": 1,
          "z1": 15
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          13,
          7
        ]
      },
      {
        "name": "Empty covered stalls",
        "bounds": {
          "x0": 1,
          "x1": 7,
          "z0": 4,
          "z1": 15
        },
        "uses": [
          "empty-animal-display"
        ],
        "access": [
          4,
          7
        ]
      },
      {
        "name": "Back dry feed",
        "bounds": {
          "x0": 1,
          "x1": 19,
          "z0": 17,
          "z1": 21
        },
        "uses": [
          "storage"
        ],
        "access": [
          12,
          19
        ]
      }
    ],
    "windows": [
      [
        4,
        0
      ],
      [
        20,
        0
      ],
      [
        0,
        8
      ],
      [
        24,
        9
      ]
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "snow vestibule"
      ],
      [
        "sales-floor",
        "empty-animal-display",
        "empty pen aisle"
      ],
      [
        "sales-floor",
        "storage",
        "back feed"
      ]
    ],
    "towers": [
      [
        3,
        17,
        4
      ],
      [
        20,
        17,
        5
      ]
    ],
    "lamp": [
      12,
      9,
      3
    ],
    "roofMassing": [
      [
        2,
        7,
        5,
        11,
        5,
        "empty-stall-loft"
      ],
      [
        11,
        18,
        10,
        12,
        3,
        "snow-trade-ridge"
      ]
    ],
    "facadeGables": [
      [
        "front",
        7,
        18,
        5
      ],
      [
        "rear",
        6,
        15,
        4
      ]
    ],
    "facadeRecesses": [
      [
        8,
        12,
        22,
        "feed-service"
      ]
    ],
    "frontPorticoes": [
      [
        9,
        15,
        2,
        "windproof-tack-foyer"
      ]
    ],
    "cornerCourtyards": [
      {
        "side": "east",
        "width": 5,
        "depth": 6,
        "role": "eastern-frost-yard"
      }
    ],
    "roofForm": "large snow L-shaped stable store with side empty pen wing and rear yard",
    "title": "Frostmane Empty-Stable Supplies",
    "signature": "large snow supply business with distinct west pen gallery and open eastern rear courtyard"
  },
  {
    "category": "magic-shop",
    "biome": "snow",
    "size": "medium",
    "w": 20,
    "d": 19,
    "h": 8,
    "entry": 10,
    "partZ": [
      [
        13,
        11
      ]
    ],
    "partX": [
      [
        5,
        3,
        12,
        7
      ]
    ],
    "caps": [],
    "foundation": "pack1:004",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:025",
    "fixtures": [
      [
        15,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        10,
        7,
        "pack5:093",
        "inert-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        15,
        9,
        "pack5:093",
        "inert-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        8,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        13,
        16,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Quiet snowy relic gallery",
        "bounds": {
          "x0": 6,
          "x1": 18,
          "z0": 1,
          "z1": 12
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "arcane-display"
        ],
        "access": [
          11,
          7
        ]
      },
      {
        "name": "Confidential appraisal",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 3,
          "z1": 12
        },
        "uses": [
          "secure-handling"
        ],
        "access": [
          3,
          9
        ]
      },
      {
        "name": "Back inert curios",
        "bounds": {
          "x0": 5,
          "x1": 18,
          "z0": 14,
          "z1": 17
        },
        "uses": [
          "storage"
        ],
        "access": [
          11,
          15
        ]
      }
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        16,
        0
      ],
      [
        0,
        7
      ],
      [
        19,
        8
      ]
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "frosted arched entrance"
      ],
      [
        "sales-floor",
        "secure-handling",
        "appraisal chamber"
      ],
      [
        "sales-floor",
        "storage",
        "rear cabinets"
      ]
    ],
    "towers": [
      [
        3,
        13,
        4
      ],
      [
        16,
        13,
        5
      ]
    ],
    "lamp": [
      10,
      8,
      3
    ],
    "roofMassing": [
      [
        9,
        14,
        5,
        9,
        6,
        "icy-watchtower"
      ],
      [
        8,
        14,
        14,
        16,
        3,
        "cold-archive-attic"
      ]
    ],
    "facadeGables": [
      [
        "front",
        8,
        14,
        5
      ]
    ],
    "facadeRecesses": [
      [
        11,
        15,
        18,
        "curio-view-bay"
      ]
    ],
    "frontPorticoes": [
      [
        7,
        13,
        2,
        "snow-curio-vestibule"
      ]
    ],
    "cornerCourtyards": [
      {
        "side": "west",
        "width": 4,
        "depth": 5,
        "role": "private-snow-consultation-court"
      }
    ],
    "roofForm": "medium snow curio L footprint with private snowy consultation yard",
    "title": "Glimmerfrost Relic Atelier",
    "signature": "snow magic shop with detached northwest consultation patio and distinct east retail lobby"
  },
  {
    "category": "potion-shop",
    "biome": "temperate",
    "size": "medium",
    "w": 20,
    "d": 19,
    "h": 8,
    "entry": 9,
    "partZ": [
      [
        13,
        11
      ]
    ],
    "partX": [
      [
        5,
        4,
        12,
        8
      ]
    ],
    "caps": [],
    "foundation": "pack1:001",
    "floor": "pack2:013",
    "wall": "pack2:013",
    "roof": "pack3:023",
    "fixtures": [
      [
        14,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        15,
        9,
        "pack5:087",
        "merchandise",
        "curio-arcade"
      ],
      [
        3,
        7,
        "pack5:089",
        "unlit-cauldron",
        "iron-tripod-cauldron"
      ],
      [
        3,
        10,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        11,
        16,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Tincture retail",
        "bounds": {
          "x0": 6,
          "x1": 18,
          "z0": 1,
          "z1": 12
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          10,
          7
        ]
      },
      {
        "name": "West cold still room",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 4,
          "z1": 12
        },
        "uses": [
          "alchemy-workspace"
        ],
        "access": [
          3,
          8
        ]
      },
      {
        "name": "Rear herb inventory",
        "bounds": {
          "x0": 1,
          "x1": 15,
          "z0": 14,
          "z1": 17
        },
        "uses": [
          "storage"
        ],
        "access": [
          10,
          15
        ]
      }
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        16,
        0
      ],
      [
        0,
        7
      ],
      [
        19,
        8
      ]
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "village herbal entrance"
      ],
      [
        "sales-floor",
        "alchemy-workspace",
        "west cold mixing"
      ],
      [
        "sales-floor",
        "storage",
        "back herb inventory"
      ]
    ],
    "towers": [
      [
        3,
        14,
        4
      ],
      [
        15,
        14,
        5
      ]
    ],
    "lamp": [
      9,
      8,
      3
    ],
    "roofMassing": [
      [
        7,
        12,
        5,
        10,
        5,
        "village-remedies-roof"
      ],
      [
        2,
        4,
        6,
        11,
        3,
        "cold-still-roof"
      ]
    ],
    "facadeGables": [
      [
        "front",
        6,
        14,
        5
      ]
    ],
    "facadeRecesses": [
      [
        5,
        9,
        18,
        "herb-pickup"
      ]
    ],
    "frontPorticoes": [
      [
        6,
        12,
        2,
        "village-remedy-stoop"
      ]
    ],
    "cornerCourtyards": [
      {
        "side": "east",
        "width": 4,
        "depth": 5,
        "role": "medicinal-herb-court"
      }
    ],
    "roofForm": "temperate mid-size L apothecary with actual open rear medicinal garden",
    "title": "Thistleford Herbal Physic",
    "signature": "temperate potion shop with separate inactive west workshop and eastern herb-yard notch"
  },
  {
    "category": "bakery",
    "biome": "desert",
    "size": "medium",
    "w": 21,
    "d": 20,
    "h": 8,
    "entry": 10,
    "partZ": [
      [
        14,
        10
      ]
    ],
    "partX": [
      [
        15,
        4,
        13,
        8
      ]
    ],
    "caps": [],
    "foundation": "pack1:005",
    "floor": "pack5:081",
    "wall": "pack5:079",
    "roof": "pack5:080",
    "fixtures": [
      [
        6,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        8,
        7,
        "pack5:087",
        "merchandise",
        "curio-arcade"
      ],
      [
        18,
        7,
        "pack5:090",
        "unlit-oven",
        "ashstone-bake-oven"
      ],
      [
        18,
        10,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        10,
        17,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Sandbread market",
        "bounds": {
          "x0": 1,
          "x1": 14,
          "z0": 1,
          "z1": 13
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          10,
          6
        ]
      },
      {
        "name": "East unlit oven wing",
        "bounds": {
          "x0": 16,
          "x1": 19,
          "z0": 4,
          "z1": 13
        },
        "uses": [
          "oven",
          "food-preparation"
        ],
        "access": [
          18,
          8
        ]
      },
      {
        "name": "Back flour room",
        "bounds": {
          "x0": 5,
          "x1": 19,
          "z0": 15,
          "z1": 18
        },
        "uses": [
          "storage"
        ],
        "access": [
          11,
          17
        ]
      }
    ],
    "windows": [
      [
        4,
        0
      ],
      [
        17,
        0
      ],
      [
        0,
        8
      ],
      [
        20,
        9
      ]
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "sandstone bread arcade"
      ],
      [
        "sales-floor",
        "oven",
        "unlit east oven"
      ],
      [
        "oven",
        "food-preparation",
        "oven workroom"
      ],
      [
        "sales-floor",
        "storage",
        "flour room"
      ]
    ],
    "towers": [
      [
        3,
        14,
        4
      ],
      [
        18,
        15,
        6
      ]
    ],
    "lamp": [
      10,
      8,
      3
    ],
    "roofMassing": [
      [
        8,
        12,
        5,
        9,
        4,
        "sandbread-shade"
      ],
      [
        16,
        19,
        6,
        9,
        6,
        "cold-baking-furnace-tower"
      ]
    ],
    "facadeGables": [
      [
        "front",
        7,
        13,
        4
      ],
      [
        "rear",
        9,
        16,
        4
      ]
    ],
    "facadeRecesses": [
      [
        12,
        16,
        19,
        "flour-tally-bay"
      ]
    ],
    "frontPorticoes": [
      [
        7,
        13,
        2,
        "sandbread-loggia"
      ]
    ],
    "cornerCourtyards": [
      {
        "side": "west",
        "width": 4,
        "depth": 5,
        "role": "cool-flour-courtyard"
      }
    ],
    "roofForm": "desert L breadworks with shaded open flour court and unlit ovenhouse turret",
    "title": "Saffron Dune Breadworks",
    "signature": "desert bakery with separated unlit east oven wing and open rear west flour unloading court"
  },
  {
    "category": "bank",
    "biome": "mountain",
    "size": "small",
    "w": 18,
    "d": 18,
    "h": 7,
    "entry": 9,
    "partZ": [
      [
        12,
        10
      ]
    ],
    "partX": [
      [
        5,
        3,
        11,
        7
      ]
    ],
    "caps": [],
    "foundation": "pack1:005",
    "floor": "pack2:013",
    "wall": "pack1:005",
    "roof": "pack3:025",
    "fixtures": [
      [
        12,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        14,
        8,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        3,
        7,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        12,
        15,
        "pack5:093",
        "inert-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        6,
        15,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Mountain public tellers",
        "bounds": {
          "x0": 6,
          "x1": 16,
          "z0": 1,
          "z1": 11
        },
        "uses": [
          "public-hall",
          "teller-service"
        ],
        "access": [
          9,
          6
        ]
      },
      {
        "name": "West private ledgers",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 3,
          "z1": 11
        },
        "uses": [
          "administrative-office"
        ],
        "access": [
          3,
          8
        ]
      },
      {
        "name": "Guarded rear reserve",
        "bounds": {
          "x0": 1,
          "x1": 13,
          "z0": 13,
          "z1": 16
        },
        "uses": [
          "vault"
        ],
        "access": [
          10,
          15
        ]
      }
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        14,
        0
      ],
      [
        0,
        7
      ],
      [
        17,
        8
      ]
    ],
    "routes": [
      [
        "exterior",
        "public-hall",
        "guarded granite stoop"
      ],
      [
        "public-hall",
        "administrative-office",
        "west records"
      ],
      [
        "public-hall",
        "vault",
        "two-wide secure reserve"
      ]
    ],
    "towers": [
      [
        3,
        13,
        4
      ],
      [
        14,
        12,
        5
      ]
    ],
    "lamp": [
      9,
      7,
      3
    ],
    "roofMassing": [
      [
        8,
        13,
        5,
        8,
        5,
        "guard-roof"
      ],
      [
        6,
        11,
        13,
        15,
        4,
        "vault-overstory"
      ]
    ],
    "facadeGables": [
      [
        "front",
        7,
        13,
        5
      ]
    ],
    "facadeRecesses": [
      [
        7,
        11,
        17,
        "granite-safe-alcove"
      ]
    ],
    "frontPorticoes": [
      [
        6,
        12,
        2,
        "granite-bank-portico"
      ]
    ],
    "cornerCourtyards": [
      {
        "side": "east",
        "width": 4,
        "depth": 5,
        "role": "mountain-secure-loading-yard"
      }
    ],
    "roofForm": "small mountain bank with side loading yard cut out of stone L plan",
    "title": "Ironstep Mountain Savings",
    "signature": "small mountain bank with private ledgers, two-cell vault gate and weatherproof L shaped walls",
    "vaultDoor": [
      10,
      12
    ],
    "vaultDoorOrientation": "north",
    "vaultDoorVariant": "citadel-ironbound-leaves"
  }
]);
export function carve2ARearCourtyard(bp,profile){
 const key=(x,y,z)=>[x,y,z].join(','),map=new Map(bp.voxels.map(v=>[key(v.x,v.y,v.z),{...v}])),info=[];
 for(const n of profile.cornerCourtyards){
  if(!['west','east'].includes(n.side)||!Number.isSafeInteger(n.width)||!Number.isSafeInteger(n.depth)||n.width<3||n.depth<4||!n.role)throw Error('invalid authored courtyard dimensions');
  const west=n.side==='west',xwall=west?n.width:bp.extents.x-n.width-1,zstart=bp.extents.z-n.depth;
  if(zstart<10)throw Error('courtyard clips public rooms');
  for(let z=zstart;z<bp.extents.z;z++)for(let x=west?0:xwall+1;x<(west?n.width:bp.extents.x);x++)for(let y=0;y<bp.extents.y;y++){
   const at=key(x,y,z),prior=map.get(at);
   if(prior&&(prior.kind==='fixture'||prior.kind==='window'))throw Error('notch intersects physical authored fixture '+at);
   map.delete(at);
  }
  // Explicit new two-leg perimeter, all courses directly supported by existing source floor/foundation.
  for(let z=zstart;z<bp.extents.z;z++)for(let y=2;y<=profile.h;y++){
   const at=key(xwall,y,z),prior=map.get(at);if(prior&&prior.kind!=='wall')throw Error('offset side wall collides '+at);
   map.set(at,{x:xwall,y,z,kind:'wall',material:profile.wall,architecturalRole:n.role+'-sidewall'});
  }
  for(let x=west?0:xwall+1;x<(west?n.width:bp.extents.x);x++)for(let y=2;y<=profile.h;y++){
   const z=zstart-1,at=key(x,y,z),prior=map.get(at);if(prior&&prior.kind!=='wall')throw Error('courtyard return wall collides '+at);
   map.set(at,{x,y,z,kind:'wall',material:profile.wall,architecturalRole:n.role+'-endwall'});
  }
  info.push({side:n.side,width:n.width,depth:n.depth,role:n.role,removedColumns:n.width*n.depth,innerX:xwall,innerZ:zstart-1});
 }
 const result={...bp,architecturalSignature:bp.architecturalSignature+'; physically open courtyard and shifted solid return walls',features:[...bp.features,'true nonrectangular roof/floor and two solid inner courtyard walls'],courtyardGeometry:info,voxels:[...map.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x)};
 validateBlueprint(result);return Object.freeze(result);
}
export const M1_COURTYARD_SHOPS=Object.freeze(M1_COURTYARD_PROFILES.map(p=>carve2ARearCourtyard(assembleSpecialistProfile(p),p)));
