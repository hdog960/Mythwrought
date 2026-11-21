// Independent experimental network-only density estimate: NOT real M7 and NOT a gameplay claim.
import {measureNaturalCaveDensity,UNDERWORLD_AUDIT_REGIONS} from '../../src/living-underworld/density-audit.mjs';
import {networkAirAt,auditUnderworldRegionGraph,planUnderworldRegion}
  from '../../src/living-underworld/worldwide-network.mjs';
const seeds=[179,-17,2026,314159];
const locations=[...UNDERWORLD_AUDIT_REGIONS,
  {name:'eastern-extension',x:32768,z:0},
  {name:'western-extension',x:-32768,z:0}];
for(const seed of seeds){
 const audit=measureNaturalCaveDensity({seed,regions:locations,columnsPerSide:4,
   blockAt:(x,y,z)=>networkAirAt(seed,x,y,z)?0:8});
 const regionGraphLocations=locations.map(r=>auditUnderworldRegionGraph(seed,
   Math.floor(r.x/256),Math.floor(r.z/256)));
 if(!regionGraphLocations.every(x=>x.passed))throw Error('regional portal mismatch');
 const citySites=locations.map(r=>planUnderworldRegion(seed,
   Math.floor(r.x/256),Math.floor(r.z/256)).cityCandidate).filter(Boolean).length;
 console.log(JSON.stringify({
   kind:'isolated-unintegrated-network-proposal',seed,
   caveDensity:audit.overall,byDepth:audit.byDepth,byRegion:audit.byRegion,
   neighborhoodGraphPass:regionGraphLocations.length,cityCandidateCount:citySites,
   actualM7:false,physicallyPlayable:false
 }));
}
