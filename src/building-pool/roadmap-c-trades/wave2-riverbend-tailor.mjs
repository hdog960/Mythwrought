// Roadmap C trade wave 2. C-only original reserved ID; no Builder B source edits.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';
const EXT={x:33,y:16,z:31};
const P={foundation:'pack1:002',floor:'pack1:001',wood:'pack2:013',
 beam:'pack2:015',rafters:'pack3:024',slate:'pack3:025',
 glass:'pack4:030',counter:'pack5:086',display:'pack5:087',
 crate:'pack4:057',cloth:'pack5:089',sign:'pack4:061'};
const key=(x,y,z)=>[x,y,z].join(','),flat=(x,z)=>x+','+z;
const rect=(a,b,c,d,fn)=>{for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)fn(x,z);};
export function createCRiverbendTailor(){
 const id='r2:tailor:temperate:small:03',ground=new Set(),cells=new Map();
 // Long street gallery, low west dye/cutting workshop, eastern private fitting
 // rooms and a raised loading wing. A 3x3 courtyard has NO foundation at all.
 for(const [a,b,c,d] of [[8,23,0,25],[2,10,6,17],[22,30,11,23],[7,25,24,29]])
  rect(a,b,c,d,(x,z)=>ground.add(flat(x,z)));
 let removed=0;
 rect(15,17,18,20,(x,z)=>{if(ground.delete(flat(x,z)))removed++;});
 if(removed!==9)throw Error(id+' lost real sunlight dye well');
 const has=(x,z)=>ground.has(flat(x,z));
 const roof=(x,z)=>x>=7&&x<=25&&z>=24&&z<=29?10:
  x>=22&&x<=30&&z>=11&&z<=23?9:
  x>=8&&x<=23&&z>=0&&z<=25?8:
  x>=2&&x<=10&&z>=6&&z<=17?7:0;
 function put(x,y,z,material,kind,role){
  if(![x,y,z].every(Number.isInteger)||x<0||y<0||z<0||x>=EXT.x||y>=EXT.y||z>=EXT.z||!has(x,z))
   throw Error(id+' ungrounded voxel '+key(x,y,z));
  const k=key(x,y,z);
  if(cells.has(k))throw Error(id+' physical overlap '+k+' '+kind);
  cells.set(k,{x,y,z,material,kind,...role?{structuralRole:role}:{}});
 }
 function replace(x,y,z,material,kind){
  const k=key(x,y,z);if(!cells.has(k))throw Error(id+' ungrounded glazing '+k);
  cells.set(k,{x,y,z,material,kind});
 }
 const door=new Set();
 function doorway(x,z,dir){
  for(let a=0;a<2;a++)for(let y=2;y<=4;y++)
   door.add(key(x+(dir==='x'?a:0),y,z+(dir==='z'?a:0)));
 }
 doorway(15,0,'x');doorway(10,11,'z');doorway(23,15,'z');
 doorway(15,24,'x');doorway(16,29,'x');
 const divider=new Set();
 for(let z=7;z<=16;z++)divider.add(flat(10,z));
 for(let z=12;z<=22;z++)divider.add(flat(23,z));
 for(let x=8;x<=23;x++)divider.add(flat(x,24));
 for(const t of ground){
  const [x,z]=t.split(',').map(Number);
  put(x,0,z,P.foundation,'foundation');
  put(x,1,z,P.floor,'floor');
 }
 for(const t of ground){
  const [x,z]=t.split(',').map(Number);
  const outer=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!has(x+dx,z+dz));
  if(!outer&&!divider.has(t))continue;
  for(let y=2;y<=Math.min(6,roof(x,z)-1);y++){
   if(door.has(key(x,y,z)))continue;
   put(x,y,z,outer?P.wood:P.beam,'wall',outer?'weather-bearing':'internal-partition');
  }
 }
 const windows=[];
 const glazes=[[12,0],[19,0],[8,3],[23,4],[2,10],[2,13],
  [30,14],[30,19],[30,23],[7,27],[9,29],[21,29]];
 for(const [x,z] of glazes)for(const y of [3,4]){
  replace(x,y,z,P.glass,'window');
  windows.push({type:'window',x,y,z,material:P.glass});
 }
 for(const [x,z] of [[9,4],[22,4],[10,17],[22,23],[8,25],[24,25],
  [4,8],[4,16],[28,13],[28,21]])
  for(let y=2;y<roof(x,z);y++)
   if(!cells.has(key(x,y,z))&&!door.has(key(x,y,z)))
    put(x,y,z,P.beam,'wall','true-grounded-support');
 for(const t of ground){
  const [x,z]=t.split(',').map(Number),h=roof(x,z);
  if(h<7)throw Error(id+' roofing gap '+t);
  const profile=h===7?'low-cutting-hip':h===8?'main-weaver-ridge':
   h===9?'east-fitting-hip':'raised-dispatch-crown';
  put(x,h,z,h===7||h===10?P.rafters:P.slate,'roof',profile);
  if(h===8&&x>=14&&x<=17&&z>=1&&z<=10)
   put(x,9,z,P.rafters,'roof','central-raised-loom-ridge');
 }
 // Real, individually positioned objects and tool bays: leave aisles clear.
 for(const [x,z,material,role] of [
  [11,5,P.counter,'public-register'],[12,5,P.counter,'public-register'],
  [19,8,P.display,'fabrics'],[20,8,P.display,'fabrics'],
  [5,8,P.cloth,'dye-rack'],[6,8,P.cloth,'dye-rack'],
  [5,15,P.counter,'cutting-table'],[6,15,P.counter,'cutting-table'],
  [26,13,P.display,'fitting-screen'],[27,13,P.display,'fitting-screen'],
  [26,21,P.cloth,'privacy-curtain'],[27,21,P.cloth,'privacy-curtain'],
  [11,27,P.crate,'packed-linen'],[12,27,P.crate,'packed-linen']
 ])put(x,2,z,material,'fixture',role);
 put(15,9,0,P.sign,'decor','inert-handpainted-shop-sign');
 const targets=[[15,0],[15,5],[15,12],[12,15],[11,16],[10,11],
  [8,11],[6,11],[23,15],[25,15],[27,17],[16,24],[16,27],[16,29]];
 for(const [x,z] of targets)for(let y=2;y<=4;y++)
  if(!has(x,z)||cells.has(key(x,y,z)))throw Error(id+' blocked three-high buyer path '+key(x,y,z));
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const deps=[...new Set([...voxels.map(v=>v.material),'pack2:020'])].sort().map(ref=>({
  ref,issue:'Manual Pack1–5 material shapes, yaw, occupied offsets, AABBs and schema-1 save mapping unverified'
 }));
 const bp={schema:SCHEMA,id,category:'tailor',biome:'temperate',size:'small',variation:3,
  title:'Riverbend Weavers — a staggered cloth shop, dye well and private fitting wing',
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  extents:EXT,blueprintVersion:'Roadmap-C-C4-W2-source-only',
  architecturalStyle:{form:'asymmetric 4-wing shop with 7/8/9/10-high roof masses, no source-ground dye court',biomeSpecific:true},
  rooms:[
   {name:'Front retail gallery',uses:['sales-floor'],bounds:{x0:8,x1:23,z0:0,z1:17}},
   {name:'Public register',uses:['service-counter'],bounds:{x0:11,x1:14,z0:3,z1:8}},
   {name:'West physical cutting workshop and dye stocks',uses:['garment-display'],bounds:{x0:2,x1:10,z0:6,z1:17}},
   {name:'Private eastern fitting bay',uses:['fitting-area'],bounds:{x0:23,x1:30,z0:11,z1:23}},
   {name:'Rear finished-garment dispatch',uses:['stockroom'],bounds:{x0:7,x1:25,z0:24,z1:29}}
  ],
  circulation:[
   {from:'exterior',to:'sales-floor',via:'true high-street two-wide clear x15–16 door'},
   {from:'sales-floor',to:'service-counter',via:'open central retail gallery'},
   {from:'sales-floor',to:'garment-display',via:'cutting hall x10 z11–12'},
   {from:'sales-floor',to:'fitting-area',via:'private two-wide x23 z15–16 passage'},
   {from:'sales-floor',to:'stockroom',via:'true rear split hall z24 x15–16'}
  ],
  openings:[
   {type:'entrance',x:15,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020'},
   {type:'internal-doorway',x:10,y:2,z:11,clearHeightCells:3},
   {type:'internal-doorway',x:23,y:2,z:15,clearHeightCells:3},
   {type:'internal-doorway',x:15,y:2,z:24,clearHeightCells:3},
   {type:'internal-doorway',x:16,y:2,z:29,clearHeightCells:3},
   ...windows],
  features:['sales-floor','service-counter','garment-display','fitting-area',
   'stockroom','literal absent-ground central dye well','three asymmetric supported rooflines'],
  openGroundWell:{x0:15,x1:17,z0:18,z1:20},
  physicalEntryCells:[...door],
  routeTargets:targets.map(([x,z])=>({x,z,y:2})),
  unresolvedDependencies:deps,physicalProducerVerified:false,creatorArtApproved:false,voxels
 };
 validateBlueprint(bp);
 return Object.freeze(bp);
}
export function getRoadmapCTradeWave2(){return [createCRiverbendTailor()];}
