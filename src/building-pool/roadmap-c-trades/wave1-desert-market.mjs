// Roadmap C exclusive Builder 2B trade addition: original desert small market square.
// Does not amend, register, or rewrite any protected Builder B / D source portfolio.
import {SCHEMA,validateBlueprint} from '../roadmap-2b/schema.mjs';

const WIDTH=46,DEPTH=40,HEIGHT=15;
const P=Object.freeze({
 foundation:'pack1:002',floor:'pack1:007',sandstone:'biome130:006',
 post:'pack2:015',walls:'pack2:013',canopy:'pack3:026',
 slate:'pack3:025',window:'pack4:030',counter:'pack5:086',
 display:'pack5:087',crate:'pack4:057',sign:'pack4:061',planter:'pack1:048'
});
const k=(x,y,z)=>x+','+y+','+z,flat=(x,z)=>x+','+z;
export function createCDesertSmallMarket(){
 const id='r2:market-square:desert:small:01';
 const foundation=new Set(),cells=new Map(),voids=[
  [19,22,27,29], // Sunken southern spice cooling court: genuine absent ground.
  [35,37,18,20]  // Separate eastern oasis daylight well.
 ];
 function rect(a,b,c,d,fun){for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)fun(x,z);}
 // An asymmetric caravan-arrival nave, six connected store wings, and a
 // physically walkable public square with substantial open-air sky above it.
 [
  [13,31,0,38], [2,14,4,24], [30,43,7,31],
  [7,39,25,38], [12,38,18,22], [9,32,11,16],
  [17,26,0,6], [25,43,23,29]
 ].forEach(([a,b,c,d])=>rect(a,b,c,d,(x,z)=>foundation.add(flat(x,z))));
 const genuinelyAbsent=[];
 for(const [a,b,c,d] of voids)rect(a,b,c,d,(x,z)=>{
  if(foundation.delete(flat(x,z)))genuinelyAbsent.push(flat(x,z));
 });
 if(genuinelyAbsent.length!==21)throw Error('Market lacks two true source-ground voids');
 const hasGround=(x,z)=>foundation.has(flat(x,z));
 const put=(x,y,z,material,kind,metadata={})=>{
  if(![x,y,z].every(Number.isInteger)||x<0||x>=WIDTH||y<0||y>=HEIGHT||z<0||z>=DEPTH)
   throw Error(id+' outside authored envelope '+k(x,y,z));
  if(!hasGround(x,z))throw Error(id+' cannot build over absent source ground '+k(x,y,z));
  const key=k(x,y,z);
  if(cells.has(key))throw Error(id+' overlapping physical source '+key);
  cells.set(key,{x,y,z,kind,material,...metadata});
 };
 const replace=(x,y,z,material,kind)=>{
  const key=k(x,y,z);if(!cells.has(key))throw Error(id+' missing replace coordinate '+key);
  cells.set(key,{x,y,z,material,kind});
 };
 for(const pos of foundation){
  const [x,z]=pos.split(',').map(Number);
  put(x,0,z,P.foundation,'foundation');
  put(x,1,z,P.floor,'floor');
 }
 const pods=[
  {name:'west-cloth',a:3,b:12,c:5,d:12,roofY:7,roof:P.canopy,uses:'vendor-stalls'},
  {name:'west-herb',a:3,b:12,c:16,d:23,roofY:8,roof:P.slate,uses:'vendor-stalls'},
  {name:'east-salt',a:33,b:42,c:8,d:15,roofY:9,roof:P.canopy,uses:'vendor-stalls'},
  {name:'east-spice',a:33,b:42,c:24,d:30,roofY:7,roof:P.slate,uses:'vendor-stalls'},
  {name:'north-weigh',a:9,b:17,c:30,d:37,roofY:8,roof:P.canopy,uses:'public-circulation'},
  {name:'north-exchange',a:28,b:38,c:31,d:37,roofY:10,roof:P.slate,uses:'public-circulation'}
 ];
 const openings=[];
 const approaches=[],designatedWindows=[];
 for(const pod of pods){
  const {a,b,c,d,roofY,roof}=pod;
  // Source-connected supporting columns, separate from the central sky-open square.
  for(const x of [a,b])for(const z of [c,d])
   for(let y=2;y<roofY;y++)put(x,y,z,P.post,'wall',{role:'load-bearing-column'});
  // Rear wall weather screens with actual source glazing, not fake glass metadata.
  for(let x=a+1;x<b;x++)for(let y=2;y<=4;y++)put(x,y,d,P.walls,'wall');
  for(const x of [a+2,b-2]){
   replace(x,3,d,P.window,'window');
   replace(x,4,d,P.window,'window');
   for(const y of [3,4])designatedWindows.push({type:'window',x,y,z:d,material:P.window});
  }
  for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)put(x,roofY,z,roof,'roof',{roofProfile:pod.name+'-'+roofY});
  // A side-screened counter and stock shelving remain off the two-wide entrance.
  for(let x=a+1;x<=a+2;x++){
   put(x,2,c+2,P.counter,'fixture',{purpose:pod.name+'-counter'});
   put(x,2,c+3,P.display,'fixture',{purpose:pod.name+'-wares'});
  }
  put(b-2,2,d-2,P.crate,'decor',{purpose:pod.name+'-stock'});
  const center=Math.floor((a+b)/2),approach={name:pod.name,x:center,y:2,z:c+1};
  for(let y=2;y<=4;y++)if(cells.has(k(center,y,c)))throw Error(id+' obstructed vendor entry '+pod.name);
  openings.push({type:'internal-doorway',x:center,y:2,z:c,clearHeightCells:3});
  approaches.push(approach);
 }
 // Actual non-rectangular southern triumph arch and four angled desert market pylons.
 for(const [x,z] of [[17,0],[26,0],[14,7],[31,7],[18,38],[26,37]]){
  for(let y=2;y<=5;y++)put(x,y,z,P.sandstone,'wall',{role:'sandstone-weather-pier'});
 }
 for(let x=17;x<=26;x++)put(x,6,0,P.post,'roof',{roofProfile:'desert-caravan-triumph-arch'});
 for(const [x,z] of [[11,14],[33,17],[11,27],[27,25]]){
  put(x,2,z,P.planter,'decor',{role:'regional-oasis-planter'});
 }
 put(17,7,0,P.sign,'decor',{role:'inert-caravan-wayfinding'});
 const entrances=[
  {type:'entrance',x:21,y:2,z:0,clearHeightCells:3,doorSymbol:'pack2:020'}
 ];
 // Ensure merchant and buyer circulation genuinely traverses 3-high clear public floor.
 const walk=[
  [21,0],[21,4],[21,9],[21,13],[21,17],[21,22],[25,23],[29,23],[30,24],
  [21,30],[21,34],[21,38],
  ...approaches.map(a=>[a.x,a.z])
 ];
 for(const [x,z] of walk){
  if(!hasGround(x,z))continue;
  for(let y=2;y<=4;y++)if(cells.has(k(x,y,z)))
   throw Error(id+' blocked public approach '+k(x,y,z));
 }
 const physicalVoids=voids.map(([a,b,c,d])=>({x0:a,x1:b,z0:c,z1:d,groundAbsent:true}));
 for(const area of physicalVoids)for(let x=area.x0;x<=area.x1;x++)for(let z=area.z0;z<=area.z1;z++)
  for(let y=0;y<HEIGHT;y++)if(cells.has(k(x,y,z)))throw Error(id+' false open-air garden');
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const deps=[...new Set([...voxels.map(v=>v.material),'pack2:020'])].sort().map(ref=>({
  ref,issue:'Producer shape, per-cell yaw, physical AABB/collision, support and schema-1 save fit not certified'
 }));
 const bp={
  schema:SCHEMA,id,category:'market-square',biome:'desert',size:'small',
  status:'authored-candidate',isolated:true,worldPlaced:false,numericIdsAssigned:false,
  extents:{x:WIDTH,y:HEIGHT,z:DEPTH},blueprintVersion:'roadmap-c-trade-wave1-original',
  architecturalStyle:{form:'asymmetric six-stall colonnade with two real open wells',biomeSpecific:true},
  rooms:[
   {name:'Open caravan gathering square',bounds:{x0:15,x1:29,z0:3,z1:24},uses:['square']},
   {name:'Six independent raised-roof vendor stalls',bounds:{x0:2,x1:43,z0:4,z1:37},uses:['vendor-stalls']},
   {name:'Northern public weighhouse arcade',bounds:{x0:8,x1:39,z0:30,z1:38},uses:['public-circulation']}
  ],
  circulation:[
   {from:'exterior',to:'square',via:'clear three-high southern caravan arch x21 z0'},
   {from:'square',to:'vendor-stalls',via:'actual dual-sided source corridors and six accessible booth entries'},
   {from:'vendor-stalls',to:'public-circulation',via:'northward road and physically supported covered exchange'}
  ],
  openings:[...entrances,...openings,...designatedWindows],
  features:['square','vendor-stalls','public-circulation','true sunlight courtyard wells','six individual roof profiles','source-authored support piers','two-sided market access'],
  physicalOpenCourts:physicalVoids,boothApproaches:approaches,
  sourceSupportAudits:pods.map(p=>({pod:p.name,roofY:p.roofY,loadBearingColumns:4})),
  routeTargets:walk.map(([x,z],i)=>({x,z,purpose:'public-route-'+i})),
  unresolvedDependencies:deps,
  physicalFamilyShapesVerified:false,creatorApproved:false,worldRegistration:false,
  voxels
 };
 validateBlueprint(bp);
 return Object.freeze(bp);
}
export function getRoadmapCTradeWave1(){return [createCDesertSmallMarket()];}
