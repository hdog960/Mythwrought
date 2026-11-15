import {SCHEMA,validateBlueprint} from './schema.mjs';
import {blueprintId} from './catalog.mjs';
// Explicit hand-authored coordinate plans, one original exemplar per nonlegacy category.
// No creatures, spells, alchemy/cooking, banking logic or settlement placement.
const PROFILES=[
  {
    "category": "pet-shop",
    "biome": "temperate",
    "size": "small",
    "w": 16,
    "d": 15,
    "h": 6,
    "entry": 8,
    "roof": "pack3:023",
    "wall": "pack5:079",
    "floor": "pack2:013",
    "foundation": "pack1:001",
    "partZ": [
      [
        10,
        8
      ]
    ],
    "partX": [],
    "caps": [],
    "windows": [
      [
        3,
        0
      ],
      [
        12,
        0
      ],
      [
        0,
        5
      ],
      [
        15,
        6
      ]
    ],
    "fixtures": [
      [
        11,
        3,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        2,
        4,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        3,
        4,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        4,
        4,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        5,
        4,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        2,
        5,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        5,
        5,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        2,
        6,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        5,
        6,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        2,
        7,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        3,
        7,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        4,
        7,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        5,
        7,
        "pack5:096",
        "empty-display-rail",
        "oak-stall-divider"
      ],
      [
        13,
        7,
        "pack5:087",
        "supply-shelf",
        "stepped-market-tray"
      ],
      [
        3,
        12,
        "pack4:057",
        "crate",
        "unresolved"
      ],
      [
        12,
        12,
        "pack4:057",
        "crate",
        "unresolved"
      ]
    ],
    "rooms": [
      {
        "name": "Empty-display retail hall",
        "bounds": {
          "x0": 1,
          "x1": 14,
          "z0": 1,
          "z1": 9
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "empty-animal-display"
        ],
        "access": [
          8,
          5
        ]
      },
      {
        "name": "Equipment storeroom",
        "bounds": {
          "x0": 1,
          "x1": 14,
          "z0": 11,
          "z1": 13
        },
        "uses": [
          "storage"
        ],
        "access": [
          8,
          12
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "front walkable entrance"
      ],
      [
        "sales-floor",
        "storage",
        "three-high rear stockroom aperture"
      ]
    ],
    "towers": [
      [
        3,
        7,
        4
      ],
      [
        12,
        7,
        3
      ]
    ],
    "lamp": [
      8,
      6,
      3
    ],
    "title": "Linden Hollow Pet Supply House",
    "roofForm": "timber-rim roof with two unequal lookout supports",
    "signature": "left twelve-rail physically empty display enclosure, east service counter, rear equipment storage, asymmetrical roof"
  },
  {
    "category": "magic-shop",
    "biome": "enchanted-forest",
    "size": "medium",
    "w": 19,
    "d": 18,
    "h": 8,
    "entry": 9,
    "roof": "pack3:026",
    "wall": "pack5:079",
    "floor": "pack2:013",
    "foundation": "pack1:005",
    "partZ": [
      [
        12,
        10
      ]
    ],
    "partX": [
      [
        5,
        4,
        10,
        7
      ]
    ],
    "caps": [
      [
        3,
        1,
        4
      ],
      [
        11,
        1,
        4
      ]
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        15,
        0
      ],
      [
        18,
        7
      ],
      [
        0,
        8
      ]
    ],
    "fixtures": [
      [
        13,
        3,
        "pack5:086",
        "service-counter",
        "festival-fascia"
      ],
      [
        8,
        5,
        "pack5:093",
        "unpowered-display-plinth",
        "sunspire-reliquary-plinth"
      ],
      [
        11,
        6,
        "pack5:093",
        "unpowered-display-plinth",
        "sunspire-reliquary-plinth"
      ],
      [
        8,
        9,
        "pack5:093",
        "unpowered-display-plinth",
        "sunspire-reliquary-plinth"
      ],
      [
        13,
        10,
        "pack5:093",
        "unpowered-display-plinth",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        8,
        "pack5:091",
        "secure-table",
        "cartographers-oak-desk"
      ],
      [
        15,
        14,
        "pack4:057",
        "sealed-crate",
        "unresolved"
      ]
    ],
    "rooms": [
      {
        "name": "Curios showroom",
        "bounds": {
          "x0": 6,
          "x1": 17,
          "z0": 1,
          "z1": 11
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "arcane-display"
        ],
        "access": [
          9,
          6
        ]
      },
      {
        "name": "Enclosed consultation bay",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 4,
          "z1": 10
        },
        "uses": [
          "secure-handling"
        ],
        "access": [
          3,
          7
        ]
      },
      {
        "name": "Rear material store",
        "bounds": {
          "x0": 1,
          "x1": 17,
          "z0": 13,
          "z1": 16
        },
        "uses": [
          "storage"
        ],
        "access": [
          10,
          14
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "treeframe front entry"
      ],
      [
        "sales-floor",
        "secure-handling",
        "side door x5,z7"
      ],
      [
        "sales-floor",
        "storage",
        "rear opening x10,z12"
      ]
    ],
    "towers": [
      [
        2,
        5,
        4
      ],
      [
        3,
        5,
        4
      ],
      [
        4,
        5,
        4
      ],
      [
        5,
        5,
        4
      ]
    ],
    "lamp": [
      9,
      8,
      3
    ],
    "title": "Whisperwood Curios and Sealed Relics",
    "roofForm": "livingwood canopy with high off-center roof piers",
    "signature": "nineteen-wide hall with left secure handling room and separate rear store, unpowered pedestals and raised piers"
  },
  {
    "category": "potion-shop",
    "biome": "snow",
    "size": "medium",
    "w": 18,
    "d": 19,
    "h": 8,
    "entry": 9,
    "roof": "pack3:025",
    "wall": "pack5:079",
    "floor": "pack2:013",
    "foundation": "pack1:001",
    "partZ": [
      [
        12,
        9
      ]
    ],
    "partX": [
      [
        12,
        4,
        10,
        7
      ]
    ],
    "caps": [
      [
        3,
        13,
        16
      ],
      [
        11,
        13,
        16
      ]
    ],
    "windows": [
      [
        4,
        0
      ],
      [
        14,
        0
      ],
      [
        17,
        8
      ],
      [
        0,
        6
      ]
    ],
    "fixtures": [
      [
        5,
        4,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        4,
        7,
        "pack5:087",
        "sealed-bottle-shelf",
        "curio-arcade"
      ],
      [
        6,
        8,
        "pack5:087",
        "sealed-bottle-shelf",
        "curio-arcade"
      ],
      [
        9,
        6,
        "pack5:087",
        "sealed-bottle-shelf",
        "curio-arcade"
      ],
      [
        15,
        8,
        "pack5:089",
        "unpowered-alchemy-station",
        "alchemists-spiral-stand"
      ],
      [
        14,
        5,
        "pack5:091",
        "formula-table",
        "cartographers-oak-desk"
      ],
      [
        4,
        15,
        "pack4:057",
        "stock-crate",
        "unresolved"
      ]
    ],
    "rooms": [
      {
        "name": "Snowfront apothecary",
        "bounds": {
          "x0": 1,
          "x1": 11,
          "z0": 1,
          "z1": 11
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          9,
          5
        ]
      },
      {
        "name": "Closed dry preparation cell",
        "bounds": {
          "x0": 13,
          "x1": 16,
          "z0": 4,
          "z1": 10
        },
        "uses": [
          "alchemy-workspace"
        ],
        "access": [
          14,
          7
        ]
      },
      {
        "name": "Protected rear supplies",
        "bounds": {
          "x0": 1,
          "x1": 16,
          "z0": 13,
          "z1": 17
        },
        "uses": [
          "storage"
        ],
        "access": [
          9,
          14
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "main winter entrance"
      ],
      [
        "sales-floor",
        "alchemy-workspace",
        "east door x12,z7"
      ],
      [
        "sales-floor",
        "storage",
        "rear door x9,z12"
      ]
    ],
    "towers": [
      [
        3,
        2,
        3
      ],
      [
        5,
        2,
        3
      ],
      [
        7,
        2,
        3
      ],
      [
        9,
        2,
        3
      ],
      [
        11,
        2,
        3
      ],
      [
        13,
        2,
        3
      ]
    ],
    "lamp": [
      9,
      8,
      3
    ],
    "title": "Frostglass Apothecary Hall",
    "roofForm": "winter shed with six raised snow-edge supports",
    "signature": "side-isolated dry alchemy room, three sealed bottle displays and deep winter storeroom"
  },
  {
    "category": "bakery",
    "biome": "desert",
    "size": "small",
    "w": 16,
    "d": 16,
    "h": 6,
    "entry": 8,
    "roof": "pack5:080",
    "wall": "pack5:079",
    "floor": "pack5:081",
    "foundation": "pack1:005",
    "partZ": [
      [
        10,
        8
      ]
    ],
    "partX": [
      [
        11,
        4,
        9,
        6
      ]
    ],
    "caps": [
      [
        3,
        12,
        14
      ]
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
        15,
        7
      ],
      [
        0,
        7
      ]
    ],
    "fixtures": [
      [
        5,
        3,
        "pack5:086",
        "baker-counter",
        "festival-fascia"
      ],
      [
        13,
        7,
        "pack5:090",
        "unlit-oven",
        "ashstone-bake-oven"
      ],
      [
        13,
        5,
        "pack5:091",
        "prep-table",
        "cartographers-oak-desk"
      ],
      [
        3,
        12,
        "pack4:057",
        "flour-crate",
        "unresolved"
      ]
    ],
    "rooms": [
      {
        "name": "Street bread counter",
        "bounds": {
          "x0": 1,
          "x1": 10,
          "z0": 1,
          "z1": 9
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          8,
          4
        ]
      },
      {
        "name": "Separate non-operational bake room",
        "bounds": {
          "x0": 12,
          "x1": 14,
          "z0": 4,
          "z1": 9
        },
        "uses": [
          "oven",
          "food-preparation"
        ],
        "access": [
          12,
          6
        ]
      },
      {
        "name": "Pantry",
        "bounds": {
          "x0": 1,
          "x1": 14,
          "z0": 11,
          "z1": 14
        },
        "uses": [
          "storage"
        ],
        "access": [
          8,
          12
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "front market-side counter"
      ],
      [
        "sales-floor",
        "oven",
        "east oven door x11,z6"
      ],
      [
        "oven",
        "food-preparation",
        "open nonfunctional prep cell"
      ],
      [
        "sales-floor",
        "storage",
        "rear pantry door x8,z10"
      ]
    ],
    "towers": [
      [
        13,
        8,
        5
      ]
    ],
    "lamp": [
      8,
      6,
      3
    ],
    "title": "Sirocco Oven Court Bakery",
    "roofForm": "flat desert parapet with single braced stone-flue stack",
    "signature": "desert bakery with separate east oven and prep chamber, unlit physical oven and rear pantry"
  },
  {
    "category": "bank",
    "biome": "mountain",
    "size": "large",
    "w": 24,
    "d": 23,
    "h": 9,
    "entry": 11,
    "roof": "pack3:025",
    "wall": "pack1:005",
    "floor": "pack1:001",
    "foundation": "pack1:005",
    "partZ": [
      [
        15,
        17
      ]
    ],
    "partX": [
      [
        5,
        4,
        13,
        8
      ],
      [
        13,
        16,
        21,
        18
      ]
    ],
    "caps": [
      [
        3,
        1,
        4
      ],
      [
        14,
        1,
        4
      ]
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        20,
        0
      ],
      [
        23,
        8
      ],
      [
        0,
        8
      ]
    ],
    "fixtures": [
      [
        9,
        5,
        "pack5:086",
        "teller-counter",
        "ledger-service"
      ],
      [
        11,
        5,
        "pack5:086",
        "teller-counter",
        "ledger-service"
      ],
      [
        13,
        5,
        "pack5:086",
        "teller-counter",
        "ledger-service"
      ],
      [
        15,
        5,
        "pack5:086",
        "teller-counter",
        "ledger-service"
      ],
      [
        3,
        9,
        "pack5:091",
        "records-desk",
        "cartographers-oak-desk"
      ],
      [
        5,
        18,
        "pack5:093",
        "inactive-vault-base",
        "runesworn-stone-altar"
      ],
      [
        8,
        19,
        "pack4:057",
        "vault-crate",
        "unresolved"
      ],
      [
        19,
        19,
        "pack4:057",
        "transit-crate",
        "unresolved"
      ]
    ],
    "rooms": [
      {
        "name": "Four counter public hall",
        "bounds": {
          "x0": 6,
          "x1": 22,
          "z0": 1,
          "z1": 14
        },
        "uses": [
          "public-hall",
          "teller-service"
        ],
        "access": [
          11,
          9
        ]
      },
      {
        "name": "Records administration office",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 4,
          "z1": 13
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
        "name": "Stone-lined vault",
        "bounds": {
          "x0": 1,
          "x1": 12,
          "z0": 16,
          "z1": 21
        },
        "uses": [
          "vault"
        ],
        "access": [
          10,
          18
        ]
      },
      {
        "name": "Secure rear corridor",
        "bounds": {
          "x0": 14,
          "x1": 22,
          "z0": 16,
          "z1": 21
        },
        "uses": [
          "vault-service"
        ],
        "access": [
          17,
          18
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "public-hall",
        "south gate"
      ],
      [
        "public-hall",
        "administrative-office",
        "west office door x5,z8"
      ],
      [
        "public-hall",
        "vault-service",
        "rear opening x17,z15"
      ],
      [
        "vault-service",
        "vault",
        "vault threshold x13,z18"
      ]
    ],
    "towers": [
      [
        2,
        2,
        3
      ],
      [
        5,
        2,
        3
      ],
      [
        8,
        2,
        3
      ],
      [
        11,
        2,
        3
      ],
      [
        14,
        2,
        3
      ],
      [
        17,
        2,
        3
      ],
      [
        20,
        2,
        3
      ],
      [
        22,
        2,
        3
      ],
      [
        3,
        19,
        5
      ]
    ],
    "lamp": [
      11,
      9,
      3
    ],
    "vaultDoor": [
      13,
      18
    ],
    "title": "Stonecrest Treasury and Records Hall",
    "roofForm": "massive stone parapet and rear vault tower",
    "signature": "24-wide four-room treasury with own records office, four counter cells, right transit and left physically enclosed vault"
  }
];
const assemble=function assemble(p){
 const voxel=new Map(),roomLinks=p.routes.map(([from,to,via])=>({from,to,via})),openings=[],k=(x,y,z)=>`${x},${y},${z}`;
 const put=(x,y,z,material,kind,more={})=>{if(![x,y,z].every(Number.isInteger)||x<0||z<0||y<0||x>=p.w||z>=p.d)throw Error('invalid placement '+k(x,y,z));const key=k(x,y,z);if(voxel.has(key))throw Error('overlapping geometry '+key);voxel.set(key,{x,y,z,material,kind,...more});};
 const remove=(x,y,z)=>voxel.delete(k(x,y,z));
 for(let x=0;x<p.w;x++)for(let z=0;z<p.d;z++){put(x,0,z,p.foundation,'foundation');put(x,1,z,p.floor,'floor');}
 for(let x=0;x<p.w;x++)for(let z=0;z<p.d;z++)if(x===0||z===0||x===p.w-1||z===p.d-1)
  for(let y=2;y<=p.h;y++)put(x,y,z,p.wall,'wall');
 for(let y=2;y<=4;y++)remove(p.entry,y,0);
 openings.push({type:'entrance',x:p.entry,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020',doorOpenState:'unverified'});
 for(const [z,doorX] of p.partZ){for(let x=1;x<p.w-1;x++)for(let y=2;y<=4;y++)if(x!==doorX)put(x,y,z,'pack2:015','wall');openings.push({type:'internal-doorway',x:doorX,y:2,z,clearHeightCells:3});}
 for(const [x,z0,z1,doorZ] of p.partX){for(let z=z0;z<=z1;z++)for(let y=2;y<=4;y++)if(z!==doorZ)put(x,y,z,'pack2:015','wall');openings.push({type:'internal-doorway',x,y:2,z:doorZ,clearHeightCells:3});}
 for(const [z,x0,x1] of p.caps)for(let x=x0;x<=x1;x++)for(let y=2;y<=4;y++)put(x,y,z,'pack2:015','wall');
 for(const [x,z] of p.windows)for(const [i,material] of ['pack4:030','pack4:032'].entries()){const y=3+i,key=k(x,y,z);if(voxel.get(key)?.kind!=='wall')throw Error('missing window wall '+key);voxel.set(key,{x,y,z,material,kind:'window'});}
 for(const [x,z,material,role,physicalVariant] of p.fixtures){if(!voxel.has(k(x,1,z))||voxel.has(k(x,2,z)))throw Error('invalid fixture floor '+k(x,2,z));put(x,2,z,material,'fixture',{role,physicalVariant,physicalFootprintStatus:'unresolved-until-families-preflight',supportIntent:'floor'});}
 // A physically backed roof plate and attached parapet; unsupported visual
 // towers are avoided by stacking their cells directly above a plate cell.
 for(let x=0;x<p.w;x++)for(let z=0;z<p.d;z++)put(x,p.h+1,z,p.roof,'roof');
 for(let x=0;x<p.w;x++)for(let z=0;z<p.d;z++)if(x===0||x===p.w-1||z===0||z===p.d-1)put(x,p.h+2,z,'pack2:015','roof');
 for(const [x,z,top] of p.towers)for(let extra=2;extra<=top;extra++)put(x,p.h+extra,z,'pack2:015','roof');
 const [lx,ly,lz]=p.lamp;put(lx,ly,lz,'pack4:035','decor',{role:'suspended-light-no-emission'});
 if(p.vaultDoor){const vault=openings.find(o=>o.type==='internal-doorway'&&o.x===p.vaultDoor[0]&&o.z===p.vaultDoor[1]);if(!vault)throw Error('missing planned vault door');vault.doorSymbol='pack5:094';vault.role='vault-threshold';vault.doorOpenState='symbolic-unverified';}
 const voxels=[...voxel.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const fullOpenings=[...openings,...voxels.filter(v=>v.kind==='window').map(({x,y,z,material})=>({type:'window',x,y,z,material}))];
 const symbols=[...new Set([...voxels.map(v=>v.material),...openings.map(o=>o.doorSymbol).filter(Boolean)])];
 const bp={schema:SCHEMA,id:blueprintId(p.category,p.biome,p.size,1),category:p.category,biome:p.biome,size:p.size,variation:1,title:p.title,
 status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,extents:{x:p.w,y:Math.max(...voxels.map(v=>v.y))+1,z:p.d},
 units:'conceptual occupied integer cells; variant multi-cell ABI not approved',architecturalSignature:p.signature,
 roof:{form:p.roofForm,biomeSpecific:true},rooms:p.rooms,features:['genuine category-specific material/fixture coordinates','no simulated shop gameplay or world placement'],
 openings:fullOpenings,circulation:roomLinks,
 unresolvedDependencies:symbols.map(ref=>({ref,issue:'Real shape dimensions, variant, yaw, collision, transparency, support and schema-1 save sidecar need separate physical ABI verification'})),
 voxels};validateBlueprint(bp);return Object.freeze(bp);
};
export const M1_SPECIALIST_EXEMPLARS=Object.freeze(PROFILES.map(assemble));
export const M1_SPECIALIST_COUNTS=Object.freeze(Object.fromEntries(M1_SPECIALIST_EXEMPLARS.map(b=>[b.category,1])));

// M1-authored extension point; no alteration to the preserved five exemplars.
export const assembleSpecialistProfile=assemble;
