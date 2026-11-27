import assert from 'node:assert/strict';
import {createSkylands} from '../../src/veilreach/generation.mjs';
import {FourRegionWorld,fourRegionProfile} from '../../src/manual-biomes/profile-world.mjs';
import {VEILREACH_GENERATOR} from '../../src/environment-ground.mjs';
import {meshChunk} from '../../src/voxel.mjs';
import {UPPER_SECTION_COUNT} from '../../src/world-height.mjs';
import {UPPER_SECTION_BYTES,validateUpperSectionGeometry} from '../../src/world-height-budget.mjs';

const seeds=[179,180,-77,2026];
const regions=[[0,0],[-43,26],[32,-49],[-21,-19],[61,35]];
const offsets=[[0,0],[-1,0],[1,0],[0,1],[0,-1],[-1,1],[2,-1]];
const empty=new Float32Array();
const families=new Set(),faults=[];
let count=0,peak={bytes:0};
for(const seed of seeds){
  const terrain=createSkylands(seed);
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,VEILREACH_GENERATOR));
  for(const [rx,rz] of regions){
    const [mainland]=terrain.region(rx,rz);
    families.add(mainland.family);
    for(const [dx,dz] of offsets){
      const cx=Math.floor(mainland.x/16)+dx,cz=Math.floor(mainland.z/16)+dz;
      const mask=terrain.sectionMask(cx,cz);
      for(let section=1;section<=UPPER_SECTION_COUNT;section++){
        if(!(mask&1<<(section-1)))continue;
        const location={seed,family:mainland.family,cx,cz,section};
        try{
          const bytes=validateUpperSectionGeometry(meshChunk(world,cx,cz,section),empty);
          if(bytes>peak.bytes)peak={...location,bytes};
          count++;
        }catch(error){faults.push({...location,reason:error.message});}
      }
    }
  }
}
console.log(JSON.stringify({seeds,regions,families:[...families],count,peak,faults,
  cap:UPPER_SECTION_BYTES},null,2));
assert.equal(families.size,3);
assert.deepEqual(faults,[]);
assert.ok(count>=300);
