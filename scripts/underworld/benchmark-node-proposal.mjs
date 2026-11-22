// Node CPU diagnostic ONLY; NOT mobile FPS / WebGL GPU or latency certification.
import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {detachedCalibratedUnderworldAirAt}
 from '../../src/living-underworld/depth-calibrated-proposal.mjs';
import {networkAirAt,planUnderworldRegion,UNDERWORLD_REGION_SIDE} from '../../src/living-underworld/worldwide-network.mjs';
import {cityFloorAt,cityClearanceAt} from '../../src/living-underworld/city-floor-proposal.mjs';
import {candidateNoiseScoreAt,candidateChamberAt}
 from '../../src/living-underworld/procedural-core.mjs';
import {caveThresholdForDepth} from '../../src/living-underworld/depth-calibrated-proposal.mjs';
const queries=Array.from({length:12288},(_,i)=>{
 const x=-3680+((i*7919)%7399),y=-4-((i*37)%207),z=1070+((i*4373)%7237);
 return [x,y,z];
});
function bench(name,fn){
 for(let i=0;i<256;i++)fn(...queries[i]);
 const samples=[];let air=0;
 for(let start=0;start<queries.length;start+=256){
  const t0=performance.now();
  for(let i=start;i<start+256;i++)if(fn(...queries[i]))air++;
  samples.push(performance.now()-t0);
 }
 samples.sort((a,b)=>a-b);
 return {name,queries:queries.length,air,meanMsPer256Batch:samples.reduce((a,b)=>a+b,0)/samples.length,
  medianMsPer256Batch:samples[Math.floor(samples.length*.5)],
  p95MsPer256Batch:samples[Math.min(samples.length-1,Math.floor(samples.length*.95))],
  maxMsPer256Batch:samples.at(-1)};
}
const originalTwoPass=(seed,x,y,z)=>{
 if(y<-210||y>-4)return false;
 if(cityFloorAt(seed,x,y,z))return false;
 if(cityClearanceAt(seed,x,y,z))return true;
 if(networkAirAt(seed,x,y,z))return true;
 if(candidateNoiseScoreAt(seed,x,y,z)>caveThresholdForDepth(y))return true;
 return candidateChamberAt(seed,x,y,z);
};
// Pre-cache reference reconstructs the same immutable candidate lookups with
// a fresh 3x3 neighborhood scan, exactly as before the bounded LRU change.
const uncachedCityMaterial=(seed,x,y,z)=>{
 if(y<-210||y>-4)return 0;
 const rx=Math.floor(x/UNDERWORLD_REGION_SIDE),rz=Math.floor(z/UNDERWORLD_REGION_SIDE);
 let clearance=false;
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
  const city=planUnderworldRegion(seed,rx+dx,rz+dz).cityCandidate;
  if(!city||Math.abs(x-city.x)>city.rx*.57||Math.abs(z-city.z)>city.rz*.57)continue;
  const nx=(x-city.x)/(city.rx*.55),nz=(z-city.z)/(city.rz*.55);
  if(nx*nx+nz*nz>1)continue;
  const floor=city.y-8;
  if(y>=floor-5&&y<=floor)return -1;
  if(y>=city.y-7&&y<=city.y+4)clearance=true;
 }
 return clearance?1:0;
};
const uncachedReference=(seed,x,y,z)=>{
 if(y<-210||y>-4)return false;
 const status=uncachedCityMaterial(seed,x,y,z);
 if(status<0)return false;
 if(status>0)return true;
 if(networkAirAt(seed,x,y,z))return true;
 if(candidateNoiseScoreAt(seed,x,y,z)>caveThresholdForDepth(y))return true;
 return candidateChamberAt(seed,x,y,z);
};
for(const args of queries){
 if(uncachedReference(179,...args)!==detachedCalibratedUnderworldAirAt(179,...args))
  throw Error('Uncached CPU reference changed a cave voxel: '+args.join(','));
}

// Exact old network algorithm retained solely for A/B CPU evidence.
// It does NOT import or replace a playable world.
const referenceRoom=(x,y,z,r)=>{
 if(Math.abs(x-r.x)>r.rx||Math.abs(y-r.y)>r.ry||Math.abs(z-r.z)>r.rz)
  return false;
 const a=(x-r.x)/r.rx,b=(y-r.y)/r.ry,c=(z-r.z)/r.rz;
 return a*a+b*b+c*c<=1;
};
const referenceTube=(x,y,z,t)=>{
 const b=t.bounds;
 if(x<b.minX||x>b.maxX||y<b.minY||y>b.maxY||z<b.minZ||z>b.maxZ)
  return false;
 const dx=t.b.x-t.a.x,dy=(t.b.y-t.a.y)*1.5,dz=t.b.z-t.a.z;
 const px=x-t.a.x,py=(y-t.a.y)*1.5,pz=z-t.a.z;
 const den=dx*dx+dy*dy+dz*dz;
 const frac=den?Math.max(0,Math.min(1,(px*dx+py*dy+pz*dz)/den)):0;
 const ax=px-frac*dx,ay=py-frac*dy,az=pz-frac*dz;
 return ax*ax+ay*ay+az*az<=t.radius*t.radius;
};
const uncachedNetwork=(seed,x,y,z)=>{
 if(y<-210||y>-4)return false;
 const rx=Math.floor(x/UNDERWORLD_REGION_SIDE),rz=Math.floor(z/UNDERWORLD_REGION_SIDE);
 const local=planUnderworldRegion(seed,rx,rz);
 if(local.layers.some(l=>referenceRoom(x,y,z,l.room)))return true;
 if(local.capsules.some(t=>referenceTube(x,y,z,t)))return true;
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
  const city=(dx===0&&dz===0?local:
    planUnderworldRegion(seed,rx+dx,rz+dz)).cityCandidate;
  if(city&&referenceRoom(x,y,z,city))return true;
 }
 return false;
};
for(const [x,y,z] of queries)
 if(uncachedNetwork(179,x,y,z)!==networkAirAt(179,x,y,z))
  throw Error('Network cache changed an actual cave voxel: '+x+','+y+','+z);
const result={kind:'NODE_CPU_ONLY_NOT_IPHONE_GPU_OR_FRAME_TIMES',
 nodeVersion:process.version,seed:179,samplesPerImplementation:queries.length,
 results:[bench('uncached-network-reference',(...a)=>uncachedNetwork(179,...a)),
  bench('network-only',(...a)=>networkAirAt(179,...a)),
  bench('uncached-city-reference',(...a)=>uncachedReference(179,...a)),
  bench('two-pass-city-reference',(...a)=>originalTwoPass(179,...a)),
  bench('calibrated-network-cavern',(...a)=>detachedCalibratedUnderworldAirAt(179,...a))],
 baselineAgainstM7:false,hardwareSpecific:true,productionRegressionsNotTested:true,
 zeroChangedVoxelCountAcrossReference:true,
 zeroChangedNetworkQueries:queries.length};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
