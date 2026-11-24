import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../src/voxel.mjs';
import {researchP0JointGroup} from '../src/manual-biomes/forgotten-sands-joint-group.mjs';
import {rankP0ActualCapWindows} from '../src/manual-biomes/forgotten-sands-actual-cap-search.mjs';
import {beginP0ReliefWindow} from '../src/manual-biomes/forgotten-sands-relief-search.mjs';
import {beginP0GroundSurvey} from '../src/manual-biomes/forgotten-sands-grounded-probe.mjs';
const make=seed=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const free=()=>false;
const finish=j=>{let r;do{r=j.step();}while(r.accepted===null);return r;};
test('actual original jointly oriented 111-span group and continuous chamber traversal',()=>{
  for(const spec of [{seed:179,x:392,z:0,axis:'x',size:15},{seed:2026,x:588,z:-1428,axis:'z',size:15}]){
    const w=make(spec.seed),before=JSON.stringify(w.save());let rev='research-1';
    const r=researchP0JointGroup(w,spec,{reserved:free,ownerRevision:()=>rev});
    assert.equal(r.placementAuthority,false);assert.equal(JSON.stringify(w.save()),before);
    if(r.accepted){
      assert.equal(r.continuousFoundation,false);assert.equal(r.addedPathCells,0);
      assert.equal(r.view.set,undefined);assert.equal(r.view.save,undefined);
      assert.equal(r.publicationStatus().authorized,false);assert.equal(r.snapshotCurrent(),true);
      rev='research-2';assert.equal(r.snapshotCurrent(),false);assert.equal(r.publicationStatus().reason,'stale-research-source');
      console.log('P0 JOINT',JSON.stringify({seed:spec.seed,accepted:true,turns:r.turns,trials:r.trials,nodes:r.nodes.length,forward:r.forward,back:r.back,proposedCells:r.proposedCells,apronCells:r.apronCells,corridorNodes:r.corridorNodes}));
    }else console.log('P0 JOINT',JSON.stringify({seed:spec.seed,accepted:false,reason:r.reason,detail:r.detail}));
  }
});
test('strict research reservation fails closed for missing answer and actual source edit',()=>{
  const w=make(179),spec={seed:179,x:392,z:0,axis:'x',size:15};
  assert.throws(()=>researchP0JointGroup(w,spec,{reserved:free}));
  const denied=researchP0JointGroup(w,spec,{reserved:()=>undefined,ownerRevision:()=>'1'});
  assert.equal(denied.accepted,false);assert.equal(denied.placementAuthority,false);
  assert.equal(w.set(344,-210,0,BLOCK.AIR),true);
  const edited=researchP0JointGroup(w,spec,{reserved:free,ownerRevision:()=>'1'});
  assert.equal(edited.accepted,false);assert.equal(edited.placementAuthority,false);
  assert.equal(w.get(344,-210,0),BLOCK.AIR);
});
test('actual source cap-ranked new windows and unchanged native continuous site admission',()=>{
  for(const seed of [179,2026]){
    const w=make(seed),rank=rankP0ActualCapWindows(w,{reserved:free,limit:10}),found={63:null,111:null},results=[];
    assert.ok(rank.windows.length>0);assert.ok(rank.samples>0);
    for(const win of rank.windows){
      const j=beginP0ReliefWindow(w,win,{reserved:free});let r;do{r=j.step();}while(!r.done);
      results.push({x:win.x,z:win.z,sampledClear:win.clear,sampledRelief:win.sampledRelief,best:r.bestSquare,clear:r.clearSquares,veto:r.reliefVeto});
      for(const size of [63,111])if(!found[size]&&r.candidates[size].length){
        const q=finish(beginP0GroundSurvey(w,r.candidates[size][0],{reserved:free}));assert.equal(q.accepted,true);assert.ok(q.maxCap-q.minCap<=8);
        found[size]={site:q.site,min:q.minCap,max:q.maxCap,floor:q.floor,top:q.maxY};
      }
    }
    assert.deepEqual(w.save().edits,[]);
    console.log('P0 ACTUAL CAP',JSON.stringify({seed,samples:rank.samples,observations:rank.windows.length*16129,results,found}));
  }
});
