// Exact source-backed face-connected 3D seam census, not a full-world floodfill.
// This is an isolated candidate only; no existing M7 generator is modified.
import fs from 'node:fs';
import {auditPhysicalRegionSeams}
 from '../../src/living-underworld/region-seam-components.mjs';
const seeds=[179,-17,2026],regions=[[0,0],[-37,52],[300,-302]];
const reports=[];let failures=0,components=0,checked=0;
for(const seed of seeds)for(const [rx,rz] of regions){
 const report=auditPhysicalRegionSeams(seed,rx,rz,{levelIndices:[0,1,2,3],radius:7});
 checked+=report.checkedSeams;
 failures+=report.checks.filter(e=>!e.passed).length;
 components+=report.checks.reduce((sum,c)=>sum+(c.components??0),0);
 reports.push({seed,rx,rz,pass:report.pass,
  checkedSeams:report.checkedSeams,
  checks:report.checks.map(c=>({depth:c.depth,direction:c.direction,
    portal:c.portal,passed:c.passed,components:c.components,
    largestAirShare:c.largestAirShare,reason:c.reason}))});
}
const result={schema:'living-underworld-exact-3d-seam-census-v1',
 reportKind:'DETACHED_CANDIDATE_NOT_M7',seeds,regions,
 checkedSeams:checked,failedSeams:failures,
 sumSampledComponentCounts:components,checks:reports,
 infiniteWorldConnectivityNotProven:true,
 iPhoneRendererAndPhysicsNotTested:true};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({checked,failed:failures,regions:reports.length,
 hadLocalDisconnectedPockets:reports.flatMap(r=>r.checks)
  .filter(c=>c.components>1).length}));
if(failures)throw Error('Real detached voxel seam is NOT 3D connected: '+failures);
