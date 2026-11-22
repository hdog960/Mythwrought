// MYTHWROUGHT Builder B Wave26 — Tidemark Forked-Quay Fishing Lodge.
// ORIGINAL medium temperate 1B source. Genuine contiguous y0 stone/wood
// forked quay: two long unroofed pier fingers joined by a paved cross-deck,
// plus two navigable open hardstands and independently roofed shore halls.
// NO simulated water, fish, boats, terrain adaptation, NPCs, economy, saves,
// real Pack mesh registration or live game/world placement.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const TIDEMARK_FORKED_QUAY_ID='r1:fishing-lodge:temperate:medium:002';
export function buildTidemarkForkedQuayFishingLodge(){
 const b=sourcePlan('fishing-lodge','temperate','medium',2,'Tidemark Forked-Quay Fishing Lodge',65,38,66);
 const wings=[
  ['north-charter-and-map-house',15,2,47,18,15,'pack3:025'],
  ['western-net-twine-pantry',4,11,24,44,12,'pack3:023'],
  ['eastern-boat-repair-office',40,10,60,44,16,'pack3:026'],
  ['central-covered-tide-ledger',20,17,44,49,18,'pack3:025'],
  ['southwest-saltless-drying-warehouse',7,43,28,57,12,'pack3:023'],
  ['southeast-crew-supply-gallery',35,44,56,58,14,'pack3:026'],
  ['northwest-canvas-flag-stall',2,4,16,27,10,'pack3:025']
 ],courts=[[27,25,38,35],[13,45,19,50]],marker=[53,19],
 K=(x,z)=>x+','+z,roofFoot=new Set(),openCourt=new Set(),quay=new Set(),roofs=new Map(),
 dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)roofFoot.add(K(x,z));
 for(const [x0,z0,x1,z1] of courts)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   openCourt.add(K(x,z));roofFoot.delete(K(x,z));
  }
 // Two independently projected south-facing wharf fingers and one solid
 // UPPER-SURFACE cross-deck, all real y0 blocks and y1 walkable. No source
 // water or unsupported pier segments are claimed.
 for(const [x0,z0,x1,z1] of [[11,52,17,64],[45,52,52,64],[17,59,52,62]])
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const key=K(x,z);if(!roofFoot.has(key)&&!openCourt.has(key))quay.add(key);
  }
 const dry=(x,z)=>roofFoot.has(K(x,z)),
  ground=(x,z)=>dry(x,z)||openCourt.has(K(x,z))||quay.has(K(x,z));
 for(const key of new Set([...roofFoot,...openCourt,...quay])){
  const [x,z]=key.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',
   {genuineSourcePavedWharf:true,realCoastalWaterNotAuthored:true});
 }
 for(const key of roofFoot){
  const [x,z]=key.split(',').map(Number);
  if(Object.values(dirs).some(([dx,dz])=>!ground(x+dx,z+dz)))
   for(let y=1;y<=8;y++)b.put(x,y,z,'wall','live:wood','none',
    {originalQuayTimberWall:true,stormWaveLoadUnverified:true});
 }
 // Original roof geometry: seven different independent pitches, each one
 // immediately bearing on an authentic source solid support at y-1.
 for(const [wing,x0,z0,x1,z1,base,asset] of wings)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!dry(x,z)||(x===marker[0]&&z===marker[1])||roofs.has(K(x,z)))continue;
   const dist=Math.min(x-x0,x1-x,z-z0,z1-z);
   const y=base+Math.floor(dist/(wing==='central-covered-tide-ledger'?3:5));
   roofs.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','none',
    {actualYMinusOneRoofBearer:true,realLongSpanEngineeringUnknown:true});
   b.put(x,y,z,'roof',asset,'north',
    {genuineTidemarkRoofWing:wing,stormSealingNotApproved:true});
  }
 if(!dry(...marker))throw Error('Tidemark signal marker has no source stone base');
 b.support(marker[0],marker[1],23,'live:stone','original-unlit-quay-bearing-marker');
 b.put(marker[0],24,marker[1],'roof','pack3:025','north',
  {originalStoneSignalCap:true,activeNavigationLight:false});
 // Timber cross braces physically buttressed to the y0 foundation.
 for(const [x,z] of [[20,7],[32,7],[43,7],[9,19],[15,35],[51,26],
  [55,39],[23,52],[43,52],[9,48],[47,15],[13,13]]){
  const y=roofs.get(K(x,z));
  if(!y)throw Error('Tidemark roof-cross-brace misses original source roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','source-continuous-roof-cross-brace');
 }
 // Interior net hall partitions explicitly leave multiple two-wide routes.
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',23,17,47,[20,21,28,29,35,36,42,43]],
  ['x',41,16,47,[19,20,27,28,37,38]],
  ['z',18,16,47,[23,24,30,31,40,41]],
  ['z',44,7,56,[15,16,24,25,39,40,47,48]],
  ['x',15,5,26,[11,12,18,19]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!dry(x,z)||gaps.includes(n)||(x===marker[0]&&z===marker[1]))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))
   b.put(x,y,z,'partition','live:wood','none',
    {genuineNetHallDivider:true,fishProcessingInactive:true});
 }
 for(const row of [
  ['northern-boat-charter-desk',16,3,46,17],
  ['west-original-dry-net-storage',5,12,23,43],
  ['east-fishing-gear-office',41,11,59,43],
  ['central-covered-quay-office',21,18,43,48],
  ['southwest-dryfish-cases',8,44,27,56],
  ['southeast-crew-knot-porch',36,45,55,57],
  ['northwest-canvas-flag-kiosk',3,5,15,26],
  ['central-sky-open-wharf-hardstand',27,25,38,35],
  ['western-roofless-trap-garden',13,45,19,50],
  ['southern-forked-wharf-left',11,58,17,63],
  ['southern-forked-wharf-right',45,58,52,63],
  ['southern-joining-crossdeck',18,59,44,62]
 ])b.room(...row);
 for(const [from,to,x,z] of [
  ['outside','northern-boat-charter-desk',31,2],
  ['northern-boat-charter-desk','west-original-dry-net-storage',23,15],
  ['northern-boat-charter-desk','east-fishing-gear-office',42,15],
  ['northern-boat-charter-desk','central-covered-quay-office',30,18],
  ['west-original-dry-net-storage','central-covered-quay-office',23,30],
  ['east-fishing-gear-office','central-covered-quay-office',41,30],
  ['central-covered-quay-office','southwest-dryfish-cases',24,44],
  ['central-covered-quay-office','southeast-crew-knot-porch',40,44],
  ['central-covered-quay-office','central-sky-open-wharf-hardstand',27,30],
  ['central-sky-open-wharf-hardstand','east-fishing-gear-office',39,29],
  ['southwest-dryfish-cases','western-roofless-trap-garden',18,44],
  ['western-roofless-trap-garden','west-original-dry-net-storage',18,39],
  ['southwest-dryfish-cases','southern-forked-wharf-left',15,57],
  ['southeast-crew-knot-porch','southern-forked-wharf-right',48,58],
  ['southern-forked-wharf-left','southern-joining-crossdeck',17,60],
  ['southern-joining-crossdeck','southern-forked-wharf-right',45,60],
  ['northern-boat-charter-desk','northwest-canvas-flag-kiosk',15,12]
 ]){
  if(!ground(x,z))throw Error('Tidemark original pedestrian access lacks real quay floor '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 // Real original exterior lower Pack4 glass; y1 lower timber sill and y4
 // lintel stay solid. Quay-side external windows do not face walkable pier.
 let bays=0,panes=0;
 for(const key of roofFoot){
  const [x,z]=key.split(',').map(Number);
  if((x===marker[0]&&z===marker[1])||(x*11+z*7)%11!==0)continue;
  const side=Object.entries(dirs).find(([,v])=>!ground(x+v[0],z+v[1]));
  if(!side||[1,2,3,4].some(y=>b.clear(x,y,z)))continue;
  for(let y=2;y<=3;y++){
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',side[0],
    {genuineTwoTierTimberFramedGlass:true,realPackAABBUncertified:true});
   panes++;
  }bays++;
 }
 for(const [x,z,name] of [[30,8,'inert-chart-ledger'],[10,22,'dry-rope-coils'],
  [52,32,'vacant-boat-tool-stand'],[25,52,'unlit-copper-lamp'],
  [45,53,'unpowered-fish-scale'],[11,11,'dry-canvas-rack']])
  if(dry(x,z)&&b.clear(x,1,z))b.fitting(x,z,name,'pack4:059');
 return b.finish('Seven original roofed shore service wings linked to a 132-cell paved sky-open charter court, 42-cell fully paved secondary yard and two long all-stone source-wharf fingers with a walkable crossing deck. Real grounded signal marker, supported Pack3 roofing and upright Pack4 bays; all boats, fishing, water and commerce disabled.',{
  sourceOwner:'Builder B 1B Wave26 original temperate medium fishing lodge',
  originalQuayRoofWings:7,skyOpenPavedCourts:[132,42],
  sourceUnroofedQuayCells:quay.size,originalForkedQuayFingers:2,
  trueGroundedMarkerStoneTiers:23,framedDoubleTierGlassBays:bays,
  actualUprightPack4GlassCells:panes,
  fishCatchEnabled:false,boatSailingEnabled:false,
  sourceWaterOrBiomesChanged:false,liveWharfEconomy:false,
  finalPackCollisionApproved:false,realIphoneAccepted:false,
  creatorArtworkAccepted:false,worldPlacement:false,
  productionRegistered:false,saveSchema1Written:false
 });
}
