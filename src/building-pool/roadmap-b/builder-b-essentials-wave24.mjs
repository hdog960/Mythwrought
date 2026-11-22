// MYTHWROUGHT Builder B original 1B Wave24 — Wistermere Crescent Baths.
// Source-only MEDIUM TEMPERATE bathhouse: separate crescent roof galleries,
// two roofless yet PAVED and WALKABLE drying courts, a grounded UNLIT
// 23-tier stone bell cupola, and fully framed two-tier upright Pack4 panes.
// NO actual water, heating, spa AI, terrain, citizens, saves or live placement.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const WISTERMERE_CRESCENT_BATHS_ID='r1:bathhouse:temperate:medium:002';
export function buildWistermereCrescentBaths(){
 const b=sourcePlan('bathhouse','temperate','medium',2,'Wistermere Crescent Baths',56,35,57);
 const wings=[
  ['north-crescent-changing',12,3,43,17,14,'pack3:023'],
  ['west-quiet-wool-gallery',4,11,22,46,11,'pack3:025'],
  ['east-ceramic-washing-porch',36,10,51,46,15,'pack3:026'],
  ['central-arched-cooling-walk',18,16,39,42,18,'pack3:023'],
  ['south-step-free-wool-vault',15,38,43,52,12,'pack3:025'],
  ['southwest-inert-basin-house',7,39,24,53,10,'pack3:026'],
  ['northeast-original-bell-veranda',42,4,52,22,16,'pack3:025']
 ],courts=[[24,23,33,31],[13,43,17,47]],
 cupola=[46,14],K=(x,z)=>x+','+z,floor=new Set(),open=new Set(),
 roofed=new Map(),sides={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)floor.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   open.add(K(x,z));floor.delete(K(x,z));
  }
 const indoor=(x,z)=>floor.has(K(x,z)),ground=(x,z)=>indoor(x,z)||open.has(K(x,z));
 // Both courts have REAL stone y0 hardstands and absolutely no roof or
 // props above. This is a foot-walkable open drying garden, not ground void.
 for(const k of new Set([...floor,...open])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {trueGroundPavedBathCourtyard:true,actualBiomeSlopeNotVerified:true});
 }
 for(const k of floor){
  const [x,z]=k.split(',').map(Number);
  if(Object.values(sides).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:stone','none',
    {sourceBathStoneExternal:true,realWaterSealUncertified:true});
 }
 // Seven different roof profiles, backed exactly by an original solid y-1
 // load cell; do not invent horizontal transparent Pack4 roof tiles.
 for(const [name,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!indoor(x,z)||(x===cupola[0]&&z===cupola[1])||roofed.has(K(x,z)))continue;
   const rise=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=base+Math.floor(rise/(name==='central-arched-cooling-walk'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {originalDirectRoofBearing:true,actualWholeSpanLoadUnknown:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalWistermereRoofWing:name,certifiedWeatherEnvelope:false});
  }
 if(!indoor(...cupola))throw Error('Wistermere cupola base lacks original foundation');
 b.support(cupola[0],cupola[1],23,'live:stone','original-unlit-grounded-bath-cupola');
 b.put(cupola[0],24,cupola[1],'roof','pack3:023','north',
  {sourceUnpoweredBellCap:true,actualAnimatedBell:false});
 // Discontinuous privacy screens: no closed off walks or overclaimed basins.
 for(const [axis,fix,low,high,pass] of [
  ['x',21,18,41,[20,21,27,28,34,35,39,40]],
  ['x',37,18,41,[20,21,29,30,36,37]],
  ['z',18,13,43,[18,19,25,26,33,34,40,41]],
  ['z',38,15,44,[19,20,27,28,35,36]],
  ['x',17,39,53,[43,44,49,50]]
 ])for(let t=low;t<=high;t++){
  const x=axis==='x'?fix:t,z=axis==='z'?fix:t;
  if(!indoor(x,z)||pass.includes(t)||(x===cupola[0]&&z===cupola[1]))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{actualBathPrivacyScreen:true,heatNone:true});
 }
 for(const [x,z] of [[18,7],[31,7],[8,22],[11,35],[45,25],[40,37],
  [26,46],[36,48],[15,50],[49,19],[34,20]]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Wistermere original structural post not under roof '+K(x,z));
  b.support(x,z,y-1,'live:stone','original-bath-crescent-load-post');
 }
 for(const r of [
  ['north-wool-entry',13,4,42,16],['west-unheated-rest-gallery',5,12,21,45],
  ['east-empty-ceramic-rooms',37,11,50,45],
  ['central-dry-arched-walk',19,17,38,41],
  ['south-clean-wool-store',16,39,42,51],
  ['southwest-dry-basin-cases',8,40,23,52],
  ['northeast-bell-terrace-base',43,5,51,21],
  ['main-real-sky-open-cooling-court',24,23,33,31],
  ['secondary-paved-outdoor-garden',13,43,17,47]
 ])b.room(...r);
 for(const [from,to,x,z] of [
  ['outside','north-wool-entry',27,3],
  ['north-wool-entry','west-unheated-rest-gallery',20,14],
  ['north-wool-entry','east-empty-ceramic-rooms',38,14],
  ['north-wool-entry','central-dry-arched-walk',28,17],
  ['west-unheated-rest-gallery','central-dry-arched-walk',21,30],
  ['east-empty-ceramic-rooms','central-dry-arched-walk',37,28],
  ['central-dry-arched-walk','south-clean-wool-store',29,38],
  ['south-clean-wool-store','southwest-dry-basin-cases',21,47],
  ['west-unheated-rest-gallery','secondary-paved-outdoor-garden',16,42],
  ['secondary-paved-outdoor-garden','southwest-dry-basin-cases',16,48],
  ['central-dry-arched-walk','main-real-sky-open-cooling-court',24,28],
  ['main-real-sky-open-cooling-court','east-empty-ceramic-rooms',34,28],
  ['north-wool-entry','northeast-bell-terrace-base',43,13]
 ]){
  if(!ground(x,z))throw Error('Wistermere passage absent original y0 stone '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Two-high upright Pack4 vertical glass only in true outward faces after
 // passages are cut: solid y1 sill + original y4 stone lintel.
 let panes=0,bays=0;
 for(const key of floor){
  const [x,z]=key.split(',').map(Number);
  if((x===cupola[0]&&z===cupola[1])||(x*7+z*13)%9!==0)continue;
  const exposed=Object.entries(sides).find(([,v])=>!ground(x+v[0],z+v[1]));
  if(!exposed||[1,2,3,4].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3]){
   b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',exposed[0],
    {sourceTwoTierBathGlass:true,actualPackSelectionAABBUnapproved:true});
   panes++;
  }bays++;
 }
 for(const [x,z,purpose] of [
  [27,8,'empty-wool-cubby'],[12,24,'unheated-handwashing-rim'],
  [43,31,'ceramic-empty-basin'],[33,45,'folded-towel-shelf'],
  [10,47,'dry-woven-robe-rack'],[48,9,'unlit-bell-pull']
 ])if(indoor(x,z)&&b.clear(x,1,z))b.fitting(x,z,purpose,'pack4:059');
 return b.finish('Original seven-wing stepped temperate spa with 90-cell roofless paved cooling courtyard and 25-cell separate open herb garden, source-continuous 23-level unlit stone bell cupola, distinct supported Pack3 roofs and genuine framed two-level upright Pack4 glass; all bath, heating and water mechanics inert',{
  exclusiveBSource:'Roadmap B Wave24',sourceRoofWings:7,originalPavedSkyCourts:[90,25],
  originalGroundedCupolaStoneTiers:23,actualTwoTierUprightGlassCells:panes,
  actualTwoTierGlassBays:bays,liveBathWater:false,liveHeating:false,
  liveMagicSteam:false,physicalPackColliderApproved:false,
  actualTerrainSlopeCertified:false,weatherproofingApproved:false,
  realIphoneTested:false,creatorArtApproved:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
