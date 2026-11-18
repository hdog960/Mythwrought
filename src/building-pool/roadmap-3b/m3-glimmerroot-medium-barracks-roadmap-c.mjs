// Roadmap C 3B original enchanted forest Glimmerroot medium canopy bridge barracks, six root guard rooms, two canopy courtyards.
// No world registration, gameplay, save migration, or changes outside this isolated builder lane.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const key=(x,y,z)=>x+','+y+','+z,flat=(x,z)=>x+','+z;
const plans=[
  {
    "biome": "enchanted-forest",
    "w": 65,
    "d": 66,
    "aisle": 31,
    "mask": [
      [
        26,
        39,
        0,
        65
      ],
      [
        2,
        27,
        3,
        24
      ],
      [
        38,
        63,
        6,
        26
      ],
      [
        5,
        29,
        34,
        51
      ],
      [
        37,
        62,
        36,
        51
      ],
      [
        12,
        27,
        54,
        64
      ],
      [
        40,
        59,
        54,
        64
      ],
      [
        4,
        21,
        25,
        32
      ],
      [
        45,
        61,
        27,
        35
      ],
      [
        1,
        17,
        55,
        65
      ]
    ],
    "rooms": [
      [
        "west",
        "amberbark-rest-dormitory",
        "bunks",
        [
          3,
          25,
          5,
          22
        ],
        11
      ],
      [
        "east",
        "lanternleaf-meal-pavilion",
        "mess",
        [
          40,
          61,
          8,
          24
        ],
        16
      ],
      [
        "west",
        "rootguard-equipment-chamber",
        "armory",
        [
          6,
          27,
          35,
          48
        ],
        41
      ],
      [
        "east",
        "spirewatch-signal-den",
        "duty",
        [
          40,
          60,
          38,
          49
        ],
        43
      ],
      [
        "west",
        "herbalist-healing-gallery",
        "infirmary",
        [
          13,
          26,
          55,
          62
        ],
        58
      ],
      [
        "east",
        "gladestrider-training-hall",
        "drill",
        [
          41,
          57,
          55,
          62
        ],
        59
      ]
    ],
    "voids": [
      [
        8,
        13,
        27,
        30
      ],
      [
        47,
        51,
        28,
        32
      ]
    ],
    "roofBands": [
      5,
      2,
      7,
      3,
      6,
      4
    ],
    "spurs": [
      [
        4,
        3
      ],
      [
        60,
        5
      ]
    ],
    "roofAxes": [
      "x",
      "z",
      "z",
      "x",
      "z",
      "x"
    ],
    "title": "Glimmerroot Canopy-Bridge Barracks with Western Moonleaf Overlook",
    "roofStyle": "glimmerroot-ten-wing-moonleaf-overlook-and-twin-canopy-roof-spurs",
    "wall": "pack1:002",
    "floor": "pack1:007",
    "roof": "pack3:023",
    "post": "pack2:015",
    "trim": "pack5:079"
  }
]
function create(p){
 const id=assertSlot('barracks',p.biome,'medium',1),w=p.w,d=p.d,H=20;
 const footprint=new Set();
 const rect=(a,b,c,e,fn)=>{for(let x=a;x<=b;x++)for(let z=c;z<=e;z++)fn(x,z);};
 for(const [a,b,c,e] of p.mask)rect(a,b,c,e,(x,z)=>footprint.add(flat(x,z)));
 // Literal hand-authored open courts: remove physical foundations, roofs and walls,
 // and reject empty/cosmetic-only cutouts before adding room paths.
 let actualRemovedCourtyardCells=0;
 for(const [a,b,c,e] of p.voids){
  let removed=0;
  rect(a,b,c,e,(x,z)=>{if(footprint.delete(flat(x,z)))removed++;});
  if(removed<6)throw Error(id+' unsupported visual-only courtyard '+[a,b,c,e]);
  actualRemovedCourtyardCells+=removed;
 }
 // Integer-coordinate, two-wide hall bridges join every genuinely offset room to the main barracks spine.
 const roomData=p.rooms.map(([side,name,kind,[a,b,c,e],doorZ])=>{
  const nodeX=side==='west'?b-3:a+1;
  const left=Math.min(nodeX,p.aisle),right=Math.max(nodeX+1,p.aisle+1);
  rect(left,right,doorZ,doorZ+1,(x,z)=>footprint.add(flat(x,z)));
  return {side,name,kind,rect:[a,b,c,e],doorZ,nodeX,bridge:[left,right,doorZ,doorZ+1]};
 });

 for(const [a,b,c,e] of p.voids)
  rect(a,b,c,e,(x,z)=>{if(footprint.has(flat(x,z)))throw Error(id+' courtyard obstructed by hall '+[x,z]);});
 const ground=[...footprint].map(s=>s.split(',').map(Number)),modules=new Map(),occupied=new Map();
 const clearances=[B(p.aisle,2,0,2,3,d)];
 for(const r of roomData){
  const [a,b,c,e]=r.rect;
  clearances.push(B(a+1,2,c+1,b-a-1,3,e-c-1));
  clearances.push(B(r.bridge[0],2,r.doorZ,r.bridge[1]-r.bridge[0]+1,3,2));
 }
 const reserved=(x,y,z)=>clearances.some(c=>x>=c.x&&x<c.x+c.width&&y>=c.y&&y<c.y+c.height&&z>=c.z&&z<c.z+c.depth);
 function write(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=H||z<0||z>=d)throw Error(id+' source out of envelope '+[role,x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' missing physical family '+ref);
  if(!footprint.has(flat(x,z)))return false;
  if(role!=='foundation'&&role!=='floor'&&reserved(x,y,z))return false;
  const k=key(x,y,z);if(occupied.has(k))return false;
  occupied.set(k,role);if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push([x,y,z,ref]);return true;
 }
 for(const [x,z] of ground){write('foundation',x,0,z,'builtin:stone');write('floor',x,1,z,p.floor);}
 // Physical Pack4 supply cache occupies an intentional non-circulation corner,
 // below the roofing and before wall placement, so it cannot be an unplaced label.
 for(const r of roomData){
  const [a,b,c,e]=r.rect;
  if(!write('equipment-store',a,2,c,'pack4:057'))throw Error(id+' supply source fails physical placement '+r.name);
  if(!write('equipment-store',a,3,c,p.trim))throw Error(id+' supplier trim source missing '+r.name);
 }
 for(const [x,z] of ground){
  const edge=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([a,b])=>!footprint.has(flat(a,b)));
  if(edge)for(let y=2;y<=6;y++)write('wall',x,y,z,p.wall);
 }
 // Perimeter partitions are real multi-room separator walls, preserving 2-wide connecting doorways.
 for(const r of roomData){const[a,b,c,e]=r.rect;
  for(let x=a;x<=b;x++)for(let z=c;z<=e;z++)if(x===a||x===b||z===c||z===e)
   for(let y=2;y<=6;y++)write('room-bulkhead',x,y,z,p.wall);
  // Source-backed gabled/terraced regional roof columns rise from an actual continuous under-roof.
 }
 for(const [x,z] of ground)write('roof',x,7,z,p.roof);
 for(let ri=0;ri<roomData.length;ri++){
  const r=roomData[ri],[a,b,c,e]=r.rect;
  const axis=p.roofAxes[ri];
  const peak=p.roofBands[ri];
  for(let x=a;x<=b;x++)for(let z=c;z<=e;z++){
   if(!footprint.has(flat(x,z)))continue;
   const inset=axis==='x'?Math.min(x-a,b-x):Math.min(z-c,e-z);
   const rise=Math.min(peak,Math.floor(inset/(2+ri%2))+(ri%2));
   for(let y=8;y<=8+rise;y++)write('source-bearing-roof-mass',x,y,z,p.roof);
  }
 }
 // Two actual regional asymmetrical rooftop watch spurs atop the supported central roof,
 // each occupied voxel face-connected to the y=7 roof. Neither blocks an interior passage.
 for(const [z0,rise] of p.spurs){
  let counted=0;
  for(let x=p.aisle+3;x<=p.aisle+4;x++)for(let z=z0;z<=z0+1;z++){
   if(!footprint.has(flat(x,z)))throw Error(id+' roof watch spur lacks real foundation '+[x,z]);
   for(let y=8;y<=8+rise;y++)if(write('roof-watch-spur',x,y,z,p.post))counted++;
  }
  if(counted<8)throw Error(id+' watch spur disappeared under colliding roof');
 }
 // Distinct true source-backed watch vents and sheltered eave piers.
 for(let ri=0;ri<p.mask.length;ri++){
  const[a,b,c,e]=p.mask[ri],x=ri%2?a:b,z=ri%2?c:e;
  for(let y=2;y<=9+(ri%3);y++)write('regional-eave-pier',x,y,z,p.post);
 }
 const nodes=[{id:'entry',x:p.aisle,y:2,z:d-1,width:2,headroom:3},
  {id:'muster-lane',x:p.aisle,y:2,z:1,width:2,headroom:3}];
 const edges=[{from:'entry',to:'muster-lane',kind:'level'}];
 const spaces=[{id:'main-muster',kind:'muster',bounds:B(p.aisle,2,0,2,3,d),accessNode:'muster-lane'}];
 for(let ri=0;ri<roomData.length;ri++){
  const r=roomData[ri],[a,b,c,e]=r.rect,node='room-'+ri,junction='junction-'+ri;
  nodes.push({id:junction,x:p.aisle,y:2,z:r.doorZ,width:2,headroom:3});
  nodes.push({id:node,x:r.nodeX,y:2,z:r.doorZ,width:2,headroom:3});
  edges.push({from:'muster-lane',to:junction,kind:'level'},{from:junction,to:node,kind:'level'});
  spaces.push({id:r.name,kind:r.kind,bounds:B(a+1,2,c+1,b-a-1,3,e-c-1),accessNode:node});
 }
 const bp={
  id,type:'barracks',biome:p.biome,size:'medium',variant:1,status:'theoretical',activated:false,
  envelope:B(0,0,0,w,H,d),
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  clearances,openings:[{id:'main-guard-door',facing:'south',x:p.aisle,y:2,z:d-1,width:2,height:3}],
  spaces,navigation:{entry:'entry',nodes,edges},
  features:[
   {name:'source-backed six-room medium garrison',position:[p.aisle,2,1],assetRef:p.post,unresolvedDependency:null},
   {name:'actual supply cache',position:[roomData[0].rect[0],2,roomData[0].rect[2]],assetRef:'pack4:057',unresolvedDependency:null},
   {name:'not-installed garrison AI',position:[p.aisle,2,d-1],assetRef:null,unresolvedDependency:'Barracks guard AI and gameplay staffing remain unimplemented'}
  ],
  architecture:{kind:p.title,physicalSixRoomPlan:true,groundedTwoWideRoute:true,
   originalMaskRegions:p.mask.length,openCourtyards:p.voids.length,courtyardRects:p.voids.map(x=>[...x]),actualRemovedCourtyardCells,roofSpurs:p.spurs.map(a=>[...a]),roofAxes:[...p.roofAxes],sourceRooms:roomData.map(r=>({name:r.name,side:r.side,bounds:[...r.rect],doorZ:r.doorZ,bridge:[...r.bridge]})),
   footprintCells:footprint.size,roofFamily:p.roofStyle,physicalRoofMassing:true,sourceCellCount:occupied.size,
   creatorApproved:false,worldPlaced:false,perCellVariantResolved:false,perCellYawResolved:false},
  dependencies:[p.wall,p.floor,p.roof,p.post,p.trim,'pack4:057','Source-collision AABB, selection/yaw/multi-cell footprint and garrison staffing not yet approved'],
  implementation:'THEORETICAL_3B_ROADMAP_C_SANDGLASS_MEDIUM_VARIANT1_ONLY; no integration, shared code, saves or production registration'
 };
 validateBlueprint(bp,ASSET_CATALOG);return bp;
}
const byBiome=new Map(plans.map(p=>[p.biome,p]));
export function createRoadmapC3BGlimmerrootMediumBarracksBlueprint(type,biome,size,variant=1){
 if(type!=='barracks'||size!=='medium'||variant!==1)throw new RangeError('Only source-authored medium barracks variant 1 allocated here');
 const p=byBiome.get(biome);if(!p)throw new RangeError('Unwritten barracks biome');
 return create(p);
}
export function createRoadmapC3BGlimmerrootMediumBarracksPool(){return plans.map(create);}
