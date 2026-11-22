// Roadmap 2A source-authored M1 landmark set: six non-cross, asymmetrical voxel structures.
// Detached prototype candidates ONLY: no world placement, persistence, AI or gameplay hooks.
import {SCHEMA,validateBlueprint} from './schema.mjs';
import {blueprintId} from './catalog.mjs';
export const M1_LANDMARK_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 3,
    "name": "Thistledock Switchback Exchange",
    "w": 44,
    "d": 40,
    "h": 10,
    "entry": 21,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        14,
        29,
        0,
        13
      ],
      [
        0,
        18,
        9,
        24
      ],
      [
        11,
        36,
        20,
        26
      ],
      [
        29,
        43,
        20,
        39
      ],
      [
        2,
        17,
        32,
        39
      ],
      [
        11,
        32,
        32,
        36
      ],
      [
        11,
        17,
        24,
        34
      ]
    ],
    "cuts": [
      [
        18,
        28,
        24,
        25
      ],
      [
        19,
        27,
        34,
        36
      ]
    ],
    "anchors": [
      [
        21,
        6
      ],
      [
        6,
        19
      ],
      [
        36,
        31
      ],
      [
        12,
        35
      ]
    ],
    "fixtures": [
      [
        25,
        5,
        "pack5:086",
        "ledger-service",
        "service counter"
      ],
      [
        8,
        18,
        "pack5:091",
        "cartographers-oak-desk",
        "western records"
      ],
      [
        35,
        28,
        "pack5:087",
        "curio-arcade",
        "dried goods gallery"
      ],
      [
        12,
        34,
        "pack4:057",
        null,
        "inventory crate"
      ]
    ],
    "roofs": [
      [
        [
          14,
          29,
          0,
          13
        ],
        "x",
        7,
        "front-merchants-timber-gable",
        "gable"
      ],
      [
        [
          0,
          18,
          9,
          24
        ],
        "z",
        4,
        "west-swap-gallery-sawteeth",
        "saw"
      ],
      [
        [
          29,
          43,
          20,
          39
        ],
        "z",
        5,
        "tall-merchant-counting-roof",
        "tower"
      ],
      [
        [
          2,
          17,
          32,
          39
        ],
        "x",
        3,
        "rear-ferry-porch",
        "terrace"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "desert",
    "size": "large",
    "variation": 3,
    "name": "Aurelia Crescent Empty-Stall Bazaar",
    "w": 45,
    "d": 39,
    "h": 10,
    "entry": 22,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        12,
        32,
        0,
        13
      ],
      [
        0,
        17,
        10,
        38
      ],
      [
        27,
        44,
        9,
        38
      ],
      [
        12,
        32,
        32,
        38
      ],
      [
        13,
        29,
        25,
        33
      ]
    ],
    "cuts": [
      [
        18,
        26,
        14,
        25
      ],
      [
        19,
        25,
        34,
        37
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        7,
        22
      ],
      [
        36,
        20
      ],
      [
        15,
        34
      ]
    ],
    "fixtures": [
      [
        27,
        5,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        8,
        19,
        "pack5:091",
        "cartographers-oak-desk",
        "empty pen records"
      ],
      [
        35,
        18,
        "pack5:087",
        "curio-arcade",
        "dry feed shelf"
      ],
      [
        15,
        35,
        "pack4:057",
        null,
        "empty stall bedding"
      ]
    ],
    "roofs": [
      [
        [
          12,
          32,
          0,
          13
        ],
        "x",
        6,
        "entry-mudbrick-sunshade",
        "terrace"
      ],
      [
        [
          0,
          17,
          10,
          38
        ],
        "z",
        3,
        "western-empty-pen-ridge",
        "saw"
      ],
      [
        [
          27,
          44,
          9,
          38
        ],
        "z",
        7,
        "east-stall-watch-spire",
        "tower"
      ],
      [
        [
          12,
          32,
          32,
          38
        ],
        "x",
        4,
        "rear-feed-gallery",
        "gable"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "mountain",
    "size": "large",
    "variation": 3,
    "name": "Starfall Lantern Galleries",
    "w": 47,
    "d": 43,
    "h": 11,
    "entry": 23,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        16,
        30,
        0,
        17
      ],
      [
        0,
        20,
        14,
        28
      ],
      [
        27,
        46,
        15,
        31
      ],
      [
        12,
        36,
        25,
        42
      ],
      [
        15,
        33,
        20,
        29
      ]
    ],
    "cuts": [
      [
        20,
        26,
        18,
        21
      ],
      [
        20,
        28,
        34,
        39
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        7,
        21
      ],
      [
        39,
        24
      ],
      [
        14,
        36
      ]
    ],
    "fixtures": [
      [
        28,
        5,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        7,
        20,
        "pack5:091",
        "cartographers-oak-desk",
        "scroll ledger"
      ],
      [
        38,
        22,
        "pack5:093",
        "sunspire-reliquary-plinth",
        "inert relic"
      ],
      [
        14,
        37,
        "pack4:057",
        null,
        "sealed curio chest"
      ]
    ],
    "roofs": [
      [
        [
          16,
          30,
          0,
          17
        ],
        "x",
        8,
        "high-oriel-front-gable",
        "gable"
      ],
      [
        [
          0,
          20,
          14,
          28
        ],
        "z",
        5,
        "twin-stair-alcoves",
        "saw"
      ],
      [
        [
          27,
          46,
          15,
          31
        ],
        "z",
        3,
        "eastern-astrolabe-terrace",
        "terrace"
      ],
      [
        [
          12,
          36,
          25,
          42
        ],
        "x",
        6,
        "rear-scroll-chimney",
        "tower"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "snow",
    "size": "large",
    "variation": 3,
    "name": "Rimebreak Cascade Apothecary",
    "w": 49,
    "d": 38,
    "h": 10,
    "entry": 23,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        16,
        30,
        0,
        15
      ],
      [
        8,
        32,
        10,
        20
      ],
      [
        0,
        18,
        16,
        27
      ],
      [
        12,
        37,
        24,
        31
      ],
      [
        29,
        48,
        20,
        37
      ],
      [
        5,
        24,
        32,
        37
      ]
    ],
    "cuts": [
      [
        18,
        27,
        16,
        18
      ],
      [
        19,
        28,
        27,
        29
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        8,
        22
      ],
      [
        40,
        27
      ],
      [
        14,
        33
      ]
    ],
    "fixtures": [
      [
        28,
        5,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        8,
        21,
        "pack5:091",
        "cartographers-oak-desk",
        "apothecary records"
      ],
      [
        40,
        26,
        "pack5:089",
        "alchemists-spiral-stand",
        "unlit brewing apparatus"
      ],
      [
        14,
        34,
        "pack4:057",
        null,
        "dry root crate"
      ]
    ],
    "roofs": [
      [
        [
          16,
          30,
          0,
          15
        ],
        "x",
        5,
        "front-apothecary-hip",
        "gable"
      ],
      [
        [
          0,
          18,
          16,
          27
        ],
        "z",
        7,
        "western-snow-drying-stack",
        "tower"
      ],
      [
        [
          29,
          48,
          20,
          37
        ],
        "z",
        4,
        "ice-bath-rear-shingles",
        "saw"
      ],
      [
        [
          5,
          24,
          32,
          37
        ],
        "x",
        3,
        "northern-herb-terrace",
        "terrace"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 3,
    "name": "Honeyglass Courtyard Bakehouse",
    "w": 46,
    "d": 44,
    "h": 11,
    "entry": 22,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        11,
        33,
        0,
        14
      ],
      [
        0,
        14,
        11,
        43
      ],
      [
        31,
        45,
        11,
        42
      ],
      [
        9,
        36,
        33,
        43
      ],
      [
        12,
        34,
        21,
        29
      ],
      [
        17,
        29,
        13,
        23
      ]
    ],
    "cuts": [
      [
        15,
        29,
        16,
        19
      ],
      [
        16,
        29,
        36,
        39
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        6,
        24
      ],
      [
        38,
        24
      ],
      [
        12,
        38
      ]
    ],
    "fixtures": [
      [
        27,
        5,
        "pack5:086",
        "ledger-service",
        "counter"
      ],
      [
        7,
        22,
        "pack5:091",
        "cartographers-oak-desk",
        "flour ledger"
      ],
      [
        38,
        22,
        "pack5:090",
        "ashstone-bake-oven",
        "cold oven"
      ],
      [
        12,
        39,
        "pack4:057",
        null,
        "flour crate"
      ]
    ],
    "roofs": [
      [
        [
          11,
          33,
          0,
          14
        ],
        "x",
        6,
        "front-sugar-glass-vault",
        "gable"
      ],
      [
        [
          0,
          14,
          11,
          43
        ],
        "z",
        4,
        "western-grain-porch",
        "terrace"
      ],
      [
        [
          31,
          45,
          11,
          42
        ],
        "z",
        8,
        "full-height-bake-chimney",
        "tower"
      ],
      [
        [
          9,
          36,
          33,
          43
        ],
        "x",
        3,
        "rear-cooling-canopy",
        "saw"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "desert",
    "size": "large",
    "variation": 3,
    "name": "Sirocco Gatehouse Treasury",
    "w": 51,
    "d": 41,
    "h": 12,
    "entry": 25,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        18,
        32,
        0,
        16
      ],
      [
        0,
        20,
        12,
        40
      ],
      [
        30,
        50,
        12,
        40
      ],
      [
        12,
        37,
        29,
        40
      ],
      [
        18,
        33,
        20,
        33
      ]
    ],
    "cuts": [
      [
        21,
        29,
        16,
        20
      ],
      [
        20,
        29,
        35,
        38
      ]
    ],
    "anchors": [
      [
        25,
        6
      ],
      [
        9,
        23
      ],
      [
        42,
        26
      ],
      [
        15,
        37
      ]
    ],
    "fixtures": [
      [
        28,
        5,
        "pack5:086",
        "ledger-service",
        "public teller"
      ],
      [
        9,
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "bond ledger"
      ],
      [
        39,
        21,
        "pack5:086",
        "ledger-service",
        "second teller"
      ],
      [
        15,
        36,
        "pack4:057",
        null,
        "sealed bond register"
      ]
    ],
    "vault": [
      36,
      45,
      22,
      31,
      25,
      26
    ],
    "roofs": [
      [
        [
          18,
          32,
          0,
          16
        ],
        "x",
        7,
        "sandstone-entry-pylon",
        "tower"
      ],
      [
        [
          0,
          20,
          12,
          40
        ],
        "z",
        4,
        "western-bond-wing",
        "saw"
      ],
      [
        [
          30,
          50,
          12,
          40
        ],
        "z",
        8,
        "fortified-vault-tower",
        "tower"
      ],
      [
        [
          12,
          37,
          29,
          40
        ],
        "x",
        3,
        "rear-records-parapet",
        "terrace"
      ]
    ]
  }
]);
const K=(x,y,z)=>x+','+y+','+z;
const inRect=(r,x,z)=>x>=r[0]&&x<=r[1]&&z>=r[2]&&z<=r[3];
const roomRoles=Object.freeze({
 'general-store':[['sales-floor','service-counter','display-shelves'],['ledger-work'],['storage'],['inventory-records']],
 'pet-shop':[['sales-floor','service-counter'],['empty-animal-display'],['storage'],['inventory-records']],
 'magic-shop':[['sales-floor','service-counter'],['arcane-display'],['storage'],['secure-handling']],
 'potion-shop':[['sales-floor','service-counter'],['alchemy-workspace'],['storage'],['herbal-records']],
 'bakery':[['sales-floor','service-counter'],['oven','food-preparation'],['storage'],['grain-records']],
 'bank':[['public-hall','teller-service'],['administrative-office'],['vault'],['bond-records']]
});
export function author2ALandmark(spec){
 const s=spec;
 const floor=new Set(),V=new Map(),windows=[],openings=[];
 for(const r of s.rects)for(let x=r[0];x<=r[1];x++)for(let z=r[2];z<=r[3];z++)floor.add(x+','+z);
 for(const r of s.cuts)for(let x=r[0];x<=r[1];x++)for(let z=r[2];z<=r[3];z++)floor.delete(x+','+z);
 const has=(x,z)=>floor.has(x+','+z),get=(x,y,z)=>V.get(K(x,y,z));
 const add=(x,y,z,kind,material,extra={})=>{
  if(!has(x,z)||!Number.isSafeInteger(y)||y<0)throw Error('outside authored floor '+s.name+' '+K(x,y,z));
  const k=K(x,y,z);if(V.has(k))throw Error('source voxel collision '+s.name+' '+k);
  V.set(k,{x,y,z,kind,material,...extra});
 };
 const remove=(x,y,z)=>V.delete(K(x,y,z));
 const edge=(x,z)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!has(x+dx,z+dz));
 for(const at of floor){const [x,z]=at.split(',').map(Number);
  add(x,0,z,'foundation',s.biome==='snow'?'pack1:004':'pack1:005');
  add(x,1,z,'floor',s.floor);
 }
 // Genuine irregular source-boundary weather walls wrap every exterior and internal court.
 for(const at of floor){const [x,z]=at.split(',').map(Number);
  if(edge(x,z))for(let y=2;y<=s.h;y++)add(x,y,z,'wall',s.wall,{architecturalRole:'rooted-irregular-weather-bay'});
 }
 // Two side-by-side three-cell openings genuinely cut into the front facade.
 for(const x of [s.entry,s.entry+1]){
  for(let y=2;y<=4;y++){
   if(get(x,y,0)?.kind!=='wall')throw Error('missing real front doorway wall '+K(x,y,0));
   remove(x,y,0);
  }
  openings.push({type:'entrance',x,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020',doorOpenState:'unverified'});
 }
 // Full-height floor-founded structural piers are positioned away from actual room access paths and fixtures.
 const mustAvoid=[...s.anchors,...s.fixtures.map(f=>f.slice(0,2)),[s.entry,2],[s.entry+1,2]];
 for(const at of floor){const [x,z]=at.split(',').map(Number);
  if(x%8!==4||z%8!==4||edge(x,z)||get(x,2,z))continue;
  if(mustAvoid.some(([ax,az])=>Math.abs(ax-x)+Math.abs(az-z)<=2))continue;
  if(s.vault&&x>=s.vault[0]-1&&x<=s.vault[1]+1&&z>=s.vault[2]-1&&z<=s.vault[3]+1)continue;
  for(let y=2;y<=s.h;y++)add(x,y,z,'wall',s.wall,{architecturalRole:'floor-founded-internal-roof-pier'});
 }
 if(s.vault){
  const [x0,x1,z0,z1,gateA,gateB]=s.vault;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)if(x===x0||x===x1||z===z0||z===z1)
   for(let y=2;y<=s.h;y++){
    const v=get(x,y,z);
    if(v&&v.kind!=='wall')throw Error('vault wall intersects protected element '+K(x,y,z));
    if(!v)add(x,y,z,'wall','pack2:015',{architecturalRole:'continuous-two-leaf-vault-shell'});
   }
  for(const z of [gateA,gateB])for(let y=2;y<=4;y++)remove(x0,y,z);
  openings.push({type:'internal-doorway',role:'vault-threshold',x:x0,y:2,z:gateA,clearHeightCells:3,
    doorSymbol:'pack5:094',physicalVariant:'citadel-ironbound-leaves',intendedFacing:'east',doorOpenState:'symbolic-unverified'});
  openings.push({type:'internal-doorway',role:'vault-wide-secondary',x:x0,y:2,z:gateB,clearHeightCells:3});
 }
 // Windows are physically occupying two separate source cells on real global exterior facades.
 const winPositions=[];
 for(const [x,z] of [[s.entry-7,0],[s.entry+8,0],[0,18],[s.w-1,18],[0,24],[s.w-1,24],[s.entry-10,0],[s.entry+11,0]]){
  if(!get(x,3,z)||!get(x,4,z)||get(x,3,z).kind!=='wall'||get(x,4,z).kind!=='wall')continue;
  if(winPositions.some(([a,b])=>a===x&&b===z))continue;
  winPositions.push([x,z]);
 }
 if(winPositions.length<3)throw Error('insufficient real side and front glazing bays: '+s.name);
 for(const [x,z] of winPositions)for(const [n,material] of ['pack4:030','pack4:032'].entries()){
  const y=n+3;V.set(K(x,y,z),{x,y,z,kind:'window',material,architecturalRole:'real-exterior-mounted-glazing'});
  openings.push({type:'window',x,y,z,material});
 }
 for(const [x,z,material,physicalVariant,role] of s.fixtures){
  if(get(x,1,z)?.kind!=='floor'||get(x,2,z))throw Error('fixture needs real clear floor: '+s.name+' '+K(x,2,z));
  add(x,2,z,'fixture',material,{role,...(physicalVariant?{physicalVariant}:{}),
    supportIntent:'real-floor',physicalFootprintStatus:'source-shape-requires-producer-verification'});
 }
 // Every irregular interior is roofed ONLY where foundation and floor physically exist.
 for(const at of floor){const [x,z]=at.split(',').map(Number);
  add(x,s.h+1,z,'roof',s.roof,{architecturalRole:'irregular-courtyard-weather-plate'});
 }
 // Four locally independent pitched, sawtooth, tower and terrace profiles.
 // Every elevated roof cell is vertically rooted on another roof cell.
 for(const [index,item] of s.roofs.entries()){
  const [r,axis,peak,role,style]=item;
  const mid=axis==='x'?(r[0]+r[1])/2:(r[2]+r[3])/2;
  for(const at of floor){const [x,z]=at.split(',').map(Number);if(!inRect(r,x,z))continue;
   const coord=axis==='x'?x:z,dist=Math.abs(coord-mid);
   let rise;
   if(style==='gable')rise=Math.max(1,peak-Math.ceil(dist/2));
   else if(style==='saw')rise=Math.max(1,peak-Math.floor(((coord-(axis==='x'?r[0]:r[2]))%7)/2));
   else if(style==='tower')rise=Math.max(1,peak-Math.ceil(dist/3));
   else rise=Math.max(1,peak-Math.floor(dist/4));
   for(let level=2;level<=rise;level++){
    const y=s.h+level,previous=get(x,y,z);
    if(previous){if(previous.kind!=='roof')throw Error('elevated roof strikes structure '+K(x,y,z));continue;}
    if(get(x,y-1,z)?.kind!=='roof')throw Error('unsupported elevated roof '+K(x,y,z));
    add(x,y,z,'roof',s.roof,{architecturalRole:role,roofBearing:'source-roof-vertical-column-not-final-span-proof',roofStyle:style});
   }
  }
 }
 // One real source-owned suspended non-emitting lantern, not gameplay light.
 if(get(s.entry,s.h,5))throw Error('lantern intersects structure');
 add(s.entry,s.h,5,'decor','pack4:035',{role:'noninteractive-market-lantern'});
 const role=roomRoles[s.category],label=['front entry trading hall','western specialist gallery','eastern service wing','rear records pavilion'];
 const rooms=s.anchors.map(([x,z],i)=>({name:s.name+' '+label[i],bounds:{x0:Math.max(0,x-2),x1:Math.min(s.w-1,x+2),z0:Math.max(0,z-2),z1:Math.min(s.d-1,z+2)},
   uses:role[i],access:[x,z]}));
 const circulation=[{from:'exterior',to:role[0][0],via:'two-wide three-high entrance over continuous physical floor'},
  ...role.slice(1).map(a=>({from:role[0][0],to:a[0],via:'connected and navigable source-authored irregular wing and open gallery route'}))];
 const voxels=[...V.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const deps=[...new Set([...voxels.map(v=>v.material),...openings.filter(o=>o.doorSymbol).map(o=>o.doorSymbol)])]
  .map(ref=>({ref,issue:'Symbolic real producer-family dimensions, yaw, physical mounting, long-span roof and saves require separate acceptance'}));
 const bp={schema:SCHEMA,id:blueprintId(s.category,s.biome,s.size,s.variation),category:s.category,biome:s.biome,size:s.size,variation:s.variation,title:s.name,
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  extents:{x:s.w,y:Math.max(...voxels.map(v=>v.y))+1,z:s.d},
  units:'independently authored occupied integer source coordinates; no live producer mesh guarantee',
  architecturalSignature:'non-cross irregular gallery with independent sawtooth, gable, terrace and tower geometry / '+s.name,
  roof:{form:'multiple source-supported region-specific roof forms',biomeSpecific:true},
  rooms,openings,circulation,voxels,unresolvedDependencies:deps,
  courtyardGeometry:s.cuts.map((cut,i)=>({kind:'sky-open irregular inner court',index:i,bounds:cut,sourceEmpty:true})),
  features:['distinct functional architecture','real floor-connected multi-wing interior','directly rooted irregular walls and pitched roof columns']};
 validateBlueprint(bp);return Object.freeze(bp);
}
export const M1_LANDMARK_SHOPS=Object.freeze(M1_LANDMARK_SPECS.map(author2ALandmark));
