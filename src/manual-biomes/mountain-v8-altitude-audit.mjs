// Isolated V8 source-biome/terrain altitude diagnostic; never dispatches V7.
// Caller supplies original terrainHeight, not an invented height map.
// Does not read or certify caves, landmarks, player edits or live VoxelWorld.
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {planMountainV8Candidate} from './mountain-v8-candidate.mjs';
const valid=n=>Number.isSafeInteger(n);
const OFFSETS=Object.freeze([[0,0],[4,0],[-4,0],[0,4],[0,-4]]);
export function auditMountainV8Altitude({seed,xMin,xMax,zMin,zMax,step=8,
  worldMaxY=19,heightAt}={}){
  if(![seed,xMin,xMax,zMin,zMax,step,worldMaxY].every(valid)||
     seed!==(seed|0)||step<1||step>64||xMin>xMax||zMin>zMax||
     worldMaxY<10||worldMaxY>256||typeof heightAt!=='function')return null;
  const nx=Math.floor((xMax-xMin)/step)+1,nz=Math.floor((zMax-zMin)/step)+1;
  if(nx*nz>8192||nx<1||nz<1)return null;
  const counts={samples:0,core:0,sourceEligible:0,ceiling:0,
    snow:0,meadow:0,stone:0,unplanned:0};
  for(let ix=0;ix<nx;ix++)for(let iz=0;iz<nz;iz++){
    const x=xMin+ix*step,z=zMin+iz*step;
    if(!valid(x)||!valid(z))return null;
    counts.samples++;
    const biomes=OFFSETS.map(([dx,dz])=>v6BiomeAt(x+dx,z+dz,seed));
    if(biomes[0]?.name!=='mountain'||biomes[0].weight<.82)continue;
    counts.core++;
    if(biomes.some(b=>b?.name!=='mountain'||b.weight<.82))continue;
    const tops=OFFSETS.map(([dx,dz])=>heightAt(x+dx,z+dz,seed));
    if(tops.some(n=>!valid(n)||n<2||n>=worldMaxY-2)){
      counts.unplanned++;continue;
    }
    const p=planMountainV8Candidate({
      x,z,seed,legacyTop:tops[0],neighborTops:tops.slice(1),
      biomeWeight:biomes[0].weight,
      neighborBiomeWeights:biomes.slice(1).map(b=>b.weight),
      worldMaxY
    });
    if(!p){counts.unplanned++;continue;}
    counts.sourceEligible++;
    if(p.top===worldMaxY-2)counts.ceiling++;
    if(p.cap==='snow')counts.snow++;
    else if(p.cap==='alpine-grass')counts.meadow++;
    else counts.stone++;
  }
  if(counts.sourceEligible+counts.unplanned>counts.core||
     counts.snow+counts.meadow+counts.stone!==counts.sourceEligible)return null;
  return Object.freeze({seed,worldMaxY,counts:Object.freeze(counts),
    noVoxelWorldUsed:true,safeToIntegrate:false,
    generatorIdentityRequired:'v8-new-opt-in'});
}
