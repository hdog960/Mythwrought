// Builder 4A M2 regional architecture — six distinct authored 3D public/trade building envelopes.
// Separate authored coordinate envelopes; shared deterministic compilation is NOT a random
// world generator. All source materials remain symbolic until physical family acceptance.
import {SCHEMA,validateBlueprint} from './schema.mjs';
const cell=(x,y,z)=>[x,y,z].join(',');
const tile=(x,z)=>x+','+z;
const pointIn=([x0,z0,x1,z1],x,z)=>x>=x0&&x<=x1&&z>=z0&&z<=z1;
const ROOF={'temperate':'pack3:023','snow':'pack3:025','enchanted-forest':'pack3:026','desert':'pack3:024','mountain':'pack3:025'};
const FAMILY=Object.freeze({
 'pack1:002':{state:'candidate',intendedShape:'single-cell',orientation:'fixed',attachment:'none',
   unresolved:['physical masonry load/neighbor-face joinery','real candidate collision/selection in game']},
 'pack2:015':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'floor',
   unresolved:['real furniture occupied volume and mounting','schema-1 saved orientation compatibility']},
 'pack3:023':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
 unresolved:['temperate roof support, physical yaw and overhang fitting']},
 'pack3:024':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['wind/debris roof tile attachment and pitch/joinery']},
 'pack3:025':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['snow/drift loading, ridge joints and roof pitch orientation']},
 'pack3:026':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['forest canopy moisture/weather seal and architectural timber mounting']},
 'pack4:030':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'wall',
   unresolved:['real glass pane wall offset, translucency sorting and yaw save']},
});
const PLANS=[
  {
    "id": "r4:civic-hall:temperate:medium:02",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "medium",
    "variant": 2,
    "bounds": [
      39,
      10,
      34
    ],
    "wings": [
      [
        7,
        7,
        30,
        27
      ],
      [
        3,
        14,
        8,
        23
      ],
      [
        30,
        11,
        36,
        20
      ],
      [
        12,
        27,
        25,
        31
      ]
    ],
    "notches": [
      [
        7,
        7,
        10,
        10
      ],
      [
        27,
        7,
        30,
        10
      ]
    ],
    "entry": [
      18,
      7
    ],
    "porch": [
      16,
      3,
      22,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 25,
        "from": 12,
        "to": 23,
        "door": 17,
        "facing": "east"
      },
      {
        "axis": "x",
        "fixed": 11,
        "from": 13,
        "to": 21,
        "door": 18,
        "facing": "west"
      }
    ],
    "windows": [
      [
        3,
        17,
        "west"
      ],
      [
        36,
        15,
        "east"
      ],
      [
        17,
        31,
        "north"
      ],
      [
        12,
        7,
        "south"
      ],
      [
        25,
        7,
        "south"
      ],
      [
        25,
        31,
        "north"
      ]
    ],
    "fixtures": [
      [
        16,
        16
      ],
      [
        20,
        21
      ],
      [
        31,
        15
      ],
      [
        5,
        18
      ],
      [
        17,
        29
      ]
    ],
    "ridges": [
      [
        17,
        12,
        21,
        23
      ],
      [
        13,
        28,
        22,
        29
      ]
    ],
    "rooms": [
      {
        "id": "temperate-open-council-chamber",
        "kind": "meeting",
        "rect": [
          13,
          12,
          23,
          24
        ]
      },
      {
        "id": "western-election-register",
        "kind": "public-voting",
        "rect": [
          4,
          16,
          9,
          22
        ]
      },
      {
        "id": "eastern-public-record-office",
        "kind": "administration",
        "rect": [
          27,
          12,
          34,
          19
        ]
      }
    ],
    "signature": [
      "tri-axial-ballot-council",
      39,
      34,
      "western-ballot-apse",
      "eastern-records-wing",
      "north-seal-gallery"
    ],
    "profile": "tri-axial-ballot-council"
  },
  {
    "id": "r4:civic-hall:snow:small:02",
    "type": "civic-hall",
    "biome": "snow",
    "size": "small",
    "variant": 2,
    "bounds": [
      31,
      9,
      29
    ],
    "wings": [
      [
        9,
        5,
        21,
        24
      ],
      [
        3,
        12,
        10,
        20
      ],
      [
        20,
        12,
        27,
        21
      ],
      [
        12,
        23,
        18,
        26
      ]
    ],
    "notches": [
      [
        9,
        5,
        10,
        7
      ],
      [
        20,
        5,
        21,
        7
      ]
    ],
    "entry": [
      15,
      5
    ],
    "porch": [
      12,
      2,
      18,
      4
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 11,
        "from": 13,
        "to": 19,
        "door": 16,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 19,
        "from": 13,
        "to": 19,
        "door": 16,
        "facing": "east"
      }
    ],
    "windows": [
      [
        3,
        15,
        "west"
      ],
      [
        27,
        16,
        "east"
      ],
      [
        15,
        26,
        "north"
      ],
      [
        12,
        5,
        "south"
      ],
      [
        18,
        5,
        "south"
      ],
      [
        9,
        10,
        "west"
      ]
    ],
    "fixtures": [
      [
        14,
        14
      ],
      [
        16,
        20
      ],
      [
        6,
        16
      ],
      [
        24,
        17
      ],
      [
        15,
        24
      ]
    ],
    "ridges": [
      [
        14,
        9,
        17,
        19
      ]
    ],
    "rooms": [
      {
        "id": "snow-heated-council-table",
        "kind": "meeting",
        "rect": [
          12,
          10,
          18,
          22
        ]
      },
      {
        "id": "winter-petition-vestibule",
        "kind": "administration",
        "rect": [
          4,
          14,
          10,
          19
        ]
      },
      {
        "id": "eastern-crier-gallery",
        "kind": "public-gallery",
        "rect": [
          21,
          14,
          26,
          20
        ]
      }
    ],
    "signature": [
      "snow-double-side-naves",
      31,
      29,
      "council-spine",
      "petition-west",
      "crier-east"
    ],
    "profile": "snow-double-side-naves"
  },
  {
    "id": "r4:civic-hall:enchanted-forest:small:02",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 2,
    "bounds": [
      33,
      9,
      32
    ],
    "wings": [
      [
        10,
        7,
        22,
        25
      ],
      [
        5,
        12,
        10,
        19
      ],
      [
        22,
        14,
        29,
        22
      ],
      [
        13,
        25,
        19,
        29
      ]
    ],
    "notches": [
      [
        10,
        7,
        11,
        9
      ],
      [
        21,
        7,
        22,
        9
      ]
    ],
    "entry": [
      16,
      7
    ],
    "porch": [
      13,
      3,
      19,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 12,
        "from": 14,
        "to": 20,
        "door": 17,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 23,
        "from": 15,
        "to": 21,
        "door": 18,
        "facing": "east"
      }
    ],
    "windows": [
      [
        5,
        15,
        "west"
      ],
      [
        29,
        18,
        "east"
      ],
      [
        16,
        29,
        "north"
      ],
      [
        14,
        7,
        "south"
      ],
      [
        19,
        7,
        "south"
      ],
      [
        10,
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        15,
        15
      ],
      [
        17,
        21
      ],
      [
        7,
        16
      ],
      [
        26,
        19
      ],
      [
        16,
        27
      ]
    ],
    "ridges": [
      [
        15,
        14,
        17,
        23
      ],
      [
        24,
        16,
        26,
        19
      ]
    ],
    "rooms": [
      {
        "id": "forest-speaking-circle",
        "kind": "meeting",
        "rect": [
          13,
          12,
          20,
          24
        ]
      },
      {
        "id": "east-glyph-records",
        "kind": "administration",
        "rect": [
          24,
          15,
          28,
          21
        ]
      },
      {
        "id": "west-treaty-viewing",
        "kind": "public-review",
        "rect": [
          6,
          13,
          9,
          18
        ]
      }
    ],
    "signature": [
      "branched-willow-chancery",
      33,
      32,
      "west-witness",
      "east-archive",
      "north-leaf-apse"
    ],
    "profile": "branched-willow-chancery"
  },
  {
    "id": "r4:guildhall:temperate:medium:01",
    "type": "guildhall",
    "biome": "temperate",
    "size": "medium",
    "variant": 1,
    "bounds": [
      37,
      10,
      32
    ],
    "wings": [
      [
        6,
        8,
        28,
        22
      ],
      [
        3,
        12,
        8,
        25
      ],
      [
        24,
        20,
        33,
        28
      ],
      [
        13,
        22,
        20,
        29
      ]
    ],
    "notches": [
      [
        6,
        8,
        9,
        10
      ],
      [
        25,
        8,
        28,
        10
      ]
    ],
    "entry": [
      17,
      8
    ],
    "porch": [
      14,
      4,
      20,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 22,
        "from": 14,
        "to": 21,
        "door": 18,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 23,
        "from": 14,
        "to": 19,
        "door": 17,
        "facing": "north"
      }
    ],
    "windows": [
      [
        3,
        17,
        "west"
      ],
      [
        33,
        25,
        "east"
      ],
      [
        16,
        29,
        "north"
      ],
      [
        13,
        8,
        "south"
      ],
      [
        22,
        8,
        "south"
      ],
      [
        28,
        14,
        "east"
      ]
    ],
    "fixtures": [
      [
        13,
        14
      ],
      [
        17,
        18
      ],
      [
        26,
        24
      ],
      [
        30,
        26
      ],
      [
        17,
        26
      ]
    ],
    "ridges": [
      [
        15,
        12,
        19,
        19
      ],
      [
        27,
        22,
        29,
        25
      ]
    ],
    "rooms": [
      {
        "id": "temperate-journeymen-meeting",
        "kind": "gathering-hall",
        "rect": [
          10,
          12,
          21,
          21
        ]
      },
      {
        "id": "eastern-stone-and-wood-workshop",
        "kind": "shared-facility",
        "rect": [
          25,
          21,
          32,
          27
        ]
      },
      {
        "id": "guild-night-ledger-archive",
        "kind": "guild-ledger",
        "rect": [
          14,
          24,
          19,
          28
        ]
      }
    ],
    "signature": [
      "asymmetric-trades-t",
      37,
      32,
      "west-voters-apse",
      "east-tool-court",
      "rear-ledger"
    ],
    "profile": "asymmetric-trades-t"
  },
  {
    "id": "r4:guildhall:snow:medium:01",
    "type": "guildhall",
    "biome": "snow",
    "size": "medium",
    "variant": 1,
    "bounds": [
      38,
      10,
      35
    ],
    "wings": [
      [
        7,
        8,
        29,
        23
      ],
      [
        3,
        13,
        8,
        23
      ],
      [
        28,
        14,
        35,
        22
      ],
      [
        10,
        23,
        23,
        30
      ]
    ],
    "notches": [
      [
        7,
        8,
        10,
        11
      ],
      [
        26,
        8,
        29,
        11
      ],
      [
        10,
        28,
        12,
        30
      ],
      [
        21,
        28,
        23,
        30
      ]
    ],
    "entry": [
      18,
      8
    ],
    "porch": [
      15,
      4,
      21,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 11,
        "from": 14,
        "to": 22,
        "door": 17,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 26,
        "from": 15,
        "to": 22,
        "door": 18,
        "facing": "east"
      }
    ],
    "windows": [
      [
        3,
        17,
        "west"
      ],
      [
        35,
        18,
        "east"
      ],
      [
        16,
        30,
        "north"
      ],
      [
        12,
        8,
        "south"
      ],
      [
        24,
        8,
        "south"
      ],
      [
        7,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        17,
        16
      ],
      [
        20,
        20
      ],
      [
        5,
        18
      ],
      [
        32,
        18
      ],
      [
        16,
        26
      ]
    ],
    "ridges": [
      [
        14,
        12,
        22,
        19
      ],
      [
        14,
        25,
        19,
        27
      ]
    ],
    "rooms": [
      {
        "id": "winter-guild-hearth-table",
        "kind": "gathering-hall",
        "rect": [
          13,
          12,
          23,
          22
        ]
      },
      {
        "id": "snow-tool-stock-office",
        "kind": "shared-facility",
        "rect": [
          4,
          15,
          10,
          22
        ]
      },
      {
        "id": "winter-coal-and-forge-room",
        "kind": "heated-craft-hall",
        "rect": [
          28,
          15,
          34,
          21
        ]
      },
      {
        "id": "north-drift-records",
        "kind": "guild-ledger",
        "rect": [
          13,
          24,
          20,
          29
        ]
      }
    ],
    "signature": [
      "four-vault-snow-hall",
      38,
      35,
      "west-coal-vault",
      "east-tools",
      "north-drift-roof"
    ],
    "profile": "four-vault-snow-hall"
  },
  {
    "id": "r4:guildhall:mountain:medium:01",
    "type": "guildhall",
    "biome": "mountain",
    "size": "medium",
    "variant": 1,
    "bounds": [
      40,
      10,
      36
    ],
    "wings": [
      [
        15,
        5,
        25,
        31
      ],
      [
        5,
        13,
        15,
        24
      ],
      [
        25,
        11,
        35,
        21
      ],
      [
        11,
        24,
        31,
        32
      ]
    ],
    "notches": [
      [
        15,
        5,
        17,
        8
      ],
      [
        23,
        5,
        25,
        8
      ],
      [
        11,
        30,
        13,
        32
      ]
    ],
    "entry": [
      20,
      5
    ],
    "porch": [
      17,
      2,
      23,
      4
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 16,
        "from": 14,
        "to": 23,
        "door": 18,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 26,
        "from": 13,
        "to": 20,
        "door": 17,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 25,
        "from": 17,
        "to": 24,
        "door": 20,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        17,
        "west"
      ],
      [
        35,
        16,
        "east"
      ],
      [
        19,
        32,
        "north"
      ],
      [
        18,
        5,
        "south"
      ],
      [
        22,
        5,
        "south"
      ],
      [
        29,
        32,
        "north"
      ]
    ],
    "fixtures": [
      [
        19,
        14
      ],
      [
        20,
        21
      ],
      [
        8,
        18
      ],
      [
        30,
        16
      ],
      [
        21,
        29
      ]
    ],
    "ridges": [
      [
        19,
        12,
        22,
        25
      ],
      [
        27,
        13,
        30,
        17
      ]
    ],
    "rooms": [
      {
        "id": "mountain-trades-central-passage",
        "kind": "gathering-hall",
        "rect": [
          17,
          11,
          24,
          23
        ]
      },
      {
        "id": "west-quarry-masons-room",
        "kind": "shared-facility",
        "rect": [
          6,
          15,
          14,
          22
        ]
      },
      {
        "id": "east-engravers-bench",
        "kind": "artisan-study",
        "rect": [
          27,
          12,
          34,
          20
        ]
      },
      {
        "id": "north-charter-crossbar",
        "kind": "guild-ledger",
        "rect": [
          14,
          26,
          29,
          31
        ]
      }
    ],
    "signature": [
      "long-spine-crossbar",
      40,
      36,
      "west-masons-terrace",
      "east-engravers",
      "north-charter"
    ],
    "profile": "long-spine-crossbar"
  }
];
const VALID_IDS=new Set(PLANS.map(p=>p.id));
function author(spec){
 const [width,height,depth]=spec.bounds;
 const ground=new Set();
 const within=(r,x,z)=>pointIn(r,x,z);
 for(let z=0;z<depth;z++)for(let x=0;x<width;x++){
  const regular=spec.wings.some(r=>within(r,x,z));
  const faceted=(spec.octagons??[]).some(([cx,cz,radius,diagonal])=>
   Math.abs(x-cx)<=radius&&Math.abs(z-cz)<=radius&&Math.abs(x-cx)+Math.abs(z-cz)<=diagonal);
  if((regular||faceted||(spec.bridge&&within(spec.bridge,x,z)))&&
     !spec.notches.some(r=>within(r,x,z)))ground.add(tile(x,z));
 }
 const occupied=new Map(),openings=[];
 const has=(x,z)=>ground.has(tile(x,z));
 function set(x,y,z,role,asset='base:stone',facing='north',replace=false){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=width||y<0||y>=height||z<0||z>=depth)
   throw Error('Invalid authored '+spec.id+' coordinate '+cell(x,y,z));
  const k=cell(x,y,z);
  if(occupied.has(k)&&!replace)throw Error('M2 overlapping occupied source cell '+spec.id+' '+k);
  occupied.set(k,{at:[x,y,z],role,asset,facing});
 }
 const erase=(x,y,z)=>occupied.delete(cell(x,y,z));
 const baseMaterial=spec.type==='guildhall'?'base:wood':'base:stone';
 const regionalRoof=ROOF[spec.biome];
 for(const key of ground){
  const [x,z]=key.split(',').map(Number);
  set(x,0,z,'floor',baseMaterial);
  set(x,5,z,'roof',regionalRoof);
  const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!has(x+dx,z+dz));
  if(edge)for(let y=1;y<=4;y++)set(x,y,z,'wall',spec.type==='guildhall'?'base:wood':'pack1:002');
 }
 // Distinct, reserved exterior approach: no duplicate wing/porch occupation.
 const [left,front,right,back]=spec.porch;
 for(let z=front;z<=back;z++)for(let x=left;x<=right;x++){
  if(has(x,z))throw Error('Authored porch intersects existing building '+spec.id+' '+tile(x,z));
  set(x,0,z,'floor','base:stone');
  set(x,5,z,'roof',regionalRoof);
  if(x===left||x===right||z===front||z===back)set(x,4,z,'beam','base:wood');
 }
 for(const x of [left,right])for(const z of [front,back])
  for(let y=1;y<=3;y++)set(x,y,z,'column','base:wood');
 // Face-integral purlin lattice: open 2-high rooms, all normal roof tiles
 // within at most 1 orthogonal step of an actual timber beam / wall below.
 for(const key of ground){
  const [x,z]=key.split(',').map(Number);
  if(!occupied.has(cell(x,4,z))&&(x%3===0||z%3===0))set(x,4,z,'beam','base:wood');
 }
 for(const [x0,z0,x1,z1] of spec.ridges)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!has(x,z))throw Error('Raised authored regional ridge extends outside floor '+spec.id+' '+tile(x,z));
  if(occupied.get(cell(x,5,z))?.role!=='roof')throw Error('Raised ridge missing base roof');
  set(x,5,z,'beam','base:wood','north',true);
  if(!occupied.has(cell(x,4,z)))set(x,4,z,'beam','base:wood');
  set(x,6,z,'roof',regionalRoof);
 }
 for(const wall of spec.partitions){
  for(let i=wall.from;i<=wall.to;i++){
   const x=wall.axis==='x'?wall.fixed:i,z=wall.axis==='z'?wall.fixed:i;
   if(!has(x,z))throw Error('Source partition outside occupancy '+spec.id+' '+tile(x,z));
   const edge=occupied.get(cell(x,1,z));
   if(edge)throw Error('Source partition overlaps external masonry '+spec.id+' '+tile(x,z));
   if(i===wall.door){set(x,3,z,'beam','base:wood');continue;}
   for(let y=1;y<=3;y++)set(x,y,z,'partition',spec.type==='guildhall'?'base:wood':'pack1:002',wall.facing);
  }
  openings.push({at:wall.axis==='x'?[wall.fixed,1,wall.door]:[wall.door,1,wall.fixed],
    kind:'door',facing:wall.facing});
 }
 const [entryX,entryZ]=spec.entry;
 if(entryZ!==back+1)throw Error('Portico does not directly connect to actual entrance');
 for(let x=entryX-1;x<=entryX+1;x++)for(let y=1;y<=2;y++){
  if(occupied.get(cell(x,y,entryZ))?.role!=='wall')
   throw Error('Formal entry does not pierce a real exterior wall '+spec.id+' '+tile(x,entryZ));
  erase(x,y,entryZ);
 }
 openings.push({at:[entryX,1,entryZ],kind:'entrance',facing:'south'});
 for(const [x,z,facing] of spec.windows){
  if(occupied.get(cell(x,2,z))?.role!=='wall')
   throw Error('Window not in exterior load-bearing wall '+spec.id+' '+tile(x,z));
  set(x,2,z,'window','pack4:030',facing,true);
  openings.push({at:[x,2,z],kind:'window',facing});
 }
 for(const [x,z] of spec.fixtures){
  if(!has(x,z)||occupied.has(cell(x,1,z)))throw Error('Authored fixture lacks usable floor '+spec.id+' '+tile(x,z));
  set(x,1,z,'fixture','pack2:015');
 }
 const navigation=new Map();
 for(const c of occupied.values())if(c.role==='floor'&&c.at[1]===0){
  const [x,,z]=c.at;
  if(!occupied.has(cell(x,1,z))&&!occupied.has(cell(x,2,z)))
   navigation.set(cell(x,1,z),{at:[x,1,z],mode:'walk'});
 }
 const spaces=[];const seenSpaceTiles=new Set();
 for(const r of spec.rooms){
  const floor=[...navigation.values()].filter(n=>within(r.rect,n.at[0],n.at[2])).map(n=>[n.at[0],n.at[2]]);
  if(floor.length<12)throw Error('Under-authored room '+spec.id+' '+r.id);
  const present=new Set(floor.map(([x,z])=>tile(x,z))),visited=new Set([tile(...floor[0])]),q=[floor[0]];
  for(let i=0;i<q.length;i++){
   const [x,z]=q[i];
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const k=tile(x+dx,z+dz);
    if(present.has(k)&&!visited.has(k)){visited.add(k);q.push([x+dx,z+dz]);}
   }
  }
  if(visited.size!==present.size)throw Error('Authored room has disconnected floor islands '+spec.id+' '+r.id);
  for(const point of floor){
   const k=tile(...point);
   if(seenSpaceTiles.has(k))throw Error('Two authored public rooms overlap '+spec.id+' '+k);
   seenSpaceTiles.add(k);
  }
  const [accessX,accessZ]=floor[Math.floor(floor.length/2)];
  spaces.push({id:r.id,kind:r.kind,level:1,access:[accessX,1,accessZ],footprint:floor});
 }
 const cells=[...occupied.values()];
 const references=[...new Set(cells.map(c=>c.asset).filter(s=>s.startsWith('pack')))].sort();
 const dependencies=references.map(ref=>{
  if(!FAMILY[ref])throw Error('Unknown material family '+ref);
  return {ref,...FAMILY[ref]};
 });
 const result={schema:SCHEMA,id:spec.id,type:spec.type,biome:spec.biome,size:spec.size,
  variant:spec.variant,bounds:spec.bounds,cells,navigation:[...navigation.values()],spaces,openings,dependencies,
  architecturalNotes:{style:spec.profile,storyCount:1,structuralSignature:spec.signature,
   roof:'actual exposed partial-family roof candidate with direct raised-ridge beams and timber purlin lattice',
   circulation:'source occupied-cell navigation graph, not path tags',
   creatorAccepted:false,liveIntegrated:false,worldPlacement:false,physicalIphoneTested:false}
 };
 validateBlueprint(result);
 return result;
}
export function buildM2Expansion(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2Expansion(){return PLANS.map(author);}
export const M2_EXPANSION_IDS=Object.freeze(PLANS.map(p=>p.id));
