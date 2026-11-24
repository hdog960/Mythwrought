// MYTHWROUGHT Builder B Wave57: Moonroot Four-Rack Spore Barn.
// Frozen B115-only original r1:farm-barn:enchanted-forest:small:004.
// Eleven actual source-backed roof wings, four original sky-open courts,
// four real 7x7 stone-grounded drying racks with sixteen 4-tier timber
// posts and y5 perimeter crossbeams, three raised DRY packing plinths,
// outdoor cardinal four-arm throughway, and Pack4 candidate glazing.
// NO live fungi, crops, automation, animals, settlement work, gameplay
// registration, Pack3/4 physical approval, save writes or iPhone PWA tests.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const MOONROOT_FOUR_RACK_ID='r1:farm-barn:enchanted-forest:small:004';
export function buildMoonrootFourRackSporeBarn(){
 const b=sourcePlan('farm-barn','enchanted-forest','small',4,'Moonroot Four-Rack Spore Barn',62,34,76);
 const roofs=[
 ['north-moonseed-arched-entry',18,3,43,14,13,'pack3:025'],
 ['west-spore-drying-gallery',3,8,22,43,15,'pack3:026'],
 ['east-lumiroot-hall',39,8,58,43,16,'pack3:023'],
 ['central-root-branch-promenade',23,13,38,52,20,'pack3:025'],
 ['southwest-amber-husk-store',6,39,26,56,16,'pack3:026'],
 ['southeast-silverspore-vault',36,39,56,56,17,'pack3:023'],
 ['northwest-lantern-lichen-hall',2,5,15,27,13,'pack3:025'],
 ['northeast-firefly-fern-hall',46,5,59,27,15,'pack3:026'],
 ['south-branch-crosshall',25,54,38,63,18,'pack3:023'],
 ['west-barkstone-walk',2,31,10,51,14,'pack3:025'],
 ['east-rootglass-walk',52,31,60,51,16,'pack3:026']
 ],courts=[
 ['north-wild-starwell',25,20,35,29],
 ['west-bright-lichen-skywell',13,33,20,39],
 ['east-moonfern-skywell',41,33,48,39],
 ['south-rootlight-open-garden',26,44,35,50]
 ],racks=[
 ['west-mossroot-rack',10,68],['west-mid-fern-rack',23,68],
 ['east-mid-glowspore-rack',40,68],['east-twilight-rack',53,68]
 ],plinths=[
 ['west-dry-spore-packing',15,69],
 ['central-dry-spore-packing',28,69],
 ['east-dry-spore-packing',35,69]
 ],K=(x,z)=>x+','+z,covered=new Set(),court=new Set(),outer=new Set(),roofed=new Map(),
 first=new Map(),roofPosts=new Set(),rackPosts=new Set(),plinthXZ=new Set(),
 dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const [,x0,z0,x1,z1]of roofs)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)covered.add(K(x,z));
 for(const [,x0,z0,x1,z1]of courts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){court.add(K(x,z));covered.delete(K(x,z))}
 for(const [x0,x1]of [[5,16],[18,29],[33,45],[47,57]])for(let x=x0;x<=x1;x++)for(let z=59;z<=74;z++)
  if(!covered.has(K(x,z))&&!court.has(K(x,z)))outer.add(K(x,z));
 for(let x=7;x<=55;x++)for(let z=72;z<=74;z++)if(!covered.has(K(x,z))&&!court.has(K(x,z)))outer.add(K(x,z));
 const founded=(x,z)=>covered.has(K(x,z))||court.has(K(x,z))||outer.has(K(x,z));
 for(const k of new Set([...covered,...court,...outer])){
  const [x,z]=k.split(',').map(Number);
  b.put(x,0,z,'foundation','live:stone','none',{moonrootTrueSourceStoneFooting:true,actualGrowing:false});
 }
 for(const k of covered){const[x,z]=k.split(',').map(Number);
  if(Object.values(dirs).some(([dx,dz])=>!founded(x+dx,z+dz)))
   for(let y=1;y<=9;y++)b.put(x,y,z,'wall','live:stone','none',{moonrootOriginalWall:true,realRuntimePhysicsPending:true});
 }
 for(const [name,x0,z0,x1,z1,base,asset]of roofs)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(!covered.has(k)||roofed.has(k))continue;
  const d=Math.min(x-x0,x1-x,z-z0,z1-z),y=base+Math.floor(d/(name==='central-root-branch-promenade'?3:5));
  roofed.set(k,{y,name});
  if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:stone','none',{moonrootOriginalImmediateRoofBacking:true});
  b.put(x,y,z,'roof',asset,'north',{moonrootOriginalDistinctCoveredWing:name,installedPack3ColliderUnverified:true});
  if(!first.has(name))first.set(name,[x,z,y]);
 }
 for(const[name]of roofs){const p=first.get(name);if(!p)throw Error('Entire genuine roof occluded '+name);
  roofPosts.add(K(p[0],p[1]));b.support(p[0],p[1],p[2]-1,'live:stone','moonroot-original-full-ground-roof-post-'+name);
 }
 let rackPostCells=0,rackBeamCells=0,packingCells=0;
 for(const[name,cx,cz]of racks){
  for(let x=cx-3;x<=cx+3;x++)for(let z=cz-3;z<=cz+3;z++){
   const k=K(x,z),corner=(x===cx-3||x===cx+3)&&(z===cz-3||z===cz+3),
    boundary=x===cx-3||x===cx+3||z===cz-3||z===cz+3;
   if(!outer.has(k)||b.clear(x,0,z))throw Error('Grounded actual rack lacks original stone '+name+' '+k);
   if(corner){rackPosts.add(k);for(let y=1;y<=4;y++){
     if(!b.clear(x,y,z))throw Error('Continuous real timber column obstructed '+name+' '+k);
     b.put(x,y,z,'support','live:wood','none',{moonrootRealFourTierTimberPost:name,sporeDryingFunction:false});rackPostCells++;
    }}
   if(boundary){if(!b.clear(x,5,z))throw Error('Actual y5 frame beam obstructed '+name+' '+k);
    b.put(x,5,z,'support','live:wood','none',{moonrootRealOriginalFifthTierPerimeterBeam:name,mechanicalDrying:false});rackBeamCells++;
   }
  }
  b.room(name,cx-2,cz-2,cx+2,cz+2);
 }
 for(const[name,cx,cz]of plinths)for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++){
  const k=K(x,z);
  if(!outer.has(k)||rackPosts.has(k)||b.clear(x,0,z)||!b.clear(x,1,z)||!b.clear(x,2,z))
   throw Error('Raised dry stone packing plate unfounded or overlapping '+name+' '+k);
  plinthXZ.add(k);b.put(x,1,z,'furnishing','live:stone','none',{moonrootGenuineRaisedStoneDryPackingPlate:name,workingInventory:false});packingCells++;
 }
 for(const [axis,fixed,lo,hi,holes]of [
  ['x',22,17,48,[20,21,26,27,34,35,41,42,46,47]],
  ['x',39,17,48,[20,21,26,27,34,35,41,42,46,47]],
  ['z',18,17,44,[20,21,27,28,33,34,40,41]],
  ['z',47,9,54,[13,14,22,23,30,31,40,41,48,49]]
 ])for(let n=lo;n<=hi;n++){
  const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n,k=K(x,z);
  if(!covered.has(k)||roofPosts.has(k)||holes.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood','none',{moonrootOriginalDryHallDivider:true});
 }
 for(const room of [
  ['north-moonseed-arched-entry',19,4,42,13],['west-spore-drying-gallery',4,9,21,42],
  ['east-lumiroot-hall',40,9,57,42],['central-root-branch-promenade',24,14,37,51],
  ['southwest-amber-husk-store',7,40,25,55],['southeast-silverspore-vault',37,40,55,55],
  ['northwest-lantern-lichen-hall',3,6,14,26],['northeast-firefly-fern-hall',47,6,58,26],
  ['south-branch-crosshall',26,55,37,62],['west-barkstone-walk',3,32,9,50],
  ['east-rootglass-walk',53,32,59,50],['north-wild-starwell',25,20,35,29],
  ['west-bright-lichen-skywell',13,33,20,39],['east-moonfern-skywell',41,33,48,39],
  ['south-rootlight-open-garden',26,44,35,50],
  ['west-original-rack-approach',5,59,16,74],
  ['midwest-original-rack-approach',18,59,29,74],
  ['mideast-original-rack-approach',33,59,45,74],
  ['east-original-rack-approach',47,59,57,74],
  ['southern-woodland-crosspath',7,72,55,74]
 ])b.room(...room);
 const portalDefs=[
 ['outside','north-moonseed-arched-entry',31,3],
 ['north-moonseed-arched-entry','central-root-branch-promenade',31,14],
 ['north-moonseed-arched-entry','west-spore-drying-gallery',22,10],
 ['north-moonseed-arched-entry','east-lumiroot-hall',39,10],
 ['north-moonseed-arched-entry','northwest-lantern-lichen-hall',15,8],
 ['north-moonseed-arched-entry','northeast-firefly-fern-hall',46,8],
 ['central-root-branch-promenade','north-wild-starwell',24,24],
 ['north-wild-starwell','west-spore-drying-gallery',22,24],
 ['north-wild-starwell','east-lumiroot-hall',39,24],
 ['central-root-branch-promenade','west-bright-lichen-skywell',22,36],
 ['central-root-branch-promenade','east-moonfern-skywell',39,36],
 ['west-spore-drying-gallery','west-bright-lichen-skywell',12,35],
 ['east-lumiroot-hall','east-moonfern-skywell',49,35],
 ['central-root-branch-promenade','south-rootlight-open-garden',25,47],
 ['south-rootlight-open-garden','south-branch-crosshall',31,54],
 ['west-spore-drying-gallery','southwest-amber-husk-store',17,40],
 ['east-lumiroot-hall','southeast-silverspore-vault',45,40],
 ['southwest-amber-husk-store','south-branch-crosshall',26,54],
 ['southeast-silverspore-vault','south-branch-crosshall',38,54],
 ['northwest-lantern-lichen-hall','west-barkstone-walk',7,30],
 ['northeast-firefly-fern-hall','east-rootglass-walk',55,30],
 ['southwest-amber-husk-store','west-original-rack-approach',12,59],
 ['southeast-silverspore-vault','east-original-rack-approach',53,59],
 ['south-branch-crosshall','midwest-original-rack-approach',27,63],
 ['south-branch-crosshall','mideast-original-rack-approach',37,63],
 ['west-original-rack-approach','southern-woodland-crosspath',12,73],
 ['midwest-original-rack-approach','southern-woodland-crosspath',23,73],
 ['mideast-original-rack-approach','southern-woodland-crosspath',40,73],
 ['east-original-rack-approach','southern-woodland-crosspath',53,73]
 ];
 for(const[from,to,x,z]of portalDefs){const k=K(x,z);
  if(!founded(x,z)||roofPosts.has(k)||rackPosts.has(k)||plinthXZ.has(k))
   throw Error('Physical source portal would cut roof post, rack or plinth '+k);
  b.opening(x,z);b.portal(from,to,x,z);
 }
 for(const[name,cx,cz]of racks){
  const x=cx,z=cz-3,k=K(x,z);
  if(!outer.has(k)||rackPosts.has(k)||plinthXZ.has(k)||!b.clear(x,1,z)||!b.clear(x,2,z))
   throw Error('Actual original rack entry obstructed '+name);
  b.portal('southern-woodland-crosspath',name,x,z);
 }
 let panes=0,windowBays=0;
 for(const k of covered){const[x,z]=k.split(',').map(Number);
  if(roofPosts.has(k)||(x*17+z*13)%15!==0||[1,2,3,4,5,6,7].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(dirs).find(([,d])=>!founded(x+d[0],z+d[1]));
  if(!face)continue;
  for(let y=2;y<=5;y++){
   b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],{moonrootOriginalFourHighCandidatePane:true,Pack4CollisionUnrun:true});panes++;
  }windowBays++;
 }
 return b.finish('Four physically grounded and truly source-framed wood drying pergolas, original elevated stone dry packing plates, eleven distinct real source-backed barn roof masses, four full-height stone sky-courts and four actually connected outdoor approaches. No running crop or spore harvesting.',{
  originalBuilderBWave:57,sourceTrulyOccupiedRoofWings:first.size,
  stoneFoundedOpenSkyCourtCells:[110,56,56,70],
  realOriginalIndependentDryingRacks:racks.length,
  genuineSourceFourTierTimberPostCells:rackPostCells,
  realSourceY5RackUpperPerimeterBeamCells:rackBeamCells,
  realRaisedStoneDryPackingPlateCells:packingCells,
  actualExteriorStoneGroundCells:outer.size,
  genuineFourWayOutsideCrosspath:true,
  sourceUnresolvedPack4WindowCandidateCells:panes,
  actuallyCompleteStoneFramedFourHighWindowBays:windowBays,
  realSporeCropHarvesting:false,actualGrowing:false,
  actualPack3Pack4PhysicalProducerApproval:false,
  realM7BodyPhysicsTested:false,productionRegistered:false,
  worldPlacement:false,schema1SaveWritten:false,
  actualIphoneHomeScreenPwaAccepted:false,creatorArtApproval:false
 });
}
