// MYTHWROUGHT Builder B Wave35 — Frostmere Three-Court Bath Lodge.
// ORIGINAL medium SNOW B115 bathhouse source only. Nine separate original
// roof wings around THREE full paved walkable outdoor bathing courts; two
// unroofed source-ground winter promenade legs with a real crosslink.
// Full upright y2–5 four-high Pack4 glazing in physically framed timber
// openings after all actual two-high door cuts; unpowered winter baths.
// NO active water/heat/ice safety, weather, settlements, live saves/PWA.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const FROSTMERE_THREE_COURT_ID='r1:bathhouse:snow:medium:003';
export function buildFrostmereThreeCourtBathLodge(){
 const b=sourcePlan('bathhouse','snow','medium',3,'Frostmere Three-Court Bath Lodge',70,45,72);
 const wings=[
  ['north-unheated-reception',15,3,54,18,15,'pack3:025'],
  ['west-cold-stone-lounge',4,12,27,55,12,'pack3:026'],
  ['east-dry-towel-gallery',43,11,66,56,17,'pack3:023'],
  ['middle-arched-rest-walk',22,18,49,57,21,'pack3:025'],
  ['southwest-silent-bath-chamber',8,51,33,65,13,'pack3:026'],
  ['southeast-winter-pebble-hall',39,52,64,66,15,'pack3:023'],
  ['northwest-dry-robe-porch',3,5,19,30,10,'pack3:025'],
  ['northeast-steamless-reading-porch',56,5,68,30,17,'pack3:026'],
  ['south-middle-empty-quiet-room',30,55,45,66,15,'pack3:023']
 ],courts=[[26,25,41,38],[13,48,21,55],[52,49,60,56]],
 K=(x,z)=>x+','+z,inside=new Set(),sky=new Set(),promenade=new Set(),roofed=new Map(),
 sides={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)inside.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   sky.add(K(x,z));inside.delete(K(x,z));
  }
 // Genuine physically grounded frost-side apron promenade: the two
 // symmetric outboard arms have a broad south y0 stone cross-deck. No
 // floating stairs, unplaced road, or fictional ice-bearing slab.
 for(const [x0,z0,x1,z1] of [[15,59,22,70],[48,59,56,70],[21,66,50,70]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!inside.has(K(x,z))&&!sky.has(K(x,z)))promenade.add(K(x,z));
 const enclosed=(x,z)=>inside.has(K(x,z)),
  ground=(x,z)=>enclosed(x,z)||sky.has(K(x,z))||promenade.has(K(x,z));
 for(const key of new Set([...inside,...sky,...promenade])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {trueOriginalPavedColdCourt:true,actualSnowBiomeTerrainUnmodified:true});
 }
 for(const key of inside){
  const [x,z]=key.split(',').map(Number);
  if(Object.values(sides).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:wood','none',
    {actualOriginalWinterBathTimberWall:true,heatSealingNotApproved:true});
 }
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!enclosed(x,z)||roofed.has(K(x,z)))continue;
   const d=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=base+Math.floor(d/(wing==='middle-arched-rest-walk'?3:5));
   roofed.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {trueImmediatePack3RoofBacking:true,sourceNotLoadRated:true});
   b.put(x,y,z,'roof',asset,'north',
    {originalFrostmereRoofWing:wing,realWeatherProofPending:true});
  }
 for(const [x,z] of [
  [20,8],[35,8],[50,8],[9,22],[18,41],[56,36],
  [27,58],[46,59],[10,57],[63,20],[15,15],[39,21],
  [32,19],[40,54]
 ]){
  const y=roofed.get(K(x,z));
  if(!y)throw Error('Frostmere real original timber support misses Pack3 roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','real-grounded-winter-lodge-bent');
 }
 // 5-high (1–5) room privacy screens all leave meaningful authentic
 // walking gaps. The three outdoor courts remain entirely untouched.
 for(const [axis,fix,lo,hi,gaps] of [
  ['x',25,18,56,[21,22,29,30,39,40,47,48]],
  ['x',45,18,56,[21,22,29,30,39,40,47,48]],
  ['z',18,15,54,[22,23,31,32,41,42,49,50]],
  ['z',53,8,64,[14,15,23,24,34,35,44,45,54,55]],
  ['x',17,6,29,[12,13,20,21,26,27]],
  ['x',59,12,55,[17,18,27,28,37,38,47,48]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fix:n,z=axis==='z'?fix:n;
  if(!enclosed(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=5;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {realColdBathPrivacyDivider:true,noOperatingSpaMechanics:true});
 }
 for(const row of [
  ['north-quiet-reception',16,4,53,17],
  ['western-empty-cold-lounge',5,13,26,54],
  ['eastern-dry-robes-storage',44,12,65,55],
  ['central-open-roofed-rest-walk',23,19,48,56],
  ['southwest-empty-bathing-room',9,52,32,64],
  ['southeast-unheated-pebble-room',40,53,63,65],
  ['northwest-snow-porch',4,6,18,29],
  ['northeast-closed-winter-porch',57,6,67,29],
  ['southern-unheated-quiet-pavilion',31,56,44,65],
  ['main-open-sky-cold-plunge-yard',26,25,41,38],
  ['west-open-air-rest-court',13,48,21,55],
  ['east-open-air-winter-court',52,49,60,56],
  ['outboard-west-roofless-terrace',15,62,22,69],
  ['outboard-east-roofless-terrace',48,62,56,69],
  ['southstone-open-walking-crossdeck',21,66,50,70]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','north-quiet-reception',35,3],
  ['north-quiet-reception','western-empty-cold-lounge',25,15],
  ['north-quiet-reception','eastern-dry-robes-storage',45,15],
  ['north-quiet-reception','central-open-roofed-rest-walk',35,18],
  ['western-empty-cold-lounge','central-open-roofed-rest-walk',25,32],
  ['eastern-dry-robes-storage','central-open-roofed-rest-walk',45,33],
  ['central-open-roofed-rest-walk','southwest-empty-bathing-room',29,53],
  ['central-open-roofed-rest-walk','southeast-unheated-pebble-room',42,53],
  ['central-open-roofed-rest-walk','southern-unheated-quiet-pavilion',37,55],
  ['central-open-roofed-rest-walk','main-open-sky-cold-plunge-yard',25,32],
  ['main-open-sky-cold-plunge-yard','eastern-dry-robes-storage',42,33],
  ['western-empty-cold-lounge','west-open-air-rest-court',18,47],
  ['west-open-air-rest-court','southwest-empty-bathing-room',19,56],
  ['eastern-dry-robes-storage','east-open-air-winter-court',56,48],
  ['east-open-air-winter-court','southeast-unheated-pebble-room',57,57],
  ['southwest-empty-bathing-room','outboard-west-roofless-terrace',19,65],
  ['southeast-unheated-pebble-room','outboard-east-roofless-terrace',51,66],
  ['outboard-west-roofless-terrace','southstone-open-walking-crossdeck',22,68],
  ['southstone-open-walking-crossdeck','outboard-east-roofless-terrace',48,68],
  ['north-quiet-reception','northwest-snow-porch',17,14],
  ['eastern-dry-robes-storage','northeast-closed-winter-porch',57,19]
 ]){
  if(!ground(x,z))throw Error('Frostmere source passage lacks physical y0 floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Glass ALWAYS last, after all doorway cuts. Four true vertical cells
 // y2..5, with original solid y1 wooden sill and y6 wood lintel.
 // Require real outward air at the same floor-height face.
 let glassCells=0,bays=0;
 for(const key of inside){
  const [x,z]=key.split(',').map(Number);
  if((x*19+z*11)%11!==0)continue;
  const side=Object.entries(sides).find(([,v])=>!ground(x+v[0],z+v[1]));
  if(!side||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  for(const y of [2,3,4,5]){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',side[0],
    {originalFrostmereFourHighGlass:true,actualPackMountNotApproved:true});
   glassCells++;
  }bays++;
 }
 for(const [x,z,label] of [
  [35,8,'empty-towel-roll'],[12,34,'unheated-copper-pitcher'],
  [54,40,'closed-bath-register'],[28,59,'silent-ice-bell'],
  [44,59,'dry-shoe-rest'],[64,16,'unpowered-winter-flower']
 ])if(enclosed(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Original snow medium bathhouse with nine genuine directly backed Pack3 roofs, three separately paved and sky-open accessible cold-bathing courts (224+72+72 cells), two unroofed paved winter terrace legs and pedestrian connected southstone crosswalk, and four-high outward Pack4 glass in complete timber frames. No working bath, heating, ice safety or crop/spa mechanics.',{
  builderBExclusiveWave:35,originalSourceRoofWings:9,
  pavedSkyOpenCourts:[224,72,72],realRooflessPromenadeCells:promenade.size,
  winterPavedPromenadeLegs:2,actualGroundedTimberRoofBents:14,
  completeOriginalFourHighGlassBays:bays,
  actualPack4UprightGlassCells:glassCells,
  liveBathWater:false,workingHeat:false,steamSystems:false,
  actualSnowWeatherSealCertified:false,iceSafetyApproved:false,
  physicalPackSelectionColliderValidated:false,originalIphonePwaAccepted:false,
  creatorArtworkApproved:false,liveWorldTerrainChanged:false,
  productionRegistered:false,worldPlacement:false,saveSchema1Written:false
 });
}
