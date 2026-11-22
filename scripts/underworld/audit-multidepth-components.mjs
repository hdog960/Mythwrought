// Detached-world multi-depth TRUE voxel-component census, read only.
// Samples both reachable hub-adjacent AIR and ambient non-network AIR;
// NEVER projects its local fractions to the infinite world.
import fs from 'node:fs';
import {planUnderworldRegion,UNDERWORLD_LEVELS,UNDERWORLD_REGION_SIDE}
 from '../../src/living-underworld/worldwide-network.mjs';
import {detachedCalibratedUnderworldAirAt}
 from '../../src/living-underworld/depth-calibrated-proposal.mjs';
import {auditBoundedCaveComponents}
 from '../../src/living-underworld/bounded-components.mjs';
import {auditCityAccessRamp}
 from '../../src/living-underworld/city-access-proposal.mjs';
const seeds=[179,-17,2026,314159],regions=[[0,0],[-128,64],[300,-302]];
const windows=[],cityRamps=[];
for(const seed of seeds){
 for(const [rx,rz] of regions){
  const plan=planUnderworldRegion(seed,rx,rz);
  for(let i=0;i<UNDERWORLD_LEVELS.length;i++){
   const level=plan.layers[i];
   const centers=[
    {kind:'hub',x:level.hub.x,y:level.hub.y,z:level.hub.z},
    {kind:'ambient',x:rx*UNDERWORLD_REGION_SIDE+32,
      y:UNDERWORLD_LEVELS[i].y,z:rz*UNDERWORLD_REGION_SIDE+32}
   ];
   for(const point of centers){
    const bounds={origin:{x:point.x-8,y:point.y-5,z:point.z-8},
     size:{x:17,y:11,z:17}};
    const result=auditBoundedCaveComponents({...bounds,maxCells:4000,
     anchors:point.kind==='hub'?[level.hub]:[],
     airAt:(x,y,z)=>detachedCalibratedUnderworldAirAt(seed,x,y,z)});
    if(!result.ok)throw Error('Unexpected 3D component-budget failure');
    if(point.kind==='hub'&&!result.anchors[0].air)
      throw Error('Main planned hub was sealed: '+seed+'/'+rx+'/'+rz+'/'+level.name);
    windows.push({seed,rx,rz,depth:level.name,kind:point.kind,
     volume:result.volume,air:result.air,components:result.componentCount,
     largestComponentAir:result.largestAirComponent,
     largestShare:result.largestAirShare,
     hasAir:result.air>0,
     fullRock:result.air===0,
     fullAir:result.air===result.volume,
     boundaryComponents:result.edgeCrossingComponents});
   }
  }
 }
 // Independent rare city access source: verify a complete pad approach once
 // per seed, WITHOUT placing steps or violating any original-world edits.
 let city=null;
 for(let rx=-5;rx<=5&&!city;rx++)for(let rz=-5;rz<=5&&!city;rz++)
  if(planUnderworldRegion(seed,rx,rz).cityCandidate)city={rx,rz};
 if(!city)throw Error('No rare city for four-seed ramp survey');
 const ramp=auditCityAccessRamp(seed,city.rx,city.rz);
 if(!ramp.ok)throw Error('City hub-to-pad ramp geometry invalid: '+JSON.stringify(ramp));
 cityRamps.push(ramp);
}
const byDepth={};
for(const level of UNDERWORLD_LEVELS){
 const sub=windows.filter(w=>w.depth===level.name);
 byDepth[level.name]={windows:sub.length,air:sub.reduce((s,w)=>s+w.air,0),
  total:sub.reduce((s,w)=>s+w.volume,0),
  noAirWindows:sub.filter(w=>w.fullRock).length,
  fullyOpenWindows:sub.filter(w=>w.fullAir).length,
  multiComponentWindows:sub.filter(w=>w.components>1).length,
  largestShareOfSampledAir:sub.reduce((s,w)=>s+w.largestComponentAir,0)/
   Math.max(1,sub.reduce((s,w)=>s+w.air,0))};
}
const result={schema:'living-underworld-bounded-multidepth-topology-v1',
 source:'Detached calibrated candidate only',
 windows,byDepth,cityRamps,numberOfWindows:windows.length,
 sixFaceConnectedComponents:true,
 infiniteWorldFractionProven:false,
 detachedBaselineOnly:true,
 notADeviceOrFPSCheck:true,
 builtInGame:false,
 fullWorldAccessibleFromSurface:false};
if(windows.length!==96||cityRamps.length!==4)
 throw Error('Incomplete worldwide local 3D sample census');
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({windows:windows.length,cityRamps:cityRamps.length,
 byDepth,fullRock:windows.filter(w=>w.fullRock).length,
 multipleComponents:windows.filter(w=>w.components>1).length}));
