import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {p0AdditionalLowReliefWindows} from '../src/manual-biomes/forgotten-sands-low-relief-windows.mjs';
import {p0ReliefWindows,beginP0ReliefWindow} from '../src/manual-biomes/forgotten-sands-relief-search.mjs';
import {beginP0GroundSurvey} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
const free=()=>false;
test('new low-relief windows selected by actual source terrain; full native clearance and relief admission unchanged',()=>{
  for(const seed of [179,2026]){
    const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const windows=p0AdditionalLowReliefWindows(seed,{limit:12});
    assert.deepEqual(windows,p0AdditionalLowReliefWindows(seed,{limit:12}));assert.equal(windows.length,12);
    const prior=new Set(p0ReliefWindows(seed).map(w=>w.x+','+w.z));
    const found={63:null,111:null},results=[];
    for(const window of windows){
      assert.ok(!prior.has(window.x+','+window.z));
      const job=beginP0ReliefWindow(w,window,{reserved:free});let r;do{r=job.step();}while(!r.done);
      results.push({x:window.x,z:window.z,estimated:window.sampledRelief,best:r.bestSquare,clear:r.clearSquares,veto:r.reliefVeto});
      for(const size of [63,111]){
        if(found[size]||!r.candidates[size].length)continue;
        const c=r.candidates[size][0],j=beginP0GroundSurvey(w,c,{reserved:free});let q;do{q=j.step();}while(q.accepted===null);
        assert.equal(q.accepted,true,JSON.stringify(q));assert.ok(q.maxCap-q.minCap<=8);
        found[size]={site:q.site,min:q.minCap,max:q.maxCap,floor:q.floor,top:q.maxY};
      }
    }
    assert.deepEqual(w.save().edits,[]);
    console.log('P0 EXTRA LOW RELIEF',JSON.stringify({seed,observations:windows.length*127*127,results,found}));
  }
});
