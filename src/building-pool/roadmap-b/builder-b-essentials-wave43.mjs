// MYTHWROUGHT Builder B Wave43 — Suncradle Offset-Basin Bathhouse.
// Original frozen B115 DESERT SMALL bathhouse: two GENUINE empty stone
// basin rings indoors, seven asymmetric source-backed Pack3 wing roofs,
// three completely sky-open paved stone courts and connected U-shaped
// outdoor stone resting terrace; real 3-high upright Pack4 framed glass.
// NO heating, actual water/steam, pumps, climate, AI, Pack producer or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const SUNCRADLE_OFFSET_BASIN_ID='r1:bathhouse:desert:small:004';
export function buildSuncradleOffsetBasinBathhouse(){
 const b=sourcePlan('bathhouse','desert','small',4,'Suncradle Offset-Basin Bathhouse',54,39,56);
 const wings=[
 ['northern-sand-entry-cloister',13,3,41,16,14,'pack3:023'],
 ['west-copper-inert-washroom',4,10,20,45,12,'pack3:026'],
 ['east-timber-dry-relief-room',34,10,50,45,17,'pack3:025'],
 ['center-open-window-arcade',19,16,36,47,20,'pack3:023'],
 ['southwest-unfilled-stone-basin',7,41,25,51,14,'pack3:026'],
 ['southeast-dry-robe-count',30,40,47,52,16,'pack3:025'],
 ['northwest-unheated-alcove',3,5,15,27,10,'pack3:023']
 ],courts=[[22,22,30,30],[10,36,16,43],[37,35,43,42]],
 key=(x,z)=>x+','+z,inside=new Set(),court=new Set(),outer=new Set(),roofs=new Map(),
 faces={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)inside.add(key(x,z));
 for(const [x0,z0,x1,z1]of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  court.add(key(x,z));inside.delete(key(x,z));
 }
 // Three unroofed source-grounded paved terrace legs and complete
 // 4-wide outdoor transverse stone walkway; no imaginary upstairs bath.
 for(const [x0,z0,x1,z1]of [[10,45,17,54],[24,45,30,54],[36,45,43,54],[16,51,38,54]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!inside.has(key(x,z))&&!court.has(key(x,z)))outer.add(key(x,z));
 const isInside=(x,z)=>inside.has(key(x,z)),
  grounded=(x,z)=>isInside(x,z)||court.has(key(x,z))||outer.has(key(x,z));
 for(const k of new Set([...inside,...court,...outer])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {trueSourceGroundedSuncradleStone:true,desertTerrainUnmodified:true});
 }
 for(const k of inside){const [x,z]=k.split(',').map(Number);
  if(Object.values(faces).some(([dx,dz])=>!grounded(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:stone','none',
    {physicalDesertWashroomOuterWall:true,noHeatSealingApproval:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset]of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!isInside(x,z)||roofs.has(key(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z),y=base+Math.floor(d/(name==='center-open-window-arcade'?3:5));
   roofs.set(key(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',
    {genuineImmediateOriginalPack3Backing:true,notLoadRated:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalSuncradleRoofWing:name,realPackRoofAABBUnknown:true});
  }
 for(const [x,z]of [[18,8],[27,8],[38,8],[8,20],[46,20],[18,33],[36,33],[14,45],[40,46]]){
  const y=roofs.get(key(x,z));
  if(!y)throw Error('Suncradle stone bent not below original source roof '+key(x,z));
  b.support(x,z,y-1,'live:stone','original-source-grounded-roof-column');
 }
 for(const [axis,fixed,lo,hi,holes]of [
  ['x',19,16,45,[20,21,28,29,37,38,43,44]],
  ['x',35,16,44,[20,21,28,29,37,38,42,43]],
  ['z',16,13,41,[18,19,26,27,35,36]],
  ['z',42,8,47,[13,14,23,24,33,34,41,42]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!isInside(x,z)||holes.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:stone','none',
    {sourcePrivateDryBathScreen:true,actualWaterMechanism:false});
 }
 for(const row of [
  ['north-unheated-copper-entry',14,4,40,15],
  ['western-desert-dry-robe-hall',5,11,19,44],
  ['eastern-empty-cooling-chamber',35,11,49,44],
  ['center-source-relief-walk',20,17,35,46],
  ['southwest-unused-stone-wash-area',8,42,24,50],
  ['southeast-dry-sand-step-room',31,41,46,51],
  ['northwest-shadow-stone-niche',4,6,14,26],
  ['central-full-sky-cooling-court',22,22,30,30],
  ['western-sky-open-stone-rest',10,36,16,43],
  ['eastern-source-open-stone-rest',37,35,43,42],
  ['left-grounded-stone-recovery',10,46,17,53],
  ['center-grounded-stone-recovery',24,46,30,53],
  ['right-grounded-stone-recovery',36,46,43,53],
  ['real-southstone-source-crosswalk',16,51,38,54]
 ])b.room(...row);
 for(const [from,to,x,z]of [
  ['outside','north-unheated-copper-entry',27,3],
  ['north-unheated-copper-entry','western-desert-dry-robe-hall',19,13],
  ['north-unheated-copper-entry','eastern-empty-cooling-chamber',35,13],
  ['north-unheated-copper-entry','center-source-relief-walk',27,16],
  ['western-desert-dry-robe-hall','center-source-relief-walk',19,28],
  ['eastern-empty-cooling-chamber','center-source-relief-walk',35,28],
  ['center-source-relief-walk','central-full-sky-cooling-court',21,26],
  ['central-full-sky-cooling-court','eastern-empty-cooling-chamber',31,26],
  ['western-desert-dry-robe-hall','western-sky-open-stone-rest',13,35],
  ['western-sky-open-stone-rest','southwest-unused-stone-wash-area',13,44],
  ['eastern-empty-cooling-chamber','eastern-source-open-stone-rest',41,34],
  ['eastern-source-open-stone-rest','southeast-dry-sand-step-room',41,43],
  ['center-source-relief-walk','southwest-unused-stone-wash-area',22,42],
  ['center-source-relief-walk','southeast-dry-sand-step-room',33,41],
  ['southwest-unused-stone-wash-area','left-grounded-stone-recovery',13,45],
  ['center-source-relief-walk','center-grounded-stone-recovery',27,47],
  ['southeast-dry-sand-step-room','right-grounded-stone-recovery',40,45],
  ['left-grounded-stone-recovery','real-southstone-source-crosswalk',17,52],
  ['center-grounded-stone-recovery','real-southstone-source-crosswalk',27,52],
  ['real-southstone-source-crosswalk','right-grounded-stone-recovery',38,52],
  ['north-unheated-copper-entry','northwest-shadow-stone-niche',14,12]
 ]){
  if(!grounded(x,z))throw Error('Suncradle original two-high portal not physically paved '+key(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Two distinct EMPTY and truly solid stone basin rings beneath
 // roofed rooms, with open pedestrian notches, no fake water tiles.
 let basinStones=0;
 for(const [name,x0,z0]of [['west-empty-cool-basin',7,30],['east-empty-cool-basin',43,29]]){
  for(let x=x0;x<=x0+4;x++)for(let z=z0;z<=z0+4;z++){
   if(x!==x0&&x!==x0+4&&z!==z0&&z!==z0+4)continue;
   if(z===z0&&x===x0+2)continue;
   if(!isInside(x,z)||!b.clear(x,1,z))throw Error('Suncradle genuine empty basin stone ring blocked '+key(x,z));
   b.put(x,1,z,'wall','live:stone','none',
    {realEmptyOriginalBasinRing:name,noActualWater:true});
   basinStones++;
  }
 }
 let glass=0,bays=0;
 for(const k of inside){const [x,z]=k.split(',').map(Number);
  if((x*13+z*9)%11!==0||[1,2,3,4,5].some(y=>b.clear(x,y,z)))continue;
  const exposure=Object.entries(faces).find(([,v])=>!grounded(x+v[0],z+v[1]));
  if(!exposure)continue;
  for(let y=2;y<=4;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',exposure[0],
    {originalThreeTierDryBathGlass:true,realPack4SelectionNotAccepted:true});
   glass++;
  }bays++;
 }
 for(const [x,z,label]of [[27,8,'unlit-copper-wash-clock'],[10,20,'empty-humidity-jar'],[47,22,'dry-stone-robe-stand']])
  if(isInside(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Seven source-backed original Pack3 roof wings enclosing three genuine open-sky paved stone cooling courts (81+56+56), two actual empty stone bathing-basin rims, three unroofed source-grounded walkways and complete three-high exterior Pack4 framed glass. No working water or heating.',{
  builderBOriginalWave:43,sourceSupportedRoofWings:7,
  genuineSkyOpenStoneCourts:[81,56,56],
  sourceOnlyPavedExteriorRecoveryWalkCells:outer.size,
  originalEmptyGroundedStoneBasinRingCells:basinStones,
  originalCompleteThreeTierPack4GlassBays:bays,
  sourceUprightPack4WindowCells:glass,
  operatingBathWater:false,workingHeatOrSteam:false,
  physicalPackMeshMountAccepted:false,creatorArtworkAccepted:false,
  installedIphonePwaAccepted:false,
  worldPlacement:false,productionRegistered:false,saveSchema1Written:false
 });
}
