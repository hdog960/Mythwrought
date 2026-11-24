// MYTHWROUGHT Builder B Wave60 Hazelspire Four-Terrace Dry Seed Conservatory.
// Frozen B115 exclusive r1:greenhouse:temperate:large:004.
// Real source stone foundations and four 9x9 raised DRY seed beds,
// twelve separate supported covered roofs, four open-air courts,
// solid stone wind screens and actual grounded exterior circulation.
// No real crops, irrigation, working greenhouse, game registration,
// settlements, schema1 saves, installed Pack3/Pack4/M7/PWA validation.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const HAZELSPIRE_FOUR_TERRACE_ID='r1:greenhouse:temperate:large:004';
export function buildHazelspireFourDrySeedTerraceConservatory(){
 const b=sourcePlan('greenhouse','temperate','large',4,'Hazelspire Four-Terrace Dry Seed Conservatory',88,38,94);
 const wings=[
 ['north-copperseed-reception',24,4,63,19,15,'pack3:026'],
 ['west-growing-archive',5,13,29,56,16,'pack3:025'],
 ['east-lantern-pollen-archive',59,13,82,56,18,'pack3:023'],
 ['central-glassless-great-nave',29,19,58,61,25,'pack3:026'],
 ['southwest-stone-seed-gallery',8,48,35,67,18,'pack3:025'],
 ['southeast-amberleaf-workhall',53,48,79,67,20,'pack3:023'],
 ['northwest-terraced-lantern',3,8,22,36,16,'pack3:026'],
 ['northeast-seedledger-hall',65,8,84,36,19,'pack3:025'],
 ['south-arch-traverse',36,58,52,69,23,'pack3:023'],
 ['west-verdigris-portico',3,37,15,63,17,'pack3:026'],
 ['east-honeyglass-portico',73,37,84,63,19,'pack3:025'],
 ['south-outer-seed-vestibule',36,68,52,72,21,'pack3:023']
 ],courts=[
 ['north-sunstone-court',36,25,47,36],
 ['west-freshair-court',17,41,25,50],
 ['east-freshair-court',63,41,71,50],
 ['southern-dawncourt',39,53,48,63]
 ],beds=[
 ['western-fern-slate-bed',13,77],['western-seed-slate-bed',33,77],
 ['eastern-seed-slate-bed',55,77],['eastern-amber-slate-bed',75,77]
 ],wind=[
 ['western-courtyard-slate-baffle',26,84],
 ['center-courtyard-slate-baffle',44,82],
 ['eastern-courtyard-slate-baffle',62,84]
 ],K=(x,z)=>x+','+z,covered=new Set(),courtXZ=new Set(),roofed=new Set(),
 first=new Map(),supportXZ=new Set(),bedXZ=new Set(),windXZ=new Set(),
 recordXZ=new Set(),dirs={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 for(const[,x0,z0,x1,z1]of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)covered.add(K(x,z));
 for(const[,x0,z0,x1,z1]of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  courtXZ.add(K(x,z));covered.delete(K(x,z));
 }
 for(let x=2;x<=85;x++)for(let z=2;z<=91;z++)
  b.put(x,0,z,'foundation','live:stone','none',{hazelspireActualSourceStoneFooting:true});
 for(const k of covered){const[x,z]=k.split(',').map(Number);
  if(Object.values(dirs).some(([dx,dz])=>!covered.has(K(x+dx,z+dz))))
   for(let y=1;y<=10;y++)b.put(x,y,z,'wall','live:stone','none',
    {hazelspireActuallyAuthoredStoneHallEnvelope:true});
 }
 for(const[name,x0,z0,x1,z1,base,asset]of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(!covered.has(k)||roofed.has(k))continue;
  const depth=Math.min(x-x0,x1-x,z-z0,z1-z),y=base+Math.floor(depth/(name==='central-glassless-great-nave'?3:5));
  roofed.add(k);
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',{hazelspireRealDirectPack3StoneBacking:true});
  b.put(x,y,z,'roof',asset,'north',{hazelspireActuallyOccupiedNamedRoofWing:name,installedMeshPending:true});
  if(!first.has(name))first.set(name,[x,z,y]);
 }
 for(const[name]of wings){
  const p=first.get(name);if(!p)throw Error('No real cells in original roof wing '+name);
  supportXZ.add(K(p[0],p[1]));
  b.support(p[0],p[1],p[2]-1,'live:stone','hazelspire-source-continuous-stone-roof-post-'+name);
 }
 let bedStone=0,bedRim=0;
 for(const[name,cx,cz]of beds)for(let x=cx-4;x<=cx+4;x++)for(let z=cz-4;z<=cz+4;z++){
  const k=K(x,z),edge=x===cx-4||x===cx+4||z===cz-4||z===cz+4;
  if(b.clear(x,0,z)||!b.clear(x,1,z)||!b.clear(x,2,z))
   throw Error('Raised DRY seed terrace lacks actual original stone footing '+name+' '+k);
  bedXZ.add(k);
  b.put(x,1,z,'furnishing','live:stone','none',
   {hazelspireActuallySolidNineByNineDrySeedBed:name,liveCropsUnimplemented:true});bedStone++;
  if(edge){b.put(x,2,z,'furnishing','live:stone','none',
    {hazelspireRealRaisedStoneSeedBedRim:name,noWaterPhysics:true});bedRim++;}
 }
 let baffleStone=0;
 for(const[name,cx,cz]of wind)for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
  const k=K(x,z);
  if(b.clear(x,0,z)||bedXZ.has(k))throw Error('Unfounded solid windbreak '+name+' '+k);
  windXZ.add(k);
  for(let y=1;y<=3;y++){
   if(!b.clear(x,y,z))throw Error('Solid windbreak collides '+name+' '+k);
   b.put(x,y,z,'wall','live:stone','none',
    {hazelspireAuthenticThreeHighStoneWindbreak:name,noWeatherSimulation:true});baffleStone++;
  }
 }
 let recordStone=0;
 for(let x=42;x<=46;x++)for(let z=85;z<=89;z++){
  const k=K(x,z);
  if(b.clear(x,0,z)||windXZ.has(k)||bedXZ.has(k)||!b.clear(x,1,z)||!b.clear(x,2,z))
   throw Error('Original raised dry seed record dais physically obstructed '+k);
  recordXZ.add(k);
  b.put(x,1,z,'furnishing','live:stone','none',{hazelspireRealRaisedStoneSeedLedger:true});recordStone++;
 }
 for(const [axis,fixed,lo,hi,holes]of [
  ['x',29,19,55,[23,24,32,33,41,42,49,50]],
  ['x',59,19,55,[23,24,32,33,41,42,49,50]],
  ['z',21,21,62,[25,26,35,36,44,45,55,56]],
  ['z',59,13,73,[17,18,27,28,37,38,48,49,57,58,67,68]]
 ])for(let t=lo;t<=hi;t++){
  const x=axis==='x'?fixed:t,z=axis==='z'?fixed:t,k=K(x,z);
  if(!covered.has(k)||supportXZ.has(k)||holes.includes(t))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',{hazelspireRealOriginalWoodPartition:true});
 }
 const halls=[
  ['north-copperseed-reception',25,5,62,18],['west-growing-archive',6,14,28,55],
  ['east-lantern-pollen-archive',60,14,81,55],['central-glassless-great-nave',30,20,57,60],
  ['southwest-stone-seed-gallery',9,49,34,66],['southeast-amberleaf-workhall',54,49,78,66],
  ['northwest-terraced-lantern',4,9,21,35],['northeast-seedledger-hall',66,9,83,35],
  ['south-arch-traverse',37,59,51,68],['west-verdigris-portico',4,38,14,62],
  ['east-honeyglass-portico',74,38,83,62],['south-outer-seed-vestibule',37,69,51,71],
  ['north-sunstone-court',36,25,47,36],['west-freshair-court',17,41,25,50],
  ['east-freshair-court',63,41,71,50],['southern-dawncourt',39,53,48,63],
  ['west-seed-court-approach',3,70,23,91],['westmid-seed-court-approach',23,70,43,91],
  ['eastmid-seed-court-approach',44,70,65,91],['east-seed-court-approach',66,70,85,91],
  ['southern-crossbed-stone-aisle',3,87,85,91]
 ];
 for(const room of halls)b.room(...room);
 for(const[from,to,x,z]of [
  ['outside','north-copperseed-reception',44,4],
  ['north-copperseed-reception','central-glassless-great-nave',44,19],
  ['north-copperseed-reception','west-growing-archive',29,13],
  ['north-copperseed-reception','east-lantern-pollen-archive',59,13],
  ['north-copperseed-reception','northwest-terraced-lantern',22,12],
  ['north-copperseed-reception','northeast-seedledger-hall',65,12],
  ['central-glassless-great-nave','north-sunstone-court',35,30],
  ['north-sunstone-court','west-growing-archive',29,30],
  ['north-sunstone-court','east-lantern-pollen-archive',58,30],
  ['central-glassless-great-nave','west-freshair-court',29,44],
  ['central-glassless-great-nave','east-freshair-court',59,44],
  ['west-growing-archive','west-freshair-court',26,44],
  ['east-lantern-pollen-archive','east-freshair-court',62,44],
  ['central-glassless-great-nave','southern-dawncourt',38,56],
  ['southern-dawncourt','south-arch-traverse',44,64],
  ['west-growing-archive','southwest-stone-seed-gallery',21,48],
  ['east-lantern-pollen-archive','southeast-amberleaf-workhall',69,48],
  ['southwest-stone-seed-gallery','south-arch-traverse',35,61],
  ['southeast-amberleaf-workhall','south-arch-traverse',53,61],
  ['northwest-terraced-lantern','west-verdigris-portico',9,37],
  ['northeast-seedledger-hall','east-honeyglass-portico',79,37],
  ['southwest-stone-seed-gallery','west-seed-court-approach',13,69],
  ['southeast-amberleaf-workhall','east-seed-court-approach',75,69],
  ['south-arch-traverse','south-outer-seed-vestibule',44,69],
  ['south-outer-seed-vestibule','westmid-seed-court-approach',40,73],
  ['south-outer-seed-vestibule','eastmid-seed-court-approach',48,73],
  ['west-seed-court-approach','southern-crossbed-stone-aisle',13,90],
  ['westmid-seed-court-approach','southern-crossbed-stone-aisle',33,90],
  ['eastmid-seed-court-approach','southern-crossbed-stone-aisle',55,90],
  ['east-seed-court-approach','southern-crossbed-stone-aisle',75,90]
 ]){
  const k=K(x,z);
  if(supportXZ.has(k)||bedXZ.has(k)||windXZ.has(k)||recordXZ.has(k))
   throw Error('Source passage cuts actual solid original terrace or footing '+k);
  b.opening(x,z);b.portal(from,to,x,z);
 }
 let panes=0,bays=0;
 for(const k of covered){
  const[x,z]=k.split(',').map(Number);
  if(supportXZ.has(k)||(x*19+z*11)%13!==0||[1,2,3,4,5,6,7].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(dirs).find(([,d])=>!covered.has(K(x+d[0],z+d[1]))&&
   [2,3,4,5,6].every(y=>b.clear(x+d[0],y,z+d[1])));
  if(!face)continue;
  for(let y=2;y<=6;y++){
   b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],
    {hazelspireActuallyOutwardFiveHighPack4Pane:true,realInstalledPhysicsPending:true});panes++;
  }bays++;
 }
 return b.finish('Real four separate nine-by-nine grounded dry seed terraces with 324 solid stone source y1 cells, 128 raised rim cells and connected open stone aisles around terraces, twelve independent source-backed gallery roofs, four full-height sky courts, three opaque stone wind screens and raised dry stone seed ledger. No irrigation or real crop gameplay.',{
  originalBuilderBWave:60,trueDistinctCoveredRoofWings:first.size,
  originalFullySkyOpenCourtSizes:[144,90,90,110],
  actuallyFoundedNineByNineDryTerraces:beds.length,
  originalStoneDryTerraceBaseCells:bedStone,realRaisedStoneRimCells:bedRim,
  genuineSolidWindbreakStoneCells:baffleStone,raisedDryLedgerStoneCells:recordStone,
  actualStoneY0FootingCells:84*90,
  sourceCandidatePack4FiveHighGlazingCells:panes,realFramedFiveHighGlazingBays:bays,
  liveSeedCrops:false,workingIrrigation:false,automaticHarvest:false,
  originalInstalledPack3Pack4PhysicalTested:false,realM7PlayerTested:false,
  productionRegistered:false,worldPlacement:false,schema1SaveWritten:false,
  realInstalledIphoneHomeScreenPwaAccepted:false
 });
}
