// Roadmap 2A: source-coordinate-authored M1 sculpted-roof markets.
// Independent from production: no placed blocks, save writes, gameplay hooks or merges.
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const M1_SCULPTED_MARKET_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "desert",
    "size": "small",
    "variation": 4,
    "name": "Sandwake Windcatcher Arcade",
    "w": 34,
    "d": 42,
    "h": 9,
    "entry": 16,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        7,
        26,
        0,
        15
      ],
      [
        11,
        23,
        10,
        28
      ],
      [
        0,
        13,
        18,
        41
      ],
      [
        24,
        33,
        24,
        39
      ],
      [
        11,
        32,
        35,
        41
      ],
      [
        9,
        27,
        27,
        34
      ]
    ],
    "cuts": [
      [
        14,
        22,
        19,
        23
      ],
      [
        15,
        23,
        36,
        39
      ]
    ],
    "anchors": [
      [
        16,
        6
      ],
      [
        6,
        30
      ],
      [
        29,
        30
      ],
      [
        11,
        38
      ]
    ],
    "fixtures": [
      [
        21,
        5,
        "pack5:086",
        "ledger-service",
        "trade-counter"
      ],
      [
        7,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "windward-ledger"
      ],
      [
        28,
        28,
        "pack5:087",
        "curio-arcade",
        "dry-goods-display"
      ],
      [
        11,
        36,
        "pack4:057",
        null,
        "caravan-crate"
      ]
    ],
    "roofs": [
      [
        [
          7,
          26,
          0,
          15
        ],
        "x",
        5,
        "front-clay-arcade-gable",
        "terrace"
      ],
      [
        [
          0,
          13,
          18,
          41
        ],
        "z",
        3,
        "west-windward-roof",
        "saw"
      ],
      [
        [
          24,
          33,
          24,
          39
        ],
        "z",
        4,
        "east-seller-pitch",
        "gable"
      ],
      [
        [
          11,
          32,
          35,
          41
        ],
        "x",
        2,
        "rear-courier-terrace",
        "terrace"
      ]
    ],
    "profiles": [
      [
        "tower-windcatcher",
        [
          11,
          16,
          4,
          12
        ],
        "minaret",
        12,
        "x"
      ],
      [
        "wind-leeward-cowl",
        [
          25,
          31,
          27,
          33
        ],
        "butterfly",
        7,
        "z"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "temperate",
    "size": "large",
    "variation": 3,
    "name": "Tanglewood Butterfly-Roof Supply",
    "w": 47,
    "d": 44,
    "h": 10,
    "entry": 23,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        14,
        33,
        0,
        13
      ],
      [
        0,
        18,
        9,
        40
      ],
      [
        31,
        46,
        11,
        42
      ],
      [
        8,
        37,
        34,
        43
      ],
      [
        13,
        35,
        24,
        30
      ],
      [
        11,
        20,
        12,
        36
      ],
      [
        28,
        37,
        12,
        36
      ]
    ],
    "cuts": [
      [
        19,
        28,
        16,
        23
      ],
      [
        19,
        28,
        35,
        39
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        8,
        21
      ],
      [
        39,
        25
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
        "front-service"
      ],
      [
        8,
        23,
        "pack5:091",
        "cartographers-oak-desk",
        "empty-stall-records"
      ],
      [
        39,
        23,
        "pack5:087",
        "curio-arcade",
        "feed-display"
      ],
      [
        12,
        40,
        "pack4:057",
        null,
        "empty-pen-hardware"
      ]
    ],
    "roofs": [
      [
        [
          14,
          33,
          0,
          13
        ],
        "x",
        5,
        "front-kennel-arcade",
        "gable"
      ],
      [
        [
          0,
          18,
          9,
          40
        ],
        "z",
        3,
        "west-pen-lean-to",
        "terrace"
      ],
      [
        [
          31,
          46,
          11,
          42
        ],
        "z",
        5,
        "east-stall-roof",
        "saw"
      ],
      [
        [
          8,
          37,
          34,
          43
        ],
        "x",
        4,
        "long-rear-crescent",
        "gable"
      ]
    ],
    "profiles": [
      [
        "east-butterfly-wing",
        [
          32,
          44,
          15,
          34
        ],
        "butterfly",
        12,
        "x"
      ],
      [
        "west-high-clerestory",
        [
          2,
          15,
          19,
          31
        ],
        "clerestory",
        8,
        "z"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "snow",
    "size": "medium",
    "variation": 3,
    "name": "Asterfell Domed Starhouse",
    "w": 40,
    "d": 46,
    "h": 11,
    "entry": 20,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        11,
        29,
        0,
        16
      ],
      [
        0,
        16,
        13,
        39
      ],
      [
        25,
        39,
        15,
        42
      ],
      [
        12,
        31,
        26,
        33
      ],
      [
        6,
        33,
        38,
        45
      ],
      [
        14,
        26,
        13,
        31
      ]
    ],
    "cuts": [
      [
        17,
        24,
        18,
        24
      ],
      [
        17,
        24,
        40,
        43
      ]
    ],
    "anchors": [
      [
        20,
        6
      ],
      [
        8,
        27
      ],
      [
        32,
        25
      ],
      [
        11,
        41
      ]
    ],
    "fixtures": [
      [
        25,
        6,
        "pack5:086",
        "ledger-service",
        "archive-counter"
      ],
      [
        8,
        26,
        "pack5:091",
        "cartographers-oak-desk",
        "astrolabe-notes"
      ],
      [
        33,
        22,
        "pack5:093",
        "sunspire-reliquary-plinth",
        "inert-snow-relic"
      ],
      [
        11,
        42,
        "pack4:057",
        null,
        "sealed-scroll-case"
      ]
    ],
    "roofs": [
      [
        [
          11,
          29,
          0,
          16
        ],
        "x",
        5,
        "front-aurora-gable",
        "gable"
      ],
      [
        [
          0,
          16,
          13,
          39
        ],
        "z",
        4,
        "western-observatory-lean-to",
        "terrace"
      ],
      [
        [
          25,
          39,
          15,
          42
        ],
        "z",
        4,
        "east-ice-ridge",
        "saw"
      ],
      [
        [
          6,
          33,
          38,
          45
        ],
        "x",
        2,
        "rear-archive-hip",
        "terrace"
      ]
    ],
    "profiles": [
      [
        "rounded-ice-dome",
        [
          14,
          27,
          3,
          15
        ],
        "dome",
        12,
        "x"
      ],
      [
        "rear-sky-lantern",
        [
          8,
          15,
          34,
          39
        ],
        "minaret",
        11,
        "z"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 3,
    "name": "Rootstream Barrel-Vault Conservatory",
    "w": 45,
    "d": 42,
    "h": 10,
    "entry": 21,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        13,
        31,
        0,
        14
      ],
      [
        0,
        16,
        12,
        38
      ],
      [
        28,
        44,
        13,
        40
      ],
      [
        13,
        30,
        25,
        33
      ],
      [
        11,
        36,
        35,
        41
      ],
      [
        14,
        30,
        14,
        28
      ]
    ],
    "cuts": [
      [
        17,
        27,
        19,
        24
      ],
      [
        19,
        27,
        36,
        40
      ]
    ],
    "anchors": [
      [
        21,
        7
      ],
      [
        7,
        25
      ],
      [
        36,
        28
      ],
      [
        14,
        37
      ]
    ],
    "fixtures": [
      [
        25,
        6,
        "pack5:086",
        "ledger-service",
        "botanical-counter"
      ],
      [
        7,
        25,
        "pack5:091",
        "cartographers-oak-desk",
        "herbal-records"
      ],
      [
        36,
        28,
        "pack5:089",
        "alchemists-spiral-stand",
        "unlit-extractor"
      ],
      [
        14,
        38,
        "pack4:057",
        null,
        "dried-roots"
      ]
    ],
    "roofs": [
      [
        [
          13,
          31,
          0,
          14
        ],
        "x",
        4,
        "front-rootwood-gable",
        "gable"
      ],
      [
        [
          0,
          16,
          12,
          38
        ],
        "z",
        4,
        "western-fern-roof",
        "terrace"
      ],
      [
        [
          28,
          44,
          13,
          40
        ],
        "z",
        5,
        "eastern-glasshouse-wing",
        "gable"
      ],
      [
        [
          11,
          36,
          35,
          41
        ],
        "x",
        3,
        "rear-herb-gallery",
        "saw"
      ]
    ],
    "profiles": [
      [
        "west-barrel-vault",
        [
          1,
          15,
          15,
          34
        ],
        "barrel",
        11,
        "x"
      ],
      [
        "east-conservatory-crest",
        [
          29,
          43,
          16,
          35
        ],
        "clerestory",
        8,
        "z"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "mountain",
    "size": "small",
    "variation": 3,
    "name": "Kilnledge Sawroof Bake Loft",
    "w": 37,
    "d": 40,
    "h": 10,
    "entry": 17,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        9,
        27,
        0,
        13
      ],
      [
        0,
        13,
        10,
        35
      ],
      [
        26,
        36,
        11,
        39
      ],
      [
        10,
        31,
        26,
        32
      ],
      [
        5,
        28,
        34,
        39
      ],
      [
        11,
        27,
        20,
        28
      ]
    ],
    "cuts": [
      [
        14,
        24,
        16,
        21
      ],
      [
        15,
        25,
        35,
        38
      ]
    ],
    "anchors": [
      [
        17,
        6
      ],
      [
        6,
        24
      ],
      [
        31,
        24
      ],
      [
        9,
        36
      ]
    ],
    "fixtures": [
      [
        21,
        5,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        6,
        23,
        "pack5:091",
        "cartographers-oak-desk",
        "flour-ledger"
      ],
      [
        31,
        24,
        "pack5:090",
        "ashstone-bake-oven",
        "unlit-double-oven"
      ],
      [
        9,
        36,
        "pack4:057",
        null,
        "stone-ground-flour"
      ]
    ],
    "roofs": [
      [
        [
          9,
          27,
          0,
          13
        ],
        "x",
        5,
        "front-stone-gable",
        "gable"
      ],
      [
        [
          0,
          13,
          10,
          35
        ],
        "z",
        3,
        "west-cliff-canopy",
        "terrace"
      ],
      [
        [
          26,
          36,
          11,
          39
        ],
        "z",
        5,
        "oven-sided-tall-pitch",
        "gable"
      ],
      [
        [
          5,
          28,
          34,
          39
        ],
        "x",
        2,
        "cooling-shed",
        "terrace"
      ]
    ],
    "profiles": [
      [
        "sawtooth-oven-vents",
        [
          27,
          35,
          15,
          34
        ],
        "sawtooth",
        13,
        "z"
      ],
      [
        "smoke-baffle",
        [
          2,
          11,
          14,
          27
        ],
        "butterfly",
        7,
        "x"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "temperate",
    "size": "small",
    "variation": 2,
    "name": "Coppervault Mansard Gatehouse",
    "w": 43,
    "d": 44,
    "h": 12,
    "entry": 20,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        11,
        31,
        0,
        15
      ],
      [
        0,
        16,
        11,
        42
      ],
      [
        28,
        42,
        12,
        42
      ],
      [
        12,
        34,
        26,
        34
      ],
      [
        9,
        35,
        37,
        43
      ],
      [
        14,
        30,
        13,
        29
      ]
    ],
    "cuts": [
      [
        18,
        26,
        18,
        24
      ],
      [
        18,
        26,
        38,
        41
      ]
    ],
    "anchors": [
      [
        20,
        7
      ],
      [
        8,
        25
      ],
      [
        36,
        28
      ],
      [
        13,
        40
      ]
    ],
    "fixtures": [
      [
        25,
        5,
        "pack5:086",
        "ledger-service",
        "bond-teller"
      ],
      [
        8,
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "record-desk"
      ],
      [
        37,
        19,
        "pack5:086",
        "ledger-service",
        "separate-service-window"
      ],
      [
        13,
        39,
        "pack4:057",
        null,
        "sealed-tokens"
      ]
    ],
    "roofs": [
      [
        [
          11,
          31,
          0,
          15
        ],
        "x",
        6,
        "public-stone-bond-hall",
        "gable"
      ],
      [
        [
          0,
          16,
          11,
          42
        ],
        "z",
        4,
        "west-ledger-sawroof",
        "saw"
      ],
      [
        [
          28,
          42,
          12,
          42
        ],
        "z",
        7,
        "eastern-vault-parapet",
        "tower"
      ],
      [
        [
          9,
          35,
          37,
          43
        ],
        "x",
        3,
        "rear-audit-portico",
        "terrace"
      ]
    ],
    "profiles": [
      [
        "main-mansard-crown",
        [
          12,
          30,
          3,
          13
        ],
        "mansard",
        14,
        "x"
      ],
      [
        "vault-fortified-clerestory",
        [
          32,
          40,
          24,
          32
        ],
        "clerestory",
        10,
        "z"
      ]
    ],
    "vault": [
      32,
      40,
      22,
      32,
      25,
      26
    ]
  }
]);
const K=(x,y,z)=>[x,y,z].join(',');
function riseFor(style,x,z,r,peak,axis){
 const w=Math.max(1,r[1]-r[0]),d=Math.max(1,r[3]-r[2]);
 const u=Math.min(1,Math.abs(2*(x-r[0])/w-1)),v=Math.min(1,Math.abs(2*(z-r[2])/d-1));
 const primary=axis==='x'?u:v,secondary=axis==='x'?v:u,coord=axis==='x'?x-r[0]:z-r[2];
 let factor=0;
 if(style==='barrel')factor=Math.sqrt(Math.max(0,1-primary*primary));
 else if(style==='butterfly')factor=.25+.75*primary;
 else if(style==='dome')factor=Math.sqrt(Math.max(0,1-(u*u+v*v)*.6));
 else if(style==='clerestory')factor=primary<=.55?.99:.25;
 else if(style==='minaret')factor=Math.max(.16,1-.72*Math.max(primary,secondary));
 else if(style==='mansard')factor=primary<.62&&secondary<.75?.95:.32;
 else if(style==='sawtooth')factor=.25+.75*((Math.floor(coord)%7)/6);
 else throw Error('unapproved bespoke roof profile '+style);
 return Math.max(1,Math.ceil(peak*factor));
}
export function author2ASculptedMarket(s){
 const baseline=author2ALandmark(s),cells=new Map(baseline.voxels.map(v=>[K(v.x,v.y,v.z),{...v}]));
 const profiles=[];
 if(!Array.isArray(s.profiles)||s.profiles.length<2)throw Error('one generic roof shape is not an original sculpted landmark');
 for(const [index,[name,rect,style,peak,axis]] of s.profiles.entries()){
  if(!name||!['barrel','butterfly','dome','clerestory','minaret','mansard','sawtooth'].includes(style)||
    !['x','z'].includes(axis)||!Number.isInteger(peak)||peak<6||peak>16||
    !Array.isArray(rect)||rect.length!==4||rect.some(n=>!Number.isInteger(n))||
    rect[0]<0||rect[2]<0||rect[1]>=s.w||rect[3]>=s.d||rect[1]<=rect[0]||rect[3]<=rect[2])
   throw Error('invalid independently authored sculpted roof');
  let added=0,affected=0,highest=s.h+1;
  for(let x=rect[0];x<=rect[1];x++)for(let z=rect[2];z<=rect[3];z++){
   if(cells.get(K(x,s.h+1,z))?.kind!=='roof')continue;
   affected++;
   const target=s.h+2+riseFor(style,x,z,rect,peak,axis);
   for(let y=s.h+2;y<=target;y++){
    const at=K(x,y,z),old=cells.get(at);
    if(old){if(old.kind!=='roof')throw Error('roof profile intersects unrelated source cell '+at);continue;}
    if(cells.get(K(x,y-1,z))?.kind!=='roof')throw Error('floating sculpted roof cell '+at);
    cells.set(at,{x,y,z,kind:'roof',material:s.roof,
     architecturalRole:'independently-shaped-'+name,roofProfile:style,
     roofBearing:'solid-roof-rooted-column-not-physical-long-span-certification'});
    added++;highest=Math.max(highest,y);
   }
  }
  if(added<40||affected<12)throw Error('roof region lacks substantial physical source geometry '+name);
  profiles.push(Object.freeze({name,style,axis,addedCells:added,roofRootColumns:affected,highest,upperFloorAccessible:false}));
 }
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const b={...baseline,voxels,extents:{...baseline.extents,y:Math.max(...voxels.map(v=>v.y))+1},
  roof:{...baseline.roof,form:'source-occupied non-cubic '+profiles.map(f=>f.style).join('/')+' stepped arches'},
  architecturalSignature:baseline.architecturalSignature+' / sculpted source architecture: '+profiles.map(f=>f.name+' '+f.style).join(' and '),
  roofProfiles:Object.freeze(profiles),
  features:[...baseline.features,'real physically rooted differing asymmetrical roof volumetric profiles, no upper floor claim'],
  worldPlaced:false,numericIdsAssigned:false};
 validateBlueprint(b);return Object.freeze(b);
}
export const M1_SCULPTED_MARKETS=Object.freeze(M1_SCULPTED_MARKET_SPECS.map(author2ASculptedMarket));
