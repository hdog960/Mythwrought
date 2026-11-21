// Source exact detached 20-seed density probe — never represent as current M7.
import fs from 'node:fs';
import {measureNaturalCaveDensity,UNDERWORLD_AUDIT_REGIONS}
 from '../../src/living-underworld/density-audit.mjs';
import {detachedCalibratedUnderworldAirAt,CAVE_CALIBRATION}
 from '../../src/living-underworld/depth-calibrated-proposal.mjs';
const seeds=[179,-17,2026,314159,-987,451,0,1,17,42,12345,-12345,
  8675309,-8675309,777,991,-991,65535,24680,13579];
const regions=[...UNDERWORLD_AUDIT_REGIONS,
  {name:'eastern-extension',x:32768,z:0},
  {name:'western-extension',x:-32768,z:0}];
const groups=new Map(),bySeed=[];
let total=0,air=0,zeroRegions=0;
for(const seed of seeds){
 const report=measureNaturalCaveDensity({seed,regions,columnsPerSide:4,
   blockAt:(x,y,z)=>detachedCalibratedUnderworldAirAt(seed,x,y,z)?0:8});
 air+=report.overall.air;total+=report.overall.total;
 zeroRegions+=report.byRegion.filter(x=>x.air===0).length;
 for(const d of report.byDepth){
  const s=groups.get(d.name)??{name:d.name,air:0,total:0};
  s.air+=d.air;s.total+=d.total;groups.set(d.name,s);
 }
 const sample={seed,air:report.overall.air,total:report.overall.total,
  percentage:report.overall.percentage,byRegion:report.byRegion};
 bySeed.push(sample);
 console.log(JSON.stringify({kind:'calibrated-cave-proposal-only',...sample}));
}
const summary={kind:'DETACHED_CALIBRATED_PROPOSAL_NOT_M7',
 seeds:seeds.length,regionsPerSeed:regions.length,regionSamples:seeds.length*regions.length,
 air,total,percentage:100*air/total,zeroRegions,
 byDepth:[...groups.values()].map(x=>({...x,percentage:100*x.air/x.total})),
 thresholds:CAVE_CALIBRATION,actualM7:false,
 activeWorldModified:false,citySitesPlayable:false,entrancesPlayable:false,
 iPhonePerformanceValidated:false};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({summary}));
