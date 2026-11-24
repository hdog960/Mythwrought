import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {defineP0ModularSpan,beginP0ModularSurvey,p0ModularTrials} from '../src/manual-biomes/forgotten-sands-modular-span.mjs';
const free=()=>false;
function finish(job){let r;do{r=job.step();}while(r.accepted===null);return r;}
test('111-span modular design is disjoint, bounded and never fills original gaps',()=>{
  for(const seed of [179,2026])for(const size of [15,23,31])for(const axis of ['x','z']){
    const s=defineP0ModularSpan({seed,x:512,z:0,size,axis});
    const lo=s.modules[0],hi=s.modules[2];
    assert.equal(axis==='x'?hi.maxX-lo.minX+1:hi.maxZ-lo.minZ+1,111);
    assert.equal(s.gap,(111-3*size)/2);assert.ok(s.gap>=9);
    assert.equal(s.index.size,3);
  }
  assert.throws(()=>defineP0ModularSpan({seed:179,x:0,z:0,size:33}));
});
test('actual M7 deterministic low-relief modular trials and whole joint quiet admission',()=>{
  for(const seed of [179,2026]){
    const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR)),before=JSON.stringify(w.save());
    let found=null;const tally={};let attempts=0;
    for(const size of [31,23,15]){
      const trials=p0ModularTrials(seed,{size,limit:48});
      assert.deepEqual(trials,p0ModularTrials(seed,{size,limit:48}));
      for(const c of trials){
        attempts++;
        const r=finish(beginP0ModularSurvey(w,c,{reserved:free}));
        if(!r.accepted){tally[r.reason]=(tally[r.reason]??0)+1;continue;}
        assert.equal(r.span,111);assert.equal(r.continuousFoundation,false);assert.equal(r.connectedWalkway,false);assert.equal(r.placementAuthority,false);
        assert.equal(r.capStorageBytes,3*size*size);assert.ok(r.maxCap-r.minCap<=8);
        const {modules,axis}=r.spec;
        let cells=0,gapColumns=0,protectedGapAir=0;
        const lo=modules[0],hi=modules[2];
        for(let x=lo.minX;x<=hi.maxX;x++)for(let z=lo.minZ;z<=hi.maxZ;z++){
          const inside=modules.some(m=>x>=m.minX&&x<=m.maxX&&z>=m.minZ&&z<=m.maxZ);
          if(!inside)gapColumns++;
          for(let y=-3;y<=100;y++){
            const p=r.proposedBlock(x,y,z);
            if(!inside){assert.equal(p,null);if(w.environmentCaves.get(x,y,z)===BLOCK.AIR)protectedGapAir++;}
            if(p!==null){assert.ok(inside);assert.equal(w.get(x,y,z),BLOCK.AIR);cells++;}
          }
        }
        assert.ok(cells>0);assert.equal(gapColumns,111*size-3*size*size);
        // Explicit reservation within the first module must veto complete group.
        const denied=finish(beginP0ModularSurvey(w,c,{reserved:(x,z)=>x===lo.x&&z===lo.z}));
        assert.equal(denied.accepted,false);assert.equal(denied.reason,'reserved-column');
        found={candidate:c,span:r.span,gap:r.spec.gap,modules:modules.map(m=>[m.x,m.z]),cells,gapColumns,protectedGapAir,min:r.minCap,max:r.maxCap};break;
      }
      if(found)break;
    }
    assert.deepEqual(JSON.stringify(w.save()),before);
    console.log('P0 MODULAR',JSON.stringify({seed,attempts,tally,found}));
  }
});
