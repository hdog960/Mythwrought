import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REPRESENTATIVES} from '../../../src/building-pool/roadmap-2/m1-representatives.mjs';

const key=(x,y,z)=>`${x},${y},${z}`;
const neighbors=[[1,0],[-1,0],[0,1],[0,-1]];
const getMap=bp=>new Map(bp.voxels.map(v=>[key(v.x,v.y,v.z),v]));

test('all generated non-Desert exterior upper-wall cells are continuously sealed to the roof',()=>{
 let checked=0;
 for(const bp of M1_REPRESENTATIVES.filter(b=>b.biome!=='desert')){
  const cells=getMap(bp);
  const founded=(x,z)=>cells.get(key(x,0,z))?.kind==='foundation';
  for(let x=0;x<bp.extents.x;x++)for(let z=0;z<bp.extents.z;z++){
   if(!founded(x,z)||!neighbors.some(([dx,dz])=>!founded(x+dx,z+dz)))continue;
   const roof=bp.voxels.filter(v=>v.x===x&&v.z===z&&v.kind==='roof');
   if(!roof.length)continue;
   const roofY=Math.min(...roof.map(v=>v.y));
   for(let y=5;y<roofY;y++){
    const wall=cells.get(key(x,y,z));
    assert(wall&&['wall','window','roof'].includes(wall.kind),
      `unweathered outer roof eave: ${bp.id} ${key(x,y,z)}`);
    checked++;
   }
  }
 }
 assert(checked>500,'did not inspect a meaningful set of exterior eave coordinates');
});

test('roof sealing preserves all registered front windows, street entries and Desert skylights',()=>{
 let windows=0,doors=0,courtyard=0;
 for(const bp of M1_REPRESENTATIVES){
  const cells=getMap(bp);
  for(const opening of bp.openings){
   if(opening.type==='window'){
    assert.equal(cells.get(key(opening.x,opening.y,opening.z))?.kind,'window',
      `lost window: ${bp.id}`);windows++;
   }
   if(opening.type==='entrance'){
    for(let y=opening.y;y<opening.y+opening.clearHeightCells;y++){
     assert(!cells.has(key(opening.x,y,opening.z)),`blocked street door: ${bp.id}`);doors++;
    }
   }
  }
  if(bp.biome==='desert'){
   const center=Math.floor(bp.extents.x/2);
   const partition=bp.extents.z-(bp.size==='large'?7:5);
   const cap=Math.min(bp.extents.z-6,8);
   for(let z=3;z<=cap;z++)for(let y=6;y<bp.extents.y;y++){
    assert(!cells.has(key(center,y,z)),`Desert open-air courtyard blocked: ${bp.id} y${y},z${z}`);
    courtyard++;
   }
  }
 }
 assert(windows>=60&&doors>=90&&courtyard>10);
});
