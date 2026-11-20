// Roadmap C original 3B desert medium barracks variant 2, isolated and unregistered.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const key=(x,y,z)=>[x,y,z].join(','),g=(x,z)=>x+','+z;
const rect=(s,a,b,c,d)=>{for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)s.add(g(x,z));};
export function createCRoadmapCDesertBarracks(){
 const id=assertSlot('barracks','desert','medium',2);
 const W=56,D=52,H=17,foot=new Set(),occupied=new Set(),mods=new Map();
 // Uneven west dorms, east mess, armory and training wing share a real two-wide
 // main mustering spine plus TWO source-authored horizontal guarded passages.
 for(const r of [[23,28,0,49],[3,24,4,18],[27,51,8,24],
  [3,23,26,42],[27,52,31,46],[17,34,38,49],
  [10,45,12,13],[10,45,36,37]])rect(foot,...r);
 let nVoid=0;
 for(const r of [[11,13,15,17],[39,41,20,22]])
  for(let x=r[0];x<=r[1];x++)for(let z=r[2];z<=r[3];z++)
   if(foot.delete(g(x,z)))nVoid++;
 if(nVoid!==18)throw Error(id+' true source-empty guard courts missing');
 const has=(x,z)=>foot.has(g(x,z));
 const clear=[
  B(24,2,0,2,3,49),B(10,2,12,36,3,2),B(10,2,36,36,3,2),
  B(22,2,40,2,3,1),
  ...Array.from({length:4},(_,i)=>B(22,3+i,41+i,2,3,1)),
  B(20,7,44,2,3,1)
 ];
 const empty=(x,y,z)=>clear.some(c=>x>=c.x&&x<c.x+c.width&&y>=c.y&&y<c.y+c.height&&z>=c.z&&z<c.z+c.depth);
 const stair=(x,z)=>x>=22&&x<=23&&z>=41&&z<=44;
 function put(role,x,y,z,ref,force=false){
  if(!has(x,z)||x<0||z<0||x>=W||z>=D||y<0||y>=H)
   throw Error(id+' source is floating/outside '+key(x,y,z));
  if(!Object.hasOwn(ASSET_CATALOG,ref))
   throw Error(id+' unsupported material '+ref);
  if(!force&&!['foundation','floor'].includes(role)&&empty(x,y,z))return false;
  const k=key(x,y,z);if(occupied.has(k))throw Error(id+' source collision '+k);
  occupied.add(k);
  if(!mods.has(role))mods.set(role,[]);
  mods.get(role).push([x,y,z,ref]);return true;
 }
 for(const s of foot){
  const [x,z]=s.split(',').map(Number);
  put('foundation',x,0,z,'builtin:stone');
  put('floor',x,1,z,'pack1:007');
 }
 const roofY=(x,z)=>x>=31&&z>=30?10:x>=31&&z<=24?9:
  x<=21&&z<=20?8:x<=21&&z>=25?
   (x>=20&&z===44?6:7):6;
 for(const s of foot){
  const [x,z]=s.split(',').map(Number);
  if(stair(x,z))continue;
  const exposed=[[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([xx,zz])=>!has(xx,zz));
  if(exposed)for(let y=2;y<=Math.min(roofY(x,z)-1,6);y++)
   put('wall',x,y,z,'pack1:002');
 }
 for(const s of foot){
  const [x,z]=s.split(',').map(Number);if(stair(x,z))continue;
  const h=roofY(x,z);
  const mat=h===10?'pack3:069':h===9?'pack3:025':h===8?'pack3:026':'pack3:023';
  put('roof',x,h,z,mat);
  if(h>=9&&x>=36&&x<=43&&z>=33&&z<=43&&x%4===0)
   put('roof-ridge',x,h+1,z,'pack3:070');
 }
 // Symbolic furnishing is source-real yet unpowered; barracks bunks await
 // physical producer asset validation, not invented working furniture IDs.
 for(const [x,z,ref] of [
  [7,7,'pack4:056'],[9,7,'pack4:056'],[15,8,'pack4:057'],
  [39,16,'pack4:057'],[42,16,'pack4:056'],[45,16,'pack4:057'],
  [8,31,'pack4:057'],[11,31,'pack4:057'],[16,30,'pack5:088'],
  [37,41,'pack4:057'],[42,41,'pack4:057'],[46,41,'pack4:056']
 ])put('equipment',x,2,z,ref);
 // Actual physical stair and under-tread supports, not a disconnected nav token.
 for(let i=0;i<4;i++)for(let x=22;x<=23;x++){
  const z=41+i,top=2+i;
  for(let y=2;y<top;y++)put('stair-support',x,y,z,'pack1:002',true);
  put('stair',x,top,z,'pack1:008',true);
 }
 const nodes=[
  {id:'entry',x:24,y:2,z:0,width:2,headroom:3},
  {id:'north-cross',x:24,y:2,z:12,width:2,headroom:3},
  {id:'west-dorm',x:11,y:2,z:12,width:2,headroom:3},
  {id:'east-mess',x:39,y:2,z:12,width:2,headroom:3},
  {id:'rear-cross',x:24,y:2,z:36,width:2,headroom:3},
  {id:'west-armory',x:11,y:2,z:36,width:2,headroom:3},
  {id:'east-training',x:39,y:2,z:36,width:2,headroom:3},
  {id:'rear-outlet',x:24,y:2,z:48,width:2,headroom:3},
  {id:'stair-foot',x:22,y:2,z:40,width:2,headroom:3},
  ...Array.from({length:4},(_,i)=>({id:'stair-'+(i+1),x:22,y:3+i,z:41+i,width:2,headroom:3})),
  {id:'roof-watch',x:20,y:7,z:44,width:2,headroom:3}
 ];
 const edgeSpecs=[['entry','north-cross','level'],['north-cross','west-dorm','level'],
  ['north-cross','east-mess','level'],['north-cross','rear-cross','level'],
  ['rear-cross','west-armory','level'],['rear-cross','east-training','level'],
  ['rear-cross','rear-outlet','level'],['rear-cross','stair-foot','level'],
  ['stair-foot','stair-1','stair'],
  ...Array.from({length:3},(_,i)=>['stair-'+(i+1),'stair-'+(i+2),'stair']),
  ['stair-4','roof-watch','stair']];
 const space=(id,kind,accessNode,x,y,z)=>({id,kind,accessNode,bounds:B(x,y,z,2,3,1)});
 const blueprint={
  id,type:'barracks',biome:'desert',size:'medium',variant:2,
  status:'theoretical',activated:false,envelope:B(0,0,0,W,H,D),
  modules:[...mods].map(([role,cells])=>({id:'sandglass-fork-'+role,role,cells})),
  clearances:clear,
  openings:[
   {id:'caravan-north-gate',facing:'north',x:24,y:2,z:0,width:2,height:3},
   {id:'south-training-egress',facing:'south',x:24,y:2,z:48,width:2,height:3}],
  spaces:[
   space('caravan-street','muster','entry',24,2,0),
   space('western-bunkhall','bunks','west-dorm',11,2,12),
   space('eastern-messhall','mess-hall','east-mess',39,2,12),
   space('rear-armory','armory','west-armory',11,2,36),
   space('covered-drill-hall','training','east-training',39,2,36),
   space('supported-rooftop-watch','observation','roof-watch',20,7,44),
   space('southern-courtyard-egress','egress','rear-outlet',24,2,48)
  ],
  navigation:{entry:'entry',nodes,edges:edgeSpecs.map(([from,to,kind])=>({from,to,kind}))},
  features:[
   {name:'inert equipment in western sleeping hall',position:[7,2,7],assetRef:'pack4:056',unresolvedDependency:null},
   {name:'literal dining storage',position:[39,2,16],assetRef:'pack4:057',unresolvedDependency:null},
   {name:'actual armory work fixture',position:[16,2,30],assetRef:'pack5:088',unresolvedDependency:null},
   {name:'roof guard landing',position:[20,7,44],assetRef:null,unresolvedDependency:'Pack 3 producer deck and collision pending'}
  ],
  physicalCourtyardVoids:[{x0:11,x1:13,z0:15,z1:17},{x0:39,x1:41,z0:20,z1:22}],
  settlementInterfaces:{streetEntrance:[24,2,0],trainingExit:[24,2,48],
   roofWatch:[20,7,44],citizenPlacementApproved:false},
  architecture:{title:'Sandglass Fork Barracks — double-court garrison',
   originalSource:true,independentRoofBands:4,
   twoWidePhysicalAccess:true,creatorAccepted:false,gameRegistered:false},
  dependencies:['pack1:002','pack1:007','pack1:008','pack3:023','pack3:025',
   'pack3:026','pack3:069','pack3:070','pack4:056','pack4:057','pack5:088',
   'Pack1–5 exact physical AABB, orientation, supports and collision not yet certified'],
  implementation:'ROADMAP-C-C4-ORIGINAL-BARRACKS-SOURCE-ONLY-NO-WORLD-PLACEMENT'
 };
 validateBlueprint(blueprint,ASSET_CATALOG);
 return blueprint;
}
export function createCRoadmapCDesertBarracksPool(){return [createCRoadmapCDesertBarracks()];}
