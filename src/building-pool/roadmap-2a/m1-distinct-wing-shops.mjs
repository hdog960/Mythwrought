// Builder 2A: independent, coordinate-authored nonrectangular original 3D shop architecture.
// All four wings and actual courtyards are constructed from occupied source coordinates.
import {SCHEMA,validateBlueprint} from './schema.mjs';
import {blueprintId} from './catalog.mjs';
export const M1_DISTINCT_WING_SPECS=Object.freeze([
  {
    "id": "r2:general-store:temperate:medium:04",
    "name": "Copperleaf Switchback Mercantile",
    "category": "general-store",
    "biome": "temperate",
    "size": "medium",
    "variation": 4,
    "w": 38,
    "d": 33,
    "h": 10,
    "entry": 18,
    "rects": [
      [
        10,
        27,
        0,
        13
      ],
      [
        0,
        14,
        9,
        25
      ],
      [
        24,
        37,
        10,
        22
      ],
      [
        7,
        32,
        22,
        32
      ],
      [
        12,
        26,
        12,
        23
      ]
    ],
    "voids": [
      [
        15,
        23,
        15,
        21
      ],
      [
        15,
        22,
        28,
        32
      ]
    ],
    "anchors": [
      [
        18,
        6
      ],
      [
        5,
        15
      ],
      [
        31,
        16
      ],
      [
        10,
        27
      ]
    ],
    "furniture": [
      [
        23,
        5,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        27,
        14,
        "pack5:087",
        "curio-arcade",
        "display"
      ],
      [
        6,
        19,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        30,
        27,
        "pack4:057",
        null,
        "inventory"
      ]
    ],
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "segments": [
      [
        [
          10,
          27,
          0,
          13
        ],
        "x",
        7,
        "front-merchant-clerestory"
      ],
      [
        [
          0,
          14,
          9,
          25
        ],
        "z",
        5,
        "west-switchback-gallery"
      ],
      [
        [
          24,
          37,
          10,
          22
        ],
        "z",
        4,
        "east-ledger-side-hall"
      ],
      [
        [
          7,
          32,
          22,
          32
        ],
        "x",
        4,
        "rear-caravan-shed"
      ]
    ]
  },
  {
    "id": "r2:pet-shop:snow:large:03",
    "name": "Frostfen Three-Hearth Supply",
    "category": "pet-shop",
    "biome": "snow",
    "size": "large",
    "variation": 3,
    "w": 39,
    "d": 30,
    "h": 10,
    "entry": 19,
    "rects": [
      [
        11,
        27,
        0,
        13
      ],
      [
        0,
        16,
        9,
        29
      ],
      [
        24,
        38,
        8,
        29
      ],
      [
        14,
        27,
        18,
        24
      ],
      [
        9,
        32,
        24,
        29
      ]
    ],
    "voids": [
      [
        17,
        23,
        14,
        22
      ],
      [
        14,
        20,
        26,
        29
      ]
    ],
    "anchors": [
      [
        19,
        6
      ],
      [
        5,
        18
      ],
      [
        33,
        18
      ],
      [
        12,
        27
      ]
    ],
    "furniture": [
      [
        22,
        5,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        28,
        16,
        "pack5:087",
        "curio-arcade",
        "unoccupied-display"
      ],
      [
        6,
        21,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        30,
        26,
        "pack4:057",
        null,
        "empty-pen-bedding"
      ]
    ],
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "segments": [
      [
        [
          11,
          27,
          0,
          13
        ],
        "x",
        5,
        "front-frost-eaves"
      ],
      [
        [
          0,
          16,
          9,
          29
        ],
        "z",
        6,
        "long-empty-stall-gallery"
      ],
      [
        [
          24,
          38,
          8,
          29
        ],
        "z",
        4,
        "high-ridge-tack-house"
      ],
      [
        [
          9,
          32,
          24,
          29
        ],
        "x",
        3,
        "rear-dry-supply"
      ]
    ]
  },
  {
    "id": "r2:magic-shop:desert:large:03",
    "name": "Mirage Ember Curio",
    "category": "magic-shop",
    "biome": "desert",
    "size": "large",
    "variation": 3,
    "w": 33,
    "d": 39,
    "h": 11,
    "entry": 17,
    "rects": [
      [
        7,
        25,
        0,
        10
      ],
      [
        0,
        14,
        7,
        35
      ],
      [
        21,
        32,
        10,
        38
      ],
      [
        11,
        24,
        18,
        25
      ],
      [
        3,
        29,
        32,
        38
      ]
    ],
    "voids": [
      [
        15,
        20,
        21,
        24
      ],
      [
        12,
        22,
        35,
        38
      ]
    ],
    "anchors": [
      [
        17,
        5
      ],
      [
        5,
        17
      ],
      [
        27,
        20
      ],
      [
        8,
        35
      ]
    ],
    "furniture": [
      [
        22,
        5,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        26,
        15,
        "pack5:093",
        "sunspire-reliquary-plinth",
        "sealed-curio"
      ],
      [
        5,
        20,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        27,
        35,
        "pack4:057",
        null,
        "inert-storeroom"
      ]
    ],
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "segments": [
      [
        [
          7,
          25,
          0,
          10
        ],
        "x",
        6,
        "front-solar-scales"
      ],
      [
        [
          0,
          14,
          7,
          35
        ],
        "z",
        7,
        "west-sunspire-aisle"
      ],
      [
        [
          21,
          32,
          10,
          38
        ],
        "z",
        4,
        "copper-curio-hip"
      ],
      [
        [
          3,
          29,
          32,
          38
        ],
        "x",
        3,
        "rear-sealed-museum"
      ]
    ]
  },
  {
    "id": "r2:potion-shop:enchanted-forest:large:03",
    "name": "Duskbrook Herbal Spiral",
    "category": "potion-shop",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 3,
    "w": 41,
    "d": 31,
    "h": 11,
    "entry": 20,
    "rects": [
      [
        12,
        28,
        0,
        12
      ],
      [
        0,
        16,
        8,
        30
      ],
      [
        25,
        40,
        9,
        28
      ],
      [
        10,
        32,
        23,
        30
      ],
      [
        15,
        26,
        11,
        25
      ]
    ],
    "voids": [
      [
        17,
        24,
        15,
        22
      ],
      [
        18,
        24,
        27,
        30
      ],
      [
        0,
        5,
        23,
        30
      ]
    ],
    "anchors": [
      [
        20,
        6
      ],
      [
        6,
        18
      ],
      [
        34,
        17
      ],
      [
        12,
        27
      ]
    ],
    "furniture": [
      [
        24,
        5,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        30,
        14,
        "pack5:089",
        "alchemists-spiral-stand",
        "unlit-apparatus"
      ],
      [
        6,
        21,
        "pack5:091",
        "cartographers-oak-desk",
        "herbal-records"
      ],
      [
        29,
        26,
        "pack4:057",
        null,
        "dry-herb-crate"
      ]
    ],
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "segments": [
      [
        [
          12,
          28,
          0,
          12
        ],
        "x",
        5,
        "witchwillow-entry-roof"
      ],
      [
        [
          0,
          16,
          8,
          30
        ],
        "z",
        7,
        "west-herbal-drying-gallery"
      ],
      [
        [
          25,
          40,
          9,
          28
        ],
        "z",
        4,
        "east-silent-laboratory"
      ],
      [
        [
          10,
          32,
          23,
          30
        ],
        "x",
        3,
        "rear-briar-ridge"
      ]
    ]
  },
  {
    "id": "r2:bakery:temperate:medium:03",
    "name": "Emberfield Twin-Oven Galleria",
    "category": "bakery",
    "biome": "temperate",
    "size": "medium",
    "variation": 3,
    "w": 37,
    "d": 37,
    "h": 9,
    "entry": 18,
    "rects": [
      [
        8,
        28,
        0,
        12
      ],
      [
        0,
        13,
        10,
        36
      ],
      [
        23,
        36,
        11,
        36
      ],
      [
        12,
        25,
        18,
        27
      ],
      [
        8,
        28,
        29,
        36
      ]
    ],
    "voids": [
      [
        14,
        22,
        21,
        24
      ],
      [
        16,
        22,
        33,
        36
      ]
    ],
    "anchors": [
      [
        18,
        6
      ],
      [
        6,
        17
      ],
      [
        30,
        19
      ],
      [
        11,
        33
      ]
    ],
    "furniture": [
      [
        23,
        6,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        29,
        15,
        "pack5:090",
        "ashstone-bake-oven",
        "unfired-oven"
      ],
      [
        5,
        20,
        "pack5:091",
        "cartographers-oak-desk",
        "flour-ledger"
      ],
      [
        30,
        31,
        "pack4:057",
        null,
        "dry-grain-stores"
      ]
    ],
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "segments": [
      [
        [
          8,
          28,
          0,
          12
        ],
        "x",
        5,
        "front-timber-bake-vault"
      ],
      [
        [
          0,
          13,
          10,
          36
        ],
        "z",
        5,
        "western-flour-wing"
      ],
      [
        [
          23,
          36,
          11,
          36
        ],
        "z",
        7,
        "high-oven-chimney-aisle"
      ],
      [
        [
          8,
          28,
          29,
          36
        ],
        "x",
        3,
        "rear-cooling-gallery"
      ]
    ]
  },
  {
    "id": "r2:bank:mountain:large:03",
    "name": "Highcairn Three-Vault Treasury",
    "category": "bank",
    "biome": "mountain",
    "size": "large",
    "variation": 3,
    "w": 43,
    "d": 38,
    "h": 12,
    "entry": 21,
    "rects": [
      [
        12,
        31,
        0,
        14
      ],
      [
        0,
        15,
        10,
        37
      ],
      [
        28,
        42,
        10,
        37
      ],
      [
        14,
        29,
        19,
        27
      ],
      [
        10,
        33,
        31,
        37
      ]
    ],
    "voids": [
      [
        16,
        26,
        24,
        27
      ],
      [
        18,
        26,
        34,
        37
      ]
    ],
    "anchors": [
      [
        21,
        6
      ],
      [
        6,
        17
      ],
      [
        36,
        23
      ],
      [
        12,
        34
      ]
    ],
    "furniture": [
      [
        24,
        5,
        "pack5:086",
        "ledger-service",
        "teller"
      ],
      [
        32,
        16,
        "pack5:086",
        "ledger-service",
        "secondary-teller"
      ],
      [
        6,
        20,
        "pack5:091",
        "cartographers-oak-desk",
        "public-bond-records"
      ],
      [
        30,
        34,
        "pack4:057",
        null,
        "sealed-bond-register"
      ]
    ],
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "vault": [
      33,
      40,
      19,
      27,
      22,
      23
    ],
    "segments": [
      [
        [
          12,
          31,
          0,
          14
        ],
        "x",
        7,
        "central-bond-keep"
      ],
      [
        [
          0,
          15,
          10,
          37
        ],
        "z",
        5,
        "west-administrative-gallery"
      ],
      [
        [
          28,
          42,
          10,
          37
        ],
        "z",
        6,
        "east-vault-bastion"
      ],
      [
        [
          10,
          33,
          31,
          37
        ],
        "x",
        3,
        "rear-audit-roof"
      ]
    ]
  }
]);
const key=(x,y,z)=>[x,y,z].join(',');
const contains=(rect,x,z)=>x>=rect[0]&&x<=rect[1]&&z>=rect[2]&&z<=rect[3];
function makeFootprint(s){
 const p=new Set();
 for(const rect of s.rects)for(let x=rect[0];x<=rect[1];x++)for(let z=rect[2];z<=rect[3];z++)p.add(x+','+z);
 for(const rect of s.voids)for(let x=rect[0];x<=rect[1];x++)for(let z=rect[2];z<=rect[3];z++)p.delete(x+','+z);
 return p;
}
function roomUse(category){
 const main=category==='bank'?['public-hall','teller-service']:category==='general-store'?['sales-floor','service-counter','display-shelves']:category==='pet-shop'?['sales-floor','service-counter','empty-animal-display']:category==='magic-shop'?['sales-floor','service-counter','arcane-display']:['sales-floor','service-counter'];
 const side=category==='bank'?['administrative-office']:category==='potion-shop'?['alchemy-workspace']:category==='bakery'?['oven','food-preparation']:['display-shelves','storage'];
 const back=category==='bank'?['vault']:category==='bakery'?['food-preparation','storage']:['storage'];
 const records=['storage','ledger-records'];
 return [main,side,back,records];
}
function assemble(s){
 const footprint=makeFootprint(s),vox=new Map(),openings=[],use=roomUse(s.category);
 const add=(x,y,z,material,kind,more={})=>{
  if(!footprint.has(x+','+z)||x<0||x>=s.w||z<0||z>=s.d||!Number.isSafeInteger(y)||y<0)throw Error('invalid occupied cell '+s.name+' '+key(x,y,z));
  const k=key(x,y,z);if(vox.has(k))throw Error('duplicate original architecture cell '+k);
  vox.set(k,{x,y,z,material,kind,...more});
 };
 const clear=(x,y,z)=>vox.delete(key(x,y,z));
 const get=(x,y,z)=>vox.get(key(x,y,z));
 const isEdge=(x,z)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!footprint.has((x+dx)+','+(z+dz)));
 for(const loc of footprint){const [x,z]=loc.split(',').map(Number);add(x,0,z,s.biome==='snow'?'pack1:004':'pack1:005','foundation');add(x,1,z,s.floor,'floor');}
 for(const loc of footprint){const [x,z]=loc.split(',').map(Number);if(isEdge(x,z))for(let y=2;y<=s.h;y++)add(x,y,z,s.wall,'wall',{architecturalRole:'perimeter-weather-shell'});}
 // A genuine two-wide exterior passage carved through three occupied height levels.
 for(const x of [s.entry,s.entry+1]){
  if(get(x,2,0)?.kind!=='wall')throw Error('entry has no actual front facade');
  for(let y=2;y<=4;y++)clear(x,y,0);
  openings.push({type:'entrance',x,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020',doorOpenState:'unverified'});
 }
 // Nondecorative glazing with exact matching source opening records; use exterior band only.
 for(const [x,z] of [[s.entry-6,0],[s.entry+7,0],[0,18],[s.w-1,18]]){
  for(const [n,material] of ['pack4:030','pack4:032'].entries()){
   const y=3+n,prior=get(x,y,z);if(prior?.kind!=='wall')throw Error('no real facade wall behind authored glazing '+key(x,y,z));
   vox.set(key(x,y,z),{x,y,z,material,kind:'window',architecturalRole:'real-exterior-window'});
   openings.push({type:'window',x,y,z,material});
  }
 }
 // Distributed load-bearing timber or masonry piers, not floating decorative cubes.
 const keepClear=[...s.anchors,...s.furniture.map(f=>[f[0],f[1]]),[s.entry,2],[s.entry+1,2]];
 for(const loc of footprint){
  const [x,z]=loc.split(',').map(Number);
  if(x%8!==4||z%8!==4||isEdge(x,z)||get(x,2,z))continue;
  if(keepClear.some(([px,pz])=>Math.abs(px-x)+Math.abs(pz-z)<=2))continue;
  if(s.vault&&x>=s.vault[0]-1&&x<=s.vault[1]+1&&z>=s.vault[2]-1&&z<=s.vault[3]+1)continue;
  for(let y=2;y<=s.h;y++)add(x,y,z,s.wall,'wall',{architecturalRole:'floor-founded-internal-roof-support-pier'});
 }
 // Real physically enclosed two-leaf bank vault; both candidate doors are 3-high voids.
 if(s.vault){
  const [x0,x1,z0,z1,door0,door1]=s.vault;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)if(x===x0||x===x1||z===z0||z===z1)
   for(let y=2;y<=s.h;y++){
    const prior=get(x,y,z);
    if(prior&&prior.kind!=='wall')throw Error('vault intersects protected source fixture '+key(x,y,z));
    if(!prior)add(x,y,z,'pack2:015','wall',{architecturalRole:'two-leaf-vault-bearing-enclosure'});
   }
  for(const z of [door0,door1])for(let y=2;y<=4;y++)clear(x0,y,z);
  openings.push({type:'internal-doorway',role:'vault-threshold',x:x0,y:2,z:door0,clearHeightCells:3,
   doorSymbol:'pack5:094',physicalVariant:'citadel-ironbound-leaves',intendedFacing:'east',doorOpenState:'symbolic-unverified'});
  openings.push({type:'internal-doorway',role:'vault-wide-secondary',x:x0,y:2,z:door1,clearHeightCells:3});
 }
 for(const [x,z,material,variant,role] of s.furniture){
  if(get(x,1,z)?.kind!=='floor'||get(x,2,z))throw Error('fixture/source floor conflict '+s.name+' '+key(x,2,z));
  add(x,2,z,material,'fixture',{role,physicalVariant:variant,physicalFootprintStatus:'producer-footprint-verified-only-by-lane-regression',supportIntent:'floor'});
 }
 // A roof exists ONLY above the real irregular floorplate; authentic open air stays empty.
 for(const loc of footprint){const [x,z]=loc.split(',').map(Number);add(x,s.h+1,z,s.roof,'roof',{architecturalRole:'contoured-wing-weather-roof'});}
 // Four distinct authored asymmetrical stepped ridge massings, each vertical lift supported by roof below.
 for(const [rect,axis,peak,role] of s.segments){
  const mid=axis==='x'?(rect[0]+rect[1])/2:(rect[2]+rect[3])/2;
  for(const loc of footprint){const [x,z]=loc.split(',').map(Number);if(!contains(rect,x,z))continue;
   const coord=axis==='x'?x:z,step=Math.ceil(Math.abs(coord-mid)/2.1),rise=Math.max(1,peak-step);
   for(let y=s.h+2;y<=s.h+rise;y++){
    const prior=get(x,y,z);
    if(prior){if(prior.kind!=='roof')throw Error('roof lift hits non-roof '+key(x,y,z));continue;}
    if(get(x,y-1,z)?.kind!=='roof')throw Error('floating tiered roof '+key(x,y,z));
    add(x,y,z,s.roof,'roof',{roofBearing:'supported-by-occupied-roof-directly-below',architecturalRole:role});
   }
  }
 }
 if(get(s.entry,s.h,4))throw Error('light cell intersects structure');
 add(s.entry,s.h,4,'pack4:035','decor',{role:'unlit-suspended-market-lantern'});
 const rooms=[
  {name:s.name+' arrival/public trading hall',bounds:{x0:s.entry-8,x1:s.entry+8,z0:1,z1:10},uses:use[0],access:s.anchors[0]},
  {name:s.name+' independent western working gallery',bounds:{x0:1,x1:15,z0:10,z1:s.d-5},uses:use[1],access:s.anchors[1]},
  {name:s.name+(s.category==='bank'?' sealed double-leaf vault':' eastern supplier wing'),bounds:{x0:s.w-15,x1:s.w-2,z0:9,z1:s.d-4},uses:use[2],access:s.anchors[2]},
  {name:s.name+' rear records & stock pavilion',bounds:{x0:5,x1:s.w-6,z0:s.d-12,z1:s.d-2},uses:use[3],access:s.anchors[3]}
 ];
 const main=use[0][0];
 const circulation=[{from:'exterior',to:main,via:'real 2-cell-wide 3-high entrance and continuous walkable floor'},
  ...use.slice(1).map(u=>({from:main,to:u[0],via:'connected irregular wing circulation with physical floor and supporting piers'}))];
 const voxels=[...vox.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const unresolved=[...new Set([...voxels.map(v=>v.material),...openings.filter(o=>o.doorSymbol).map(o=>o.doorSymbol)])]
   .map(ref=>({ref,issue:'Producer physical mesh, variant yaw, load span, transparency, hardware and schema-1 save require explicit central ABI signoff'}));
 const blueprint={schema:SCHEMA,id:blueprintId(s.category,s.biome,s.size,s.variation),
  category:s.category,biome:s.biome,size:s.size,variation:s.variation,title:s.name,
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  extents:{x:s.w,y:Math.max(...voxels.map(v=>v.y))+1,z:s.d},
  units:'individually authored occupied integer source cells; true Pack physical variant signoff pending',
  architecturalSignature:'independently source-constructed asymmetric wing topology / '+s.name,
  roof:{form:'four irregular supported stepped gable/ridge roof systems, void-adjacent weather walls',biomeSpecific:true},
  rooms,circulation,openings,voxels,
  courtyardGeometry:s.voids.map((r,i)=>({kind:'independent-sky-open-court',index:i,shape:r,sourceEmpty:true})),
  features:[...use.flat(), 'genuinely open source-carved courtyards','source-supported distinct pitched roof clusters','physically connected irregular wing gallery'],
  unresolvedDependencies:unresolved};
 validateBlueprint(blueprint);return Object.freeze(blueprint);
}
export const M1_DISTINCT_WING_SHOPS=Object.freeze(M1_DISTINCT_WING_SPECS.map(assemble));
