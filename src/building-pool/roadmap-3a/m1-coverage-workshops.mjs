/**
 * Source-authored 3D voxel implementation of all 44 remaining M1 representatives.
 * The 44 independently specified architecture programmes are in m1-coverage-specs.
 * This emits complete deterministic coordinates, not random seeds / titles /
 * palette swaps or runtime entities. Never writes saves or registers live IDs.
 */
import {slotId} from './roster.mjs';
import {validateBlueprint} from './contract.mjs';
import {M1_COMPLETION_SPECS} from './m1-coverage-specs.mjs';
const B=Object.freeze({
 masonry:'pack1:002',slab:'pack1:007',post:'pack1:010',
 boards:'pack2:013',timber:'pack2:015',
 tile:'pack3:023',slate:'pack3:025',
 anvil:'pack5:088',crate:'pack4:057'
});
const HEIGHT=25;
function build(q){
 const w=q.width,d=q.depth,center=Math.floor(w/2)-1;
 const occupied=new Map(),modules=new Map(),features=[];
 const at=(x,y,z)=>x+','+y+','+z;
 const has=(x,y,z)=>occupied.has(at(x,y,z));
 function put(role,x,y,z,asset,meta=null){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||z<0||z>=d||y<0||y>=HEIGHT)
   throw RangeError(q.design+' voxel out of envelope: '+at(x,y,z));
  const k=at(x,y,z);
  if(occupied.has(k))throw Error(q.design+' overlapping source occupancy '+k);
  occupied.set(k,role);
  if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push(meta===null?[x,y,z,asset]:[x,y,z,asset,Object.freeze(meta)]);
 }
 // Region-specific asymmetric footprint cuts. The center two-wide through
 // route never overlaps a notch. Perimeter wall wraps the true plan.
 function foot(x,z){
  if(x<0||x>=w||z<0||z>=d)return false;
  const a=q.cutWidth,L=q.cutLength, start=Math.floor((d-L)/2);
  switch(q.footprintCut){
   case 'nw':return !(x<a&&z<L);
   case 'ne':return !(x>=w-a&&z<L);
   case 'sw':return !(x<a&&z>=d-L);
   case 'se':return !(x>=w-a&&z>=d-L);
   case 'east':return !(x>=w-a&&z>=start&&z<start+L);
   case 'west':return !(x<a&&z>=start&&z<start+L);
   default:throw Error('Unknown authored footprint '+q.footprintCut);
  }
 }
 function roofHeight(x,z){
  const left=Math.min(x,w-1-x),end=Math.min(z,d-1-z);
  switch(q.roofProfile){
   case 'gable':return 10+Math.min(5,Math.floor(left/4));
   case 'hip':return 10+Math.min(5,Math.floor(Math.min(left,end)/4));
   case 'shed':return 10+Math.floor((w-1-x)/7);
   case 'saw':return 10+Math.floor(x/5)%3;
   case 'stepped':return 10+Math.floor(x/7)+Math.floor(z/13);
   case 'butterfly':return 10+Math.floor(Math.abs(x-(w-1)/2)/6);
   case 'cloister':return 10+Math.min(5,Math.floor(Math.min(left,end)/5));
   case 'axial':return 10+Math.min(4,Math.floor(end/5));
   case 'terrace':return 10+Math.floor(z/8);
   case 'cross':return 10+Math.min(4,Math.floor(left/5))+Math.floor(z/18);
   case 'gambrel':return 10+Math.min(5,Math.floor(left/3));
   case 'lantern':return 10+(x>=center-2&&x<=center+3?3:0);
   case 'pergola':return 10+Math.floor(z/6)%2;
   case 'half-vault':return 10+Math.min(5,Math.floor(left/4));
   default:throw Error('Unknown authored roof '+q.roofProfile);
  }
 }
 function roofOpening(x,z){
  switch(q.roofCourt){
   case 'none':return false;
   case 'north-loading':return z<9&&x>5&&x<w-6;
   case 'south-porch':return z>=d-8&&x>5&&x<w-6;
   case 'east-garden':return x>=w-9&&x<w-3&&z>=8&&z<d-8;
   case 'west-court':return x>=3&&x<9&&z>=8&&z<d-8;
   case 'central-skylight':return x>=center+3&&x<center+7&&z>=10&&z<d-10;
   default:throw Error('Unknown courtyard '+q.roofCourt);
  }
 }
 function opening(x,y,z){
  if(z===d-1&&x>=center&&x<center+2&&y>=2&&y<=4)return true;
  if(y>=4&&y<=5&&((x===0&&z>=Math.floor(d*.33)&&z<=Math.floor(d*.33)+3)||
      (x===w-1&&z>=Math.floor(d*.66)&&z<=Math.floor(d*.66)+3)))return true;
  // Independent stock loading door on side elevation.
  if((q.rackSide==='east'?x===w-1:x===0)&&z>=d-9&&z<=d-7&&y>=2&&y<=5)return true;
  return false;
 }
 const deck=q.type==='carpenter'||q.type==='stonemason'?B.boards:B.slab;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(foot(x,z)){
  put('foundation',x,0,z,B.masonry);
  put('floor',x,1,z,deck);
 }
 const wallTop=q.size==='large'?9:8;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(!foot(x,z))continue;
  if(foot(x-1,z)&&foot(x+1,z)&&foot(x,z-1)&&foot(x,z+1))continue;
  for(let y=2;y<=wallTop;y++){
   if(opening(x,y,z))continue;
   const portal=z===d-1&&(x===center-1||x===center+2)&&y<=7;
   put(portal?'entry-frame':'wall',x,y,z,portal?B.post:
      q.type==='carpenter'?B.boards:B.masonry);
  }
 }
 // Complete material-coordinate roof; deliberate open-to-sky work courts remain
 // flagged as future weather/layout acceptance dependencies.
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(foot(x,z)&&!roofOpening(x,z))
   put('roof',x,roofHeight(x,z),z,q.biome==='snow'||q.biome==='mountain'?B.slate:B.tile);
 }
 // Structural posts and purlins placed only where the actual roof exists.
 for(let z=3;z<d-3;z+=q.pierSpacing){
  for(const x of [3,w-4]){
   if(!foot(x,z)||roofOpening(x,z))continue;
   for(let y=2;y<roofHeight(x,z);y++)
    if(!has(x,y,z))put('support-pier',x,y,z,B.post);
  }
  for(let x=4;x<w-4;x++){
   if(!foot(x,z)||roofOpening(x,z))continue;
   const y=roofHeight(x,z)-1;
   if(!has(x,y,z))put('roof-truss',x,y,z,B.timber);
  }
 }
 const n=q.size==='small'?3:q.size==='medium'?4:5;
 const zonePositions=Array.from({length:n},(_,i)=>Math.floor((i+1)*d/(n+1)));
 const dividerCount=q.partitionPlan==='one'?1:q.partitionPlan==='two'?2:3;
 for(let i=1;i<=dividerCount;i++){
  const z=Math.floor(i*d/(dividerCount+1));
  for(let x=2;x<w-2;x++){
   if((x>=center&&x<center+2)||!foot(x,z))continue;
   for(let y=2;y<=5;y++)if(!has(x,y,z))
    put('workroom-partition',x,y,z,q.type==='carpenter'?B.boards:B.masonry);
  }
 }
 // Physical fixtures and stock piers materially differ by category.
 const rackX=q.rackSide==='east'?w-6:5;
 const opposite=q.rackSide==='east'?4:w-5;
 for(let z=4;z<d-4;z+=q.pierSpacing){
  for(let y=2;y<=5;y++){
   if(foot(rackX,z)&&!has(rackX,y,z))
    put(q.type==='armorer'?'plate-rack':
        q.type==='carpenter'?'timber-rack':
        q.type==='stonemason'?'cut-stone-rack':'ore-rack',
        rackX,y,z,q.type==='carpenter'?B.timber:B.post);
  }
 }
 for(let z=5;z<d-5;z+=q.pierSpacing+2){
  if(foot(opposite,z)&&!has(opposite,2,z))
   put(q.type==='stonemason'?'rough-stone-stock':'stock-pallet',
       opposite,2,z,q.type==='carpenter'?B.timber:B.slab);
 }
 // Non-operating real placed fixtures; mounting variants resolved by physical ABI.
 const stations=[
  {x:6,z:zonePositions[0],name:'primary '+q.type+' preparation bench'},
  {x:w-9,z:zonePositions[n-1],name:q.design+' stock marker'}
 ];
 for(let i=0;i<stations.length;i++){
  const s=stations[i];
  if(!foot(s.x,s.z)||has(s.x,2,s.z))
   throw Error(q.design+' fixture collides with authored room '+at(s.x,2,s.z));
  const asset=q.type==='armorer'&&i===0?B.anvil:
     q.type==='mining-workshop'&&i===1?B.crate:B.slab;
  const meta=asset===B.anvil?{orientation:'north',variant:'blackiron-horn',state:{}}:
      {orientation:'north',state:{}};
  put('fixture',s.x,2,s.z,asset,meta);
  features.push({name:s.name,position:[s.x,2,s.z],assetRef:asset,
   active:false,requiresPhysicalFit:true,noInteractiveCrafting:true});
 }
 // Named rooms share a verifiably open central route and partition doorways.
 const nodes=[
  {id:'entry',x:center,y:2,z:d-1,width:2,headroom:3},
  ...zonePositions.map((z,i)=>({id:'zone-'+i,x:center,y:2,z,width:2,headroom:3}))
 ];
 const edges=zonePositions.map((_,i)=>({
  from:i===0?'entry':'zone-'+(i-1),to:'zone-'+i,kind:'level'
 }));
 const spaces=zonePositions.map((z,i)=>({
  id:'workzone-'+i,kind:i===0?'front-loading-gallery':
     i===n-1?'finished-material-stock':q.type+'-'+q.design+'-bay-'+i,
  bounds:{x:1,y:2,z:Math.max(2,z-2),width:w-2,height:4,depth:5},
  accessNode:'zone-'+i,spatialProgramme:true
 }));
 const b={
  id:slotId(q.type,q.biome,q.size,1),type:q.type,biome:q.biome,size:q.size,variant:1,
  status:'theoretical',activated:false,worldPlaced:false,productionRegistered:false,
  envelope:{x:0,y:0,z:0,width:w,height:HEIGHT,depth:d},
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  openings:[{kind:'entrance',x:center,y:2,z:d-1,width:2,height:3,facing:'south'}],
  clearances:[{x:center,y:2,z:2,width:2,height:3,depth:d-2}],
  spaces,navigation:{entry:'entry',nodes,edges},features,
  dependencies:[
   'Exact manual five-pack orientation, structural support and collision fit still required',
   'Open courtyard roof junction and physical weather/roof-span load unapproved',
   'No functional crafting, production, mining machinery, NPCs, economy or world saves'
  ],
  architecture:{authoredProgramme:q.design,roof:q.roofProfile,notch:q.footprintCut,
   notchWidth:q.cutWidth,notchDepth:q.cutLength,courtyard:q.roofCourt,
   roofSpanCertified:false,creatorApproved:false,
   sourceOnly:true,actualDistinctProgrammeSpaces:n,
   roofWeatherProof:false,noGameIntegration:true}
 };
 validateBlueprint(b);
 return b;
}
export function createM1CompletionWorkshop(type,biome,size){
 const row=M1_COMPLETION_SPECS.find(r=>r.type===type&&r.biome===biome&&r.size===size);
 if(!row)throw RangeError('That biome/size workshop slot is not individually authored');
 return build(row);
}
export function createM1CompletionPool(){return M1_COMPLETION_SPECS.map(build);}
