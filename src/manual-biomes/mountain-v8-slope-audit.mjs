// Detached V8 source-biome/height seam audit, never live V7 dispatch.
// Full original caves, landmarks, physical blocks and schema-1 saves UNTESTED.
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {planMountainV8Candidate} from './mountain-v8-candidate.mjs';
const valid=n=>Number.isSafeInteger(n);
const SURROUND=Object.freeze([[0,0],[4,0],[-4,0],[0,4],[0,-4]]);
const CARDINAL=Object.freeze([[1,0],[-1,0],[0,1],[0,-1]]);
export function auditMountainV8SourceSlopes({seed,xMin,xMax,zMin,zMax,
  step=8,worldMaxY=19,heightAt}={}){
  if(![seed,xMin,xMax,zMin,zMax,step,worldMaxY].every(valid)||
    seed!==(seed|0)||step<1||step>64||worldMaxY<10||worldMaxY>256||
    xMin>xMax||zMin>zMax||typeof heightAt!=='function')return null;
  const nx=Math.floor((xMax-xMin)/step)+1;
  const nz=Math.floor((zMax-zMin)/step)+1;
  if(!valid(nx)||!valid(nz)||nx<1||nz<1||nx*nz>8192)return null;
  const cache=new Map();
  function candidate(x,z){
    if(!valid(x)||!valid(z))return null;
    const k=x+','+z;
    if(cache.has(k))return cache.get(k);
    const biomes=SURROUND.map(([dx,dz])=>v6BiomeAt(x+dx,z+dz,seed));
    let p=null;
    if(biomes.every(b=>b?.name==='mountain'&&b.weight>=.82)){
      const h=SURROUND.map(([dx,dz])=>heightAt(x+dx,z+dz,seed));
      if(h.every(v=>valid(v)&&v>=3&&v<worldMaxY-2))
        p=planMountainV8Candidate({x,z,seed,legacyTop:h[0],
          neighborTops:h.slice(1),biomeWeight:biomes[0].weight,
          neighborBiomeWeights:biomes.slice(1).map(b=>b.weight),worldMaxY});
    }
    cache.set(k,p);
    return p;
  }
  let accepted=0,missingNeighbors=0,excessiveSteps=0,largestStep=0;
  let cliff=0,meadow=0,snow=0,ceiling=0,exposedFaces=0;
  for(let iz=0;iz<nz;iz++)for(let ix=0;ix<nx;ix++){
    const x=xMin+ix*step,z=zMin+iz*step;
    const p=candidate(x,z);
    if(!p)continue;
    accepted++;
    cliff+=Number(p.cliff);meadow+=Number(p.cap==='alpine-grass');
    snow+=Number(p.cap==='snow');ceiling+=Number(p.top===worldMaxY-2);
    const neighbors=CARDINAL.map(([dx,dz])=>candidate(x+dx,z+dz));
    if(neighbors.some(n=>!n)){missingNeighbors++;continue;}
    const steps=neighbors.map(n=>Math.abs(p.top-n.top));
    const max=Math.max(...steps);
    largestStep=Math.max(largestStep,max);
    exposedFaces+=steps.reduce((sum,n)=>sum+n,0);
    if(max>2)excessiveSteps++;
  }
  const checked=accepted-missingNeighbors;
  return Object.freeze({seed,counts:Object.freeze({samples:nx*nz,
    sourceEligible:accepted,checked,missingNeighbors,excessiveSteps,
    largestStep,exposedFaces,cliff,meadow,snow,ceiling,
    uniqueSourceSites:cache.size}),source:'V6-biome-original-height-V8-proposal',
    fullVoxelWorldVerified:false,safeToIntegrate:false});
}
