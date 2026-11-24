import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {p0NewColossalWindows,p0ColossalCoreWitness} from '../src/manual-biomes/forgotten-sands-colossal-core.mjs';
import {beginP0ReliefWindow} from '../src/manual-biomes/forgotten-sands-relief-search.mjs';
import {beginP0GroundSurvey} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
const free=()=>false;
test('new outer macrotiles: exact common-core witness excludes all 111 endpoints, survivors require full source survey',()=>{
 for(const seed of [179,2026]){
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR)),windows=p0NewColossalWindows(seed),vetoReasons={};let samples=0,excluded=0,full=0,found=null,unresolved=0;
  assert.equal(new Set(windows.map(v=>v.x+','+v.z)).size,windows.length);
  for(const win of windows){
    assert.ok(Math.max(Math.abs(win.tx),Math.abs(win.tz))>9);
    const r=p0ColossalCoreWitness(w,win,{reserved:free});samples+=r.inspected;
    if(r.veto){
      for(let a=-63;a<=-47;a++)for(let b=-63;b<=-47;b++){
        assert.ok(r.witness.x>=win.x+a&&r.witness.x<=win.x+a+110);
        assert.ok(r.witness.z>=win.z+b&&r.witness.z<=win.z+b+110);
      }
      excluded+=r.excludedEndpoints;vetoReasons[r.witness.reason]=(vetoReasons[r.witness.reason]??0)+1;continue;
    }
    if(full>=12){unresolved++;continue;}
    full++;const j=beginP0ReliefWindow(w,win,{reserved:free});let q;do{q=j.step();}while(!q.done);
    excluded+=289-q.clearSquares[111];
    if(q.candidates[111].length&&!found){
      const g=beginP0GroundSurvey(w,q.candidates[111][0],{reserved:free,maxRelief:8});let a;do{a=g.step();}while(a.accepted===null);
      assert.equal(a.accepted,true);found={site:a.site,floor:a.floor,top:a.maxY,min:a.minCap,max:a.maxCap};
    }
    console.log('P0 COLOSSAL SURVIVOR',JSON.stringify({seed,window:win,best:q.bestSquare,clear:q.clearSquares[111],reliefVeto:q.reliefVeto[111]}));
  }
  assert.deepEqual(w.save().edits,[]);
  console.log('P0 COLOSSAL CORE',JSON.stringify({seed,windows:windows.length,samples,excludedEndpoints:excluded,fullWindows:full,unresolved,vetoReasons,found}));
 }
});
