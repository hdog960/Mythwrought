import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../src/voxel.mjs';
import {beginP0MixedSpanWindow,verifyP0MixedSpan} from '../src/manual-biomes/forgotten-sands-mixed-span.mjs';
const free=()=>false;
test('original native larger mixed-size disjoint 111-span layouts and unchanged gap cells',()=>{
  for(const seed of [179,2026]){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR)),before=JSON.stringify(world.save());
    const windows=seed===179?[[392,0],[512,-120],[608,112]]:[[588,-1428],[480,-5],[-928,-2053]];
    let best=null;const census=[];
    for(const [x,z] of windows){
      const j=beginP0MixedSpanWindow(world,{seed,x,z},{reserved:free});let r,old=0,rank=0;
      do{r=j.step();assert.ok(r.columns-old<=32);assert.ok(r.layoutCursor-rank<=32);old=r.columns;rank=r.layoutCursor;}while(!r.done);
      census.push({x,z,columns:r.columns,layouts:r.layouts,eligible:r.eligible,cachedSquares:r.cachedSquares,best:r.candidates[0]??null});
      if(r.candidates.length&&(!best||r.candidates[0].area>best.area))best=r.candidates[0];
    }
    let result=null;
    if(best){
      const r=verifyP0MixedSpan(world,best,{reserved:free});assert.equal(r.accepted,true);
      assert.equal(r.continuousFoundation,false);assert.equal(r.placementAuthority,false);
      let cells=0,gapColumns=0;
      const minX=Math.min(...r.modules.map(m=>m.minX)),maxX=Math.max(...r.modules.map(m=>m.maxX)),minZ=Math.min(...r.modules.map(m=>m.minZ)),maxZ=Math.max(...r.modules.map(m=>m.maxZ));
      for(let x=minX;x<=maxX;x++)for(let z=minZ;z<=maxZ;z++){
        const inside=r.modules.some(m=>x>=m.minX&&x<=m.maxX&&z>=m.minZ&&z<=m.maxZ);
        if(!inside)gapColumns++;
        for(let y=-3;y<=60;y++){const p=r.proposedBlock(x,y,z);if(p===null)continue;assert.ok(inside);assert.equal(world.get(x,y,z),BLOCK.AIR);cells++;}
      }
      assert.ok(best.area>675);assert.ok(cells>0);
      const deny=verifyP0MixedSpan(world,best,{reserved:(x,z)=>x===r.modules[0].x&&z===r.modules[0].z});
      assert.equal(deny.accepted,false);
      result={best,cells,gapColumns,min:r.min,max:r.max};
    }
    assert.equal(JSON.stringify(world.save()),before);
    console.log('P0 MIXED SPAN',JSON.stringify({seed,census,result}));
  }
});
