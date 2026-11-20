// Builder 3B independent watchtower variant 2 — fifteen source-authored variant-3 voxel plans with twin independently supported high turrets.
// This file never places or registers a structure in-game; PR #122's originals unchanged.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const N=(id,x,y,z,kind='passage')=>({id,x,y,z,kind,width:2,headroom:2});
const E=(from,to,kind='level')=>({from,to,kind});
const key=(x,y,z)=>x+','+y+','+z,flat=(x,z)=>x+','+z;
const plans=[
 {
  "biome": "temperate",
  "size": "small",
  "w": 28,
  "d": 34,
  "steps": 11,
  "aisle": 10,
  "title": "Riverford split beacon with offset grain loft, low bridge and double finial",
  "mask": [
   [
    3,
    17,
    0,
    33
   ],
   [
    2,
    8,
    0,
    10
   ],
   [
    0,
    10,
    23,
    33
   ],
   [
    18,
    27,
    13,
    25
   ],
   [
    20,
    27,
    0,
    8
   ],
   [
    16,
    21,
    4,
    6
   ],
   [
    16,
    22,
    27,
    30
   ]
  ],
  "canopy": [
   6,
   12,
   5,
   11
  ],
  "roofType": "gable",
  "roofRibs": [
   [
    2,
    8,
    0,
    10,
    "x",
    3
   ],
   [
    18,
    27,
    13,
    25,
    "x",
    3
   ]
  ],
  "cargo": [
   8,
   10
  ],
  "northHeight": 4,
  "southHeight": 3,
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:023",
  "post": "pack2:015",
  "trim": "pack5:079",
  "symbol": ""
 },
 {
  "biome": "desert",
  "size": "small",
  "w": 30,
  "d": 33,
  "steps": 11,
  "aisle": 11,
  "title": "Mirage toll tower with open dune court and terraced signal needles",
  "mask": [
   [
    3,
    18,
    0,
    32
   ],
   [
    6,
    9,
    12,
    30
   ],
   [
    19,
    29,
    11,
    14
   ],
   [
    15,
    29,
    23,
    32
   ],
   [
    1,
    8,
    0,
    7
   ],
   [
    17,
    23,
    10,
    13
   ],
   [
    17,
    24,
    25,
    28
   ]
  ],
  "canopy": [
   6,
   14,
   6,
   12
  ],
  "roofType": "terrace",
  "roofRibs": [
   [
    6,
    9,
    12,
    30,
    "x",
    3
   ],
   [
    15,
    29,
    23,
    32,
    "z",
    3
   ]
  ],
  "cargo": [
   8,
   12
  ],
  "northHeight": 5,
  "southHeight": 2,
  "wall": "pack5:080",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": ""
 },
 {
  "biome": "snow",
  "size": "small",
  "w": 31,
  "d": 36,
  "steps": 12,
  "aisle": 11,
  "title": "Whitepine rescue spike with split snowshed and stepped hoist gallery",
  "mask": [
   [
    3,
    18,
    0,
    35
   ],
   [
    0,
    10,
    1,
    6
   ],
   [
    4,
    7,
    26,
    35
   ],
   [
    25,
    30,
    18,
    30
   ],
   [
    23,
    30,
    7,
    11
   ],
   [
    17,
    23,
    0,
    9
   ],
   [
    17,
    25,
    27,
    30
   ]
  ],
  "canopy": [
   6,
   14,
   5,
   13
  ],
  "roofType": "cross",
  "roofRibs": [
   [
    0,
    10,
    1,
    6,
    "z",
    3
   ],
   [
    25,
    30,
    18,
    30,
    "x",
    3
   ]
  ],
  "cargo": [
   8,
   14
  ],
  "northHeight": 3,
  "southHeight": 4,
  "wall": "pack1:002",
  "floor": "pack5:081",
  "roof": "pack3:025",
  "post": "pack2:015",
  "trim": "pack5:081",
  "symbol": "biome130:094"
 },
 {
  "biome": "enchanted-forest",
  "size": "small",
  "w": 32,
  "d": 36,
  "steps": 12,
  "aisle": 12,
  "title": "Sporelight odd-root lantern keep and suspended watch-ring",
  "mask": [
   [
    3,
    19,
    0,
    35
   ],
   [
    0,
    10,
    18,
    35
   ],
   [
    3,
    9,
    1,
    9
   ],
   [
    20,
    31,
    13,
    20
   ],
   [
    26,
    31,
    23,
    35
   ],
   [
    22,
    26,
    11,
    14
   ],
   [
    18,
    27,
    29,
    32
   ]
  ],
  "canopy": [
   7,
   15,
   5,
   13
  ],
  "roofType": "saw",
  "roofRibs": [
   [
    0,
    10,
    18,
    35,
    "x",
    3
   ],
   [
    20,
    31,
    13,
    20,
    "x",
    3
   ]
  ],
  "cargo": [
   8,
   10
  ],
  "northHeight": 5,
  "southHeight": 5,
  "wall": "pack2:015",
  "floor": "pack2:013",
  "roof": "pack3:023",
  "post": "pack2:022",
  "trim": "pack5:079",
  "symbol": "biome130:096"
 },
 {
  "biome": "mountain",
  "size": "small",
  "w": 33,
  "d": 38,
  "steps": 13,
  "aisle": 12,
  "title": "Windpass crag beacon and split ore chute with stepped flags",
  "mask": [
   [
    3,
    19,
    0,
    37
   ],
   [
    0,
    10,
    8,
    21
   ],
   [
    3,
    6,
    33,
    37
   ],
   [
    20,
    30,
    5,
    13
   ],
   [
    25,
    32,
    27,
    36
   ],
   [
    18,
    24,
    2,
    10
   ],
   [
    18,
    27,
    29,
    32
   ]
  ],
  "canopy": [
   7,
   15,
   6,
   14
  ],
  "roofType": "slope",
  "roofRibs": [
   [
    0,
    10,
    8,
    21,
    "x",
    3
   ],
   [
    20,
    30,
    5,
    13,
    "x",
    3
   ]
  ],
  "cargo": [
   8,
   12
  ],
  "northHeight": 6,
  "southHeight": 3,
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "biome130:098"
 },
 {
  "biome": "temperate",
  "size": "medium",
  "w": 39,
  "d": 46,
  "steps": 16,
  "aisle": 14,
  "title": "Branchwater forked signal bastion and asymmetrical watch gables",
  "mask": [
   [
    3,
    21,
    0,
    45
   ],
   [
    2,
    10,
    9,
    18
   ],
   [
    0,
    11,
    39,
    45
   ],
   [
    22,
    38,
    12,
    31
   ],
   [
    27,
    38,
    3,
    10
   ],
   [
    20,
    28,
    8,
    11
   ],
   [
    20,
    29,
    37,
    40
   ]
  ],
  "canopy": [
   7,
   17,
   6,
   16
  ],
  "roofType": "gable",
  "roofRibs": [
   [
    2,
    10,
    9,
    18,
    "x",
    3
   ],
   [
    22,
    38,
    12,
    31,
    "x",
    5
   ]
  ],
  "cargo": [
   8,
   14
  ],
  "northHeight": 4,
  "southHeight": 4,
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:023",
  "post": "pack2:015",
  "trim": "pack5:079",
  "symbol": ""
 },
 {
  "biome": "desert",
  "size": "medium",
  "w": 41,
  "d": 45,
  "steps": 16,
  "aisle": 15,
  "title": "Duskfall caravan lantern with broken arch court and split minarets",
  "mask": [
   [
    3,
    22,
    0,
    44
   ],
   [
    0,
    11,
    24,
    38
   ],
   [
    0,
    8,
    1,
    9
   ],
   [
    23,
    40,
    6,
    19
   ],
   [
    30,
    40,
    25,
    38
   ],
   [
    21,
    31,
    11,
    14
   ],
   [
    21,
    33,
    34,
    37
   ]
  ],
  "canopy": [
   8,
   18,
   5,
   16
  ],
  "roofType": "terrace",
  "roofRibs": [
   [
    0,
    11,
    24,
    38,
    "x",
    3
   ],
   [
    23,
    40,
    6,
    19,
    "z",
    5
   ]
  ],
  "cargo": [
   8,
   10
  ],
  "northHeight": 6,
  "southHeight": 2,
  "wall": "pack5:080",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": ""
 },
 {
  "biome": "snow",
  "size": "medium",
  "w": 42,
  "d": 48,
  "steps": 17,
  "aisle": 15,
  "title": "Frostgate rescue eyrie and offset skycage over avalanche stairs",
  "mask": [
   [
    3,
    22,
    0,
    47
   ],
   [
    0,
    12,
    1,
    31
   ],
   [
    0,
    8,
    35,
    47
   ],
   [
    28,
    38,
    22,
    45
   ],
   [
    29,
    41,
    2,
    14
   ],
   [
    21,
    32,
    8,
    12
   ],
   [
    21,
    32,
    32,
    36
   ]
  ],
  "canopy": [
   8,
   18,
   6,
   16
  ],
  "roofType": "cross",
  "roofRibs": [
   [
    0,
    12,
    1,
    31,
    "z",
    3
   ],
   [
    28,
    38,
    22,
    45,
    "x",
    5
   ]
  ],
  "cargo": [
   8,
   12
  ],
  "northHeight": 4,
  "southHeight": 6,
  "wall": "pack1:002",
  "floor": "pack5:081",
  "roof": "pack3:025",
  "post": "pack2:015",
  "trim": "pack5:081",
  "symbol": "biome130:094"
 },
 {
  "biome": "enchanted-forest",
  "size": "medium",
  "w": 44,
  "d": 47,
  "steps": 18,
  "aisle": 16,
  "title": "Mothspire forked moon observatory with triple-root buttress",
  "mask": [
   [
    3,
    23,
    0,
    46
   ],
   [
    0,
    13,
    17,
    39
   ],
   [
    0,
    10,
    1,
    9
   ],
   [
    24,
    43,
    11,
    28
   ],
   [
    27,
    37,
    34,
    38
   ],
   [
    21,
    35,
    18,
    22
   ],
   [
    22,
    34,
    38,
    46
   ]
  ],
  "canopy": [
   8,
   20,
   7,
   17
  ],
  "roofType": "saw",
  "roofRibs": [
   [
    0,
    13,
    17,
    39,
    "x",
    3
   ],
   [
    24,
    43,
    11,
    28,
    "x",
    5
   ]
  ],
  "cargo": [
   8,
   14
  ],
  "northHeight": 7,
  "southHeight": 5,
  "wall": "pack2:015",
  "floor": "pack2:013",
  "roof": "pack3:023",
  "post": "pack2:022",
  "trim": "pack5:079",
  "symbol": "biome130:096"
 },
 {
  "biome": "mountain",
  "size": "medium",
  "w": 45,
  "d": 50,
  "steps": 18,
  "aisle": 16,
  "title": "Steepstone switchback command tower with hanging alpine ledges",
  "mask": [
   [
    3,
    23,
    0,
    49
   ],
   [
    10,
    13,
    28,
    49
   ],
   [
    0,
    9,
    2,
    12
   ],
   [
    30,
    44,
    1,
    17
   ],
   [
    32,
    44,
    33,
    38
   ],
   [
    22,
    35,
    2,
    12
   ],
   [
    22,
    36,
    38,
    42
   ]
  ],
  "canopy": [
   8,
   20,
   7,
   17
  ],
  "roofType": "slope",
  "roofRibs": [
   [
    10,
    13,
    28,
    49,
    "x",
    3
   ],
   [
    30,
    44,
    1,
    17,
    "x",
    5
   ]
  ],
  "cargo": [
   8,
   10
  ],
  "northHeight": 6,
  "southHeight": 5,
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "biome130:098"
 },
 {
  "biome": "temperate",
  "size": "large",
  "w": 55,
  "d": 61,
  "steps": 21,
  "aisle": 18,
  "title": "Riverwarden multi-court signal citadel with tall twin lantern lofts",
  "mask": [
   [
    3,
    25,
    0,
    60
   ],
   [
    0,
    14,
    4,
    23
   ],
   [
    3,
    13,
    42,
    59
   ],
   [
    30,
    54,
    10,
    29
   ],
   [
    35,
    48,
    36,
    57
   ],
   [
    23,
    37,
    16,
    20
   ],
   [
    24,
    39,
    46,
    51
   ]
  ],
  "canopy": [
   8,
   23,
   7,
   18
  ],
  "roofType": "gable",
  "roofRibs": [
   [
    0,
    14,
    4,
    23,
    "x",
    5
   ],
   [
    30,
    54,
    10,
    29,
    "x",
    5
   ]
  ],
  "cargo": [
   8,
   12
  ],
  "northHeight": 8,
  "southHeight": 5,
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:023",
  "post": "pack2:015",
  "trim": "pack5:079",
  "symbol": ""
 },
 {
  "biome": "desert",
  "size": "large",
  "w": 56,
  "d": 59,
  "steps": 21,
  "aisle": 18,
  "title": "Amber dune paired bastions with zigzag roof galleries and high bell",
  "mask": [
   [
    3,
    25,
    0,
    58
   ],
   [
    0,
    14,
    22,
    51
   ],
   [
    0,
    8,
    1,
    9
   ],
   [
    26,
    49,
    9,
    18
   ],
   [
    35,
    55,
    40,
    57
   ],
   [
    23,
    39,
    15,
    18
   ],
   [
    23,
    43,
    44,
    48
   ]
  ],
  "canopy": [
   9,
   23,
   7,
   18
  ],
  "roofType": "terrace",
  "roofRibs": [
   [
    0,
    14,
    22,
    51,
    "x",
    5
   ],
   [
    26,
    49,
    9,
    18,
    "z",
    5
   ]
  ],
  "cargo": [
   8,
   14
  ],
  "northHeight": 7,
  "southHeight": 6,
  "wall": "pack5:080",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": ""
 },
 {
  "biome": "snow",
  "size": "large",
  "w": 57,
  "d": 64,
  "steps": 22,
  "aisle": 19,
  "title": "Frostveil switchback observatory and triple-height storm refuge",
  "mask": [
   [
    3,
    26,
    0,
    63
   ],
   [
    10,
    15,
    1,
    29
   ],
   [
    2,
    14,
    47,
    62
   ],
   [
    27,
    56,
    13,
    49
   ],
   [
    38,
    43,
    9,
    15
   ],
   [
    34,
    43,
    10,
    13
   ],
   [
    24,
    41,
    42,
    46
   ]
  ],
  "canopy": [
   9,
   24,
   6,
   19
  ],
  "roofType": "cross",
  "roofRibs": [
   [
    10,
    15,
    1,
    29,
    "z",
    5
   ],
   [
    27,
    56,
    13,
    49,
    "x",
    5
   ]
  ],
  "cargo": [
   8,
   10
  ],
  "northHeight": 9,
  "southHeight": 4,
  "wall": "pack1:002",
  "floor": "pack5:081",
  "roof": "pack3:025",
  "post": "pack2:015",
  "trim": "pack5:081",
  "symbol": "biome130:094"
 },
 {
  "biome": "enchanted-forest",
  "size": "large",
  "w": 59,
  "d": 63,
  "steps": 23,
  "aisle": 19,
  "title": "Elderroot crossing-canopy command hall with split high watch pavilions",
  "mask": [
   [
    3,
    27,
    0,
    62
   ],
   [
    0,
    15,
    31,
    60
   ],
   [
    0,
    11,
    1,
    14
   ],
   [
    28,
    58,
    8,
    31
   ],
   [
    38,
    58,
    43,
    61
   ],
   [
    25,
    45,
    15,
    20
   ],
   [
    25,
    47,
    48,
    52
   ]
  ],
  "canopy": [
   9,
   24,
   6,
   19
  ],
  "roofType": "saw",
  "roofRibs": [
   [
    0,
    15,
    31,
    60,
    "x",
    5
   ],
   [
    28,
    58,
    8,
    31,
    "x",
    5
   ]
  ],
  "cargo": [
   8,
   12
  ],
  "northHeight": 7,
  "southHeight": 8,
  "wall": "pack2:015",
  "floor": "pack2:013",
  "roof": "pack3:023",
  "post": "pack2:022",
  "trim": "pack5:079",
  "symbol": "biome130:096"
 },
 {
  "biome": "mountain",
  "size": "large",
  "w": 60,
  "d": 66,
  "steps": 23,
  "aisle": 20,
  "title": "Stormcrest split ridge sentinel and upper straddled semaphore gate",
  "mask": [
   [
    3,
    28,
    0,
    65
   ],
   [
    0,
    16,
    17,
    55
   ],
   [
    0,
    11,
    1,
    11
   ],
   [
    29,
    59,
    1,
    26
   ],
   [
    39,
    59,
    48,
    63
   ],
   [
    26,
    47,
    12,
    16
   ],
   [
    26,
    48,
    51,
    55
   ]
  ],
  "canopy": [
   10,
   25,
   7,
   20
  ],
  "roofType": "slope",
  "roofRibs": [
   [
    0,
    16,
    17,
    55,
    "x",
    5
   ],
   [
    29,
    59,
    1,
    26,
    "x",
    5
   ]
  ],
  "cargo": [
   8,
   14
  ],
  "northHeight": 9,
  "southHeight": 7,
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "biome130:098"
 }
];

function create(p){
 const {w,d,steps,aisle}=p,sx=4,sz=5,deckY=steps,lastZ=sz+steps-1;
 const id=assertSlot('watchtower',p.biome,p.size,3);
 const mask=new Set();
 for(const [x0,x1,z0,z1] of p.mask)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)mask.add(flat(x,z));
 const core=p.mask[0],isCore=(x,z)=>x>=core[0]&&x<=core[1]&&z>=core[2]&&z<=core[3];
 const halls=[
  B(aisle,2,0,2,3,d),B(sx,2,4,aisle-sx+2,3,1),
  ...Array.from({length:steps},(_,i)=>B(sx,2+i,sz+i,2,2,1)),
  B(sx+2,deckY+1,lastZ,aisle-sx,2,2),
  B(aisle,deckY+1,3,2,2,lastZ-1)
 ];
 const reserved=(x,y,z)=>halls.some(b=>x>=b.x&&x<b.x+b.width&&y>=b.y&&y<b.y+b.height&&z>=b.z&&z<b.z+b.depth);
 const blocks=new Map(),mods=new Map();
 function write(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=steps+14||z<0||z>=d)
   throw Error(id+' local voxel outside envelope '+[x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' missing source family '+ref);
  if(!mask.has(flat(x,z)))return false;
  if(role!=='foundation'&&role!=='floor'&&reserved(x,y,z))return false;
  const k=key(x,y,z);if(blocks.has(k))return false;
  blocks.set(k,role);if(!mods.has(role))mods.set(role,[]);
  mods.get(role).push([x,y,z,ref]);return true;
 }
 const stair=(x,z)=>x>=sx&&x<sx+2&&z>=sz&&z<=lastZ;
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  write('foundation',x,0,z,'builtin:stone');
  if(!stair(x,z))write('floor',x,1,z,p.floor);
 }
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  const boundary=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([a,b])=>!mask.has(flat(a,b)));
  if(boundary)for(let y=2;y<=(isCore(x,z)?deckY-1:6);y++)write('wall',x,y,z,p.wall);
 }
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  if(isCore(x,z)){if(!stair(x,z))write('roof',x,deckY,z,p.floor);}
  else write('roof',x,7,z,p.roof);
 }
 for(let i=0;i<steps;i++)for(let x=sx;x<sx+2;x++){
  const z=sz+i;
  for(let y=1;y<=i;y++)write('stair-support',x,y,z,p.post);
  write('stair',x,1+i,z,'pack1:008');
 }
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  if(!isCore(x,z))continue;
  const edge=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([a,b])=>!isCore(a,b));
  if(edge&&(x+z+steps)%4!==0)write('battlement',x,deckY+1,z,'pack3:070');
 }
 const [cx0,cx1,cz0,cz1]=p.canopy,top=(x,z)=>{
  if(p.roofType==='gable')return deckY+6+Math.floor(Math.min(x-cx0,cx1-x)/3);
  if(p.roofType==='cross')return deckY+6+Math.floor(Math.min(z-cz0,cz1-z)/3);
  if(p.roofType==='terrace')return deckY+6+(x<=(cx0+cx1)/2?2:0);
  if(p.roofType==='saw')return deckY+6+(Math.floor((x-cx0)/3)%2);
  return deckY+6+Math.floor((x-cx0)/4);
 };
 for(const [x,z] of [[cx0,cz0],[cx1,cz0],[cx0,cz1],[cx1,cz1]]){
  if(!isCore(x,z)||stair(x,z))throw Error(id+' unsupported canopy bearer');
  for(let y=deckY+1;y<top(x,z);y++)write('canopy-bearing',x,y,z,p.post);
 }
 for(let x=cx0;x<=cx1;x++)for(let z=cz0;z<=cz1;z++)write('canopy-roof',x,top(x,z),z,p.roof);
 for(let x=cx0+1;x<=cx1;x++)for(let z=cz0;z<=cz1;z++){
  const prev=top(x-1,z),next=top(x,z);
  for(let y=Math.min(prev,next);y<Math.max(prev,next);y++)write('canopy-x-brace',prev<next?x:x-1,y,z,p.post);
 }
 for(let z=cz0+1;z<=cz1;z++)for(let x=cx0;x<=cx1;x++){
  const prev=top(x,z-1),next=top(x,z);
  for(let y=Math.min(prev,next);y<Math.max(prev,next);y++)write('canopy-z-brace',x,y,prev<next?z:z-1,p.post);
 }
 // Explicit source-cell-supported pitched annex rooflines, unlike identical flat box roofs.
 // These extra authored roof ridges sit on existing y=7 bearing roofs, are not cosmetic SVG assets.
 for(const [x0,x1,z0,z1,axis,rise] of p.roofRibs){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(isCore(x,z)||!mask.has(flat(x,z)))continue;
   const inset=axis==='x'?Math.min(x-x0,x1-x):Math.min(z-z0,z1-z);
   const height=8+Math.min(rise,Math.floor(inset/3));
   for(let y=8;y<=height;y++)write('bearing-pitched-annex',x,y,z,p.roof);
  }
 }
 // New M3 construction: two source-real, load-path-bearing staggered signal turrets.
 // The turret crowns are independent of the observation deck path and do not obstruct it.
 const towers=[{name:'upwind',z0:2,z1:8,rise:p.northHeight},{name:'downwind',z0:d-12,z1:d-6,rise:p.southHeight}];
 for(const t of towers){
  const tx0=aisle+3,tx1=aisle+6,midZ=Math.floor((t.z0+t.z1)/2);
  for(let x=tx0;x<=tx1;x++)for(let z=t.z0;z<=t.z1;z++){
   if(!isCore(x,z))throw Error(id+' turret outside actual high-keep foundation');
   const edge=x===tx0||x===tx1||z===t.z0||z===t.z1;
   const corner=(x===tx0||x===tx1)&&(z===t.z0||z===t.z1);
   // Real four load-bearing continuous columns from y=1 foundation to rooftop.
   if(corner)for(let y=1;y<=deckY;y++)write('turret-ground-bearing',x,y,z,p.post);
   if(edge)for(let y=deckY+1;y<=deckY+t.rise;y++)write('turret-high-wall',x,y,z,p.wall);
   const centerFold=Math.min(x-tx0,tx1-x,z-t.z0,t.z1-z);
   const taper=p.roofType==='terrace'?Math.min(2,Math.floor((z-t.z0)/3))
    :p.roofType==='saw'?(x+z+t.rise)%2
    :p.roofType==='cross'?Math.min(2,Math.floor(centerFold))
    :p.roofType==='gable'?Math.min(2,Math.floor(Math.min(x-tx0,tx1-x)))
    :Math.min(2,Math.floor((x-tx0)/2));
   for(let y=deckY+t.rise+1;y<=deckY+t.rise+1+taper;y++)
    write('turret-tiered-cap',x,y,z,p.roof);
   if(edge&&(x+z)%3===0)write('turret-crest',x,deckY+t.rise+2+taper,z,p.post);
  }
  // The signal finial is structurally attached to actual source roof cells.
  const spireX=aisle+4,spireY=deckY+t.rise+2;
  for(let y=spireY;y<spireY+Math.min(3,Math.max(2,Math.ceil(t.rise/2)));y++)
   write('turret-signal-finial',spireX,y,midZ,p.post);
 }
 for(let y=2;y<=4;y++){
  write('cargo',p.cargo[0],y,p.cargo[1],'pack4:057');
  write('regional-inset',p.cargo[0]+1,y,p.cargo[1],p.trim);
 }
 const nodes=[N('entry',aisle,2,d-1,'entry'),N('base',aisle,2,4)];
 const edges=[E('entry','base')];
 for(let i=0;i<steps;i++){
  nodes.push(N('step-'+i,sx,2+i,sz+i,'stairs'));
  edges.push(E(i===0?'base':'step-'+(i-1),'step-'+i,i===0?'level':'stair'));
 }
 nodes.push(N('landing',sx+2,deckY+1,lastZ,'observation'));
 nodes.push(N('lookout',aisle,deckY+1,3,'observation'));
 edges.push(E('step-'+(steps-1),'landing'));edges.push(E('landing','lookout'));
 const bp={
  id,type:'watchtower',biome:p.biome,size:p.size,variant:3,status:'theoretical',activated:false,
  envelope:B(0,0,0,w,steps+14,d),
  modules:[...mods].map(([role,cells])=>({id:role+'-01',role,cells})),
  clearances:halls,openings:[{id:'guard-door',facing:'south',x:aisle,y:2,z:d-1,width:2,height:3}],
  spaces:[
   {id:'ground-guard',kind:'guard-access',bounds:B(aisle-1,2,1,4,4,d-2),accessNode:'base'},
   {id:'stair-chamber',kind:'upper-circulation',bounds:B(sx,2,4,aisle-sx+2,steps+1,lastZ-2),accessNode:'step-0'},
   {id:'upper-terrace',kind:'observation',bounds:B(sx+2,deckY+1,2,aisle-sx+3,2,lastZ),accessNode:'lookout'}
  ],
  navigation:{entry:'entry',nodes,edges},
  features:[
   {name:'two-wide physical stair',position:[sx,2,sz],assetRef:'pack1:008',unresolvedDependency:null},
   {name:'source-real upper-bearing',position:[cx0,deckY+1,cz0],assetRef:p.post,unresolvedDependency:null},
   {name:'real cargo source',position:[p.cargo[0],2,p.cargo[1]],assetRef:'pack4:057',unresolvedDependency:null},
   {name:'unbuilt smoke warning',position:[aisle,deckY+1,3],assetRef:null,unresolvedDependency:'Signal and fire not implemented'}
  ],
  architecture:{kind:p.title,sourceIrregularMaskedFoundation:true,footprintCells:mask.size,stairSteps:steps,
   observationAccess:true,observationY:deckY+1,roofProfile:p.roofType,
   realRoofBearingColumns:4,occupiedCoordinates:blocks.size,worldPlaced:false,creatorApproved:false,
   perCellVariantResolved:false,perCellYawResolved:false},
  dependencies:[p.wall,p.floor,p.roof,p.post,p.trim,'pack1:008','pack3:070','pack4:057',p.symbol,
   'Physical stair collider, per-cell numeric variants and yaw, multi-cell reservation unresolved'],
  implementation:'THEORETICAL_3B_WATCHTOWER_VARIANT3_ONLY: no gameplay placement, saves or runtime changes'
 };
 validateBlueprint(bp,ASSET_CATALOG);return bp;
}
const byBiomeSize=new Map(plans.map(p=>[p.biome+':'+p.size,p]));
export function createWatchtowerVariant3FirstBlueprint(type,biome,size,variant=3){
 if(type!=='watchtower'||!['small','medium','large'].includes(size)||variant!==3)
  throw new RangeError('Only specifically authored third-variation watchtower source plans belong to this batch');
 const p=byBiomeSize.get(biome+':'+size);if(!p)throw new RangeError('Unwritten third-variation tower slot');
 return create(p);
}
export function createWatchtowerVariant3FirstPool(){return plans.map(create);}
