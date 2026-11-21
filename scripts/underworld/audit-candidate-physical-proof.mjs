// Exact-source isolated 3-D component and exhaustive candidate city-floor audit.
// No production world writes; does not claim player locomotion or full-world access.
import fs from 'node:fs';
import {planUnderworldRegion} from '../../src/living-underworld/worldwide-network.mjs';
import {detachedCalibratedUnderworldAirAt}
 from '../../src/living-underworld/depth-calibrated-proposal.mjs';
import {auditBoundedCaveComponents}
 from '../../src/living-underworld/bounded-components.mjs';
import {auditFullCityCandidate}
 from '../../src/living-underworld/city-full-floor-audit.mjs';
import {planUnderworldSurfaceEntrance}
 from '../../src/living-underworld/surface-entrance-proposal.mjs';
import {auditSupportedEntranceStairs}
 from '../../src/living-underworld/walkable-entrance-stairs.mjs';
const seeds=[179,-17,2026,314159];
const regions=[[0,0],[-128,64],[100,-99]];
const reports=[],cityProofs=[],stairs=[];
for(const seed of seeds){
 for(const [rx,rz] of regions){
  const hub=planUnderworldRegion(seed,rx,rz).layers[1].hub;
  for(const kind of ['hub','off-network']){
   const origin=kind==='hub'?
    {x:hub.x-10,y:hub.y-6,z:hub.z-10}:
    {x:rx*256+24,y:-129,z:rz*256+24};
   const size={x:21,y:13,z:21};
   const report=auditBoundedCaveComponents({origin,size,
    anchors:kind==='hub'?[hub]:[],
    airAt:(x,y,z)=>detachedCalibratedUnderworldAirAt(seed,x,y,z)});
   reports.push({seed,rx,rz,kind,volume:report.volume,air:report.air,
    componentCount:report.componentCount,largestAirShare:report.largestAirShare,
    edgeCrossingComponents:report.edgeCrossingComponents,anchors:report.anchors});
   if(kind==='hub'&&(!report.anchors[0].air||report.largestAirShare<.75))
    throw Error('Hub-local cave-air disconnected: '+JSON.stringify(reports.at(-1)));
  }
 }
 let city=null;
 for(let rx=-5;rx<=5&&!city;rx++)for(let rz=-5;rz<=5&&!city;rz++){
  if(planUnderworldRegion(seed,rx,rz).cityCandidate)
   city=auditFullCityCandidate(seed,rx,rz);
 }
 if(!city||!city.ok)throw Error('No fully supported exhaustive city-floor site: '+
  JSON.stringify({seed,city}));
 cityProofs.push(city);
 for(const [rx,rz] of [[0,0],[-128,64]]){
  const p=planUnderworldSurfaceEntrance(seed,rx,rz,
   {surfaceHeightAt:()=>8,biomeAt:()=> 'plains'});
  if(!p.ok)throw Error('No synthetic gallery plan for detached stair audit');
  const r=auditSupportedEntranceStairs(p);
  stairs.push({seed,rx,rz,ok:r.ok,length:r.length,supportCells:r.supportCells,
   clearanceCells:r.clearanceCells,conflicts:r.conflictCells,maximumStepRise:r.maximumStepRise});
  if(!r.ok)throw Error('Detached supported stairs contradict their own plan: '+
   JSON.stringify({seed,rx,rz,r}));
 }
}
const result={schema:'living-underworld-proposal-physical-proof-v1',
 exactSource:'use verified GitHub artifact checked-out-head.txt',
 testedSeeds:seeds,localWindows:reports,fullResolutionCitySites:cityProofs,
 supportedGalleryProposals:stairs,actualM7:false,
 fullInfiniteComponentConnectivityProven:false,
 actualPlayerCollisionVerified:false,realTerrainSupportChecked:false,
 iPhoneGPUVerified:false,settlementsBuilt:false};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({windows:reports.length,allCityPadsPass:cityProofs.every(x=>x.ok),
 cityFloorCounts:cityProofs.map(x=>({seed:x.seed,rx:x.rx,rz:x.rz,cells:x.footprintCount})),
 stairPlans:stairs.length,allStairsPass:stairs.every(x=>x.ok),
 looseCavernWindows:reports.filter(x=>x.kind==='off-network')
 .map(x=>({seed:x.seed,region:[x.rx,x.rz],air:x.air,
  components:x.componentCount,largestShare:x.largestAirShare}))}));
