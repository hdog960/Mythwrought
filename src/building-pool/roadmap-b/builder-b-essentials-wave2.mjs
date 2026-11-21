// Builder B 1B: original compact temperate glasshouse with skylight grid, true open garden and accessible potting aisles.
// Source-only. No farming, growth, irrigation, settlement placement, runtime registration or saves.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ALDERGLASS_GREENHOUSE_ID='r1:greenhouse:temperate:small:002';
export function buildAlderglassTrellisConservatory(){
 const b=sourcePlan('greenhouse','temperate','small',2,'Alderglass Split-Trellis Conservatory',43,26,41);
 const wings=[[15,2,28,14],[3,11,18,33],[25,10,39,30],[12,27,34,38],[15,15,28,28],[2,28,10,38]],
 courtyard=[19,18,24,24],K=(x,z)=>x+','+z,shape=new Set(),roof=new Map();
 for(const [x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)shape.add(K(x,z));
 for(let x=courtyard[0];x<=courtyard[2];x++)for(let z=courtyard[1];z<=courtyard[3];z++)shape.delete(K(x,z));
 const has=(x,z)=>shape.has(K(x,z));
 for(const q of shape){
  const [x,z]=q.split(',').map(Number);b.put(x,0,z,'foundation','live:stone');
  if(!has(x+1,z)||!has(x-1,z)||!has(x,z+1)||!has(x,z-1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood');
 }
 // Opaque growing-room dividers with deliberate double-width access alleys.
 for(const [axis,fixed,lo,hi,pass] of [
  ['z',14,15,27,[19,20,26,27]],['x',18,13,32,[16,17,26,27]],
  ['x',25,12,30,[14,15,27,28]],['z',28,13,34,[17,18,30,31]]
 ]){
  for(let t=lo;t<=hi;t++){
   const x=axis==='x'?fixed:t,z=axis==='z'?fixed:t;
   if(!has(x,z)||pass.includes(t))continue;
   for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood');
  }
 }
 const roofs=[
  [15,2,28,14,12,'front-ribbon-terrace'],
  [3,11,18,33,11,'west-sawtooth-glaze'],
  [25,10,39,30,15,'east-glaze-monitor'],
  [12,27,34,38,12,'rear-cross-ridge'],
  [15,15,28,28,17,'central-openlight-walk'],
  [2,28,10,38,10,'low-orchid-shade']
 ];
 for(const [x0,z0,x1,z1,start,profile] of roofs)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roof.has(K(x,z)))continue;
   // Pack4 clear-glass 030 is a real VERTICAL opening pane, never a roofing tile.
   // Keep all 1,097 original roof coordinates and supported Pack3 026 ribs/tiles.
   const y=start+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/5);
   roof.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','north',
    {sourceRoofBearing:true,roofLoadCertificationPending:true});
   b.put(x,y,z,'roof','pack3:026','north',
    {profile,glazed:false,opaqueRoof:true,transparentRoofCandidate:false,
     finalGlazingSupportCertification:false,roofWeatherApproved:false});
  }
 // Persistent grounded framing posts and a timber rib at each fourth glazed roof strip.
 for(const [x,z] of [[17,5],[26,6],[8,17],[12,27],[34,17],[33,25],[18,34],[27,34],[6,32],[17,20],[27,20]]){
  const y=roof.get(K(x,z));if(!y||!has(x,z))throw Error('Alderglass missing grounded source roof '+K(x,z));
  b.support(x,z,y-1,'live:wood','alderglass-ground-to-roof-support');
 }
 const oldGroundGlazing=[[18,2,'north'],[25,2,'north'],[3,17,'west'],[3,25,'west'],[39,17,'east'],
  [39,24,'east'],[17,38,'south'],[30,38,'south'],[2,34,'west'],
  [16,11,'north'],[28,12,'north'],[13,32,'south']];
 for(const [x,z,side] of oldGroundGlazing){
  if(!has(x,z))throw Error('Alderglass unsupported outer glazing '+K(x,z));
  b.pane(x,z,side);
 }
 for(const r of [
  ['north-glass-gallery',16,3,27,13],
  ['west-propagation-wing',4,12,17,32],
  ['east-botanical-display',26,11,38,29],
  ['rear-seed-catalogue',13,28,33,37],
  ['central-courtyard-aisle',16,15,28,27],
  ['low-west-shade-appendix',3,29,9,37]
 ])b.room(...r);
 for(const [from,to,x,z] of [
  ['outside','north-glass-gallery',22,2],
  ['north-glass-gallery','west-propagation-wing',17,14],
  ['north-glass-gallery','east-botanical-display',27,12],
  ['north-glass-gallery','central-courtyard-aisle',21,14],
  ['west-propagation-wing','central-courtyard-aisle',18,27],
  ['east-botanical-display','rear-seed-catalogue',30,28],
  ['central-courtyard-aisle','rear-seed-catalogue',22,28],
  ['west-propagation-wing','low-west-shade-appendix',9,32]
 ]){
  if(!has(x,z))throw Error('Alderglass inaccessible portal '+K(x,z));
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const [x,z,label] of [
  [19,6,'unplanted-glass-bed-reference'],[6,21,'winter-seed-labels'],
  [34,20,'inert-orchid-display'],[20,34,'botany-study-ledger'],[7,35,'empty-tray-storage']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 // Frame ORIGINAL 371 glass components as actual Pack4 upright opening panes.
 // A real Pack4 030 pane is vertically planar (full Y span, thin Z), with cardinal
 // yaw only. Never declare an unsupported horizontal/pitched glass roof.
 const sides=[['north',0,-1],['south',0,1],['west',-1,0],['east',1,0]],bays=[];
 for(const key of shape){
  const [x,z]=key.split(',').map(Number);
  if(oldGroundGlazing.some(([gx,gz])=>gx===x&&gz===z))continue;
  if(![1,2,3,4,5,6,7].every(y=>!b.clear(x,y,z)))continue;
  const outdoor=sides.filter(([,dx,dz])=>!has(x+dx,z+dz));
  if(outdoor.length!==1)continue; // retain solid corner columns
  const [orientation]=outdoor[0];
  bays.push({x,z,orientation,rank:((x*1315423911)^(z*2654435761))>>>0});
 }
 bays.sort((a,b)=>a.rank-b.rank||a.z-b.z||a.x-b.x);
 if(bays.length<124)throw Error('Alderglass lacks 124 real unblocked upright clerestory wall bays');
 const selected=bays.slice(0,124);
 if(new Set(selected.map(c=>c.orientation)).size!==4)
  throw Error('Alderglass lost one of its four exterior daylight facades');
 let physicalGlazing=0;
 for(let i=0;i<selected.length;i++){
  const {x,z,orientation}=selected[i];
  const heights=i===123?[2,4]:[2,4,6]; // 123 * 3 + 2 = exactly 371 original glass source panes
  for(const y of heights){
   if(b.clear(x,y,z))throw Error('Missing actual original greenhouse wall for upright glazing '+[x,y,z]);
   b.cut(x,y,z);
   b.put(x,y,z,'window','pack4:030',orientation,{
    glazed:true,originalGlazing:true,sourceFacade:orientation,framedClerestory:true,
    uprightOpeningPane:true,roofTile:false,visibleDaylight:true,
    physicalLoadCertified:false,actualWindowWeatherSealCertified:false,
    glassBreakageAndLiveCollisionCertified:false
   });
   physicalGlazing++;
  }
 }
 if(physicalGlazing!==371)throw Error('Must retain precisely 371 source transparent panes as real upright windows');
 return b.finish('True timber-supported bifurcated conservatory with exactly 371 upright and physically framed Pack4 clear-glass openings, all 1,097 original supported opaque roof tiles, a source-absent open central garden, connected planting aisles and inert seed archive; no plant growth or farming',{
  sourceAuthor:'Builder B uniquely surveyed Alderglass greenhouse second design',
  glassRoofPanels:0,sourceUprightGlazingPanels:371,opaqueRoofSourceCells:1097,oldGroundGlassPanels:12,\n  openFoundationCourtyard:true,physicalGlassSupportAuditPending:true,
  plantingAisles:true,plantGrowthEnabled:false,roofWeatherApproved:false,
  physicalPackABIApproved:false,rendererAndCollisionAccepted:false,
  liveIntegration:false,worldPlacement:false,productionRegistered:false
 });
}
