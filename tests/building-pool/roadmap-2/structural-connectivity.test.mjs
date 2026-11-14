import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REPRESENTATIVES} from '../../../src/building-pool/roadmap-2/m1-representatives.mjs';

const key=(x,y,z)=>[x,y,z].join(',');
const occupied=bp=>new Map(bp.voxels.map(v=>[key(v.x,v.y,v.z),v]));
const structural=new Set(['foundation','floor','wall','roof','window']);
const directions=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];

test('all structural voxels are six-neighbor connected to actual foundations, not isolated roof islands',()=>{
 for(const bp of M1_REPRESENTATIVES){
  const cells=occupied(bp),seen=new Set(),queue=[];
  for(const v of bp.voxels)if(v.y===0&&v.kind==='foundation'){
   seen.add(key(v.x,v.y,v.z));queue.push(v);
  }
  for(let i=0;i<queue.length;i++){
   const v=queue[i];
   for(const [dx,dy,dz] of directions){
    const k=key(v.x+dx,v.y+dy,v.z+dz),next=cells.get(k);
    if(next&&structural.has(next.kind)&&!seen.has(k)){
     seen.add(k);queue.push(next);
    }
   }
  }
  const detached=bp.voxels.filter(v=>structural.has(v.kind)&&!seen.has(key(v.x,v.y,v.z)));
  assert.equal(detached.length,0,bp.id+' has detached structural cells: '+JSON.stringify(detached.slice(0,5)));
 }
});

test('mountain last roof tiers have continuous rear-gable material and Desert lanterns rest on covered porch',()=>{
 for(const bp of M1_REPRESENTATIVES){
  const cells=occupied(bp);
  if(bp.biome==='mountain'){
   const z=bp.extents.z-1;
   for(let x=0;x<bp.extents.x;x++){
    if(cells.get(key(x,0,z))?.kind!=='foundation')continue;
    const roofs=bp.voxels.filter(v=>v.x===x&&v.z===z&&v.kind==='roof');
    assert(roofs.length>0,bp.id+' missing rear roof above x='+x);
    const roofY=Math.min(...roofs.map(v=>v.y));
    for(let y=2;y<roofY;y++)assert(cells.has(key(x,y,z)),bp.id+' rear roof ungrounded at '+key(x,y,z));
   }
  }
  if(bp.category==='temple'&&bp.biome==='desert'){
   const center=Math.floor(bp.extents.x/2),top={small:7,medium:8,large:10}[bp.size];
   assert.equal(cells.get(key(center,top+1,2))?.kind,'roof',bp.id+' porch lacks foundation for lantern');
   assert(cells.has(key(center,top+2,2)),bp.id+' lantern missing from covered porch');
   const partition=bp.extents.z-(bp.size==='large'?7:5),courtyardZ=Math.max(4,Math.floor(partition/2));
   assert(!cells.has(key(center,top+2,courtyardZ)),bp.id+' formerly floating central lantern still obstructs courtyard');
  }
 }
});
