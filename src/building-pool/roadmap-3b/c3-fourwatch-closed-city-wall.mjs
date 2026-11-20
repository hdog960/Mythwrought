// Roadmap C original self-contained, two-wide walked closed city wall candidate.
// Read-only source architecture: no settlement, world placement, save or powered devices.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
import {validateCityWallTopology} from './fortification-topology.mjs';

const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const K=(x,y,z)=>x+','+y+','+z, G=(x,z)=>x+','+z;
export function createRoadmapCFirstCityWallBlueprint(){
 const id=assertSlot('city-wall','temperate','small',1);
 const W=44,D=44,H=16,foundations=new Set(),occupied=new Map(),modules=new Map();
 const putFoot=(x,z)=>{if(x<0||z<0||x>=W||z>=D)throw Error(id+' footprint outside bounds');foundations.add(G(x,z));};
 const rect=(a,b,c,d,fn)=>{for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)fn(x,z);};
 // Continuous two-cell-thick perimeter rampart, all four physical sides.
 // Interior four buttresses have deliberately different masses and heights.
 rect(3,40,3,40,(x,z)=>{
  if(x<=4||x>=39||z<=4||z>=39)putFoot(x,z);
 });
 const bastions=[
  {a:5,b:9,c:5,d:8,height:8,name:'northwest-armory'},
  {a:35,b:38,c:5,d:10,height:10,name:'northeast-signal-platform'},
  {a:5,b:10,c:35,d:38,height:9,name:'southwest-guards'},
  {a:34,b:38,c:34,d:38,height:8,name:'southeast-watch-platform'}
 ];
 for(const p of bastions)rect(p.a,p.b,p.c,p.d,putFoot);
 // A physical exterior-to-interior two-wide road, then a real horizontal
 // cross-gallery to the east guard stair; no teleport connectivity.
 for(let z=1;z<=10;z++)for(let x=20;x<=21;x++)putFoot(x,z);
 for(let x=20;x<=28;x++)for(let z=9;z<=10;z++)putFoot(x,z);
 for(let z=5;z<=10;z++)for(let x=27;x<=28;x++)putFoot(x,z);
 const clear=[
  B(20,2,1,2,3,10),B(20,2,10,9,3,1),
  ...Array.from({length:5},(_,i)=>B(27,3+i,9-i,2,3,1)),
  B(27,7,4,2,3,1)
 ];
 const reserved=(x,y,z)=>clear.some(c=>x>=c.x&&x<c.x+c.width&&y>=c.y&&y<c.y+c.height&&z>=c.z&&z<c.z+c.depth);
 function put(role,x,y,z,ref){
  if(!foundations.has(G(x,z))||x<0||x>=W||z<0||z>=D||y<0||y>=H)throw Error(id+' ungrounded source '+K(x,y,z));
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' unallocated asset '+ref);
  if(role!=='foundation'&&role!=='floor'&&reserved(x,y,z))return false;
  const at=K(x,y,z);if(occupied.has(at))throw Error(id+' overlapping source '+at+' '+role);
  occupied.set(at,role);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push([x,y,z,ref]);
  return true;
 }
 for(const xz of foundations){
  const [x,z]=xz.split(',').map(Number);
  put('foundation',x,0,z,'builtin:stone');
  put('floor',x,1,z,'pack1:007');
 }
 const ring2=(x,z)=>x>=3&&x<=40&&z>=3&&z<=40&&(x<=4||x>=39||z<=4||z>=39);
 const road=(x,z)=>x>=20&&x<=21&&z>=1&&z<=10;
 for(const xz of foundations){
  const [x,z]=xz.split(',').map(Number);
  if(!ring2(x,z))continue;
  // Actual three-high cart opening through BOTH rings of wall thickness.
  const gate=road(x,z)&&(z===3||z===4);
  for(let y=2;y<=5;y++){
   if(gate&&y<=4)continue;
   put('wall',x,y,z,gate?'pack3:069':'pack1:002');
  }
  put('rampart',x,6,z,'pack3:070');
 }
 // Roof-shrouded unequal corner bastions are source-connected to the
 // double-thick ring at adjacent columns; no isolated tower islands.
 for(const [bi,p] of bastions.entries()){
  rect(p.a,p.b,p.c,p.d,(x,z)=>{
   for(let y=2;y<=5;y++)put('bastion-bearing',x,y,z,'pack1:002');
   put('roof',x,6,z,bi%2?'pack3:025':'pack3:069');
   // Raised detail is supported on the real y6 roof mass, not a floating fake.
   const boundary=x===p.a||x===p.b||z===p.c||z===p.d;
   if(boundary)for(let y=7;y<p.height;y++)put('battlement-mass',x,y,z,'pack1:010');
  });
 }
 // Source-backed two-wide staircase, each tread bearing on a literal column,
 // with separate real 3-high headroom at every step and a continuous roof landing.
 for(let i=0;i<5;i++){
  const z=9-i,top=2+i;
  for(let x=27;x<=28;x++){
   for(let y=2;y<top;y++)put('stair-support',x,y,z,'pack1:002');
   if(!put('stair',x,top,z,'pack1:008'))throw Error(id+' blocked authentic two-wide stair at '+K(x,top,z));
  }
 }
 const vertices=[[3,3],[40,3],[40,40],[3,40],[3,3]];
 const rampartRoute=[];
 for(let i=1;i<vertices.length;i++){
  const [a,c]=vertices[i-1],[b,d]=vertices[i];
  const dx=Math.sign(b-a),dz=Math.sign(d-c);
  for(let t=0;t<Math.abs(b-a)+Math.abs(d-c);t++)
   rampartRoute.push([a+dx*t,7,c+dz*t]);
 }
 const navigation={
  entry:'road-entry',
  nodes:[
   {id:'road-entry',x:20,y:2,z:1,width:2,headroom:3},
   {id:'middle-road',x:20,y:2,z:8,width:2,headroom:3},
   {id:'stair-foot',x:27,y:2,z:10,width:2,headroom:3},
   ...Array.from({length:5},(_,i)=>({id:'stair-'+(i+1),x:27,y:3+i,z:9-i,width:2,headroom:3})),
   {id:'rampart',x:27,y:7,z:4,width:2,headroom:3}
  ],
  edges:[
   {from:'road-entry',to:'middle-road',kind:'level'},
   {from:'middle-road',to:'stair-foot',kind:'level'},
   {from:'stair-foot',to:'stair-1',kind:'stair'},
   ...Array.from({length:4},(_,i)=>({from:'stair-'+(i+1),to:'stair-'+(i+2),kind:'stair'})),
   {from:'stair-5',to:'rampart',kind:'level'}
  ]
 };
 const bp={
  id,type:'city-wall',biome:'temperate',size:'small',variant:1,
  status:'theoretical',activated:false,envelope:B(0,0,0,W,H,D),
  modules:[...modules].map(([role,cells])=>({id:role+'-original',role,cells})),
  clearances:clear,
  openings:[{id:'caravan-north-gate',facing:'north',x:20,y:2,z:1,width:2,height:3}],
  spaces:[
   {id:'caravan-pass',kind:'gateway',bounds:B(20,2,1,2,3,10),accessNode:'road-entry'},
   {id:'guard-stair',kind:'stairwell',bounds:B(27,2,10,2,3,1),accessNode:'stair-foot'},
   {id:'upper-wall-run',kind:'wall-run',bounds:B(27,7,4,2,3,1),accessNode:'rampart'},
   {id:'defensive-rampart',kind:'battlement',bounds:B(27,7,4,2,3,1),accessNode:'rampart'}
  ],navigation,
  fortification:{
   wallPath:vertices,rampartRoute,
   gatePassages:[{axis:'z',floorY:2,width:2,height:3,
    points:Array.from({length:7},(_,i)=>[20,i+1])}],
   junctionSockets:vertices.slice(0,-1).map(([x,z],i)=>({x,z,y:7,kind:'reinforced-corner',orientation:['northwest','northeast','southeast','southwest'][i]})),
   roadwaySockets:[{x:20,z:1,heading:'north',width:2},{x:20,z:10,heading:'south',width:2}],
   terrainConstraints:{flatFoundationRequired:true,minUnderwallSupport:1,roadGrade:0},
   physicalGateClearance:{width:2,height:3,openCells:14},
   specialStructures:bastions.map(p=>({name:p.name,width:p.b-p.a+1,depth:p.d-p.c+1,height:p.height}))
  },
  features:[
   {name:'northern original two-wide gate',position:[20,2,3],assetRef:null,unresolvedDependency:'Pack2 hinges and future gate mechanics NOT installed'},
   {name:'southwest real corner roof',position:[8,6,36],assetRef:'pack3:069',unresolvedDependency:null},
   {name:'open skyline inside perimeter',position:[22,2,22],assetRef:null,unresolvedDependency:'Open interior is reserved for later settlement only; none is generated'}
  ],
  architecture:{title:'Fourwatch Circuit — first closed city wall',originalSource:true,
   enclosedGroundSourceSpace:true,twoWideWallAccess:true,actualPerimeterCells:rampartRoute.length,
   independentBastionProfiles:bastions.length,
   wallSupportsFromY0:true,creatorAccepted:false,liveRegistered:false,physicalProducerResolved:false},
  dependencies:['pack1:002','pack1:007','pack1:008','pack1:010','pack3:025',
   'pack3:069','pack3:070','verify Pack 1–5 physical AABB/yaw and wall-gate joins'],
  implementation:'ROADMAP-C-3B-CLOSED-PERIMETER-SOURCE-ONLY; NO PLACEMENT OR SETTLEMENT GENERATION'
 };
 validateBlueprint(bp,ASSET_CATALOG);
 validateCityWallTopology(bp);
 return bp;
}
export function createRoadmapCFirstCityWallPool(){return [createRoadmapCFirstCityWallBlueprint()];}
